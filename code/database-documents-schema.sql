-- Document Management System Schema
-- This extends the existing schema with document-related tables

-- Company Documents Table
CREATE TABLE public.company_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_size bigint,
  file_type text NOT NULL,
  mime_type text,
  pages integer,
  uploaded_by uuid NOT NULL,
  is_public boolean DEFAULT false,
  is_analyzed boolean DEFAULT false,
  analysis_status text DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT company_documents_pkey PRIMARY KEY (id),
  CONSTRAINT company_documents_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company_profiles(id) ON DELETE CASCADE,
  CONSTRAINT company_documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id)
);

-- Document Summaries Table
CREATE TABLE public.document_summaries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL,
  summary_text text NOT NULL,
  key_points jsonb,
  topics jsonb,
  generated_by text DEFAULT 'llama',
  model_version text,
  processing_time_ms integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT document_summaries_pkey PRIMARY KEY (id),
  CONSTRAINT document_summaries_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.company_documents(id) ON DELETE CASCADE
);

-- Document Chat History Table
CREATE TABLE public.document_chat_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  document_id uuid,
  company_id uuid NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  source_documents jsonb, -- Array of document IDs that were used to generate the answer
  confidence_score float,
  model_used text DEFAULT 'llama',
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT document_chat_history_pkey PRIMARY KEY (id),
  CONSTRAINT document_chat_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT document_chat_history_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.company_documents(id) ON DELETE SET NULL,
  CONSTRAINT document_chat_history_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.company_profiles(id)
);

-- Document Access Log Table
CREATE TABLE public.document_access_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  document_id uuid NOT NULL,
  action text NOT NULL, -- VIEW, DOWNLOAD, SEARCH, CHAT
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT document_access_log_pkey PRIMARY KEY (id),
  CONSTRAINT document_access_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT document_access_log_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.company_documents(id)
);

-- Indexes for better performance
CREATE INDEX idx_company_documents_company_id ON public.company_documents(company_id);
CREATE INDEX idx_company_documents_category ON public.company_documents(category);
CREATE INDEX idx_company_documents_analysis_status ON public.company_documents(analysis_status);
CREATE INDEX idx_document_summaries_document_id ON public.document_summaries(document_id);
CREATE INDEX idx_document_chat_history_user_id ON public.document_chat_history(user_id);
CREATE INDEX idx_document_chat_history_company_id ON public.document_chat_history(company_id);
CREATE INDEX idx_document_access_log_user_id ON public.document_access_log(user_id);
CREATE INDEX idx_document_access_log_document_id ON public.document_access_log(document_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_access_log ENABLE ROW LEVEL SECURITY;

-- Company Documents RLS Policies
CREATE POLICY "Users can view documents from their company" ON public.company_documents
  FOR SELECT USING (
    company_id IN (
      SELECT cp.id FROM public.company_profiles cp 
      WHERE cp.user_id = auth.uid()
    )
  );

CREATE POLICY "HR can upload documents to their company" ON public.company_documents
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT cp.id FROM public.company_profiles cp 
      WHERE cp.user_id = auth.uid()
    )
  );

CREATE POLICY "HR can update documents from their company" ON public.company_documents
  FOR UPDATE USING (
    company_id IN (
      SELECT cp.id FROM public.company_profiles cp 
      WHERE cp.user_id = auth.uid()
    )
  );

-- Document Summaries RLS Policies
CREATE POLICY "Users can view summaries of their company documents" ON public.document_summaries
  FOR SELECT USING (
    document_id IN (
      SELECT cd.id FROM public.company_documents cd
      WHERE cd.company_id IN (
        SELECT cp.id FROM public.company_profiles cp 
        WHERE cp.user_id = auth.uid()
      )
    )
  );

-- Document Chat History RLS Policies
CREATE POLICY "Users can view their own chat history" ON public.document_chat_history
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create chat history for their company" ON public.document_chat_history
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT cp.id FROM public.company_profiles cp 
      WHERE cp.user_id = auth.uid()
    )
  );

-- Document Access Log RLS Policies
CREATE POLICY "Users can view their own access logs" ON public.document_access_log
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create access logs" ON public.document_access_log
  FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.company_documents TO authenticated;
GRANT ALL ON public.document_summaries TO authenticated;
GRANT ALL ON public.document_chat_history TO authenticated;
GRANT ALL ON public.document_access_log TO authenticated;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_documents_updated_at 
    BEFORE UPDATE ON public.company_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
