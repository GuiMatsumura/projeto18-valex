import joi from 'joi';

export const ativateCardSchema = joi.object({
  cvc: joi.string().required(),
  password: joi
    .string()
    .length(4)
    .pattern(/^[0-9]+$/)
    .required(),
  cardNumber: joi.string().required(),
  cardHolderName: joi.string().required(),
  expirationDate: joi.string().required(),
});
