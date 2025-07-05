const express=require('express');
const router=express.Router();
const {addReview, getReviewsByBook, likeOrDislikeReview} =require('../controllers/reviewController')

const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, addReview); 
router.get('/:bookId', verifyToken, getReviewsByBook); 
router.post('/like', verifyToken,likeOrDislikeReview);

module.exports = router;