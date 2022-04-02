const { Router } = require('express');

const Room = require('../models/Room');
const User = require('../models/User');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allRooms = await Room.find()
      .populate('user', 'name')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name' },
        select: 'comment score user',
      });

    res.status(200).json(allRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { email } = req.user;

  try {
    const userId = await User.findOne({ email }).select('_id');
    const newRoom = await Room.create({ ...req.body, user: userId._id });
    const { _id } = newRoom;
    await User.findOneAndUpdate({ email }, { $push: { rooms: _id } });

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Room.findByIdAndDelete(id);

    res.status(200).json('Successfully deleted room');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
