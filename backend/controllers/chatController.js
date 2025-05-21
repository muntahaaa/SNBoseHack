const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to get Gemini model
const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};

// Helper function to convert roles to Gemini-compatible format
const convertRole = (role) => {
  switch (role.toLowerCase()) {
    case 'assistant':
      return 'model';
    case 'system':
      return 'user';
    default:
      return role;
  }
};

// Process chat request
exports.processChat = async (req, res) => {
  try {
    const { message, promptContext, chatHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = getGeminiModel();
    
    // Format chat history for Gemini API with proper role conversion
    const formattedHistory = chatHistory.map(msg => ({
      role: convertRole(msg.role),
      parts: [{ text: msg.content }]
    }));

    // Format prompt context as part of the user's message
    const contextualizedMessage = promptContext 
      ? `${promptContext.replace(/[\n\r\t-]/g, ' ').trim()}\n\nUser message: ${message}`
      : message;
    
    // Start a chat session
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(contextualizedMessage);
    const response = result.response.text();
    
    res.json({ 
      response,
      timestamp: new Date().toISOString() 
    });
    
  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat request',
      details: error.message 
    });
  }
};