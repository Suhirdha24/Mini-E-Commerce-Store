import { Router } from 'express';
import { create, myOrders, getOne, all, updateStatus, cancelMyOrder } from '../controllers/orders.js';
import { protect, adminOnly } from '../middleware/auth.js';

const r = Router();

r.post('/', protect, create);
r.get('/mine', protect, myOrders);
r.get('/admin/all', protect, adminOnly, all);
r.get('/:id', protect, getOne);
r.post('/:id/cancel', protect, cancelMyOrder);
r.patch('/:id/status', protect, adminOnly, updateStatus);

export default r;
