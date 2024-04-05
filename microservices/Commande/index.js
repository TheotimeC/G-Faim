const express = require('express')
const mongoose = require('mongoose');
const router = express.Router();
const Routes = require('./src/routes/routes');
const cors = require('cors');

require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 3003;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connecté a MongoDB');
  app.use('/',Routes)
  // Starting the server after successfully connecting to MongoDB
  app.listen(PORT, () => {
    console.log(`Serveur en ligne sur le port ${PORT}`);
  });
})
.catch(err => console.error('Erreur connection MongoDB:', err));


