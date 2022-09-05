import { Request, Response, NextFunction } from 'express';

export default async function errorHandler(
  error: { code: string; message: string },
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.code === 'Conflict') {
    return res.status(409).send(error.message);
  }
  if (error.code === 'Unauthorized') {
    return res.status(401).send(error.message);
  }
  if (error.code === 'NotFound') {
    return res.status(404).send(error.message);
  }
  if (error.code === 'BadRequest') {
    return res.status(400).send(error.message);
  }

  res.sendStatus(500);
}
