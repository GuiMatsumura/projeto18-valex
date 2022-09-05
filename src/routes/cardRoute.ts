import { Router } from 'express';

import {
  createCard,
  activateCard,
  balanceCard,
  blockCard,
  unblockCard,
  recharge,
} from '../controllers/cardController';
import { schemaValidation } from '../middlewares/schemaValidation';
import { createCartSchema } from '../schemas/cardSchema/createCardSchema';
import { ativateCardSchema } from '../schemas/cardSchema/ativateCardSchema';
import { balanceCardSchema } from '../schemas/cardSchema/balanceCardSchema';
import { blockCardSchema } from '../schemas/cardSchema/blockCardSchema';
import { unblockCardSchema } from '../schemas/cardSchema/unblocCardSchema';
import { rechargeSchema } from '../schemas/balanceSchema/rechargeSchema';

const router = Router();

router.post('/cards', schemaValidation(createCartSchema), createCard);
router.put('/cards', schemaValidation(ativateCardSchema), activateCard);
router.get('/cards', schemaValidation(balanceCardSchema), balanceCard);
router.put(
  '/cards/block/:cardId',
  schemaValidation(blockCardSchema),
  blockCard
);
router.put(
  '/cards/unblock/:cardId',
  schemaValidation(unblockCardSchema),
  unblockCard
);
router.post('/recharge/:cardId', schemaValidation(rechargeSchema), recharge);

export default router;
