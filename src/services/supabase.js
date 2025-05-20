import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Fetches homework submission history with pagination
 * @param {Object} options Pagination options
 * @param {number} options.page Page number (1-based)
 * @param {number} options.pageSize Number of items per page
 * @param {string} options.sortBy Column to sort by
 * @param {string} options.sortOrder 'asc' or 'desc'
 * @returns {Promise<{ data: Array, count: number, error: Error | null }>}
 */
export async function fetchHomeworkHistory({ 
  page = 1, 
  pageSize = 10, 
  sortBy = 'submission_date',
  sortOrder = 'desc'
} = {}) {
  try {
    // Calculate offset
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('homework_submissions')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Fetch paginated data
    const { data, error } = await supabase
      .from('homework_submissions')
      .select('*')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) throw error;

    return {
      data: data.map(submission => ({
        id: submission.id,
        date: new Date(submission.submission_date),
        percentCorrect: submission.percent_correct,
        problems: submission.problems,
        parameters: submission.parameters,
      })),
      count,
      error: null
    };
  } catch (error) {
    console.error('Error fetching homework history:', error);
    return {
      data: [],
      count: 0,
      error
    };
  }
}

/**
 * Saves a new homework submission
 * @param {Object} submission Homework submission data
 * @param {Array} submission.problems Array of problem objects
 * @param {Object} submission.parameters Parameters used for the homework
 * @param {number} submission.percentCorrect Percentage of correct answers
 * @returns {Promise<{ data: Object | null, error: Error | null }>}
 */
export async function saveHomeworkSubmission({ problems, parameters, percentCorrect }) {
  try {
    const { data, error } = await supabase
      .from('homework_submissions')
      .insert([{
        problems,
        parameters,
        percent_correct: percentCorrect,
      }])
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error saving homework submission:', error);
    return { data: null, error };
  }
}

/**
 * Fetches active admin parameters
 * @returns {Promise<{ data: Object | null, error: Error | null }>}
 */
export async function fetchActiveParameters() {
  try {
    const { data, error } = await supabase
      .from('admin_parameters')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching active parameters:', error);
    return { data: null, error };
  }
}

export const homeworkService = {
  async saveHomeworkSession(session) {
    const { data, error } = await supabase
      .from('homework_submissions')
      .insert([{
        problems: session.problems,
        parameters: session.parameters,
        percent_correct: session.percentCorrect,
        submission_date: new Date().toISOString()
      }])
      .select()
    
    if (error) {
      console.error('Error saving homework session:', error)
      throw new Error('Failed to save homework session')
    }
    return data[0]
  },

  async getHomeworkHistory() {
    const { data, error } = await supabase
      .from('homework_submissions')
      .select('*')
      .order('submission_date', { ascending: false })
    
    if (error) {
      console.error('Error fetching homework history:', error)
      throw new Error('Failed to fetch homework history')
    }
    return data
  },

  async getParameters() {
    const { data, error } = await supabase
      .from('parameters')
      .select('*')
      .eq('is_active', true)
      .single()
    
    if (error) {
      console.error('Error fetching parameters:', error)
      // If no active parameters found, return defaults
      if (error.code === 'PGRST116') {
        return {
          age: 8,
          additions_count: 4,
          subtractions_count: 3,
          max_number: 20
        }
      }
      throw new Error('Failed to fetch parameters')
    }
    
    return {
      age: data.age,
      add: data.additions_count,
      sub: data.subtractions_count,
      max: data.max_number
    }
  },

  async saveParameters(params) {
    try {
      // Get the current parameters row
      const { data: existingParams, error: fetchError } = await supabase
        .from('parameters')
        .select('id')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
        throw fetchError;
      }

      // If there's an existing row, update it. Otherwise, insert a new one
      const { data, error } = await supabase
        .from('parameters')
        .upsert([{
          id: existingParams?.id, // This will be undefined for first insert
          age: parseInt(params.age),
          additions_count: parseInt(params.add),
          subtractions_count: parseInt(params.sub),
          max_number: parseInt(params.max),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error saving parameters:', error);
      throw error;
    }
  }
} 