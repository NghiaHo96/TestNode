const { Sequelize, DataTypes } = require('sequelize')
const db = require('../config/database.js')

const usersSchema = db.define('users', {
	name: {
		type: DataTypes.STRING,
	},
	email: {
		type: DataTypes.STRING,
	},
	username: {
		type: DataTypes.STRING,
	},
	password: {
		type: DataTypes.STRING,
	},
	googleId: {
		type: DataTypes.STRING,
	},
	accessToken: {
		type: DataTypes.STRING,
	},
	refreshToken: {
		type: DataTypes.STRING,
	},
	createdAt: {
		type: DataTypes.DATE,
	},
	updatedAt: {
		type: DataTypes.DATE,
	},
})

module.exports = usersSchema