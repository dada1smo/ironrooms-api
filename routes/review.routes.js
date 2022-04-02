const { Router } = require('express');

const Review = require('../models/Reviews');
const User = require('../models/User');
const Room = require('../models/Room');

const router = Router();

router.post('/', async (req, res) => {
  const { email } = req.user;
  const { room } = req.body;

  try {
    const userId = await User.findOne({ email }).select('_id');
    const { user } = await Room.findOne({ _id: room });

    if (userId._id.valueOf() === user.valueOf()) {
      throw new Error("Can't review own room");
    }

    const newReview = await Review.create({
      ...req.body,
      user: userId._id,
      room: room,
    });
    const { _id } = newReview;
    await User.findOneAndUpdate({ email }, { $push: { reviews: _id } });
    await Room.findOneAndUpdate({ _id: room }, { $push: { reviews: _id } });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.user;

  try {
    const userId = await User.findOne({ email }).select('_id');
    const { user } = await Review.findOne({ id });

    if (userId._id.valueOf() !== user.valueOf()) {
      throw new Error("Can't edit another user's review");
    }

    const { comment, score } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { comment, score },
      {
        new: true,
      }
    );

    res.status(201).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { email } = req.user;

  try {
    const userId = await User.findOne({ email }).select('_id');
    const { user } = await Review.findOne({ id });

    if (userId._id.valueOf() !== user.valueOf()) {
      throw new Error("Can't delete another user's review");
    }

    await Review.findByIdAndDelete(id);

    res.status(201).json('Successfully deleted review');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
