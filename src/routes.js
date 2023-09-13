import { Router } from 'express';
import { sendNotificationsByUserId } from './app/controllers/NotificationController';

const router = new Router()

router.post('/notification/:id', sendNotificationsByUserId);

export default router;
