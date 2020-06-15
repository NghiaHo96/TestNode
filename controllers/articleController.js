const express = require('express')
const app = express()
const Article = require('../models/article.js')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')

app.use(bodyParser.urlencoded({ extended: true }))

exports.getArticle = (req, res) => {
	Article.findAll()
		.then(articles => {
			res.json(articles)
		})
		.catch(err => console.log('Database not connected: ' + err))
}

exports.getAddArticle = (req, res) => {
	return res.json("Add Article")
}

exports.postAddArticle = (req, res) => {
	[
	  	check('title').not().isEmpty().withMessage('Title is required'),
	  	check('body').not().isEmpty().withMessage('Body is required')
	],(req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.json(errors.errors)
		}

    	let article = {}

		article.title = req.body.title
		article.id_user = req.user.id
		article.body = req.body.body
		article.createdAt = new Date()
		article.updatedAt = new Date()

		Article.create(article)
				.then(article => {
					res.json(article)
				})
				.catch(err => console.log(err))
		
  	}
}

exports.getIdArticle = (req, res) => {
	Article.findOne({
		where: {
			id: req.params.id
		}
	}).then(article =>  {
		res.json(article)
	}).catch(err => console.log(err))
}

exports.putIdArticle = (req, res) => {
	[
	  check('title').not().isEmpty().withMessage('Title field is required'),
	  check('body').not().isEmpty().withMessage('Body field is required')
	], async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.json(errors.errors)
		}
		
		let new_article = {}

		new_article.title = req.body.title
		new_article.id_user = req.user.id
		new_article.body = req.body.body
		new_article.updatedAt = new Date()

		let id = req.params.id

		await Article.update(new_article, {
		  	where: {
		    	id: id
		  	}
		})

		const article = await Article.findOne({
			where: {
		    	id: id
		  	}
		})

		res.json(article)
	}
}

exports.deleteArticle = (req, res) => {
	async (req, res) => {
		let id = req.params.id

		await Article.destroy({
		  	where: {
		    	id: id
		  	}
		})
			
		res.send('Delete Success')
	}
}