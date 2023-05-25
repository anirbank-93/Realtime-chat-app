const mongoose = require('mongoose');

const Messages = require('../models/messageModel');

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [mongoose.Types.ObjectId(from), mongoose.Types.ObjectId(to)],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message,
      };
    });
    res.status(200).json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: message,
      users: [mongoose.Types.ObjectId(from), mongoose.Types.ObjectId(to)],
      sender: from,
    });

    if (data)
      return res
        .status(201)
        .json({ status: true, msg: 'Message added successfully.', data: data });
    else
      return res
        .status(500)
        .json({ status: false, msg: 'Failed to add message to the database' });
  } catch (ex) {
    next(ex);
  }
};
