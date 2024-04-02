const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  }
}, { collection: 'Users' });

const User = mongoose.model('User', userSchema);
module.exports = User;
