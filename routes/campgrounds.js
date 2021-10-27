const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Campground = require('../models/campground');

// rota para listar todos os campgrounds. Referenciando o arquivo em controllers.
router.get('/', catchAsync(campgrounds.index));

// rota para ver form de criação de novo campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// rota para criacao/submit do novo campground
router.post(
  '/',
  isLoggedIn,
  upload.array('image'),
  validateCampground,
  catchAsync(campgrounds.createNewCampground)
);

router.post('/', upload.array('image'), (req, res) => {
  console.log(req.body, req.file);
  res.send('It worked');
});

// rota para detalhe de campground
router.get('/:id', catchAsync(campgrounds.campgroundDetail));

// rota para o form de edicao do campground
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.campgroundEdit)
);

// rota para submit do form com o update do registro
router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  upload.array('image'),
  validateCampground,
  catchAsync(campgrounds.campgroundEditSubmit)
);

// rota para deletar registro
router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.campgroundDelete)
);

module.exports = router;
