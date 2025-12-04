const Joi = require('joi');

// User registration validation schema
const registerValidation = (data) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .min(3)
      .max(50)
      .required()
      .pattern(/^[a-zA-Z\s]+$/)
      .messages({
        'string.pattern.base': 'Full name must contain only letters and spaces',
        'string.min': 'Full name must be at least 3 characters long',
        'string.max': 'Full name cannot exceed 50 characters',
        'any.required': 'Full name is required'
      }),
    
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.min': 'Email must be at least 6 characters long',
        'string.max': 'Email cannot exceed 255 characters',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .min(6)
      .max(1024)
      .required()
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 1024 characters',
        'any.required': 'Password is required'
      })
  });

  return schema.validate(data);
};

// User login validation schema
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .min(6)
      .max(1024)
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation
};