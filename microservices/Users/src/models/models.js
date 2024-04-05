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
  }
}, { collection: 'Users' });

userSchema.pre('save', async function(next) {
  if (!this.isModified('mot_de_passe')) return next();
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, 12);
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
