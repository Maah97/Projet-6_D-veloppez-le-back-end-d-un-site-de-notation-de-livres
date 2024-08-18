const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const bookController = require('../controllers/books');

router.post('/', auth, bookController.createBook);
router.post('/:id/rating', auth, bookController.postRatingBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getOneBook);
router.get('/bestrating', bookController.getBestRatingBook);
router.put('/:id', auth, bookController.modifyOneBook);
router.delete('/:id', auth, bookController.deleteOneBook);

module.exports = router;