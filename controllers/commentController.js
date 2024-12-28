const { Comment, User, CommentUser } = require('../models');

class CommentController {
  static async getPostComments(req, res, next) {
    try {
      const { postId } = req.params;
      
      const comments = await Comment.findAll({
        where: { 
          postId,
          parentId: null // Only get top-level comments
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'picture']
          },
          {
            model: Comment,
            as: 'replies',
            include: [{
              model: User,
              as: 'author',
              attributes: ['id', 'name', 'picture']
            }]
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
            through: { attributes: [] }
          }
        ],
        order: [
          ['createdAt', 'DESC'],
          [{ model: Comment, as: 'replies' }, 'createdAt', 'ASC']
        ]
      });

      res.json(comments);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { postId } = req.params;
      const { content, parentId } = req.body;

      if (!content) {
        throw { name: 'BadRequest', message: 'Content is required' };
      }

      if (parentId) {
        const parentComment = await Comment.findByPk(parentId);
        if (!parentComment) {
          throw { name: 'NotFound', message: 'Parent comment not found' };
        }
      }

      const comment = await Comment.create({
        content,
        postId,
        parentId,
        userId: req.user.id
      });

      // Fetch the created comment with associations
      const createdComment = await Comment.findByPk(comment.id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'picture']
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
            through: { attributes: [] }
          }
        ]
      });

      res.status(201).json(createdComment);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const comment = await Comment.findByPk(id);
      if (!comment) {
        throw { name: 'NotFound', message: 'Comment not found' };
      }

      if (comment.userId !== req.user.id) {
        throw { name: 'Forbidden', message: 'Not authorized to update this comment' };
      }

      await comment.update({
        content,
        isEdited: true
      });

      // Fetch updated comment with associations
      const updatedComment = await Comment.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'picture']
          },
          {
            model: User,
            as: 'likedBy',
            attributes: ['id'],
            through: { attributes: [] }
          }
        ]
      });

      res.json(updatedComment);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const comment = await Comment.findByPk(id);
      if (!comment) {
        throw { name: 'NotFound', message: 'Comment not found' };
      }

      if (comment.userId !== req.user.id) {
        throw { name: 'Forbidden', message: 'Not authorized to delete this comment' };
      }

      await comment.destroy();
      res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async toggleLike(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const comment = await Comment.findByPk(id);
      if (!comment) {
        throw { name: 'NotFound', message: 'Comment not found' };
      }

      const existingLike = await CommentUser.findOne({
        where: { commentId: id, userId }
      });

      if (existingLike) {
        await existingLike.destroy();
        await comment.decrement('likes');
        res.json({ liked: false });
      } else {
        await CommentUser.create({ commentId: id, userId });
        await comment.increment('likes');
        res.json({ liked: true });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CommentController;