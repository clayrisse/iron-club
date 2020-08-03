const express = require('express');
const authRouter = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require('./../models/User');

const parser = require('./../config/cloudinary');

//SIGNUP
authRouter.get('/signup', (req, res, next) => {
  res.render('auth/signup', { errorMessage: '' });
});
// esto "parser.single('profilepic')" es para la foto en el sign up
authRouter.post('/signup', parser.single('profilepic'), async (req, res, next) => {
  console.log('req.body', req.body);
  const { name, email, password } = req.body;
  const image_url = req.file.secure_url;

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
    await User.create({ name, email, password: hashedPassword, profilepic: image_url  })
    
    res.redirect('/login'); //levantar sesion al hacer signup
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
        .then((user) => { //este user
            if(!user) {
                res.render('auth/login', { errorMessage: "The user doesn't exist"});
                return;
            }
            const correctePass = (bcrypt.compareSync(password, user.password))//es este user
            if(!correctePass) { 
              res.render('auth/login', { errorMessage: 'Incorrect password.' })
            } else {
              req.session.currentUser = user;
              //res.render('forusers/user-profile', {user})  
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
