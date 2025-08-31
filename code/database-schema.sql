-- Database Schema for KLMMS User Registration System
-- This file contains the actual schema used in the application

-- Create custom types if they don't exist
DO $$ BEGIN
    CREATE TYPE public.account_type AS ENUM ('COMPANY', 'JOBSEEKER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.gender AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.remote_preference AS ENUM ('ONSITE', 'REMOTE', 'HYBRID');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.profile_visibility AS ENUM ('PUBLIC', 'PRIVATE', 'CONNECTIONS_ONLY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.industry AS ENUM ('TECHNOLOGY', 'HEALTHCARE', 'FINANCE', 'EDUCATION', 'RETAIL', 'MANUFACTURING', 'CONSULTING', 'MARKETING', 'SALES', 'HUMAN_RESOURCES', 'LEGAL', 'REAL_ESTATE', 'TRANSPORTATION', 'ENERGY', 'ENTERTAINMENT', 'NON_PROFIT', 'GOVERNMENT', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.company_size AS ENUM ('1-10', '11-50', '51-200', '201-1000', '1000+');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.company_type AS ENUM ('CORPORATION', 'LLC', 'PARTNERSHIP', 'SOLE_PROPRIETORSHIP', 'NON_PROFIT', 'GOVERNMENT', 'STARTUP', 'FRANCHISE', 'OTHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.subscription_plan AS ENUM ('FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email text NOT NULL,
    password text NOT NULL,
    account_type public.account_type NOT NULL,
    email_verified boolean NULL DEFAULT false,
    email_verified_at timestamp with time zone NULL,
    is_active boolean NULL DEFAULT true,
    last_login_at timestamp with time zone NULL,
    login_attempts integer NULL DEFAULT 0,
    locked_until timestamp with time zone NULL,
    google_id text NULL,
    linkedin_id text NULL,
    reset_token text NULL,
    reset_token_expiry timestamp with time zone NULL,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_google_id_key UNIQUE (google_id),
    CONSTRAINT users_linkedin_id_key UNIQUE (linkedin_id),
    CONSTRAINT users_reset_token_key UNIQUE (reset_token)
);

-- Create job_seeker_profiles table
CREATE TABLE IF NOT EXISTS public.job_seeker_profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NULL,
    location text NULL,
    professional_title text NULL,
    summary text NULL,
    skills jsonb NULL,
    experience jsonb NULL,
    education jsonb NULL,
    date_of_birth date NULL,
    gender public.gender NULL,
    nationality text NULL,
    profile_picture text NULL,
    resume_url text NULL,
    resume_file_name text NULL,
    resume_uploaded_at timestamp with time zone NULL,
    desired_salary_min integer NULL,
    desired_salary_max integer NULL,
    preferred_locations jsonb NULL,
    job_types jsonb NULL,
    remote_preference public.remote_preference NULL,
    availability_date timestamp with time zone NULL,
    profile_visibility public.profile_visibility NULL DEFAULT 'PUBLIC'::profile_visibility,
    allow_recruiter_contact boolean NULL DEFAULT true,
    email_notifications boolean NULL DEFAULT true,
    sms_notifications boolean NULL DEFAULT false,
    job_alerts boolean NULL DEFAULT true,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now(),
    embedding public.vector NULL,
    CONSTRAINT job_seeker_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT job_seeker_profiles_user_id_key UNIQUE (user_id),
    CONSTRAINT job_seeker_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create company_profiles table
CREATE TABLE IF NOT EXISTS public.company_profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    company_name text NOT NULL,
    industry public.industry NOT NULL,
    company_size public.company_size NULL,
    website text NULL,
    company_description text NULL,
    contact_email text NULL,
    contact_phone text NULL,
    address text NULL,
    city text NULL,
    state text NULL,
    country text NULL,
    postal_code text NULL,
    founded_year integer NULL,
    employee_count integer NULL,
    company_type public.company_type NULL,
    logo text NULL,
    subscription_plan public.subscription_plan NULL DEFAULT 'FREE'::subscription_plan,
    subscription_expiry timestamp with time zone NULL,
    features_enabled jsonb NULL,
    auto_screening boolean NULL DEFAULT true,
    email_notifications boolean NULL DEFAULT true,
    sms_notifications boolean NULL DEFAULT false,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now(),
    CONSTRAINT company_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT company_profiles_user_id_key UNIQUE (user_id),
    CONSTRAINT company_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create job_postings table
CREATE TABLE IF NOT EXISTS public.job_postings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    requirements text NULL,
    responsibilities text NULL,
    location text NOT NULL,
    job_type text NOT NULL,
    salary_min integer NULL,
    salary_max integer NULL,
    experience_level text NULL,
    department text NULL,
    skills_required jsonb NULL,
    benefits jsonb NULL,
    application_deadline timestamp with time zone NULL,
    is_active boolean NULL DEFAULT true,
    is_featured boolean NULL DEFAULT false,
    views_count integer NULL DEFAULT 0,
    applications_count integer NULL DEFAULT 0,
    created_at timestamp with time zone NULL DEFAULT now(),
    updated_at timestamp with time zone NULL DEFAULT now(),
    embedding public.vector NULL,
    CONSTRAINT job_postings_pkey PRIMARY KEY (id),
    CONSTRAINT job_postings_company_id_fkey FOREIGN KEY (company_id) REFERENCES company_profiles (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_account_type ON public.users(account_type);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_job_seeker_skills ON public.job_seeker_profiles USING gin (skills jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_job_seeker_embedding_ivfflat ON public.job_seeker_profiles USING ivfflat (embedding vector_cosine_ops) WITH (lists = '100');
CREATE INDEX IF NOT EXISTS job_seeker_profiles_embedding_idx ON public.job_seeker_profiles USING ivfflat (embedding vector_cosine_ops) WITH (lists = '100');
CREATE INDEX IF NOT EXISTS idx_company_features ON public.company_profiles USING gin (features_enabled);
CREATE INDEX IF NOT EXISTS idx_job_postings_skills ON public.job_postings USING gin (skills_required jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_job_postings_embedding_ivfflat ON public.job_postings USING ivfflat (embedding vector_cosine_ops) WITH (lists = '100');
CREATE INDEX IF NOT EXISTS idx_job_postings_active ON public.job_postings (is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Create RLS policies for job_seeker_profiles table
CREATE POLICY "Users can view own job seeker profile" ON public.job_seeker_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own job seeker profile" ON public.job_seeker_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own job seeker profile" ON public.job_seeker_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create RLS policies for company_profiles table
CREATE POLICY "Users can view own company profile" ON public.company_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own company profile" ON public.company_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own company profile" ON public.company_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Create RLS policies for job_postings table
CREATE POLICY "Companies can view own job postings" ON public.job_postings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.company_profiles 
            WHERE company_profiles.id = job_postings.company_id 
            AND company_profiles.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Companies can update own job postings" ON public.job_postings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.company_profiles 
            WHERE company_profiles.id = job_postings.company_id 
            AND company_profiles.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Companies can insert own job postings" ON public.job_postings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.company_profiles 
            WHERE company_profiles.id = job_postings.company_id 
            AND company_profiles.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Job seekers can view active job postings" ON public.job_postings
    FOR SELECT USING (is_active = true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_seeker_profiles_updated_at 
    BEFORE UPDATE ON public.job_seeker_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profiles_updated_at 
    BEFORE UPDATE ON public.company_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at 
    BEFORE UPDATE ON public.job_postings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.job_seeker_profiles TO anon, authenticated;
GRANT ALL ON public.company_profiles TO anon, authenticated;
GRANT ALL ON public.job_postings TO anon, authenticated;

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_jobs_with_profile(
  profile_embedding vector,
  match_limit integer DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  company_id uuid,
  title text,
  description text,
  requirements text,
  responsibilities text,
  location text,
  job_type text,
  salary_min integer,
  salary_max integer,
  experience_level text,
  department text,
  skills_required jsonb,
  benefits jsonb,
  similarity_score float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jp.id,
    jp.company_id,
    jp.title,
    jp.description,
    jp.requirements,
    jp.responsibilities,
    jp.location,
    jp.job_type,
    jp.salary_min,
    jp.salary_max,
    jp.experience_level,
    jp.department,
    jp.skills_required,
    jp.benefits,
    1 - (jp.embedding <=> profile_embedding) as similarity_score
  FROM public.job_postings jp
  WHERE jp.is_active = true 
    AND jp.embedding IS NOT NULL
  ORDER BY jp.embedding <=> profile_embedding
  LIMIT match_limit;
END;
$$;
