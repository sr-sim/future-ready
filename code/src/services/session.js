import { supabase } from '../lib/supabase'

export async function ensureHrSession(options = {}) {
  const { redirectOnFail = true } = options
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  if (!currentUser?.id || (currentUser?.accountType && currentUser.accountType.toLowerCase() !== 'company')) {
    if (redirectOnFail) window.location.href = '/login'
    throw new Error('HR session not found')
  }

  // Ensure company profile exists and cache companyId
  const { data, error } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', currentUser.id)
    .single()

  if (error || !data) {
    if (redirectOnFail) window.location.href = '/login'
    throw new Error('Company profile not found')
  }

  if (data.id) localStorage.setItem('companyId', data.id)
  return { user: currentUser, company: data }
}

export async function ensureJobSeekerSession(options = {}) {
  const { redirectOnFail = true } = options
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  if (!currentUser?.id || (currentUser?.accountType && currentUser.accountType.toLowerCase() !== 'jobseeker')) {
    if (redirectOnFail) window.location.href = '/login'
    throw new Error('Jobseeker session not found')
  }

  // Ensure job seeker profile exists; cache profile id
  const { data, error } = await supabase
    .from('job_seeker_profiles')
    .select('id, first_name, last_name')
    .eq('user_id', currentUser.id)
    .single()

  if (error || !data) {
    if (redirectOnFail) window.location.href = '/login'
    throw new Error('Jobseeker profile not found')
  }

  if (data.id) localStorage.setItem('jobSeekerProfileId', data.id)
  return { user: currentUser, profile: data }
}
