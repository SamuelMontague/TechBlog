const router = require('express').Router();
const {Post, User, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

// allows for creation of posts
router.post('/', withAuth, async (req, res) => {
  try{
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id
    });

    res.status(200).json(newPost);
  }catch(err){
    console.log(err);
    res.status(400).json(err);
  }
});

// allows for existing post editing
router.put('/edit/:id', withAuth, async (req, res) => {
  try{
    const postData = await Post.update({
      title: req.body.title,
      post_body: req.body.post_body
      },
      {
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      }
    });

    res.status(200).json(postData);

  }catch(err){
    console.log(err);
    res.status(400).json(err);
  }
});

// allows for deletion of posts
router.delete('/:id', withAuth, async (req, res) => {
  try{
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id
      }
    });

    if(!postData){
      res.status(404).json({message: "entered post ID not found"});

      return;
    }
    res.status(200).json(postData);

  }catch(err){
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;