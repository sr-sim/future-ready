# AI Job Matching Setup Guide

This guide explains how to set up the AI job matching functionality using the BGE-small-en model for vector similarity search.

## Prerequisites

1. **Database Setup**: Ensure you have run the updated `database-schema.sql` which includes:
   - `job_postings` table with vector embeddings
   - Vector similarity search function `match_jobs_with_profile`
   - Proper indexes for performance

2. **Supabase Configuration**: Make sure your Supabase project has the `pgvector` extension enabled.

## Backend Setup

### 1. Install Backend Dependencies

Navigate to the server-scripts directory and install dependencies:

```bash
cd future-ready/code/server-scripts
npm install
```

### 2. Start the Embedding API Server

```bash
npm start
```

The server will run on `http://localhost:3001` and provide:
- `/api/generate-embedding` - Generate embeddings for text
- `/api/health` - Health check endpoint

### 3. Verify Backend is Running

Check the health endpoint:
```bash
curl http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "modelLoaded": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Frontend Setup

### 1. Environment Variables

Ensure your `.env` file contains the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Start the Frontend

```bash
cd future-ready/code
npm run dev
```

## How It Works

### 1. Resume Data Collection
- Users fill out their resume in `Jobseeker-ResumeForm.vue`
- Data is saved to the `job_seeker_profiles` table
- Profile includes skills, experience, education, and other relevant information

### 2. AI Matching Process
When a user clicks "Start AI Matching" in `Jobseeker-JobMatching.vue`:

1. **Profile Retrieval**: Gets the user's job seeker profile from the database
2. **Embedding Generation**: 
   - Combines profile data into a single text
   - Sends to backend API to generate vector embedding using BGE-small-en
   - Saves embedding to the profile
3. **Vector Similarity Search**: 
   - Uses PostgreSQL's vector similarity search
   - Compares profile embedding with job posting embeddings
   - Returns top matches ordered by similarity score
4. **Result Processing**:
   - Formats matches with company information
   - Calculates matching skills
   - Generates resume score and improvement suggestions

### 3. Results Display
- Results are saved to localStorage
- `Jobseeker-MatchedResult.vue` displays actual matching results
- Users can filter and sort results
- Each match shows company info, job details, and match score

## Database Schema

### job_postings Table
```sql
CREATE TABLE job_postings (
    id uuid PRIMARY KEY,
    company_id uuid REFERENCES company_profiles(id),
    title text NOT NULL,
    description text NOT NULL,
    requirements text,
    responsibilities text,
    location text NOT NULL,
    job_type text NOT NULL,
    salary_min integer,
    salary_max integer,
    experience_level text,
    department text,
    skills_required jsonb,
    benefits jsonb,
    is_active boolean DEFAULT true,
    embedding vector, -- pgvector column
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);
```

### Vector Similarity Function
```sql
CREATE FUNCTION match_jobs_with_profile(
  profile_embedding vector,
  match_limit integer DEFAULT 20
)
RETURNS TABLE (
  -- job posting fields
  similarity_score float
)
```

## API Endpoints

### Backend API (Port 3001)

#### POST /api/generate-embedding
Generate embeddings for text using BGE-small-en model.

**Request:**
```json
{
  "text": "Software engineer with 5 years experience in React, Node.js, and Python..."
}
```

**Response:**
```json
{
  "embedding": [0.1, 0.2, 0.3, ...] // 384-dimensional vector
}
```

#### GET /api/health
Health check endpoint to verify server and model status.

## Troubleshooting

### Common Issues

1. **"Model not initialized"**
   - Check if the backend server is running
   - Verify the model is loading correctly in the console
   - Restart the backend server

2. **"Failed to generate embedding"**
   - Check network connectivity to backend
   - Verify the backend API is accessible at `http://localhost:3001`
   - Check backend logs for errors

3. **"No matching results"**
   - Ensure job_postings table has data with embeddings
   - Check if user profile has sufficient data
   - Verify vector similarity function is working

4. **Database errors**
   - Ensure pgvector extension is enabled in Supabase
   - Check that all database functions are created
   - Verify RLS policies are correct

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG=true
```

### Performance Optimization

1. **Index Optimization**: Ensure proper indexes on vector columns
2. **Batch Processing**: For large datasets, process embeddings in batches
3. **Caching**: Consider caching frequently accessed embeddings
4. **Model Optimization**: Use model quantization for faster inference

## Security Considerations

1. **API Security**: The backend API should be secured in production
2. **Rate Limiting**: Implement rate limiting for embedding generation
3. **Input Validation**: Validate all text inputs before processing
4. **Error Handling**: Don't expose sensitive information in error messages

## Production Deployment

For production deployment:

1. **Backend**: Deploy the embedding API to a cloud service (AWS, GCP, Azure)
2. **Environment Variables**: Use production environment variables
3. **SSL/TLS**: Enable HTTPS for all API communications
4. **Monitoring**: Add logging and monitoring for the AI matching process
5. **Scaling**: Consider horizontal scaling for high traffic

## Testing

Test the AI matching functionality:

1. Create a job seeker account and fill out a resume
2. Create some job postings in the database
3. Run the matching process
4. Verify results are displayed correctly
5. Test filtering and sorting functionality
