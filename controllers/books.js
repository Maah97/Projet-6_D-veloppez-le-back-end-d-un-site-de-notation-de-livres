const { json } = require('body-parser');
const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    book.save()
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};

exports.postRatingBook = (req, res, next) => {
    ratingObjet = {...req.body};
    Book.findOne({_id: req.params.id})
        .then((book) => {
            const ExistingRating = book.ratings.find(({ userId }) => userId === ratingObjet.userId);
            if ((!ExistingRating) && (ratingObjet.rating < 6)) {
                book.ratings.push({userId: ratingObjet.userId, grade: ratingObjet.rating});
                let sum = 0;
                for (let i = 0; i < book.ratings.length; i++) {
                    sum = sum + book.ratings[i].grade; 
                }
                book.averageRating = Math.round(sum / book.ratings.length);
                delete book._userId;
                Book.updateOne({ _id: req.params.id}, book)
                .then(() => res.status(200).json(book))
                .catch(error => res.status(401).json({ error }));
            } else {
                res.status(403).json('Vous avez déjà noté ce livre !');
            }           
        })
        .catch(error => res.status(404).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getBestRatingBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books.sort((x, y) => y.averageRating - x.averageRating).slice(0, 3 - books.length)))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

exports.modifyOneBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message : 'unauthorized request' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`,() => {
                    Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Livre modifié !'}))
                    .catch(error => res.status(401).json({ error }));
                })
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
       .then(book => {
           if (book.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};