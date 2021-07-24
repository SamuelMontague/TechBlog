const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');


// GET all comment
// router.get('/', async (req, res) => {
//     try {
//         const commentData = await Comment.findAll({
//             include: [
//                 {
//                     model: User,
//                     attributes: ['userName'],
//                 },
//                 {
//                     model: Post,
//                     attributes: ['id', 'post-title', 'post-content', 'user_id'],
//                     include: {
//                         model: User,
//                         attributes: [userName]
//                     }

//                 },
//             ],
//         });


//         const comments = commentData.map((comment) =>
//             comment.get({ plain: true })
//         );

//         res.render('comment', {
//             comment,
//             loggedIn: req.session.loggedIn,
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     }
// });


// router.post('/', withAuth, async (req, res) => {
//     try {
//       const newComment = await Comment.create({
//        commentText: req.body.Comment-title,
//         content: req.body.Comment-content,
//         used_id: req.session.user_id
//       });
  
//       res.status(200).json(newComment);
//     } catch (err) {
//       res.status(400).json(err);
//     }
//   });
  
//   router.delete('/:id', withAuth, async (req, res) => {
//     try {
//       const CommentData = await Comment.destroy({
//         where: {
//           id: req.params.id,
//         },
//       });
  
//       if (!CommentData) {
//         res.status(404).json({ message: 'No Comment found with this id!' });
//         return;
//       }
  
//       res.status(200).json(CommentData);
//     } catch (err) {
//       res.status(500).json(err);
//     }
//   });

  module.exports = router;