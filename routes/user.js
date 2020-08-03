const express = require('express');
const userRouter = express.Router();

const User = require('./../models/User');
const Activity = require('./../models/Activity');

// MIDDLEWARE =>
userRouter.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect('/login');
});
// <= MIDDLEWARE

userRouter.get('/profile', (req, res, next) => {
    res.render('forusers/user-profile');
  });

  /*
userRouter.get('/user/edit', (req, res, next) => {
    req.session.currentUser = user;
    User
        .then(userEdit => {
            res.render('forusers/user-profile-edit', { user: userEdit })
        })
        .catch(error => {
            console.log('Error while retrieving user details: ', error);
        })
});

userRouter.post('/user/:id/edit', (req, res, next) => {
    const { name, age, email, password, imgProfile, instructor } = req.body;
    User
        .update(
            { _id: req.query.user_id },
            { $set: { name, age, email, password, imgProfile, instructor } },
            { new: true }
        )
        .then(() => {
            res.redirect('forusers/user-profile')
        })
        .catch(error => {
            console.log('Error while retrieving user details: ', error);
        })
});
*/
userRouter.get('/new-activity', (req, res, next) => {
    res.render('forusers/activity-create', { errorMessage: '' });
});

userRouter.post('/new-activity', (req, res, next) => {
    
    const { title, description} = req.body;

    Activity
        .create({ title, description })
        .then(newActivity => {
        res.render('activity-detail', {activity: newActivity})
        })
        .catch(error => {
        console.log('Error while create the activity: ', error);
        res.render("forusers/activity-create");
        });
});

userRouter.get('/:_id/activity-edit', (req, res, next) => {
    Activity.findById(req.params.id)
            .then(actEdit => {
                res.render('forusers/activity-edit', { actEdit } )
            })
});

module.exports = userRouter;