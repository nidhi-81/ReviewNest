const express=require('express');
const router=express.Router();
const {addReview, getReviewsByBook} =require('../controllers/reviewController')

const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, addReview); 
router.get('/:bookId', getReviewsByBook); 

module.exports = router;