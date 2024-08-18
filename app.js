const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://MonGrimoire:MonGrimoire082024@cluster0.87avv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use('/api/books', (req, res) => {
    const books = [
        {
            userId : 'String - identifiant MongoDB unique de utilisateur qui a créé le livre',
            title : 'String - titre du livre',
            author : 'String - auteur du livre',
            imageUrl : 'String - illustration/couverture du livre',
            year: '1997',
            genre: 'String - genre du livre',
            ratings : [
                {
                    userId : 'String - identifiant MongoDB unique de utilisateur qui a noté le livre',
                    grade : '2'
                }
            ],
            
            averageRating : '15'
        }


    ];
    res.status(200).json(books);
  });

module.exports = app;