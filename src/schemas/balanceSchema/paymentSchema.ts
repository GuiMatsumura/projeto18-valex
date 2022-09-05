import joi from 'joi';

export const paymentSchema = joi.object({
  password: joi.string().required(),
  cardId: joi.number().required(),
  businessId: joi.number().required(),
  amount: joi.number().min(1).required(),
});
