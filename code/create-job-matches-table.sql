-- Create job_matches table for storing AI matching results
-- This table will store the results of AI job matching between job seekers and job postings

-- First, create the necessary enums if they don't exist
DO $$ BEGIN
    CREATE TYPE public.job_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.experience_level AS ENUM ('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.job_status AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'PAUSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create the job_matches table
CREATE TABLE IF NOT EXISTS public.job_matches (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  job_posting_id uuid NOT NULL,
  job_seeker_id uuid NOT NULL,
  match_score double precision NOT NULL,
  matched_skills jsonb NOT NULL,
  match_reason text NULL,
  viewed boolean NULL DEFAULT false,
  interested boolean NULL,
  applied boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT job_matches_pkey PRIMARY KEY (id),
  CONSTRAINT job_matches_job_posting_id_job_seeker_id_key UNIQUE (job_posting_id, job_seeker_id),
  CONSTRAINT job_matches_job_posting_id_fkey FOREIGN KEY (job_posting_id) REFERENCES job_postings (id) ON DELETE CASCADE,
  CONSTRAINT job_matches_job_seeker_id_fkey FOREIGN KEY (job_seeker_id) REFERENCES job_seeker_profiles (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_matches_job_posting_id ON public.job_matches USING btree (job_posting_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_job_seeker_id ON public.job_matches USING btree (job_seeker_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_match_score ON public.job_matches USING btree (match_score DESC);
CREATE INDEX IF NOT EXISTS idx_job_matches_created_at ON public.job_matches USING btree (created_at DESC);

-- Update the job_postings table to match the user's schema
ALTER TABLE public.job_postings 
ADD COLUMN IF NOT EXISTS job_type public.job_type,
ADD COLUMN IF NOT EXISTS experience_level public.experience_level,
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS is_remote boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS application_deadline timestamp with time zone,
ADD COLUMN IF NOT EXISTS max_applications integer,
ADD COLUMN IF NOT EXISTS auto_screening boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS status public.job_status DEFAULT 'DRAFT',
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS closed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS tags jsonb;

-- Update job_seeker_profiles to match user's schema
ALTER TABLE public.job_seeker_profiles
ADD COLUMN IF NOT EXISTS company_id uuid,
ADD CONSTRAINT IF NOT EXISTS job_seeker_profiles_company_id_fkey 
FOREIGN KEY (company_id) REFERENCES company_profiles (id) ON DELETE SET NULL;

-- Create index for company_id in job_seeker_profiles
CREATE INDEX IF NOT EXISTS idx_job_seeker_profiles_company_id ON public.job_seeker_profiles USING btree (company_id);

-- Add unique constraint for slug in job_postings if it doesn't exist
DO $$ BEGIN
    ALTER TABLE public.job_postings ADD CONSTRAINT job_postings_slug_key UNIQUE (slug);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create trigger for updating updated_at timestamp in job_matches
CREATE OR REPLACE FUNCTION update_job_matches_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_matches_updated_at
    BEFORE UPDATE ON public.job_matches
    FOR EACH ROW
    EXECUTE FUNCTION update_job_matches_updated_at();

-- Grant permissions
GRANT ALL ON public.job_matches TO anon, authenticated;

-- Create function to get job matches for a job seeker
CREATE OR REPLACE FUNCTION get_job_matches_for_seeker(
  seeker_id uuid,
  limit_count integer DEFAULT 20,
  min_score double precision DEFAULT 0.0
)
RETURNS TABLE (
  match_id uuid,
  job_posting_id uuid,
  company_id uuid,
  company_name text,
  job_title text,
  job_description text,
  job_location text,
  job_type public.job_type,
  salary_min integer,
  salary_max integer,
  match_score double precision,
  matched_skills jsonb,
  match_reason text,
  viewed boolean,
  interested boolean,
  applied boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jm.id as match_id,
    jm.job_posting_id,
    jp.company_id,
    cp.company_name,
    jp.title as job_title,
    jp.description as job_description,
    jp.location as job_location,
    jp.job_type,
    jp.salary_min,
    jp.salary_max,
    jm.match_score,
    jm.matched_skills,
    jm.match_reason,
    jm.viewed,
    jm.interested,
    jm.applied,
    jm.created_at
  FROM public.job_matches jm
  JOIN public.job_postings jp ON jm.job_posting_id = jp.id
  JOIN public.company_profiles cp ON jp.company_id = cp.id
  WHERE jm.job_seeker_id = seeker_id
    AND jm.match_score >= min_score
  ORDER BY jm.match_score DESC, jm.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Create function to save job matches
CREATE OR REPLACE FUNCTION save_job_matches(
  matches jsonb
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  match_record jsonb;
  inserted_count integer := 0;
BEGIN
  FOR match_record IN SELECT jsonb_array_elements(matches)
  LOOP
    INSERT INTO public.job_matches (
      job_posting_id,
      job_seeker_id,
      match_score,
      matched_skills,
      match_reason
    )
    VALUES (
      (match_record->>'job_posting_id')::uuid,
      (match_record->>'job_seeker_id')::uuid,
      (match_record->>'match_score')::double precision,
      match_record->'matched_skills',
      match_record->>'match_reason'
    )
    ON CONFLICT (job_posting_id, job_seeker_id) 
    DO UPDATE SET
      match_score = EXCLUDED.match_score,
      matched_skills = EXCLUDED.matched_skills,
      match_reason = EXCLUDED.match_reason,
      updated_at = now();
    
    inserted_count := inserted_count + 1;
  END LOOP;
  
  RETURN inserted_count;
END;
$$;

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'job_matches' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
