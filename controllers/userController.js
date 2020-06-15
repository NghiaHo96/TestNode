const express = require('express')
const app = express()
const User = require('../models/user.js')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

app.use(bodyParser.urlencoded({ extended: true }))

exports.getRegister = (req, res) => {
	res.send('Register')
}

exports.postRegister = (req, res) => {
	[
		check('name').notEmpty().withMessage('Name field is required'),
		check('email').notEmpty().withMessage('Email field is required').exists().isEmail().withMessage('Email is valid'),
		check('username').notEmpty().withMessage('Username field is required'),
		check('password').notEmpty().withMessage('Password field is required'),
		check('confirm', 'Confirm Password field must have the same value as the password field')
	    .exists()
	    .custom((value, { req }) => value === req.body.password)
	    .exists()
	    .notEmpty().withMessage('Confirm Password do not match')
	], async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json(errors.errors)
		}

		const user = await User.findOne({ where: { username: req.body.username } })

		if (user === null) {
			let new_user = {}

			new_user.name = req.body.name
			new_user.email = req.body.email
			new_user.username = req.body.username
			new_user.password = req.body.password
			new_user.createdAt = new Date()
			new_user.updatedAt = new Date()

			bcrypt.genSalt(10, (err, salt) => {
			    bcrypt.hash(new_user.password, salt, (err, hash) => {
			        if(err){
			        	console.log(err)
			        }
			        new_user.password = hash
			        User.create(new_user)
			        .then(user => {
			        	return res.json(user)
			        	
			        })
			        .catch(err => console.log(err))
			    })
			})
		} else {
		  	return res.send('User da ton tai')
		}			
	}
}

exports.getLogin = (req, res) => {
	res.send('Login')
}

exports.postLogin = (req, res) => {
	passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }           
           const token = jwt.sign(JSON.parse(JSON.stringify(user)), 'your_jwt_secret', { expiresIn: '30m' });
           return res.json({user, token})
        });
    })(req, res)
}

exports.postLoginGoogle = (req, res) => {
	passport.authenticate('google', { scope: ["profile", "email"], prompt: 'consent', accessType: 'offline'})
}

exports.postLoginGooleCallback = (req, res) => {
	passport.authenticate('google', { failureRedirect: '/users/login' }, (err, user, info) => {
		if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            })
        }
		return res.json(user)
	})(req, res)
}

exports.postLogout = (req, res) => {
	req.session = null
	req.logout()
}