const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

router.use(bodyParser.urlencoded({ extended: true }))

router.route('/register')
	.get((req, res) => {
		res.send('Register')
	})
	.post([
			check('name').notEmpty().withMessage('Name field is required'),
			check('email').notEmpty().withMessage('Email field is required').exists().isEmail().withMessage('Email is valid'),
			check('username').notEmpty().withMessage('Username field is required'),
			check('password').notEmpty().withMessage('Password field is required'),
			check('confirm', 'Confirm Password field must have the same value as the password field')
		    .exists()
		    .custom((value, { req }) => value === req.body.password)
		    .exists()
		    .notEmpty().withMessage('Confirm Password do not match')
		],async (req, res) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				res.json(errors.errors)
				return
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
				        	res.json(user)
				        	return
				        })
				        .catch(err => console.log(err))
				    })
				})
				return
			} else {
			  	res.send('User da ton tai')
				return
			}			
		}
	)

router.route('/login')
	.get((req, res) => {
		res.send('login')
	})
	.post((req, res) => {
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
	})

router.get('/auth/google',
  	passport.authenticate('google', { scope: ["profile", "email"], prompt: 'consent', accessType: 'offline'})
)

router.get('/auth/google/callback', (req, res) => {
	passport.authenticate('google', { failureRedirect: '/users/login' }, (err, user, info) => {
		if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user   : user
            })
        }
		return res.json(user)
	})(req, res)
})

router.get('/logout', (req, res) => {
	req.session = null
	req.logout()
})

module.exports = router 