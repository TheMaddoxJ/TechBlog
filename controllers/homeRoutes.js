const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const sequelize = require('../config/connection');

// GET POSTS
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const post = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      projects, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a post
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: {id: req.params.id},
      attributes: ['title', 'content', 'id', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: ['comment', 'userId', 'id', 'created_at', 'post_id'],
          include: {
            model: User,
            attributes: ['username']
          },
        },
        { model: User,
        attributes: ['username'], }
      ],
      order: [['created_at', 'description']],
    });

    if (postData) {
      const post = postData.get({ plain: true });
      res.render('post', { post, loggedIn: req.session.loggedIn, username: req.session.username, })  

  } else {
      res.status(404).json({ message: "no post for this id!"});
      return;
  }

} 

catch (err) { res.status(500).json(err); }   
});

//Signup
router.get('/signup', async (req, res) => {
  res.render('signup');
});


// Login
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;