const Joi = require("joi");

let user = {
  register: Joi.object().keys({
    // name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
  login: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = user;
