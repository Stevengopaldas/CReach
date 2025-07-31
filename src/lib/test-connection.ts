import { supabase } from './supabase'

// Test database connection
export async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing Supabase connection...')
    
    // Test 1: Check if Supabase client is initialized
    if (!supabase) {
      throw new Error('Supabase client is not initialized')
    }
    console.log('✅ Supabase client initialized')

    // Test 2: Test basic connection by checking auth status
    const { data: authData, error: authError } = await supabase.auth.getSession()
    if (authError && authError.message !== 'Auth session missing!') {
      throw new Error(`Auth error: ${authError.message}`)
    }
    console.log('✅ Supabase auth connection working')

    // Test 3: Try to query users table (should return empty array if no users)
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (usersError) {
      throw new Error(`Users table error: ${usersError.message}`)
    }
    console.log('✅ Users table accessible:', users?.length || 0, 'users found')

    // Test 4: Try to query buddy_requests table
    const { data: buddyRequests, error: buddyError } = await supabase
      .from('buddy_requests')
      .select('*')
      .limit(1)
    
    if (buddyError) {
      throw new Error(`Buddy requests table error: ${buddyError.message}`)
    }
    console.log('✅ Buddy requests table accessible:', buddyRequests?.length || 0, 'requests found')

    // Test 5: Try to query volunteer_requests table
    const { data: volunteerRequests, error: volunteerError } = await supabase
      .from('volunteer_requests')
      .select('*')
      .limit(1)
    
    if (volunteerError) {
      throw new Error(`Volunteer requests table error: ${volunteerError.message}`)
    }
    console.log('✅ Volunteer requests table accessible:', volunteerRequests?.length || 0, 'requests found')

    // Test 6: Try to query availability table
    const { data: availability, error: availabilityError } = await supabase
      .from('availability')
      .select('*')
      .limit(1)
    
    if (availabilityError) {
      throw new Error(`Availability table error: ${availabilityError.message}`)
    }
    console.log('✅ Availability table accessible:', availability?.length || 0, 'slots found')

    // Test 7: Try to query emotional_checkins table
    const { data: checkins, error: checkinError } = await supabase
      .from('emotional_checkins')
      .select('*')
      .limit(1)
    
    if (checkinError) {
      throw new Error(`Emotional checkins table error: ${checkinError.message}`)
    }
    console.log('✅ Emotional checkins table accessible:', checkins?.length || 0, 'checkins found')

    console.log('🎉 All database tests passed! Connection is working perfectly.')
    return {
      success: true,
      message: 'Database connection successful!',
      tables: {
        users: users?.length || 0,
        buddy_requests: buddyRequests?.length || 0,
        volunteer_requests: volunteerRequests?.length || 0,
        availability: availability?.length || 0,
        emotional_checkins: checkins?.length || 0
      }
    }

  } catch (error) {
    console.error('❌ Database connection test failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    }
  }
}

// Test environment variables
export function testEnvironmentVariables() {
  console.log('🔄 Testing environment variables...')
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (!supabaseUrl) {
    console.error('❌ VITE_SUPABASE_URL is not defined')
    return false
  }
  
  if (!supabaseKey) {
    console.error('❌ VITE_SUPABASE_ANON_KEY is not defined')
    return false
  }
  
  if (!supabaseUrl.startsWith('https://')) {
    console.error('❌ VITE_SUPABASE_URL should start with https://')
    return false
  }
  
  console.log('✅ VITE_SUPABASE_URL:', supabaseUrl)
  console.log('✅ VITE_SUPABASE_ANON_KEY:', supabaseKey.substring(0, 20) + '...')
  console.log('✅ Environment variables are properly configured')
  
  return true
} 