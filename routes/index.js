var express = require('express');
var indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function(req, res, next) {
  res.render('index', { errorMessage: '' });
});

indexRouter.get('/faq', (req, res, next) => {
  res.render('faq', { errorMessage: '' });
});

indexRouter.get('/activity-calendar', (req, res, next) => {
  res.render('activity-calendar', { errorMessage: '' });
});

indexRouter.get('/activity', (req, res, next) => {
  res.render('forusers/activity-create', { errorMessage: '' });
})

indexRouter.get('/amenities', (req, res, next) => {
  res.render('amenities', { errorMessage: '' });
});


module.exports = indexRouter;
