const { Sequelize, DataTypes } = require('sequelize')
const db = require('../config/database.js')

const articlesSchema = db.define('articles', {
	title: {
		type: DataTypes.STRING,
	},
	id_user: {
		type: DataTypes.INTEGER,
	},
	body: {
		type: DataTypes.STRING,
	},
	createdAt: {
		type: DataTypes.DATE,
	},
	updatedAt: {
		type: DataTypes.DATE,
	},
})

module.exports = articlesSchema