import { Router } from 'express';

import {
  createCard,
  activateCard,
  balanceCard,
} from '../controllers/cardController';
import { schemaValidation } from '../middlewares/schemaValidation';
import { createCartSchema } from '../schemas/cardSchema/createCardSchema';
import { ativateCardSchema } from '../schemas/cardSchema/ativateCardSchema';
import { balanceCardSchema } from '../schemas/cardSchema/balanceCardSchema';

const router = Router();

router.post('/cards', schemaValidation(createCartSchema), createCard);
router.put('/cards', schemaValidation(ativateCardSchema), activateCard);
router.get('/cards', schemaValidation(balanceCardSchema), balanceCard);

export default router;
