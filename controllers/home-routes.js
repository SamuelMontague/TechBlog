const router = require('express').Router();
const {Post, User, Comment} = require('../models');
const withAuth = require('../utils/auth');

// renders homepage with posts
router.get('/', async (req, res) => {
  try{
    const postData = await Post.findAll({
      include: {
        model: User,
        attributes: ['name']
      }
    });

    const posts = postData.map((post) => post.get({plain: true}));

    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in
    });

  }catch(err){
    console.log(err);
    res.status(500).json(err);
  }
});

// renders user dashboard or redirects to login
router.get('/dashboard', withAuth, async (req, res) => {
  try{
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });

  }catch(err){
    res.status(500).json(err);
  }
});

// renders signup or dashboard if already logged-in
router.get('/signup', (req, res) => {
  if(req.session.logged_in){
    res.redirect('/dashboard');
    return;
  }
  res.render('signup');
});

// renders login page
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

// handles login process and creates user session
router.post('/login', async (req, res) => {
  try{
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'you are now logged in' });
    });

  }catch(err){
    res.status(400).json(err);
  }
});

// allows user to end their session if logged in
router.post('/logout', (req, res) => {
  if(req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// allows reference to specific posts by id
router.get('/posts/:id', async (req, res) => {
  try{
    const postData = await Post.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['name']
      }]
    });

    const posts = postData.get({plain: true});

    const commentData = await Comment.findAll({
      where: {
        post_id: req.params.id
      },
      include: [{
        model: User,
        attributes: ['name']
      }]
    });

    const comments = commentData.map((comment) => comment.get({plain: true}));

    res.render('post', {
      ...posts,
      comments,
      logged_in: req.session.logged_in
    });

  }catch(err){
    console.log(err);
    res.status(500).json(err);
  }
});

// route for access to post editing
router.get('/edit/:id', async (req, res) => {
  try{
    const postData = await Post.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['name']
      }]
    });

    const post = postData.get({plain: true});

    res.render('edit', {
      post,
      logged_in: req.session.logged_in
    });

  }catch(err){
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;