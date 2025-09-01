# 🚀 Future-Ready AI Job Matching Platform

A comprehensive AI-powered job matching platform built with Vue.js, Express.js, and Supabase, featuring BGE-small-en embeddings for intelligent resume matching and document QA capabilities.

## 🏗️ **Architecture Overview**

```
Frontend (Vue.js) ←→ Backend APIs ←→ Supabase Database
     ↓                    ↓              ↓
  Vue Components    Express Servers   PostgreSQL + Vector
  - Job Upload      - Job Matching    - Job Postings
  - Resume Form     - Document QA     - User Profiles
  - Dashboard       - Embeddings      - AI Embeddings
```

## 📋 **Prerequisites**

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Git**
- **Supabase Account** (for database)

## 🚀 **Quick Start**

### **1. Clone the Repository**
```bash
git clone <your-repository-url>
cd future-ready/code
```

### **2. Install Dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server-scripts
npm install
cd ..
```

### **3. Environment Setup**
Create a `.env` file in the `server-scripts` directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Custom ports
PORT_JOB_MATCHING=3002
PORT_DOCUMENT_QA=3006
PORT_EMBEDDING=3004
```

### **4. Database Setup**
Run the following SQL in your Supabase SQL editor:

```sql
-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create job_postings table
CREATE TABLE public.job_postings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  department text,
  location text,
  job_type text,
  experience_level text,
  salary text,
  status text DEFAULT 'DRAFT',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  embedding public.vector,
  CONSTRAINT job_postings_pkey PRIMARY KEY (id),
  CONSTRAINT job_postings_company_id_fkey FOREIGN KEY (company_id) REFERENCES company_profiles (id) ON DELETE CASCADE
);

-- Create vector index for AI matching
CREATE INDEX job_postings_embedding_idx ON public.job_postings USING ivfflat (embedding vector_cosine_ops) WITH (lists = '100');
```

## 🔧 **Backend Services Setup**

### **Service Ports**
| Service | Port | Purpose |
|---------|------|---------|
| **Job Matching API** | 3002 | BGE-small-en resume matching |
| **Document QA API** | 3006 | AI document chat & analysis |
| **Embedding API** | 3004 | General text embeddings |

### **Starting Services**

#### **Option 1: Start All Services**
```bash
cd server-scripts
npm run dev:full
```

#### **Option 2: Start Individual Services**
```bash
# Job Matching API (for resume matching)
npm run dev:job-matching

# Document QA API (for document chat)
npm run dev:document-qa

# Embedding API (for general embeddings)
npm run dev
```

#### **Option 3: Start Core Services Only**
```bash
# Job Matching + Document QA
npm run dev:ai
```

### **Verify Services Are Running**
```bash
# Job Matching API
curl http://localhost:3002/health

# Document QA API
curl http://localhost:3006/health

# Embedding API
curl http://localhost:3004/health
```

## 🌐 **Frontend Setup**

### **Start Development Server**
```bash
# From the code directory
npm run dev
```

The frontend will run on `http://localhost:5173` with automatic API proxy configuration.

### **Vite Proxy Configuration**
The frontend automatically proxies API calls to the correct backend services:

- `/api/job-matching` → Port 3002 (Job Matching API)
- `/api/chat-history` → Port 3006 (Document QA API)
- `/api/chat-with-documents` → Port 3006 (Document QA API)
- `/api/generate-embedding` → Port 3004 (Embedding API)

## 🎯 **Key Features & How to Use**

### **1. HR Job Management**
- **Location**: `src/views/HR-JobUpload.vue`
- **Purpose**: Upload and manage job postings
- **Status**: Local state management (no database integration)

### **2. AI Resume Matching**
- **Location**: `src/services/aiMatchingService.js`
- **Purpose**: Match job seekers with jobs using BGE-small-en
- **API**: `http://localhost:3002/api/job-matching`

### **3. Document QA System**
- **Location**: `src/services/documentService.js`
- **Purpose**: AI-powered document chat and analysis
- **API**: `http://localhost:3006/api/chat-with-documents`

### **4. Job Seeker Onboarding**
- **Location**: `src/views/Jobseeker-Onboarding.vue`
- **Purpose**: Collect job seeker information and skills

## 🗂️ **Project Structure**

```
future-ready/code/
├── src/
│   ├── components/          # Vue components
│   ├── views/              # Page components
│   ├── services/           # API services
│   ├── stores/             # Pinia stores
│   └── lib/                # Utilities (Supabase client)
├── server-scripts/         # Backend APIs
│   ├── job-matching-api.js    # Resume matching service
│   ├── document-qa-api.js     # Document chat service
│   ├── embedding-api.js       # Text embedding service
│   └── package.json
├── vite.config.ts          # Frontend build configuration
└── README.md               # This file
```

## 🔍 **Troubleshooting**

### **Port Conflicts**
If you get "address already in use" errors:

```bash
# Check what's using the port
netstat -ano | findstr :3002
netstat -ano | findstr :3006
netstat -ano | findstr :3004

# Kill conflicting processes
taskkill /PID <PID> /F
```

### **API Connection Issues**
1. **Verify services are running** using health check endpoints
2. **Check port numbers** match the configuration
3. **Ensure .env file** has correct Supabase credentials

### **Frontend Proxy Errors**
1. **Restart Vite dev server** after changing proxy config
2. **Check backend services** are running on correct ports
3. **Verify API endpoints** exist in backend services

## 🚀 **Development Workflow**

### **1. Start Backend Services**
```bash
cd server-scripts
npm run dev:full
```

### **2. Start Frontend**
```bash
# In a new terminal
npm run dev
```

### **3. Make Changes**
- **Backend**: Services auto-reload with nodemon
- **Frontend**: Vite provides hot module replacement

### **4. Test Features**
- **Job Matching**: Upload resume and test matching
- **Document Chat**: Upload document and ask questions
- **HR Dashboard**: Create and manage job postings

## 📚 **API Documentation**

### **Job Matching API (Port 3002)**
```http
POST /api/job-matching
{
  "userId": "user-uuid",
  "limit": 20
}
```

### **Document QA API (Port 3006)**
```http
POST /api/chat-with-documents
{
  "question": "What are the company policies?",
  "companyId": "company-uuid",
  "userId": "user-uuid"
}
```

### **Embedding API (Port 3004)**
```http
POST /api/generate-embedding
{
  "text": "Sample text for embedding"
}
```

## 🔐 **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |
| `PORT_JOB_MATCHING` | Job Matching API port | ❌ (default: 3002) |
| `PORT_DOCUMENT_QA` | Document QA API port | ❌ (default: 3006) |
| `PORT_EMBEDDING` | Embedding API port | ❌ (default: 3004) |

## 🎉 **Success Indicators**

- ✅ All health endpoints return `{"status": "OK"}`
- ✅ Frontend loads without console errors
- ✅ Job matching works with BGE-small-en model
- ✅ Document chat responds to questions
- ✅ No "connection refused" errors

## 📞 **Getting Help**

1. **Check service logs** for error messages
2. **Verify ports** are not in use
3. **Ensure .env file** is properly configured
4. **Check Supabase** connection and permissions

## 🚀 **Next Steps**

1. **Customize job matching** algorithms
2. **Add more document types** support
3. **Implement user authentication**
4. **Add job application tracking**
5. **Enhance AI matching** with more models

---

**Happy Coding! 🎯✨**
