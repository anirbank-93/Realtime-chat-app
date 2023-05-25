const { addMessage, getMessages } = require('../controllers/messageController');
const router = require('express').Router();

router.post('/', addMessage);
router.post('/exchanged-messages', getMessages);

module.exports = router;
