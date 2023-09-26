import express from 'express';
import gettime from './gettime.js';
import queryindex from './queryindex.js';

const router = express.Router();

router.use(gettime);
router.use(queryindex);

// other routes

export default router;
