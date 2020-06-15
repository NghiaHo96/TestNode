const {check} = require('express-validator');

let validateRegisterUser = () => {
  return [
    check('name').notEmpty().withMessage('Name field is required'),
    check('email').notEmpty().withMessage('Email field is required').exists().isEmail().withMessage('Email is valid'),
    check('username').notEmpty().withMessage('Username field is required'),
    check('password').notEmpty().withMessage('Password field is required'),
    check('confirm', 'Confirm Password field must have the same value as the password field')
      .exists()
      .custom((value, { req }) => value === req.body.password)
      .exists()
      .notEmpty().withMessage('Confirm Password do not match')
  ];
}

let validate = {
  validateRegisterUser: validateRegisterUser
};

module.exports = {validate};