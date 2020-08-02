const express = require('express');
const userRouter = express.Router();

const User = require('./../models/User');

/*userRouter.get('/user/:_id', (req, res, next) => {
    
    User
        .findById(req.params.id)
        .then(userData => {
            res.render('forusers/user-profile', {theUser: userData})
        });
});*/


userRouter.get('/user/:id/edit', (req, res, next) => {
    User
        .findById(req.params.id)
        .then(userEdit => {
            res.render('forusers/user-profile-edit', { userEdit })
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

//activities
userRouter.get('/activity', (req, res, next) => {
    // console.log('Entra en signup');
    res.render('forusers/activity-create', { errorMessage: '' });
})


module.exports = userRouter;