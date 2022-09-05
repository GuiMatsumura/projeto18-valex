import joi from 'joi';

export const blockCardSchema = joi.object({
  password: joi.string().required(),
});
