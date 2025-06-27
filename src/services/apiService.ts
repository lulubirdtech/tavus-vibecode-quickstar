import { supabase } from '../lib/supabase';

export class ApiService {
  // Auth endpoints - using Supabase
  static async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return { user: data.user, session: data.session };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  static async register(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { user: data.user, session: data.session };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  static async validateToken() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(error.message);
      }

      return { session, user: session?.user };
    } catch (error: any) {
      throw new Error(error.message || 'Token validation failed');
    }
  }

  static async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  }

  // Database operations using Supabase
  static async uploadFiles(files: File[]) {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(fileName, file);

        if (error) {
          throw new Error(error.message);
        }

        return data;
      });

      const results = await Promise.all(uploadPromises);
      return { files: results };
    } catch (error: any) {
      throw new Error(error.message || 'File upload failed');
    }
  }

  static async getUploadedFiles(params?: any) {
    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .list();

      if (error) {
        throw new Error(error.message);
      }

      return { files: data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch files');
    }
  }

  static async getFileDetails(fileId: string) {
    try {
      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileId);

      return { file: data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get file details');
    }
  }

  // Analysis endpoints using Supabase
  static async startAnalysis(data: any) {
    try {
      const { data: result, error } = await supabase
        .from('diagnoses')
        .insert([{
          user_id: data.user_id,
          user_symptoms_id: data.user_symptoms_id,
          image_urls: data.image_urls || [],
          image_types: data.image_types || [],
          body_parts_analyzed: data.body_parts_analyzed || [],
          ai_model_used: data.ai_model_used || 'general-practitioner',
          results: data.results || {},
          confidence_score: data.confidence_score,
          anomaly_detected: data.anomaly_detected || false,
          severity: data.severity,
          status: 'processing'
        }])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { analysis: result };
    } catch (error: any) {
      throw new Error(error.message || 'Analysis failed');
    }
  }

  static async getAnalysis(analysisId: string) {
    try {
      const { data, error } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('id', analysisId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { analysis: data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch analysis');
    }
  }

  static async getAnalyses(params?: any) {
    try {
      let query = supabase
        .from('diagnoses')
        .select('*')
        .order('created_at', { ascending: false });

      if (params?.user_id) {
        query = query.eq('user_id', params.user_id);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { analyses: data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch analyses');
    }
  }

  // Reports endpoints using Supabase
  static async generateReport(data: any) {
    try {
      // This would typically involve creating a treatment plan
      const { data: result, error } = await supabase
        .from('treatment_plans')
        .insert([{
          diagnosis_id: data.diagnosis_id,
          user_id: data.user_id,
          plan_data: data.plan_data || {},
          natural_remedies: data.natural_remedies || [],
          recommended_foods: data.recommended_foods || [],
          medications: data.medications || [],
          exercises: data.exercises || [],
          daily_schedule: data.daily_schedule || [],
          prevention_tips: data.prevention_tips || [],
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { report: result };
    } catch (error: any) {
      throw new Error(error.message || 'Report generation failed');
    }
  }

  static async getReport(reportId: string) {
    try {
      const { data, error } = await supabase
        .from('treatment_plans')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { report: data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch report');
    }
  }

  static async updateReport(reportId: string, data: any) {
    try {
      const { data: result, error } = await supabase
        .from('treatment_plans')
        .update(data)
        .eq('id', reportId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { report: result };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update report');
    }
  }

  static async getReports(params?: any) {
    try {
      let query = supabase
        .from('treatment_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (params?.user_id) {
        query = query.eq('user_id', params.user_id);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { reports: data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch reports');
    }
  }

  // Chat endpoints - could use a custom table or integrate with consultations
  static async sendMessage(data: any) {
    try {
      // This could be implemented using the consultations table
      const { data: result, error } = await supabase
        .from('consultations')
        .insert([{
          user_id: data.user_id,
          doctor_id: data.doctor_id,
          doctor_type: data.doctor_type || 'general-practitioner',
          symptoms: data.message,
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { message: result };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send message');
    }
  }

  static async getChatHistory(params?: any) {
    try {
      let query = supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (params?.user_id) {
        query = query.eq('user_id', params.user_id);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return { history: data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch chat history');
    }
  }

  static async clearChatHistory() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to clear chat history');
    }
  }
}

export default supabase;