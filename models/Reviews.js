const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
  comment: {
    type: String,
    maxlength: 200,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
});

module.exports = model('Review', reviewSchema);
