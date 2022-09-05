import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const schemaValidation = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw {
        code: 'BadRequest',
        message: `${error.details[0].message}`,
      };
    }
    next();
  };
};
