const { Anthropic } = require('@anthropic-ai/sdk');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  async generateResponse(messages) {
    try {
      const response = await this.client.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: messages
      });
      
      return response.content[0].text;
    } catch (error) {
      throw { name: 'AIServiceError', message: 'Failed to generate AI response' };
    }
  }

  async analyzeContent(content) {
    try {
      const message = await this.client.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Analyze this blog post and provide a summary and key points: ${content}`
        }]
      });
      
      return message.content[0].text;
    } catch (error) {
      throw { name: 'AIServiceError', message: 'Failed to analyze content' };
    }
  }
}

module.exports = new ClaudeService();