import {
  findByCardDetails,
  findByTypeAndEmployeeId,
  insert,
  TransactionTypes,
  update,
  findById as findCardById,
} from '../repositories/cardRepository';
import { findByApiKey } from '../repositories/companyRepository';
import { findById } from '../repositories/employeeRepository';
import { findByCardId as findRecharges } from '../repositories/rechargeRepository';
import { findByCardId as findPayments } from '../repositories/paymentRepository';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import dotenv from 'dotenv';
import cryptr from 'cryptr';
import bcrypt from 'bcrypt';

dotenv.config();
const cryptography = new cryptr(process.env.CRYPTR_CVC);

async function verifyKey(apiKey: string) {
  const Company = await findByApiKey(apiKey);

  if (!Company) throw { code: 'Unauthorized', message: 'Unauthorized' };

  return Company;
}

async function verifyCard(employeeId: number, type: TransactionTypes) {
  const Card = await findByTypeAndEmployeeId(type, employeeId);

  if (Card)
    throw {
      code: 'Conflict',
      message: 'O empregado já tem um Cartão do mesmo tipo',
    };

  return Card;
}

async function verifyEmployee(employeeId: number) {
  const user = await findById(employeeId);

  if (!user) {
    throw { code: 'NotFound', message: 'Empregado não encontrado!' };
  }

  return user.fullName;
}

export function formatCardName(userName: string) {
  let nameArray = userName.toUpperCase().split(' ');
  const firstName = nameArray.shift();
  const lastName = nameArray.pop();
  let namesMiddle = [];
  nameArray.forEach((userName) => {
    if (userName.length >= 3) {
      namesMiddle.push(userName[0]);
    }
  });

  const nameFormat = `${firstName} ${namesMiddle.join(' ')} ${lastName}`;

  return nameFormat;
}

function encryptCVC(cvc: string) {
  return cryptography.encrypt(cvc);
}

export async function createCardService(
  employeeId: number,
  type: TransactionTypes,
  apiKey: string
) {
  await verifyKey(apiKey);
  await verifyCard(employeeId, type);
  const userName = await verifyEmployee(employeeId);

  const cardNumber: string = faker.finance.creditCardNumber();
  const cardHolderName: string = formatCardName(userName);
  const expirationCardDate = dayjs().add(5, 'year').format('MM/YY');
  const cvc: string = faker.finance.creditCardCVV();
  const encryptedCVC: string = encryptCVC(cvc);

  const CardFormater = {
    employeeId: employeeId,
    number: cardNumber,
    cardholderName: cardHolderName,
    securityCode: encryptedCVC,
    expirationDate: expirationCardDate,
    isVirtual: true,
    isBlocked: true,
    type: type,
  };

  await insert(CardFormater);

  const dataCard = {
    cardHolderName,
    encryptedCVC,
    cardNumber,
    expirationCardDate,
  };

  return dataCard;
}

async function cardExist(cardDetails: object) {
  if (!cardDetails) {
    throw {
      code: 'NotFound',
      message: 'O cartão informado não foi encontrado.',
    };
  }
}

async function cardActive(password: string) {
  if (password !== null) {
    throw { code: 'Conflict', message: 'O cartão informado já está ativado.' };
  }
}

async function cardValidationDate(expirationDate: string) {
  const today = dayjs().format('MM/YY');
  if (today > dayjs().format(expirationDate)) {
    throw { code: 'Unauthorized', message: 'Validade do cartão expirou!' };
  }
}

async function checkCvc(cvc: string, securityCode: string) {
  const decryptedCvC = cryptography.decrypt(securityCode);
  if (decryptedCvC !== cvc) {
    throw {
      code: 'NotFound',
      message: 'Ensira corretamente os dados do cartão!',
    };
  }
}

export async function activateCardService(
  cvc: string,
  password: string,
  cardNumber: string,
  cardHolderName: string,
  expirationDate: string
) {
  const cardDetails = await findByCardDetails(
    cardNumber,
    cardHolderName,
    expirationDate
  );

  cardExist(cardDetails);
  cardActive(cardDetails.password);
  cardValidationDate(expirationDate);
  checkCvc(cvc, cardDetails.securityCode);

  const passwordHash = bcrypt.hashSync(password, 10);

  const cardUpdate = { isBlocked: false, password: passwordHash };

  return await update(cardDetails.id, cardUpdate);
}

export async function balanceCardService(
  cvc: string,
  cardNumber: string,
  cardHolderName: string,
  expirationDate: string
) {
  const cardDetails = await findByCardDetails(
    cardNumber,
    cardHolderName,
    expirationDate
  );

  cardExist(cardDetails);
  checkCvc(cvc, cardDetails.securityCode);

  const payments = await findPayments(cardDetails.id);
  const recharges = await findRecharges(cardDetails.id);
  let totalPayment = 0;
  let totalRecharge = 0;

  for (let i: number = 0; i < payments.length; i++) {
    totalPayment += payments[i].amount;
  }
  for (let i: number = 0; i < recharges.length; i++) {
    totalRecharge += recharges[i].amount;
  }

  const balance = {
    balance: totalRecharge - totalPayment,
    transactions: payments,
    recharges: recharges,
  };

  return balance;
}

function cardExistId(card: object) {
  if (!card) {
    throw {
      code: 'NotFound',
      message: 'O cartão informado não foi encontrado.',
    };
  }
}

function validatePassword(password: string, validPassword: string) {
  const validatePassword = bcrypt.compareSync(password, validPassword);
  if (!validatePassword) {
    throw {
      code: 'Unauthorized',
      message: 'O cartão informado não foi encontrado.',
    };
  }
}

function cardIsBlocked(blocked: boolean) {
  if (blocked) {
    throw {
      code: 'BadRequest',
      message: 'O cartão informado ja esta bloqueado.',
    };
  }
}

function cardIsActive(password: string) {
  if (password === null) {
    throw { code: 'Conflict', message: 'O cartão informado não está ativado.' };
  }
}

export async function blockCardService(cardId: number, password: string) {
  const card = await findCardById(cardId);

  cardExistId(card);
  cardIsActive(card.password);
  validatePassword(password, card.password);
  cardIsBlocked(card.isBlocked);
  cardValidationDate(card.expirationDate);

  const cardUpdate = { isBlocked: true };

  return await update(cardId, cardUpdate);
}

function cardIsUnblocked(blocked: boolean) {
  if (!blocked) {
    throw {
      code: 'BadRequest',
      message: 'O cartão informado ja esta desbloqueado.',
    };
  }
}

export async function unblockCardService(cardId: number, password: string) {
  const card = await findCardById(cardId);

  cardExistId(card);
  cardIsActive(card.password);
  validatePassword(password, card.password);
  cardIsUnblocked(card.isBlocked);
  cardValidationDate(card.expirationDate);

  const cardUpdate = { isBlocked: false };

  return await update(cardId, cardUpdate);
}
