const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  id:{
    type: mongoose.Schema.Types.ObjectId,
    required:false
    },
    Titre: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  Prix: {
    type: Number,
    required: true
  },
  Catégorie: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: false
  },
  activ: {
    type: Boolean,
    required: false,
    default:true
  }
});

const menuSchema = new mongoose.Schema({
  id:{
    type: mongoose.Schema.Types.ObjectId,
    required:false
    },
  Titre: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  Prix: {
    type: Number,
    required: true
  },
  Articles: [{
    type: mongoose.Schema.Types.ObjectId, // Supposant que ce sont les IDs des articles référencés
    required: true
  }],
  img: {
    type: String,
    required: false
  },
  activ: {
    type: Boolean,
    required: false,
    default:true
  }
});

const horaireSchema = new mongoose.Schema({
  Lundi: String,
  Mardi: String,
  Mercredi: String,
  Jeudi: String,
  Vendredi: String,
  Samedi: String,
  Dimanche: String
}, { _id: false }); // Pas besoin d'un ID séparé pour les horaires

const restaurantSchema = new mongoose.Schema({
  id:{
  type: mongoose.Schema.Types.ObjectId,
  required:false
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  Nom: {
    type: String,
    required: true
  },
  Telephone: {
    type: String,
    required: true
  },
  Adresse: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Categorie: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  Horairesouverture: horaireSchema,
  Menus: [menuSchema],
  Articles: [articleSchema]
}, { collection: 'Restaurant' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
