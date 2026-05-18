const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  performanceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // Assuming a score out of 100
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
