const express = require('express');

const router = express.Router();

const { couner } = require('../middleware/allMiddleware');

router.get('/', couner, (req, res) => {
  res.cookie('test', 'true', { maxAge: 60000, httpOnly: true });
  res.render('index', { title: 'Express' });
});

module.exports = router;
