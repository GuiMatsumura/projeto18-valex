import joi from 'joi';

export const createCartSchema = joi.object({
  type: joi
    .string()
    .valid('groceries', 'restaurant', 'transport', 'education', 'health')
    .required(),
  employeeId: joi.number().required(),
});
