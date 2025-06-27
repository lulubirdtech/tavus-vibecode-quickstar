class TavusService {
  private apiKey: string;
  private baseURL = 'https://tavusapi.com/v2';

  constructor() {
    // Try environment variable first, then localStorage for settings override
    this.apiKey = this.getApiKey();
  }

  private getApiKey(): string {
    // Check localStorage first (for settings override)
    const storedKey = localStorage.getItem('tavus_api_key');
    if (storedKey && storedKey.trim()) {
      return storedKey.trim();
    }
    
    // Fallback to environment variable
    return import.meta.env.VITE_TAVUS_API_KEY || '';
  }

  async getReplicaStatus(replicaId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/replicas/${replicaId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Tavus replica status check failed:', error);
      throw error;
    }
  }

  async startConsultation(replicaId: string, personaId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        },
        body: JSON.stringify({
          replica_id: replicaId,
          persona_id: personaId,
          callback_url: `${window.location.origin}/api/tavus/callback`
        })
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Tavus consultation start failed:', error);
      throw error;
    }
  }

  async endConsultation(conversationId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Tavus consultation end failed:', error);
      throw error;
    }
  }

  async getConversationStatus(conversationId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Tavus API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Tavus status check failed:', error);
      throw error;
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== 'fc8919f4yy46myrmm6';
  }
}

export const tavusService = new TavusService();