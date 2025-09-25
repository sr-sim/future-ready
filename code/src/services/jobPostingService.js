import { supabase } from '../lib/supabase'

export class JobPostingService {
  static getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || '{}')
  }

  static async ensureCompanyIdForCurrentUser() {
    const currentUser = this.getCurrentUser()
    if (!currentUser.id) throw new Error('User session not found')

    // Try to find an existing company profile for this HR user
    const { data: existing, error: fetchErr } = await supabase
      .from('company_profiles')
      .select('id, company_name')
      .eq('user_id', currentUser.id)
      .single()

    if (!fetchErr && existing?.id) {
      localStorage.setItem('companyId', existing.id)
      return existing.id
    }

    // If not found, attempt to create a minimal company profile
    // Adjust fields below to match your schema (company_name may be required)
    const newCompany = {
      user_id: currentUser.id,
      company_name: currentUser.email || 'New Company',
      created_at: new Date().toISOString()
    }

    const { data: created, error: insertErr } = await supabase
      .from('company_profiles')
      .insert(newCompany)
      .select('id')
      .single()

    if (insertErr || !created?.id) {
      throw new Error('Could not resolve or create company profile for this user')
    }

    localStorage.setItem('companyId', created.id)
    return created.id
  }

  static normalizeSalaryRange(salaryText) {
    // Expect formats like "RM8000 - RM12000" or "8000-12000"
    const numbers = String(salaryText || '')
      .replace(/[^0-9\-]/g, '')
      .split('-')
      .map(s => parseInt(s, 10))
      .filter(n => !isNaN(n))
    if (numbers.length === 1) return { min: numbers[0], max: numbers[0] }
    if (numbers.length >= 2) return { min: Math.min(numbers[0], numbers[1]), max: Math.max(numbers[0], numbers[1]) }
    return { min: 0, max: 0 }
  }

  static mapJobType(uiJobType) {
    // Map UI labels to enum format: FULL_TIME, PART_TIME, CONTRACT, REMOTE
    if (!uiJobType) return null
    return String(uiJobType)
      .trim()
      .toUpperCase()
      .replace(/[-\s]+/g, '_')
  }

  static mapExperienceLevel(uiExp) {
    // Map UI labels to enum format: ENTRY_LEVEL, MID_LEVEL, SENIOR_LEVEL, EXECUTIVE
    if (!uiExp) return null
    return String(uiExp)
      .trim()
      .toUpperCase()
      .replace(/[-\s]+/g, '_')
  }

  static async createJobPosting(form, companyId) {
    // If companyId not provided, resolve from DB based on current HR user
    let resolvedCompanyId = companyId
    if (!resolvedCompanyId) {
      resolvedCompanyId = await this.ensureCompanyIdForCurrentUser()
    }
    const { min: salary_min, max: salary_max } = this.normalizeSalaryRange(form.salary)

    // Prepare aggregates from requirements
    const requirementsArr = (form.requirements || []).map((r, idx) => ({
      skill: String(r.skill || '').trim(),
      description: r.description ? String(r.description).trim() : null,
      score: parseInt(r.score, 10) || 0,
      position: idx + 1
    })).filter(r => r.skill)

    const total_score = requirementsArr.reduce((sum, r) => sum + (r.score || 0), 0)
    const requirements_json = requirementsArr.map(({ position, ...rest }) => rest)

    // Insert job_postings
    const { data: job, error: insertError } = await supabase
      .from('job_postings')
      .insert({
        company_id: resolvedCompanyId,
        title: form.title,
        description: form.scope, // mirror scope as description
        department: form.department,
        scope: form.scope,
        location: form.location,
        job_type: this.mapJobType(form.jobType),
        experience_level: this.mapExperienceLevel(form.experience),
        salary_min,
        salary_max,
        currency: 'MYR',
        is_remote: (form.jobType === 'Remote') || false,
        requirements_json,
        total_score,
        status: 'DRAFT'
      })
      .select('*')
      .single()

    if (insertError) {
      console.error('Insert job_postings failed:', insertError)
      throw new Error(insertError.message || 'Insert failed')
    }

    // Insert requirement rows (normalized). If table not present, skip gracefully
    try {
      if (requirementsArr.length > 0) {
        const rows = requirementsArr.map(r => ({
          job_posting_id: job.id,
          position: r.position,
          skill: r.skill,
          description: r.description,
          score: r.score
        }))
        const { error: reqError } = await supabase
          .from('job_posting_requirements')
          .insert(rows)
        if (reqError) console.warn('Failed to insert job_posting_requirements:', reqError.message)
      }
    } catch (e) {
      console.warn('Requirements table not available or insert failed:', e?.message || e)
    }

    return job
  }

  static async updateJobPosting(jobId, form) {
    if (!jobId) throw new Error('jobId is required')
    const { min: salary_min, max: salary_max } = this.normalizeSalaryRange(form.salary)

    const requirementsArr = (form.requirements || []).map((r, idx) => ({
      skill: String(r.skill || '').trim(),
      description: r.description ? String(r.description).trim() : null,
      score: parseInt(r.score, 10) || 0,
      position: idx + 1
    })).filter(r => r.skill)

    const total_score = requirementsArr.reduce((sum, r) => sum + (r.score || 0), 0)
    const requirements_json = requirementsArr.map(({ position, ...rest }) => rest)

    const { data: updated, error: updErr } = await supabase
      .from('job_postings')
      .update({
        title: form.title,
        description: form.scope,
        department: form.department,
        scope: form.scope,
        location: form.location,
        job_type: this.mapJobType(form.jobType),
        experience_level: this.mapExperienceLevel(form.experience),
        salary_min,
        salary_max,
        currency: 'MYR',
        is_remote: (form.jobType === 'Remote') || false,
        requirements_json,
        total_score,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select('*')
      .single()

    if (updErr) {
      console.error('Update job_postings failed:', updErr)
      throw new Error(updErr.message || 'Update failed')
    }

    // Sync normalized requirements: replace all rows for this job
    try {
      // Delete existing
      await supabase.from('job_posting_requirements').delete().eq('job_posting_id', jobId)
      // Insert new
      if (requirementsArr.length > 0) {
        const rows = requirementsArr.map(r => ({
          job_posting_id: jobId,
          position: r.position,
          skill: r.skill,
          description: r.description,
          score: r.score
        }))
        const { error: reqErr } = await supabase.from('job_posting_requirements').insert(rows)
        if (reqErr) console.warn('Failed to upsert job_posting_requirements:', reqErr.message)
      }
    } catch (e) {
      console.warn('Requirements sync failed:', e?.message || e)
    }

    return updated
  }

  static async deleteJobPosting(jobId) {
    if (!jobId) throw new Error('jobId is required')
    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', jobId)
    if (error) throw new Error(error.message)
    return true
  }

  static formatJobForUI(row) {
    const dbStatus = String(row.status || 'DRAFT').toUpperCase()
    const statusUi = (() => {
      switch (dbStatus) {
        case 'PUBLISHED': return 'published'
        case 'PAUSED': return 'paused'
        case 'DRAFT': return 'pending'
        default: return 'pending'
      }
    })()
    return {
      id: row.id,
      title: row.title,
      department: row.department,
      location: row.location,
      jobType: row.job_type,
      salary: `${row.currency === 'MYR' ? 'RM' : ''}${row.salary_min} - ${row.salary_max}`,
      experience: row.experience_level,
      description: row.scope,
      requiredSkills: Array.isArray(row.required_skills)
        ? row.required_skills.map(s => ({ name: s, description: '' }))
        : [],
      totalScore: row.total_score || 0,
      requirements: row.requirements_json || [],
      status: statusUi,
      applications: 0,
      postedDate: new Date(row.created_at).toLocaleDateString()
    }
  }

  static async listJobs(companyId) {
    if (!companyId) throw new Error('companyId is required')
    // Fetch jobs
    const { data: jobs, error: jobsErr } = await supabase
      .from('job_postings')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
    if (jobsErr) throw new Error(jobsErr.message)
    if (!jobs || jobs.length === 0) return []

    const jobIds = jobs.map(j => j.id)
    // Fetch requirements separately and map skills
    const { data: reqs, error: reqErr } = await supabase
      .from('job_posting_requirements')
      .select('job_posting_id, skill, description')
      .in('job_posting_id', jobIds)
    if (reqErr) {
      // If requirements table not available, fall back to required_skills from job row
      return jobs.map(this.formatJobForUI)
    }
    const jobIdToSkills = {}
    for (const r of (reqs || [])) {
      if (!jobIdToSkills[r.job_posting_id]) jobIdToSkills[r.job_posting_id] = []
      jobIdToSkills[r.job_posting_id].push({ name: r.skill, description: r.description || '' })
    }

    return jobs.map(j => {
      const ui = this.formatJobForUI(j)
      if (jobIdToSkills[j.id] && jobIdToSkills[j.id].length > 0) {
        ui.requiredSkills = jobIdToSkills[j.id]
      }
      return ui
    })
  }

  static mapUiStatusToDb(status) {
    if (!status) return null
    const s = String(status).trim().toLowerCase()
    switch (s) {
      case 'published': return 'PUBLISHED'
      case 'paused': return 'PAUSED'
      case 'pending': return 'DRAFT'
      default: return 'DRAFT'
    }
  }

  static async updateJobStatus(jobId, nextUiStatus) {
    if (!jobId) throw new Error('jobId is required')
    const nextDbStatus = this.mapUiStatusToDb(nextUiStatus)
    const { data, error } = await supabase
      .from('job_postings')
      .update({ status: nextDbStatus, updated_at: new Date().toISOString() })
      .eq('id', jobId)
      .select('*')
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}

export default JobPostingService


