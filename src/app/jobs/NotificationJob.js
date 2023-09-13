import { Expo } from 'expo-server-sdk';

import Queue from '../queues/NotificationQueue';
import defs from '../lib/GlobalDefs';
import { updateNotification } from '../services/notification';
import { login } from '../services/auth';

const expo = new Expo({});
// const myExpoPushToken = 'ExponentPushToken[YuxPNALsgQqCyFE9DVfKbR]';

export default {
  queue: Queue.name,
  type: defs.JobType.NotificationJob,
  handle: async ({ data }) => {
    try {
      let messages;
      if (typeof data.expoToken === "string") {
        messages = [{
          to: data.expoToken,
          sound: 'default',
          title: data.title,
          body: data.text,
        }];
      } else if (Array.isArray(data.expoToken)) {
        messages = data.expoToken.map((expoToken) => ({
          to: expoToken,
          sound: 'default',
          title: data.title,
          body: data.text,
        }));
      }

      const token = await login('sistema@eshows.com.br', '140414');

      const response = await expo.sendPushNotificationsAsync(messages);

      // console.log("sendPushNotificationsAsync", response)
      if (data.notificationId) {
        await updateNotification(token, { 'NOTIFICATION_READ': 1 }, data.notificationId);
      }
    } catch (err) {
      console.log('deu erro');
    }
  },
}
