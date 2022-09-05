import { Request, Response } from 'express';

import {
  createCardService,
  activateCardService,
  balanceCardService,
} from '../services/cardService';

export async function createCard(req: Request, res: Response) {
  const apiKey = String(req.headers['x-api-key']);
  const { type, employeeId } = req.body;

  const createdCard = await createCardService(employeeId, type, apiKey);

  return res.status(201).send(createdCard);
}

export async function activateCard(req: Request, res: Response) {
  const {
    cvc,
    password,
    cardNumber,
    cardHolderName,
    expirationDate,
  }: {
    cvc: string;
    password: string;
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
  } = req.body;

  await activateCardService(
    cvc,
    password,
    cardNumber,
    cardHolderName,
    expirationDate
  );

  res.sendStatus(200);
}

export async function balanceCard(req: Request, res: Response) {
  const {
    cvc,
    cardNumber,
    cardHolderName,
    expirationDate,
  }: {
    cvc: string;
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
  } = req.body;

  const balance = await balanceCardService(
    cvc,
    cardNumber,
    cardHolderName,
    expirationDate
  );

  res.status(200).send(balance);
}
