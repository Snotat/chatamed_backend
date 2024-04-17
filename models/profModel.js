const mongoose = require("mongoose");

const profSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 1,
    max: 20,
  },
  name: {
    type: String,
    required: true,
    min: 4,
    max: 50,
  },

  profession: {
    type: String,
    required: true,
    min: 1,
    max: 25,
  },
  specialty: {
    type: String,
    required: true,
    min: 1,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 50,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },
  address: {
    type: String,
    min: 3,
    max: 100,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
});

module.exports = mongoose.model("Profs", profSchema);
