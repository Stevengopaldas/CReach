-- Remove the foreign key constraint temporarily for demo purposes
-- This allows us to create buddy profiles without needing auth.users entries
ALTER TABLE public.users 
DROP CONSTRAINT users_id_fkey;

-- Make id field a regular UUID primary key instead of foreign key
-- (The constraint is already dropped above, this is just for clarity) 