const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mot_de_passe: {
    type: String,
    required: true
  },
  adresses_de_livraison: [{
    adresse: {
      type: String,
      required: true
    },
    code_postal: {
      type: String,
      required: true
    },
    ville: {
      type: String,
      required: true
    },
    pays: {
      type: String,
      required: true
    }
  }],
  code_parrain: {
    type: String,
    required: false
  },
  total_personnes_parrainees: {
    type: Number,
    required: true,
    default: 0
  },
  apiKey:{
    type: String,
    required:true
  }
}, { collection: 'Users' });

userSchema.pre('save', async function(next) {
  if (!this.isModified('mot_de_passe')) return next();
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, 12);
  next();
});

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
    required: true
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
    type: String, // Supposant que ce sont les IDs des articles référencés
    required: true
  }],
  img: {
    type: String,
    required: true
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
const User = mongoose.model('User', userSchema);
module.exports = User;
