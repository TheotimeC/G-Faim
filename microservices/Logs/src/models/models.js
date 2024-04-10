const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  entityType: {
    type: String,
    required: true,
    // Exemple: 'User', 'Order', 'Product', etc.
  },
  entityId: {
    type: String,
    required: true,
    // L'ID de l'entité concernée par le log
  },
  action: {
    type: String,
    required: true,
    // Exemple: 'created', 'updated', 'deleted', etc.
  },
  userId: {
    type: String ,
    ref: 'User',
    required: false,
    // ID de l'utilisateur qui a effectué l'action, si applicable
  },
  description: {
    type: String,
    required: true,
    // Description détaillée de l'action effectuée
  },
  additionalData: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
    // Description détaillée de l'action effectuée
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, { collection: 'Logs' });

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
