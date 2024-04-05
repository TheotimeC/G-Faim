const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma modifié pour inclure les détails des articles dans les commandes
const commandeArticleDetailSchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  Titre: {
    type: String,
    required: true
  },
  Prix: {
    type: Number,
    required: true
  },
  quantite: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    required: true
  }
}, { _id: false }); // Pas besoin d'un ID séparé pour chaque détail d'article dans la commande

const CommandesSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  articles: [commandeArticleDetailSchema],
  status: { type: String, required: true },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  LivreurId: { type: Schema.Types.ObjectId, ref: 'Livreur' },
  isPickedUp: { type: Boolean, required: true, default: false },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { collection: 'Commande' });

const Commandes = mongoose.model('Commande', CommandesSchema);

module.exports = Commandes;
