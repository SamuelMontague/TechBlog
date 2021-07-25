
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const router = require('express').Router();



router.get('/', (req, res) => {
    try {
  
      res.render('homepage', {
        User,
        logged_in: req.session.logged_in,
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

router.get('/', async (req, res) => {
    try {
      
      const postData = await Post.findAll({
        
        attributes: req.body,
        include: [{
            model: User,
            attributes: ['name']
        }]
      });
      
      const posts = postData.map((post) => post.get({ plain: true }));
  
      
      res.render('homepage', {
        posts
      });
    } catch (err) {
        console.log(err)
      res.status(500).json(err);
    }
});

router.get('/post/:id', async (req, res) => {
    try {
        const postdata = await Post.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['name']
            }]
        })

        const posts = postadata.get({plain: true});

        res.render('post', {
            ...posts,
            logged_in: req.session.logged_in
        })
    }catch(err){
        res.status(500).json(err)
    }
})
    

router.get('/comments', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            ...req.body
        })

        res.status(200).json(commentData);

    }catch(err){
        res.status(400).json(err)
    }
})

router.get('/comments/:id', async (req, res) => {
    try {
        const commentData = await Comment.findByPk(req.params.id, {
            include: [{
                model: User, 
                attributes: ['name']
            }]
        })

        const comments = commentData.get({plain: true})

        res.render('comment', {
            ...comments, 
            logged_in: req.session.logged_in
        })
    } catch(err){
        res.status(500).json(err);
    }
})

router.get('/profile', withAuth, async (req, res) => {
    try{
        const userdata = await User.findByPk(req.session.user_id, {
            attributes: {exclude: ['password']},
            include: [{model: Post}]
        });

        const user = userdata.get({plain: true})

        res.render('dashboard', {
            ...user,
            logged_in: true
        })
    }catch(err){
        res.status(500).json(err);
    }

})

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
})

router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
      res.redirect('/dashboard');
      return;
    }
    
    res.render('signup');
});

module.exports = router;