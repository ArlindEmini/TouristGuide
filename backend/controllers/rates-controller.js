const fs = require('fs');

const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');

const Rates = require('../models/rates');
const Place = require('../models/place');
const User = require('../models/user');

// Get Rate By Id

const getRateById = async (req, res, next) => {
  const rateId = req.params.rid;

  let rate;
  try {
    rate = await Rates.findById(rateId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a rate.',
      500
    );
    return next(error);
  }

  if (!rate) {
    const error = new HttpError(
      'Could not find rate for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ rate: rate.toObject({ getters: true }) });
};

// get All Rates----------

const getAllRates = async (req, res, next) => {
  let allRates;
  try {
    allRates = await Rates.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching rates failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!allRates || allRates.length === 0) {
    return next(new HttpError("Could not find rates", 404));
  }

  res.json({
    rates: allRates.map((rate) => rate.toObject({ getters: true })),
  });
};

// get Rate By User Id

const getRateByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userRate;
  try {
    userRate = await Rates.findOne({ 'userId': userId });
  } catch (err) {
    const error = new HttpError(
      'Fetching places failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!userRate) {
    const response = new HttpError(
      'There is no rate for this user',
      404
    );
    return next(response);
  }

  res.json({ rate: userRate.toObject({ getters: true }) });
};

// Create a new Rate

const createRate = async (req, res, next) => {
  console.log("EXCEUTEDDDDDD0DDD");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  console.log("param", req.params);

  const {uid: userId, pid: placeId } = req.params;
  const { rateValue } = req.body;
  const rateDate = Date.now();

  let place;
  let user;
  try {
    place = await Place.findById(placeId);
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError(
      'Creating rate failed, please try again.',
      500
    );
    return next(error);
  }

  console.log(user);
  console.log(place);

  if (!user) {
    const error = new HttpError('Could not find user for provided id.', 404);
    return next(error);
  } else if (!place) {
    const error = new HttpError('Could not find place with the provided id.', 404);
    return next(error);
  }

  let createdRate;
  try {
    const rate = await Rates.findOne({ 'userId': userId, "placeId": placeId });
    console.log("ratee", rate);
    if (rate) {
      rate.value = rateValue;
      rate.date = rateDate;
      await rate.save();
    } else {
       createdRate = new Rates({
        userId,
        placeId,
        value: rateValue,
        date: rateDate
      });
      const response = await createdRate.save();
      console.log("save responsee", response);
    }

    let existingRateValue = place.rateValue || 0;
    let existingRateCount = place.rateCount || 0;
    place.rateValue = existingRateValue + rateValue;
    place.rateCount = existingRateCount + 1;
    place.rateAverage = place.rateValue / place.rateCount;
    console.log("place", place);
    const response = await place.save();
    console.log("place res ", response);
  } catch (err) {
    console.log("error: ", err);
    const error = new HttpError(
      'Creating rate failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdRate });
};



// get rate by user id and post id .

const getRateByUserAndPostId = async (req, res, next) => {
  const userId = req.params.uid;
  const placeId = req.params.pid;

  let userRate;
  try {
    userRate = await Rates.findOne({ 'userId': userId, 'placeId' : placeId});
  } catch (err) {
    const error = new HttpError(
      'Fetching rates failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!userRate) {
    const response = new HttpError(
      'There is no rate for this user and post',
      404
    );
    return next(response);
  }

  res.json({ rate: userRate.toObject({ getters: true }) });
};

exports.getRateById = getRateById;
exports.getAllRates = getAllRates;
exports.getRateByUserId = getRateByUserId;
exports.getRateByUserAndPostId = getRateByUserAndPostId
exports.createRate = createRate;
