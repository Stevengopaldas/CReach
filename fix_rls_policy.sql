-- Add INSERT policy to allow users to create their own records
-- This allows anyone to insert a new user record (for demo purposes)
CREATE POLICY "Users can create their own record" ON public.users 
FOR INSERT WITH CHECK (true);

-- Alternative: More restrictive policy that requires the inserted ID to match auth.uid()
-- CREATE POLICY "Users can create their own record" ON public.users 
-- FOR INSERT WITH CHECK (auth.uid() = id); 