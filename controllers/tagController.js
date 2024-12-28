const { Tag, Post, User } = require('../models');
const { Op } = require('sequelize');

class TagController {
  static async getAll(req, res, next) {
    try {
      const tags = await Tag.findAll({
        order: [['postCount', 'DESC']]
      });
      
      res.json(tags);
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const tag = await Tag.findByPk(id, {
        include: [{
          model: Post,
          as: 'posts',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'picture']
          }]
        }]
      });

      if (!tag) {
        throw { name: 'NotFound', message: 'Tag not found' };
      }

      res.json(tag);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, description } = req.body;

      if (!name) {
        throw { name: 'BadRequest', message: 'Tag name is required' };
      }

      // Create slug from name
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const tag = await Tag.create({
        name,
        slug,
        description
      });

      res.status(201).json(tag);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const tag = await Tag.findByPk(id);
      if (!tag) {
        throw { name: 'NotFound', message: 'Tag not found' };
      }

      // Update slug if name is changed
      const updates = {
        description: description || tag.description
      };

      if (name) {
        updates.name = name;
        updates.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      await tag.update(updates);
      
      res.json(tag);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const tag = await Tag.findByPk(id);
      if (!tag) {
        throw { name: 'NotFound', message: 'Tag not found' };
      }

      await tag.destroy();
      res.json({ message: 'Tag deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async getTrending(req, res, next) {
    try {
      const tags = await Tag.findAll({
        where: {
          postCount: {
            [Op.gt]: 0
          }
        },
        order: [['postCount', 'DESC']],
        limit: 10
      });

      res.json(tags);
    } catch (err) {
      next(err);
    }
  }

  static async getTagPosts(req, res, next) {
    try {
      const { id } = req.params;
      const posts = await Post.findAll({
        include: [
          {
            model: Tag,
            as: 'tags',
            where: { id },
            through: { attributes: [] }
          },
          {
            model: User,
            as: 'author',
            attributes: ['id', 'name', 'picture']
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

module.exports = TagController;