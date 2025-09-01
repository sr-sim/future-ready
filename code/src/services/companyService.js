// Company Service for fetching company information
import { supabase } from '../lib/supabase'

export class CompanyService {
  // Get company profile for the current user
  static async getCompanyProfile() {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      
      if (!currentUser.id) {
        throw new Error('User session not found')
      }
      
      const { data: companyProfile, error } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()
      
      if (error) {
        throw error
      }
      
      return companyProfile
    } catch (error) {
      console.error('Error fetching company profile:', error)
      throw error
    }
  }

  // Get company name for the current user
  static async getCompanyName() {
    try {
      const companyProfile = await this.getCompanyProfile()
      return companyProfile.company_name
    } catch (error) {
      console.error('Error fetching company name:', error)
      return 'Your Company' // Fallback name
    }
  }

  // Get company information for display
  static async getCompanyInfo() {
    try {
      const companyProfile = await this.getCompanyProfile()
      return {
        name: companyProfile.company_name,
        industry: companyProfile.industry,
        size: companyProfile.company_size,
        website: companyProfile.website,
        description: companyProfile.company_description,
        contactEmail: companyProfile.contact_email,
        contactPhone: companyProfile.contact_phone,
        address: companyProfile.address
      }
    } catch (error) {
      console.error('Error fetching company info:', error)
      return {
        name: 'Your Company',
        industry: 'Technology',
        size: null,
        website: null,
        description: null,
        contactEmail: null,
        contactPhone: null,
        address: null
      }
    }
  }

  // Format company size for display
  static formatCompanySize(size) {
    if (!size) return 'Not specified'
    
    const sizeMap = {
      '1-10': '1-10 employees',
      '11-50': '11-50 employees',
      '51-200': '51-200 employees',
      '201-1000': '201-1000 employees',
      '1000+': '1000+ employees'
    }
    
    return sizeMap[size] || size
  }

  // Format industry for display
  static formatIndustry(industry) {
    if (!industry) return 'Not specified'
    
    // Convert from SNAKE_CASE to Title Case
    return industry
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }
}
