import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // EMAIL
  EMAIL_SERVICE: Joi.string().required(),
  EMAIL_AUTH_USER: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  EMAIL_BASE_URL: Joi.string().required().uri(),
  // DB
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  DB_ROOT_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SYNC: Joi.string().required(),
  // JWT
  JWT_SECRET: Joi.string().required(),
});
