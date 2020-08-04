const express = require('express');
const userRouter = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = 10;

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

//USER
userRouter.get('/profile', (req, res, next) => {
    res.render('forusers/user-profile');
  });


userRouter.get('/edit-profile', (req, res, next) => {
    res.render('forusers/user-profile-edit', { errorMessage: '' });
    
});

userRouter.post('/edit-profile', (req, res, next) => {
    
    const { name, email, password } = req.body;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    User
        .findByIdAndUpdate(
            req.session.currentUser._id ,
            { $set: { name, email, password: hashedPassword } },
            { new: true }
        )
        .then((userEDit) => {
            console.log(userEDit)
            req.session.currentUser = userEDit;
            res.redirect('/user/profile')
        })
        .catch(error => {
            console.log('Error while retrieving user details: ', error);
        })
});

userRouter.post('/delete', (req, res, next) => {
    const userId = req.session.currentUser._id;

    User
        .findByIdAndDelete(userId)
        .then(() => {
            res.redirect('/');
        })
        .catch(error => {
        console.log(error);
        });
});

//ACTIVITY
userRouter.get('/new-activity', (req, res, next) => {
    res.render('forusers/activity-create', { errorMessage: '' });
});

userRouter.post('/new-activity', (req, res, next) => {
    
    const { title, description} = req.body;
    const curUser = req.session.currentUser._id;

    Activity
        .create({ title, description })
        .then(newActivity => {

            const actId = newActivity._id;
            User.findByIdAndUpdate(
                curUser,
                { $push: { creatAct: actId} },
                { new: true }
                )
                .then((user) => {
                    console.log(user);
                    res.redirect(`/user/activity/${newActivity._id}`)
                })
        })
        .catch(error => {
        console.log('Error while create the activity: ', error);
        res.render("forusers/activity-create");
        });

});

userRouter.get('/activity/:id', (req, res, next) => {
    
    Activity
        .findById(req.params.id)
        .then(actDetail => {
            //console.log(actDetail)
        res.render('activity-detail', {activity: actDetail})
        })
        .catch(error => {
        console.log(error);
        });
});

userRouter.get('/activity/:id/edit', async(req, res, next) => {
    
    Activity
        .findById(req.params.id)
        .then((activity) => {
            console.log(activity)
            res.render('forusers/activity-edit', {activity});
        })
        .catch((error) => {
            console.log(error);
        });
});

userRouter.post('/activity/:id/edit', async(req, res, next) => {
    
    const { title, description } = req.body;

    Activity
        .findByIdAndUpdate(
            req.params.id,
            { $set: { title, description } },
            { new: true }
        )
        .then( (actUpdate) => {
            console.log(actUpdate);
        res.redirect(`/user/activity/${actUpdate._id}`)
        })
        .catch(error => {
            console.log('Error while retrieving activity details: ', error);
        })
});


module.exports = userRouter;