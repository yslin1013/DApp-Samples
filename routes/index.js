const express = require('express');
const router = express.Router();
const debug = require('debug')('erc20-metamask-example:index');

router.get('/', function(req, res, next) {
  res.render('index', { desc: true });
});

module.exports = router;

