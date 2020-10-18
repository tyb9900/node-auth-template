const Joi = require("joi");

const ValidateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(user);
};

module.exports = ValidateUser;
