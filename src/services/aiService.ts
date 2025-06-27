class AIService {
  private getApiKey(provider: 'gemini' | 'openai'): string | null {
    // Check localStorage first (for settings override)
    const storedKey = localStorage.getItem(`${provider}_api_key`);
    if (storedKey && storedKey.trim()) {
      return storedKey.trim();
    }
    
    // Fallback to environment variables
    if (provider === 'gemini') {
      return import.meta.env.VITE_GEMINI_API_KEY || null;
    } else if (provider === 'openai') {
      return import.meta.env.VITE_OPENAI_API_KEY || null;
    }
    
    return null;
  }

  private async callGeminiAPI(prompt: string): Promise<string> {
    const apiKey = this.getApiKey('gemini');
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }

  private async callOpenAIAPI(prompt: string): Promise<string> {
    const apiKey = this.getApiKey('openai');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a medical AI assistant. Provide helpful, accurate medical information while emphasizing the importance of consulting healthcare professionals.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  }

  async generateSymptomDiagnosis(symptoms: string, bodyParts: string[], severity: string, duration: string): Promise<any> {
    const provider = localStorage.getItem('ai_provider') || 'gemini';
    
    const prompt = `
As a medical AI assistant, analyze the following symptoms and provide a comprehensive diagnosis and treatment plan:

Symptoms: ${symptoms}
Affected body parts: ${bodyParts.join(', ')}
Severity: ${severity}
Duration: ${duration}

Please provide a structured response with:
1. Most likely condition name
2. Confidence percentage (0-100)
3. Brief description of the condition
4. 5 natural remedies with specific instructions
5. 5 healing foods and dietary recommendations
6. 3 recommended medications (over-the-counter)
7. 4 administration instructions
8. Important warning signs to watch for

Format the response as a JSON object with the following structure:
{
  "condition": "condition name",
  "confidence": number,
  "description": "description",
  "naturalRemedies": ["remedy1", "remedy2", ...],
  "foods": ["food1", "food2", ...],
  "medications": ["med1", "med2", ...],
  "administration": ["instruction1", "instruction2", ...],
  "warning": "warning text"
}
`;

    try {
      let response: string;
      if (provider === 'openai') {
        response = await this.callOpenAIAPI(prompt);
      } else {
        response = await this.callGeminiAPI(prompt);
      }

      // Try to parse JSON response
      try {
        return JSON.parse(response);
      } catch {
        // If JSON parsing fails, create structured response from text
        return this.parseTextResponse(response);
      }
    } catch (error) {
      console.error('AI diagnosis generation failed:', error);
      throw error;
    }
  }

  async generateTreatmentPlan(condition: string, severity: string): Promise<any> {
    const provider = localStorage.getItem('ai_provider') || 'gemini';
    
    const prompt = `
Create a comprehensive treatment plan for: ${condition} (${severity} severity)

Provide a detailed treatment plan with:
1. Lifecycle phases (3 phases with descriptions)
2. 6 natural remedies with specific instructions
3. 6 healing foods and dietary recommendations
4. 4 recommended medications
5. 5 recommended exercises
6. Daily schedule with 4 time-based activities
7. 4 prevention tips for future occurrences
8. Possible causes (3-4 causes)

Format as JSON:
{
  "lifecyclePhases": {
    "phase1": "description",
    "phase2": "description", 
    "phase3": "description"
  },
  "naturalRemedies": ["remedy1", ...],
  "foods": ["food1", ...],
  "medications": ["med1", ...],
  "exercises": ["exercise1", ...],
  "dailySchedule": [
    {"time": "08:00", "activity": "activity", "type": "medication"},
    ...
  ],
  "preventionTips": ["tip1", ...],
  "possibleCauses": ["cause1", ...]
}
`;

    try {
      let response: string;
      if (provider === 'openai') {
        response = await this.callOpenAIAPI(prompt);
      } else {
        response = await this.callGeminiAPI(prompt);
      }

      try {
        return JSON.parse(response);
      } catch {
        return this.parseTreatmentResponse(response);
      }
    } catch (error) {
      console.error('Treatment plan generation failed:', error);
      throw error;
    }
  }

  async generateHealthArticle(topic: string): Promise<any> {
    const provider = localStorage.getItem('ai_provider') || 'gemini';
    
    const prompt = `
Write a comprehensive health education article about: ${topic}

Include:
1. Detailed overview (2-3 paragraphs)
2. 6 key points with actionable advice
3. 5 natural treatments with specific instructions
4. Scientific evidence and recent research
5. Prevention strategies
6. When to seek medical attention

Format as JSON:
{
  "title": "article title",
  "overview": "detailed overview text",
  "keyPoints": ["point1", "point2", ...],
  "naturalTreatments": ["treatment1", ...],
  "evidence": "scientific evidence text",
  "prevention": ["strategy1", ...],
  "seekHelp": "when to seek medical attention"
}
`;

    try {
      let response: string;
      if (provider === 'openai') {
        response = await this.callOpenAIAPI(prompt);
      } else {
        response = await this.callGeminiAPI(prompt);
      }

      try {
        return JSON.parse(response);
      } catch {
        return this.parseArticleResponse(response, topic);
      }
    } catch (error) {
      console.error('Health article generation failed:', error);
      throw error;
    }
  }

  private parseTextResponse(text: string): any {
    // Fallback parser for non-JSON responses
    return {
      condition: "AI-Generated Diagnosis",
      confidence: 75,
      description: text.substring(0, 200) + "...",
      naturalRemedies: [
        "Rest and adequate sleep",
        "Stay hydrated with water",
        "Apply warm or cold compress",
        "Practice stress reduction",
        "Maintain healthy diet"
      ],
      foods: [
        "Fresh fruits and vegetables",
        "Lean proteins",
        "Whole grains",
        "Anti-inflammatory foods",
        "Plenty of fluids"
      ],
      medications: [
        "Over-the-counter pain relievers as needed",
        "Consult pharmacist for recommendations",
        "Follow package instructions"
      ],
      administration: [
        "Take medications with food",
        "Follow recommended dosages",
        "Monitor symptoms closely",
        "Seek medical attention if worsening"
      ],
      warning: "Consult a healthcare professional if symptoms persist or worsen."
    };
  }

  private parseTreatmentResponse(text: string): any {
    return {
      lifecyclePhases: {
        phase1: "Immediate relief and symptom management",
        phase2: "Active treatment and healing",
        phase3: "Recovery and prevention"
      },
      naturalRemedies: [
        "Rest and adequate sleep",
        "Stress reduction techniques",
        "Natural anti-inflammatory foods",
        "Gentle exercise as tolerated",
        "Hydration therapy",
        "Herbal remedies as appropriate"
      ],
      foods: [
        "Anti-inflammatory foods",
        "Fresh fruits and vegetables",
        "Lean proteins",
        "Whole grains",
        "Healthy fats",
        "Adequate hydration"
      ],
      medications: [
        "Over-the-counter pain relief",
        "Anti-inflammatory medications",
        "Topical treatments",
        "Supplements as recommended"
      ],
      exercises: [
        "Gentle stretching",
        "Light walking",
        "Breathing exercises",
        "Range of motion activities",
        "Gradual activity increase"
      ],
      dailySchedule: [
        { time: "08:00", activity: "Morning medication and breakfast", type: "medication" },
        { time: "12:00", activity: "Healthy lunch and light exercise", type: "nutrition" },
        { time: "18:00", activity: "Evening medication", type: "medication" },
        { time: "21:00", activity: "Relaxation and preparation for sleep", type: "wellness" }
      ],
      preventionTips: [
        "Maintain healthy lifestyle",
        "Regular exercise routine",
        "Stress management",
        "Adequate sleep"
      ],
      possibleCauses: [
        "Lifestyle factors",
        "Environmental triggers",
        "Genetic predisposition",
        "Previous injuries or conditions"
      ]
    };
  }

  private parseArticleResponse(text: string, topic: string): any {
    return {
      title: `Understanding ${topic}: A Comprehensive Guide`,
      overview: text.substring(0, 300) + "...",
      keyPoints: [
        "Understanding the condition",
        "Recognizing symptoms early",
        "Lifestyle modifications",
        "Treatment options",
        "Prevention strategies",
        "Long-term management"
      ],
      naturalTreatments: [
        "Dietary modifications",
        "Herbal remedies",
        "Physical therapy",
        "Stress management",
        "Sleep optimization"
      ],
      evidence: "Recent research supports the effectiveness of natural treatments combined with conventional medicine.",
      prevention: [
        "Regular health screenings",
        "Healthy diet and exercise",
        "Stress management",
        "Adequate sleep"
      ],
      seekHelp: "Seek immediate medical attention if symptoms are severe, persistent, or worsening."
    };
  }

  isConfigured(): boolean {
    return !!(this.getApiKey('gemini') || this.getApiKey('openai'));
  }
}

export const aiService = new AIService();