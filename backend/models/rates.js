const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const ratesSchema = new Schema({
    userId: { type: String, required: true },
    placeId: { type: String, required: true },
    value: { type: Number, required: true },
    date: { type: Date, required: true },
  });
  
  ratesSchema.plugin(uniqueValidator);
  
  module.exports = mongoose.model('Rates', ratesSchema);

