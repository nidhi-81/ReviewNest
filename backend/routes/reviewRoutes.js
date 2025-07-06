const express=require('express');
const router=express.Router();
const {addReview, getReviewsByBook, likeOrDislikeReview, deleteReview, getAllReviews} =require('../controllers/reviewController')

const verifyAdmin = require('../middleware/verifyAdmin');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, addReview); 
router.get('/all', verifyToken, verifyAdmin, getAllReviews);
router.get('/:bookId', verifyToken, getReviewsByBook); 

router.post('/like', verifyToken,likeOrDislikeReview);
router.delete('/:reviewId', verifyToken, verifyAdmin, deleteReview);

module.exports = router;