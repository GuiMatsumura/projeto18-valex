import joi from 'joi';

export const balanceCardSchema = joi.object({
  cvc: joi.string().required(),
  cardNumber: joi.string().required(),
  cardHolderName: joi.string().required(),
  expirationDate: joi.string().required(),
});
