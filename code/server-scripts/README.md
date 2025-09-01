# Job Matching API Server

## The Problem
If you're seeing this error in your frontend:
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
Error performing job matching: TypeError: Failed to fetch
```

It means the job matching API server is not running on port 3002.

## The Solution

### Step 1: Configure Environment Variables
You need to set up your Supabase credentials before starting the server.

1. **Copy the template file:**
   ```bash
   copy env-template.txt .env
   ```

2. **Edit the .env file** with your actual Supabase credentials:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to Settings > API
   - Copy the Project URL and anon/public key
   - Update the .env file with these values

### Step 2: Start the Server
```bash
# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

### Step 3: Verify the Server is Running
The server should start and show:
```
✅ Supabase credentials configured
Loading BGE-small-en model...
Model loaded successfully!
Job Matching API server running on port 3002
Health check: http://localhost:3002/health
```

### Step 4: Test the Connection
Open your browser and go to: `http://localhost:3002/health`

You should see a JSON response like:
```json
{
  "status": "OK",
  "service": "Job Matching API",
  "port": 3002
}
```

## Alternative Startup Methods

### Using Batch File (Windows)
```bash
start-job-matching-api.bat
```

### Using PowerShell Script
```powershell
.\start-job-matching-api.ps1
```

## Troubleshooting

### "Supabase credentials not configured" Error
- Make sure you have a `.env` file in this directory
- Verify your Supabase URL and anon key are correct
- Check that the `.env` file has no extra spaces or quotes

### "Model loading failed" Error
- Ensure you have sufficient disk space (the AI model is ~100MB)
- Check your internet connection (first run downloads the model)
- Try running `npm install` again

### Port Already in Use
If port 3002 is already in use, change the PORT in your .env file:
```
PORT=3003
```

## File Structure
```
server-scripts/
├── job-matching-api.js          # Main server file
├── .env                         # Environment variables (create this)
├── env-template.txt             # Template for .env file
├── package.json                 # Dependencies
├── start-job-matching-api.bat   # Windows startup script
├── start-job-matching-api.ps1   # PowerShell startup script
└── README.md                    # This file
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/job-matching` - Perform AI job matching
- `GET /api/job-matches/:userId` - Get saved matches
- `PATCH /api/job-matches/:matchId` - Update match status

## Next Steps
After the server is running successfully:
1. Your frontend should be able to connect to `http://localhost:3002`
2. The "Start AI Matching" button should work
3. Job matching results will be saved to your database
4. You can view detailed results in the matched results page
