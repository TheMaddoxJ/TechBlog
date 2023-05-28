const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../utils/auth');

// Signup
router.post('/', async (req, res) => {
  try {
    const postData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.email = userData.email;
      req.session.logged_in = true;

      res.status(200).json({ message: `profile created for ${userData.username}`});
    });

  } 
  catch (err) {
    res.status(400).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect user id' });
      return;
    };

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect password' });
      return;
    };

    // Create session
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.email = userData.email;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
