const express = require('express');
const router = express.Router();
const debug = require('debug')('erc20-metamask-samples:index');

router.get('/', function(req, res, next) {
  res.render('index', { desc: true });
});

router.get('/login', function(req, res, next) {
  res.render('login', { desc: true });
});

module.exports = router;

