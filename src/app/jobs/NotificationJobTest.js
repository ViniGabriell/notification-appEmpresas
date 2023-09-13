import { Expo } from 'expo-server-sdk';

const expo = new Expo({});


const sendNotification = async () => {
  const response = await expo.sendPushNotificationsAsync([
    {
      to: 'ExponentPushToken[lFIMa1JM34ky4Urpcfbxvi]',
      sound: "default",
      title: 'Teste ignorar',
      body: 'teste zina app empresas',
    }
  ]);

  console.log(response)
}
sendNotification()