const express = require('express');
const userRouter = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const parser = require('./../config/cloudinary');

const User = require('./../models/User');
const Activity = require('./../models/Activity');

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
    
    const currUser = req.session.currentUser._id;

    User
        .findById(currUser)
        .populate ('creatAct reservAct')
        .then(user => {
            res.render('forusers/user-profile', {user});
        })
        .catch(error => {
            console.log(error);
        });
});

userRouter.get('/edit-profile', (req, res, next) => {
    
    res.render('forusers/user-profile-edit', { errorMessage: '' });
    
});

userRouter.post('/edit-profile', parser.single('activitypic'), (req, res, next) => {
    
    const { name, email, password, instructor } = req.body;
    let imageAct_url;
    if (req.file){
        imageAct = req.file.secure_url;
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    User
        .findByIdAndUpdate(
            req.session.currentUser._id ,
            { $set: { name, email, password: hashedPassword, instructor, activitypic: imageAct_url} },
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

    User
        .findByIdAndDelete(req.session.currentUser._id)
        .then(() => {
            res.redirect('/logout');
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
    
    const { title, description, amenity, participants, date, time, instructor} = req.body;
    const curUser = req.session.currentUser._id;

    Activity
        .create({ title, description, amenity, participants, date, time, instructor })
        .then(newActivity => {

            const actId = newActivity._id;
            User.findByIdAndUpdate(
                currUser,
                { $push: { creatAct: actId} },
                { new: true }
                )
                .then((user) => {
                    console.log(user);
                    res.redirect(`/user/activity/${newActivity._id}`)
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
        console.log('Error while create the activity: ', error);
        res.render("forusers/activity-create");
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

userRouter.post('/activity/:id/edit', (req, res, next) => {
    
    const { title, description, amenity, participants, date, instructor } = req.body;
console.log(req.body)
    Activity
        .findByIdAndUpdate(

            req.params.id,
            { $set: { title, description, amenity, participants, date, instructor } },
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

userRouter.post('/activity/:id/book-activity', (req, res, next) => {

    const currUser = req.session.currentUser._id;

    Activity
        .findById(req.params.id)
        .then(bookAct => {
            
            const bookId = bookAct._id;

            User.findByIdAndUpdate(
                currUser,
                { $push: { reservAct: bookId} },
                { new: true }
                )
                .then((user) => {
                    console.log(user);
                    res.redirect('/user/profile')
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log('Error while save the activity: ', error);
            res.redirect('/activity-calendar');
        });

});

userRouter.post('/activity/:id/book-activity-delete', (req, res, next) => {

    const currUser = req.session.currentUser._id;

    Activity
        .findById(req.params.id)
        .then(bookAct => {
            
            const bookId = bookAct._id;

            User.findByIdAndUpdate(
                currUser,
                { $pull: { reservAct: bookId} },
                { new: true }
                )
                .then((user) => {
                    console.log(user);
                    res.redirect('/user/profile')
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log('Error while save the activity: ', error);
            res.redirect('/activity-calendar');
        });

});

userRouter.post('/activity/:id/delete-activity', (req, res, next) => {

    Activity
        .findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('/user/profile');
        })
        .catch(error => {
        console.log(error);
        });
});


module.exports = userRouter;