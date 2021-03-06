var express = require('express');
var indexRouter = express.Router();

const Activity = require('./../models/Activity');

/* GET home page. */
indexRouter.get('/', function(req, res, next) {
  res.render('index',{ errorMessage: '' });
  // res.render('index',{layout: 'layoutbootstrap.hbs', errorMessage: '' });
});

indexRouter.get('/faq', (req, res, next) => {
  res.render('faq', { errorMessage: '' });
});

indexRouter.get('/activity-calendar', (req, res, next) => {
  Activity.find()
          .then(activitiesFromDB => {
            //console.log(activitiesFromDB)
            res.render('activity-calendar', { layout: 'layoutbootstrap.hbs', activities: activitiesFromDB  });
          })
          .catch(error => {
            console.log(error);
          })
});

indexRouter.get('/amenities', (req, res, next) => {
  res.render('amenities', { errorMessage: '' });
});

module.exports = indexRouter;
