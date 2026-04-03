# 🗄️ Database Setup Guide

Your project **Career Compass** now has a database service integrated!

## Current State: Hybrid Mock Mode
To ensure the app works immediately, it is currently in **Hybrid Mode**. 
- If Supabase credentials are not found, it automatically uses `localStorage` to save user profiles and assessments.
- This means you can use the Login page and see your data persist in your browser right now!

## Switching to a Real Cloud Database (Supabase)
To connect to a real PostgreSQL database, follow these steps:

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com) and create a free project.
2. **Create the Tables**:
   Run these SQL commands in your Supabase SQL Editor:
   ```sql
   -- Users Table
   create table profiles (
     id uuid primary key default uuid_generate_v4(),
     email text unique not null,
     full_name text,
     updated_at timestamp with time zone
   );

   -- Assessments Table
   create table assessments (
     id uuid primary key default uuid_generate_v4(),
     user_email text references profiles(email),
     assessment_data jsonb,
     created_at timestamp with time zone default now()
   );
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (copy from `.env.example`) and add your keys:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Why Supabase?
- **Auth**: Real login/signup out of the box.
- **SQL**: Powerful relational database.
- **Real-time**: Sync data instantly across devices.
- **Speed**: Built on top of PostgreSQL.

Happy coding! 🚀
