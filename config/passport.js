const LocalStrategy = require('passport-local').Strategy
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const BearerStrategy = require("passport-http-bearer").Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const key = require('../key.json')

module.exports = passport => {
	passport.use(new LocalStrategy({
		    usernameField: 'username',
		    passwordField: 'password'
		}, async (username, password, done) => {

			const user = await User.findOne({ where: { username: username } })

			if (!user) { return done(null, false, { message: 'Incorrect username.' }) }

			let user_password = user.password
			
	      	bcrypt.compare(password, user_password, (err, isMatch) => {
	      		if (err) throw err
				if(isMatch){
					return done(null, user)
				}
				else return done(null, false, { message: 'Wrong password.' })
			})
		}
	))

	passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret'
    },(jwtPayload, cb) => {
        return User.findOne({
        		where: {
        			id: jwtPayload.id
        		}
        	})
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    	}
	))

	passport.use(new GoogleStrategy({
	    clientID: key.client_id,
	    clientSecret: key.client_secret,
	    callbackURL: key.redirect_uris,
	  	}, async (accessToken, refreshToken, params, profile, done) => {
			const user = await User.findOne({ where: { googleId: profile.id } })

	    	if(user === null){
				let userGoogle = {}

				userGoogle.googleId = profile.id
				userGoogle.name = profile.displayName
				userGoogle.accessToken = accessToken
				userGoogle.refreshToken = refreshToken
				userGoogle.createdAt = new Date()
				userGoogle.updatedAt = new Date()

				const user = User.create(userGoogle)
				return done(null, user)
							
			} else if(user.accessToken != accessToken){
				let newAccessToken = accessToken

				await User.update({ 
					accessToken: newAccessToken, 
					updatedAt: new Date()
				}, {
					where: {
					    googleId: profile.id 
					}
				})

				const user = await User.findOne({
					where: {
						googleId: profile.id 
					}
				})

				return done(null, user)
			} else {
				return done(null, user)
			}
	  	}
	))

	passport.use(new BearerStrategy(
	  	async (token, done) => {
	    	const user = await User.findOne({ where: { accessToken: token } })

			if (!user) { return done(null, false) }

	    	return done(null, user, { scope: 'all' })
	  	}
	))

	passport.serializeUser((user, done) => {
	  	done(null, user.id)
	})

	passport.deserializeUser((id, done) => {
		User.findOne({
			where: {
				id: id
			}
		}).then((user) => {
			done(null, user)
		})
	})
}