const express = require('express');
const router = express.Router();
const { addBook, getBooks } = require('../controllers/bookController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, addBook); 
router.get('/', getBooks); 

module.exports = router;
