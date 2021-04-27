const express = require('express')
const { check } = require('express-validator')

const router = express.Router()
const {protect} = require('../middleware/authMiddleware')

const {getPlaceById  , createPlace , updatePlace , deletePlace , findPlacesByUserId} =  require('../controllers/placesController')

router.route('/users').get(protect,findPlacesByUserId)
router.get('/:pid',  getPlaceById )
router.post('/', protect, [
  check('title').not().isEmpty(),
  check('description').isLength({min : 5}),
  check('address').not().isEmpty()
], createPlace )
router.patch('/:pid', updatePlace )
router.delete('/:pid', deletePlace)


module.exports = router