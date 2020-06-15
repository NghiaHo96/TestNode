const express = require('express')
const router = express.Router()
const passport = require('passport')
const articleController = require('../controllers/articleController.js')
const userController = require('../controllers/userController.js')

router.get('/articles', passport.authenticate(['jwt','bearer'], { session: false }), articleController.getArticle)

router.get('/articles/add', passport.authenticate(['jwt','bearer'], { session: false }), articleController.getAddArticle)

router.post('/articles/add', passport.authenticate(['jwt','bearer'], { session: false }), articleController.postAddArticle)

router.get('/articles/:id', passport.authenticate(['jwt','bearer'], { session: false }), articleController.getIdArticle)

router.put('/articles/edit/:id', passport.authenticate(['jwt','bearer'], { session: false }), articleController.putIdArticle)
	
router.delete('/articles/:id', passport.authenticate(['jwt','bearer'], { session: false }), articleController.deleteArticle)

router.get('/users/register', userController.getRegister)

router.post('/users/register', userController.postRegister)

router.get('/users/login', userController.getLogin)

router.post('/users/login', userController.postLogin)

router.get('/users/auth/google', passport.authenticate('google', { scope: ["profile", "email"], prompt: 'consent', accessType: 'offline'}))
router.get('/users/auth/google/callback', userController.postLoginGooleCallback)

router.post('/users/logout', userController.postLogout)

module.exports = router