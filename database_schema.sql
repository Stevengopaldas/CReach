-- Add buddy profile columns to existing users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS expertise TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability_days TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferred_times TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS meeting_preference TEXT CHECK (meeting_preference IN ('in-person', 'virtual', 'both')) DEFAULT 'both',
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{"English"}',
ADD COLUMN IF NOT EXISTS max_weekly_hours INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS availability_status TEXT CHECK (availability_status IN ('online', 'busy', 'offline')) DEFAULT 'online',
ADD COLUMN IF NOT EXISTS response_time TEXT DEFAULT 'Usually responds in 2 hours',
ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ DEFAULT NOW(); 