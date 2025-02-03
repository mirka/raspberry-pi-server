import express from 'express';
import time from './time.js';

const router = express.Router();

router.use("/now/time", time);

export default router;
