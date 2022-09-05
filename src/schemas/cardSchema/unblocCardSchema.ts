import joi from 'joi';

export const unblockCardSchema = joi.object({
  password: joi.string().required(),
});
