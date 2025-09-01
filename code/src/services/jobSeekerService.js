// Job Seeker Service for managing job seeker assignments
import { supabase } from '../lib/supabase'

export class JobSeekerService {
  // Assign a job seeker to a company (called when HR approves hiring)
  static async assignToCompany(jobSeekerId, companyId) {
    try {
      const { data, error } = await supabase
        .from('job_seeker_profiles')
        .update({ company_id: companyId })
        .eq('id', jobSeekerId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error assigning job seeker to company:', error)
      throw error
    }
  }

  // Remove job seeker from company (if needed)
  static async removeFromCompany(jobSeekerId) {
    try {
      const { data, error } = await supabase
        .from('job_seeker_profiles')
        .update({ company_id: null })
        .eq('id', jobSeekerId)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error removing job seeker from company:', error)
      throw error
    }
  }

  // Get job seeker's company information
  static async getJobSeekerCompany(jobSeekerId) {
    try {
      const { data, error } = await supabase
        .from('job_seeker_profiles')
        .select(`
          company_id,
          company_profiles!inner (
            id,
            company_name,
            industry,
            company_size
          )
        `)
        .eq('id', jobSeekerId)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error getting job seeker company:', error)
      throw error
    }
  }

  // Get all job seekers for a company
  static async getCompanyJobSeekers(companyId) {
    try {
      const { data, error } = await supabase
        .from('job_seeker_profiles')
        .select(`
          id,
          first_name,
          last_name,
          professional_title,
          created_at
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error getting company job seekers:', error)
      throw error
    }
  }

  // Check if job seeker is assigned to a company
  static async isAssignedToCompany(jobSeekerId) {
    try {
      const { data, error } = await supabase
        .from('job_seeker_profiles')
        .select('company_id')
        .eq('id', jobSeekerId)
        .single()

      if (error) {
        throw error
      }

      return !!data.company_id
    } catch (error) {
      console.error('Error checking job seeker assignment:', error)
      return false
    }
  }
}
