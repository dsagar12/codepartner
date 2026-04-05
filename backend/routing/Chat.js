const express = require('express');
const router = express.Router();
const Message = require('../model/Message');
const authMiddleware = require('../middleware/auth.middleware');
// Get chat history between two users
router.get('/messages/:userId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(100);

    const formattedMessages = messages.map((msg) => ({
      text: msg.text,
      sender: msg.sender.toString() === currentUserId.toString() ? 'me' : 'other',
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      _id: msg._id,
    }));

    res.json(formattedMessages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark messages as read
router.post('/messages/read/:userId', authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const otherUserId = req.params.userId;

    await Message.updateMany(
      { sender: otherUserId, receiver: currentUserId, read: false },
      { read: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

module.exports = router;