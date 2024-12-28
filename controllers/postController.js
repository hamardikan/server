const { Post, User, Tag, Comment } = require('../models');

class PostController {
  static async getAll(req, res, next) {
    try {
      const posts = await Post.findAll({
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'email', 'picture']
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] } // Exclude junction table attributes
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(posts);
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'email', 'picture']
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] }
          },
          {
            model: Comment,
            as: 'comments',
            include: [
              {
                model: User,
                as: 'author',
                attributes: ['id', 'name', 'picture']
              }
            ]
          }
        ]
      });

      if (!post) {
        throw { name: 'NotFound', message: 'Post not found' };
      }

      res.json(post);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { title, content, tags } = req.body;
      
      if (!title || !content) {
        throw { name: 'BadRequest', message: 'Title and content are required' };
      }

      const post = await Post.create({
        title,
        content,
        authorId: req.user.id
      });

      // If tags are provided, associate them with the post
      if (tags && tags.length > 0) {
        const foundTags = await Tag.findAll({
          where: { id: tags }
        });
        await post.setTags(foundTags);
      }

      // Fetch the created post with its associations
      const createdPost = await Post.findByPk(post.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'email', 'picture']
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] }
          }
        ]
      });

      res.status(201).json(createdPost);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, content, tags, published } = req.body;

      const post = await Post.findByPk(id);
      if (!post) {
        throw { name: 'NotFound', message: 'Post not found' };
      }

      if (post.authorId !== req.user.id) {
        throw { name: 'Forbidden', message: 'Not authorized to update this post' };
      }

      await post.update({
        title: title || post.title,
        content: content || post.content,
        published: published !== undefined ? published : post.published
      });

      // Update tags if provided
      if (tags) {
        const foundTags = await Tag.findAll({
          where: { id: tags }
        });
        await post.setTags(foundTags);
      }

      // Fetch updated post with associations
      const updatedPost = await Post.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'email', 'picture']
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] }
          }
        ]
      });

      res.json(updatedPost);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const post = await Post.findByPk(id);
      if (!post) {
        throw { name: 'NotFound', message: 'Post not found' };
      }

      if (post.authorId !== req.user.id) {
        throw { name: 'Forbidden', message: 'Not authorized to delete this post' };
      }

      await post.destroy();
      res.json({ message: 'Post deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async getUserPosts(req, res, next) {
    try {
      const { userId } = req.params;
      
      const posts = await Post.findAll({
        where: { authorId: userId },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'email', 'picture']
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] }
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json(posts);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PostController;