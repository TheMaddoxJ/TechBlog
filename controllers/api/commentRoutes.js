const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get comments
router.get('/', async (req, res) => {
    try{ 
      const commentData = await Comment.findAll({});
      if (commentData.length === 0) {
        res.status(404).json({ message: 'No comments!'});
        return;
      };
      res.status(200).json(commentData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Make a comment 
router.post('/', withAuth, async (req, res) => {
    const body = req.body;
    try {
        const makeComment = await Comment.create({
            ...body,
            userId: req.session.userId,
        });
        res.status(200).json({ makeComment, success: true });
    } catch (err) {
        res.status(500).json(err);
    }
});

  // Get comments from a specific post
  router.get('/:id', async (req, res) => {
    try{ 
      const commentData = await Comment.findAll({
        where: { id: req.params.id },
      });
            if (commentData.length === 0) {
        res.status(404).json({ message: 'No comments!'});
        return;
      };
      res.status(200).json(commentData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Delete a comment
  router.delete('/:id', withAuth, async (req, res) => {
    try {
      const commentData = await Comment.destroy({
        where: {id: req.params.id},
      });        
      if (!commentData) {
        res.status(404).json({
          message: `No comments!`,
        });
        return;
      }  
      res.status(200).json({commentData, success: true});
    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;