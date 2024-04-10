const express = require('express')
const mongoose = require('mongoose');
const router = express.Router();
const Routes = require('./src/routes/routes');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
// Si server.js est exécuté depuis /projet-racine/microservice-backend
const componentsDir = path.join(__dirname, '..','..', 'client-react','src', 'components','common');

require('dotenv').config();

const app = express()
const PORT = process.env.PORT || 3004;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connecté a MongoDB');
  app.use('/',Routes)

  app.get('/api/components/list', (req, res) => {
    console.log("componentsDir",componentsDir)
      fs.readdir(componentsDir, (err, files) => {
          if (err) {
              console.error('Erreur lors de la lecture du dossier des composants :', err);
              return res.status(500).send('Erreur lors de la récupération des composants');
          }

          const components = files.map(file => ({
              name: file,
              downloadPath: `/api/components/download/${encodeURIComponent(file)}`
          }));

          res.json(components);
      });
  });

  app.get('/api/components/download/:fileName', (req, res) => {
      const fileName = req.params.fileName;
      const filePath = path.join(componentsDir, fileName);

      res.download(filePath, fileName, err => {
          if (err && !res.headersSent) {
              console.error('Erreur lors du téléchargement du composant :', err);
              res.status(500).send('Erreur lors du téléchargement du composant');
          }
      });
  });

  // Starting the server after successfully connecting to MongoDB
  app.listen(PORT, () => {
    console.log(`Serveur en ligne sur le port ${PORT}`);
  });
})
.catch(err => console.error('Erreur connection MongoDB:', err));


