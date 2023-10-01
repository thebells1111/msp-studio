import express from 'express';
import queryIndex from './queryIndex.js';
import getTime from './getTime.js';
import proxy from './proxy.js';
import podping from './podping.js';
import downloadFeed from './downloadFeed.js';
import download from './download.js';
import database from './database.js';
import upload from './upload.js';
import updatePassword from './updatePassword.js';

const router = express.Router();

router.use('/queryindex', queryIndex);
router.use('/gettime', getTime);
router.use('/proxy', proxy);
router.use('/podping', podping);
router.use('/downloadfeed', downloadFeed);
router.use('/download', download);
router.use('/database', database);
router.use('/upload', upload);
router.use('/update-password', updatePassword);

export default router;
