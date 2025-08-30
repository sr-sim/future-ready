import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { pipeline } from '@xenova/transformers';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

let embedder;
async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5', { quantized: true });
  }
  return embedder;
}

function toSingleVector(output) {
  // output is usually Float32Array or nested; ensure 1D array
  if (Array.isArray(output)) return output[0];
  return output;
}

async function embedText(text) {
  const model = await getEmbedder();
  const output = await model(text, { pooling: 'mean', normalize: true });
  return Array.from(toSingleVector(output.data));
}

async function upsertJobPostingEmbedding(job) {
  const text = [job.title, job.description, job.requirements, job.responsibilities]
    .filter(Boolean)
    .join('\n\n');
  const vector = await embedText(text);
  const { error } = await supabase
    .from('job_postings')
    .update({ embedding: vector })
    .eq('id', job.id);
  if (error) throw error;
}

async function upsertJobSeekerEmbedding(seeker) {
  const skills = Array.isArray(seeker.skills) ? seeker.skills.join(', ') : JSON.stringify(seeker.skills || '');
  const experience = JSON.stringify(seeker.experience || '');
  const education = JSON.stringify(seeker.education || '');
  const text = [
    seeker.first_name,
    seeker.last_name,
    seeker.professional_title,
    seeker.summary,
    skills,
    experience,
    education,
  ]
    .filter(Boolean)
    .join('\n\n');
  const vector = await embedText(text);
  const { error } = await supabase
    .from('job_seeker_profiles')
    .update({ embedding: vector })
    .eq('id', seeker.id);
  if (error) throw error;
}

async function main() {
  const mode = process.argv[2]; // 'jobs' | 'seekers' | 'both'

  if (!mode || !['jobs', 'seekers', 'both'].includes(mode)) {
    console.log('Usage: node server-scripts/backend-embeddings.js <jobs|seekers|both>');
    process.exit(1);
  }

  if (mode === 'jobs' || mode === 'both') {
    const { data: jobs, error } = await supabase
      .from('job_postings')
      .select('id, title, description, requirements, responsibilities')
      .is('embedding', null);
    if (error) throw error;
    for (const job of jobs || []) {
      await upsertJobPostingEmbedding(job);
      console.log(`Embedded job ${job.id}`);
    }
  }

  if (mode === 'seekers' || mode === 'both') {
    const { data: seekers, error } = await supabase
      .from('job_seeker_profiles')
      .select('id, first_name, last_name, professional_title, summary, skills, experience, education')
      .is('embedding', null);
    if (error) throw error;
    for (const seeker of seekers || []) {
      await upsertJobSeekerEmbedding(seeker);
      console.log(`Embedded seeker ${seeker.id}`);
    }
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


