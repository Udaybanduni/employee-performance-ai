const axios = require('axios');
const Employee = require('../models/Employee');

exports.getRecommendations = async (req, res) => {
  try {
    const { employeeId } = req.body;

    if (!employeeId) {
      console.log('Error: Missing employeeId in request body');
      return res.status(400).json({ message: 'Employee ID is required' });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      console.log(`Error: Employee not found for ID ${employeeId}`);
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Construct the prompt for OpenRouter
    const prompt = `
      Analyze the following employee and provide a performance review, promotion recommendation, and training suggestions.
      Format your response in plain text with clear headings, or simple markdown.
      
      Employee Details:
      - Name: ${employee.name}
      - Department: ${employee.department}
      - Skills: ${employee.skills.join(', ') || 'None listed'}
      - Performance Score: ${employee.performanceScore}/100
      - Years of Experience: ${employee.yearsOfExperience}
      
      Please provide:
      1. Promotion Recommendation (Yes/No and Why)
      2. Performance Feedback
      3. Suggested Training / Upskilling
    `;

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      console.error('Error: OPENROUTER_API_KEY is missing in .env');
      return res.status(500).json({ message: 'OpenRouter API key is missing on the server' });
    }

    console.log('====================================');
    console.log('OPENROUTER API REQUEST INITIATED');
    console.log('Model: google/gemini-2.5-flash');
    console.log('Endpoint: https://openrouter.ai/api/v1/chat/completions');
    console.log(`API Key loaded: ${openRouterApiKey ? 'Yes (Starts with ' + openRouterApiKey.substring(0, 7) + '...)' : 'No'}`);
    console.log('====================================');

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.5-flash',
        max_tokens: 1500, // Fixing the 402 Credits Error by limiting tokens
        messages: [
          { role: 'system', content: 'You are an expert HR analyst providing employee performance insights.' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'TalentPulse AI',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('OpenRouter Response Status:', response.status);
    
    if (!response.data || !response.data.choices || response.data.choices.length === 0) {
      console.error('Error: OpenRouter returned an unexpected format:', response.data);
      return res.status(500).json({ message: 'Invalid response format from AI service' });
    }

    const aiRecommendation = response.data.choices[0].message.content;
    console.log('Successfully generated AI recommendation of length:', aiRecommendation.length);

    res.status(200).json({ recommendation: aiRecommendation });
  } catch (error) {
    console.error('====================================');
    console.error('AI RECOMMENDATION ERROR CAUGHT');
    if (error.response) {
      console.error('OpenRouter Status Code:', error.response.status);
      console.error('OpenRouter Error Data:', JSON.stringify(error.response.data, null, 2));
      const exactMessage = error.response.data?.error?.message || 'Unknown OpenRouter Error';
      return res.status(error.response.status).json({ message: `OpenRouter Error: ${exactMessage}` });
    } else {
      console.error('Server/Network Error:', error.message);
      return res.status(500).json({ message: `Server Error: ${error.message}` });
    }
  }
};
