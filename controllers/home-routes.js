const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const router = require('express').Router();


router.get('/', async (req, res) => {
    console.log()
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
        
        include: [{
          model: User,
          attributes: ['userName'],
  
          model: Comment, 
          attributes: ['created_at', 'id', 'comment', 'post_id', 'user_id'],
        }],
      });
      
      const posts = postData.map((post) => post.get({ plain: true }));
  
      
      res.render('homepage', {
        posts,
        logged_in: req.session.logged_in
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });


router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }
    res.render('login');
})

router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
      res.redirect('/');
      return;
    }
  
    res.render('signup');
});


router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: { 
            id: req.params.id
        },
        attributes: [
            'id', 
            'content',
            'title',
            'created_at'
        ],
        include: [{
            model: Comment, 
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'create_at'],
            include: {
                model: User, 
                attributes: ['username']
            }
        },
        {
            model: User, 
            attributes: ['username']
        }]
    })
    .then(postdata => {
        if (!postdata) {
        res.status(404).json({ message: 'no post found with this id'});
        return
    }
        const post = postdata.get({ plain: true});
        console.log(post);
        res.render('single-post', { post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.statusMessage(500).json(err);
    });
});

router.get('/posts-comments', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'content', 
            'title',
            'created_at'
        ],
        include: [{
            model: Comment, 
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: Comment, 
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User, 
                    attributes: ['username']
                }
            }
        }]   
         
    })
    .then(postdata => {
        if(!postdata) {
            res.status(404).json({message: 'No post found with this id'});
            return;
        }
        const post = postdata.get({ plain: true })
        res.render('posts-comments', {post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

module.exports = router;