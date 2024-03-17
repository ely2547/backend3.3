const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir);
}

router.use(cors());
router.use(express.json());
router.use('/uploads', express.static('uploads'));


// Configuración de Multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Esquema de Mongoose para los servicios
const serviceSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String
});

const Service = mongoose.model('Service', serviceSchema);

// Conexión a MongoDB
mongoose.connect('mongodb+srv://anggemarigi:Pancho20.@cluster2.vhsetpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2');

// Rutas CRUD
router.post('/services', upload.single('image'), (req, res) => {
  const newService = new Service({
    name: req.body.name,
    description: req.body.description,
    image: req.file.path // Guarda la ruta de la imagen
  });
  newService.save().then(() => res.json('Servicio agregado exitosamente!'));
});

router.get('/services', (req, res) => {
  Service.find()
    .then(services => res.json(services))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/services/:id', upload.single('image'), (req, res) => {
  Service.findById(req.params.id)
    .then(service => {
      service.name = req.body.name;
      service.description = req.body.description;
      // Verifica si hay un archivo de imagen en la solicitud y actualiza la ruta de la imagen
      if (req.file) {
        service.image = req.file.path;
      }

      service.save()
        .then(() => res.json(service)) 
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


router.delete('/services/:id', (req, res) => {
  Service.findByIdAndDelete(req.params.id)
    .then(() => res.json('Servicio eliminado.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
