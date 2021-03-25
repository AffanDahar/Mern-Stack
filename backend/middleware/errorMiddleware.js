const HttpError = require("../models/http-error")

const notFound = (req,res,next) => {
    const error = new HttpError(`requested route ${req.originalUrl} is not found`)
    throw error
    
}

const errorHandler = (err , req,res,next) => {
    if(res.headerSent){
        return next(err)
    }

    res.status(err.code || 500)
    res.json({message : err.message})
}

module.exports = {notFound , errorHandler}