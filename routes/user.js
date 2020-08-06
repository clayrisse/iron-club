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
        .populate('comments.creator participants')
        .then(actDetail => {
            //console.log(actDetail.comments);
            res.render('activity-detail', { activity: actDetail})
                
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

userRouter.post('/edit-profile',  (req, res, next) => {
    
    const { name, email, password, instructor, age } = req.body;
   

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    User
        .findByIdAndUpdate(
            req.session.currentUser._id ,
            { $set: { name, email, password: hashedPassword, instructor, age } },
            { new: true }
        )
        .then((userEDit) => {
            //console.log(userEDit)
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

userRouter.post('/new-activity', parser.single('activitypic'),(req, res, next) => {
    
    const { title, description, amenity, participants, date, time, instructor, maxparticipants} = req.body;
    const currUser = req.session.currentUser._id;
    let imageAct_url;
    if (req.file){
        imageAct_url = req.file.secure_url;
    }

    Activity
        .create({ title, description, amenity, participants, date, time, instructor, activitypic: imageAct_url, maxparticipants })
        .then(newActivity => {

            const actId = newActivity._id;
            User.findByIdAndUpdate(
                currUser,
                { $push: { creatAct: actId} },
                { new: true }
                )
                .then((user) => {
                    //console.log(user);
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
            //console.log(activity)
            res.render('forusers/activity-edit', {activity});
        })
        .catch((error) => {
            console.log(error);
        });

});

userRouter.post('/activity/:id/edit', (req, res, next) => {
    
    const { title, description, amenity, participants, date, instructor } = req.body;
    //console.log(req.body)
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
        .findByIdAndUpdate(
            req.params.id, 
            { $push: {participants: currUser} },
            { new: true })
        .then(bookAct => {
            
            const bookId = bookAct._id;

            User.findByIdAndUpdate(
                currUser,
                { $push: { reservAct: bookId} },
                { new: true }
                )
                .then((user) => {
                    //console.log(user);
                    res.redirect('/user/profile');
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
        .findByIdAndUpdate(
            req.params.id, 
            { $pull: {participants: currUser} },
            { new: true })
        .then(bookAct => {
            
            const bookId = bookAct._id;

            User.findByIdAndUpdate(
                currUser,
                { $pull: { reservAct: bookId} },
                { new: true }
                )
                .then((user) => {
                    //console.log(user);
                    res.redirect('/user/profile')
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log('Error delete the activity: ', error);
            res.redirect('/activity-calendar');
        });

});

userRouter.post('/activity/:id/delete-activity', (req, res, next) => {

    const currUser = req.session.currentUser._id;

    Activity
        .findByIdAndDelete(req.params.id)
        .then(delAct => {
            
            const bookId = delAct._id;

            User.findByIdAndUpdate(
                currUser,
                { $pull: { creatAct: bookId} },
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
        console.log(error);
        });

});

userRouter.post('/activity/:id/review', (req, res, next) => {

    const currUser = req.session.currentUser._id;
    const { review, rating } = req.body;
    const comment = { review : review,
                      creator: currUser,
                      rating: rating };

    const actId = req.params.id;
        //console.log(comment);
    Activity
        .findByIdAndUpdate(
        actId,
        { $push: { comments: comment} },
        { new: true }
        )
        .then((act) => {
            //console.log('comentario crado',act);
            res.redirect(`/user/activity/${actId}`)
        })
        .catch(error => {
            console.log(error);
        });

});


module.exports = userRouter;