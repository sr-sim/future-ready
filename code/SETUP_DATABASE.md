# Database Setup Guide for KLMMS User Registration

## Prerequisites
1. A Supabase project set up at https://supabase.com
2. Your Supabase URL and anon key

## Setup Steps

### 1. Environment Variables
Create a `.env` file in the `future-ready/code/` directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Schema Setup
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database-schema.sql` into the editor
4. Run the SQL script

### 3. Authentication Settings
In your Supabase dashboard:
1. Go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. Add any additional redirect URLs as needed

### 4. Email Templates (Optional)
1. Go to Authentication > Email Templates
2. Customize the confirmation and recovery email templates

## Database Tables Created

### `users` Table
Stores user authentication and basic profile information:

- `id`: UUID (primary key)
- `email`: User's email address (unique)
- `password`: Hashed password (in production, should be properly hashed)
- `account_type`: Enum ('COMPANY' or 'JOBSEEKER')
- `email_verified`: Boolean flag for email verification
- `email_verified_at`: Timestamp when email was verified
- `is_active`: Boolean flag for account status
- `last_login_at`: Timestamp of last login
- `login_attempts`: Number of failed login attempts
- `locked_until`: Timestamp when account is locked (security feature)
- `google_id`: Google OAuth ID (optional)
- `linkedin_id`: LinkedIn OAuth ID (optional)
- `reset_token`: Password reset token (optional)
- `reset_token_expiry`: Password reset token expiry (optional)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### `job_seeker_profiles` Table
Stores detailed profile information for job seekers:

- `id`: UUID (primary key)
- `user_id`: Foreign key to users table
- `first_name`: First name
- `last_name`: Last name
- `phone`: Phone number
- `location`: Location
- `professional_title`: Job title
- `summary`: Professional summary
- `skills`: JSONB array of skills
- `experience`: JSONB array of work experience
- `education`: JSONB array of education
- `date_of_birth`: Date of birth
- `gender`: Enum ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY')
- `nationality`: Nationality
- `profile_picture`: Profile picture URL
- `resume_url`: Resume file URL
- `resume_file_name`: Resume file name
- `resume_uploaded_at`: Resume upload timestamp
- `desired_salary_min`: Minimum desired salary
- `desired_salary_max`: Maximum desired salary
- `preferred_locations`: JSONB array of preferred locations
- `job_types`: JSONB array of preferred job types
- `remote_preference`: Enum ('ONSITE', 'REMOTE', 'HYBRID')
- `availability_date`: When available to start
- `profile_visibility`: Enum ('PUBLIC', 'PRIVATE', 'CONNECTIONS_ONLY')
- `allow_recruiter_contact`: Boolean for recruiter contact
- `email_notifications`: Boolean for email notifications
- `sms_notifications`: Boolean for SMS notifications
- `job_alerts`: Boolean for job alerts
- `embedding`: Vector for AI matching (pgvector extension)
- `created_at`: Profile creation timestamp
- `updated_at`: Last update timestamp

### `company_profiles` Table
Stores detailed profile information for companies:

- `id`: UUID (primary key)
- `user_id`: Foreign key to users table
- `company_name`: Company name
- `industry`: Enum (various industry types)
- `company_size`: Enum ('1-10', '11-50', '51-200', '201-1000', '1000+')
- `website`: Company website URL
- `company_description`: Company description
- `contact_email`: Contact email address
- `contact_phone`: Contact phone number
- `address`: Company address
- `city`: City
- `state`: State/Province
- `country`: Country
- `postal_code`: Postal/ZIP code
- `founded_year`: Year company was founded
- `employee_count`: Number of employees
- `company_type`: Enum ('CORPORATION', 'LLC', 'PARTNERSHIP', etc.)
- `logo`: Company logo URL
- `subscription_plan`: Enum ('FREE', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE')
- `subscription_expiry`: Subscription expiry date
- `features_enabled`: JSONB array of enabled features
- `auto_screening`: Boolean for automatic resume screening
- `email_notifications`: Boolean for email notifications
- `sms_notifications`: Boolean for SMS notifications
- `created_at`: Profile creation timestamp
- `updated_at`: Last update timestamp

## Security Features

- **Row Level Security (RLS)**: Enabled on the users table
- **Policies**: Users can only access their own data
- **Triggers**: Automatic timestamp updates and user profile creation
- **Data Validation**: Account type constraints and required fields

## Testing the Setup

1. Start your development server: `npm run dev`
2. Navigate to the login page
3. Try creating a new account (both company and job seeker)
4. Check your Supabase dashboard to verify data is being saved

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Ensure your `.env` file is in the correct location
   - Check that variable names match exactly

2. **"Failed to create user account"**
   - Verify your Supabase URL and anon key are correct
   - Check that the database schema has been applied

3. **"Permission denied"**
   - Ensure RLS policies are correctly set up
   - Check that the user has proper authentication

4. **"Table does not exist"**
   - Run the database schema SQL script again
   - Check that the `users` table was created successfully

### Debug Mode
To enable debug logging, add this to your `.env` file:
```env
VITE_DEBUG=true
```

## API Endpoints Used

The application uses these Supabase operations:
- `supabase.from('users').insert()` - User registration
- `supabase.from('users').select()` - User login and data retrieval
- `supabase.from('users').update()` - Update user data (login attempts, last login)
- `supabase.from('job_seeker_profiles').insert()` - Create job seeker profile
- `supabase.from('job_seeker_profiles').select()` - Retrieve job seeker profile data
- `supabase.from('company_profiles').insert()` - Create company profile
- `supabase.from('company_profiles').select()` - Retrieve company profile data

## Security Features

- **Row Level Security (RLS)**: Enabled on both tables
- **Account Locking**: Automatic account locking after 5 failed login attempts
- **Login Attempt Tracking**: Tracks failed login attempts
- **Password Validation**: Minimum 6 characters required
- **Data Validation**: Account type constraints and required fields
- **Foreign Key Constraints**: Ensures data integrity between tables

## Next Steps

After setting up the database:
1. Test user registration and login
2. Implement email verification (optional)
3. Add password reset functionality
4. Set up user profile management
5. Implement session management
