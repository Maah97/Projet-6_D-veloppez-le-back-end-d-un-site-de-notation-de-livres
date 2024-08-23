const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config');

const bookController = require('../controllers/books');

router.post('/', auth, multer, bookController.createBook);
router.post('/:id/rating', auth, bookController.postRatingBook);
router.get('/', bookController.getAllBooks);
router.get('/bestrating', bookController.getBestRatingBook);
router.get('/:id', bookController.getOneBook);
router.put('/:id', auth, multer, bookController.modifyOneBook);
router.delete('/:id', auth, bookController.deleteOneBook);

module.exports = router;