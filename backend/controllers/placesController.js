const { validationResult } = require('express-validator');
const mongoose = require('mongoose')
const User = require('../models/userModel')
const HttpError= require('../models/http-error');
const getCoordsForAddress = require('../utils/utils')
const Place = require('../models/placesModel')

  
const getPlaceById = async (req,res,next) => {

    const placeId = req.params.pid 
 
    const place = await Place.findById(placeId).populate(
      'creator',
      'name email'
    )

    if(!place){
        throw new HttpError('place not found with provided id',500)
    }

    res.status(201).json({ place : place.toObject({getters : true}) })
}

// const getPlaces = async (req,res,next) => {
//   const places = await Place.find()
// }

const createPlace = async (req, res, next) => {
  const userId = req.user._id

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address } = req.body;

  
  const coordinates = await getCoordsForAddress(address);
  

  // const title = req.body.title;
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator : userId
  });

  let user 
  try{
   user = await User.findById(userId)
  }catch (err){
    const error = new HttpError('Creating Place failed, please try again',500)
    return next(error)
  
  }

  if(!user){
    const error = new HttpError('Could not find user for provided id', 404)
    return next(error)
  }

  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({session: sess})

    user.places.push(createdPlace)
    await user.save({session : sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }
  
  res.status(201).json({ place: createdPlace });
};


const updatePlace = async(req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const placeId = req.params.pid
//  first method
  // const updatedPlace = await Place.findByIdAndUpdate(placeId , req.body, {
  //     new : true ,
  //     runValidators : true
  // })

  // if(!updatedPlace){
  //   const error = new HttpError('something went wrong could not update place', 500)
  //   return next(error)
  // }

  // second method
  const {title , description} = req.body
  let place 
  try {
   place =  await Place.findById(placeId)
  } catch (err){
    const error = new HttpError('something went wrong could not update place', 500)
    return next(error)
  }

  place.title = title 
  place.description= description

  const updatedPlace = await place.save()

  res.status(201).json({place : updatedPlace.toObject({getters : true})})
}

const deletePlace = async (req,res , next) => {
  const placeId = req.params.pid
  
  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  if(!place){
    const error = new HttpError('Could not find place by provided id', 404)
    return next(error)
  }

  try{
  const sess = mongoose.startSession()
   sess.startTransaction()
   await  place.remove({session : sess})
   place.creator.pull(place)
   await place.creator.save({session : sess})
   await (await sess).commitTransaction
  }catch(err){
  const error = new HttpError('Something went wrong could not delete place.', 500)
   return next(error)  
}

  
  res.status(200).json({message : 'place deleted successfully'})
}

const findPlacesByUserId = async (req,res,next) =>{
  const user = req.user._id
  console.log(user)
   let places
   try {
     places = await Place.find({creator : req.user._id}).populate(
      'creator',
      'name email'
    ) 
   } catch(err){
     const error = new HttpError(err, 500)
          return next(error)
   }


   if(!places || places.length == 0){
     throw new HttpError('could not find places', 400)
   }
   res.status(200).json({places : places.map(place => place.toObject({getters : true}))})

}

module.exports =  {getPlaceById , createPlace , updatePlace , deletePlace , findPlacesByUserId}