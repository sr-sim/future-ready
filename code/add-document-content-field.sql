-- Add document_content field to company_documents table
-- This field will store the extracted text content from uploaded documents

ALTER TABLE public.company_documents 
ADD COLUMN IF NOT EXISTS document_content TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN public.company_documents.document_content IS 'Stores the extracted text content from uploaded documents for AI processing';

-- Create index for better performance when searching document content
CREATE INDEX IF NOT EXISTS idx_company_documents_content 
ON public.company_documents USING gin(to_tsvector('english', document_content));

-- Update existing documents to have placeholder content if they don't have any
UPDATE public.company_documents 
SET document_content = CONCAT(
  'Document: ', title, E'\n',
  'Description: ', COALESCE(description, ''), E'\n',
  'Category: ', COALESCE(category, 'General'), E'\n',
  'Content: This document contains company information and policies. The content was uploaded but not fully extracted for AI processing.'
)
WHERE document_content IS NULL OR document_content = '';

-- Verify the changes
SELECT 
  id, 
  title, 
  LENGTH(document_content) as content_length,
  LEFT(document_content, 100) as content_preview
FROM public.company_documents 
LIMIT 5;
