var express = require('express');
var router = express.Router();

router.get('/profile', async (req, res, next) => {
  try {
    var user = req.user;
    res.render('user/profile', { user : user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
