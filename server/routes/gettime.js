import express from 'express';
const router = express.Router();

router.get('/gettime', (req, res) => {
	res.json({ time: Date.now() });
});

export default router;
