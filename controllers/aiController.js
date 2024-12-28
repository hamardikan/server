const ClaudeService = require('../services/claude.service');
const { Post } = require('../models');

class AIController {
  static async chatAboutPost(req, res, next) {
    try {
      const { postId } = req.params;
      const { message } = req.body;

      if (!message) {
        throw { name: 'BadRequest', message: 'Message is required' };
      }

      // Get the post content
      const post = await Post.findByPk(postId);
      if (!post) {
        throw { name: 'NotFound', message: 'Post not found' };
      }

      // Construct system message with blog context
      const messages = [
        {
          role: "system",
          content: `You are a helpful assistant discussing a blog post. The post's title is "${post.title}". 
                   Your responses should be focused on the blog content and related topics.
                   Be informative but concise. If asked about topics unrelated to the blog post, 
                   gently guide the conversation back to the blog content.`
        },
        {
          role: "user",
          content: `Blog Content: ${post.content}\n\nUser Question: ${message}`
        }
      ];

      const response = await ClaudeService.generateResponse(messages);
      res.json({ response });
    } catch (err) {
      next(err);
    }
  }

  static async analyzeBlogPost(req, res, next) {
    try {
      const { postId } = req.params;

      const post = await Post.findByPk(postId);
      if (!post) {
        throw { name: 'NotFound', message: 'Post not found' };
      }

      const analysis = await ClaudeService.analyzeContent(post.content);
      res.json({ analysis });
    } catch (err) {
      next(err);
    }
  }

  static async suggestRelatedTopics(req, res, next) {
    try {
      const { postId } = req.params;

      const post = await Post.findByPk(postId);
      if (!post) {
        throw { name: 'NotFound', message: 'Post not found' };
      }

      const messages = [
        {
          role: "user",
          content: `Based on this blog post titled "${post.title}", suggest 5 related topics or questions for further discussion:\n\n${post.content}`
        }
      ];

      const suggestions = await ClaudeService.generateResponse(messages);
      res.json({ suggestions });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AIController;