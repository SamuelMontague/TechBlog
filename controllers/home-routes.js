const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: {
                model: User,
                attributes: ['username']
            }
        });

        const posts = postData.map((post) => post.get({plain: true}));

        res.render('homepage', {
            posts, 
            logged_in: req.session.logged_in
        })
    
    } catch(err){
        res.status(500).json(err)
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    console.log('in dashboard')
    try {
      
      const userData = await User.findByPk(req.session.user_id,{
        attributes: {exclude: ['password'] },
        include: [{
            model: Post
           
        }],
      });
      console.log(userData)
      const user = userData.get({ plain: true });
  
      console.log("this is user", user)
      res.render('dashboard', {
        ...user,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get('/signup', (req, res) => {
    if(req.session.logged_in){
        res.redirect('/dashboard');
        return;
    }
    res.render('signup');
})

router.get('/login', (req, res) => {
    if(req.session.logged_in){
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
})

router.post('/login', async (req, res) => {
    try{
      const userData = await User.findOne({ where: { username: req.body.username } });
  
      if (!userData) {
        res
          .status(400)
          .json({ message: 'incorrect username or password, please try again' });
        return;
      }
  
      const validPassword = await userData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'incorrect username or password, please try again' });
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

router.post('/logout', (req, res) => {
    if(req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).render();
        });
    } else {
        res.status(404)
    }
})

router.get('/posts/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['username']
            }]
        });

        const posts = postData.get({plain: true});

        const commentData = await Comment.findAll({
            where: {
                post_id: req.params.id
            },
            include: [{
                model: User,
                attributes: ['username']
            }]
        });

        const comments = commentData.map((comment) => comment.get({plain: true}))
        console.log("this is post!!" , posts)
        console.log("this is comments!", comments)
        res.render('post', {
            ...posts,
            comments,
            logged_in: req.session.logged_in
        });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.get('/edit/:id', async (req,res) => {
    try {
        const postData = await Post.findByPk(req.params.id,
            {
                include: [{
                    model: User, 
                    attributes: ['username']
                }]
            })

            const post = postData.get({plain: true});

            res.render('edit', {
                post,
                logged_in: req.session.logged_in
            });
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;