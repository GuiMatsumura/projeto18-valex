import { Router } from 'express';

import cardRoute from './cardRoute';

const router = Router();

router.use(cardRoute);

export default router;
