import { Request, Response } from 'express';

import {
  createCardService,
  activateCardService,
  balanceCardService,
  blockCardService,
  unblockCardService,
  rechargeService,
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

export async function blockCard(req: Request, res: Response) {
  const { password }: { password: string } = req.body;
  const cardId: number = Number(req.params.cardId);
  await blockCardService(cardId, password);
  res.sendStatus(200);
}

export async function unblockCard(req: Request, res: Response) {
  const { password }: { password: string } = req.body;
  const cardId: number = Number(req.params.cardId);
  await unblockCardService(cardId, password);
  console.log('aqui8');
  res.sendStatus(200);
}

export async function recharge(req: Request, res: Response) {
  const cardId: number = Number(req.params.cardId);
  const { amount }: { amount: number } = req.body;

  await rechargeService(cardId, amount);

  res.sendStatus(200);
}
