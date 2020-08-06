const express = require('express');
const authRouter = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require('./../models/User');

const parser = require('./../config/cloudinary')

//SIGNUP
authRouter.get('/signup', (req, res, next) => {
  res.render('auth/signup', { errorMessage: '' });
});

authRouter.post('/signup', parser.single('profilepic'), async (req, res, next) => {

  const { name, email, password } = req.body;
  let image_url;
  if (req.file){
    image_url = req.file.secure_url;
  }

  if(email === "" || password === "") {
    res.render('auth/signup', { errorMessage: "Enter both email and password "});
    return;
  }
  try {
      
    const foundUser = await User.findOne({ email })
    if(foundUser) {
      res.render('auth/signup', { errorMessage: `There's already an account with the email ${email}`});
      return;
    }
    
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    // esto "profilepic: image_url " es para pasar el profilepic
    const newUser = await User.create({ name, email, password: hashedPassword, profilepic: image_url })
    //console.log(newUser)
    req.session.currentUser = newUser;
    res.redirect('/user/profile'); 
  } 
  catch (error) {
    res.render('auth/signup', { errorMessage: "Error while creating account. Please try again."})
  }
})

//LOGIN
authRouter.get('/login', (req, res, next) => {
 
    res.render('auth/login', { errorMessage: '' })
});

authRouter.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    
    if(email === "" || password === "") {
        res.render('auth/login', { errorMessage: 'Please, enter username and password to login.'});
        return;
    }
    
    User.findOne({ email }) 
        .then((user) => { 
            if(!user) {
                res.render('auth/login', { errorMessage: "The user doesn't exist"});
                return;
            }
            const correctePass = (bcrypt.compareSync(password, user.password))
            if(!correctePass) { 
              res.render('auth/login', { errorMessage: 'Incorrect password.' })
            } else {
              req.session.currentUser = user;  
              res.redirect('/user/profile'); 
            }
        })
        .catch((error) => {
            console.log(error);
        })  
});

//LOGOUT
authRouter.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
      res.redirect("/");
    });
});

module.exports = authRouter;
