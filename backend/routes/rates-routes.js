const express = require('express');
const { check } = require('express-validator');

const ratesController = require('../controllers/rates-controller');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/', ratesController.getAllRates);
router.get('/user/:uid/place/:pid', ratesController.getRateByUserAndPostId);
router.get('/user/:uid', ratesController.getRateByUserId);
router.get('/:rid', ratesController.getRateById);

router.use(checkAuth);

router.post(
  '/place/:pid/user/:uid',
  ratesController.createRate
);

// router.patch(
//   '/:rid',
//   ratesController.update
// );

// router.delete('/:rid', ratesController.);

module.exports = router;
