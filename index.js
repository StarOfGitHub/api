const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  console.log(req.query)

  sendPushNotification(req.query.message)

  res.send('Push notification received!')
})

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`)
})

function sendPushNotification(alt_message) {
  const admin = require('firebase-admin')
  const apn = require('apn');

  const serviceAccount = require('./qbit-prod-firebase-adminsdk-vwacc-fef1c77e50.json')

  const apnProvider = new apn.Provider({
    token: {
      key: 'SubscriptionKey_6T5S995V2J.p8', // Path to your APNs Auth Key
      keyId: 'push_notification', // Your APNs Auth Key ID
      teamId: 'X9NH7R32V4', // Your Team ID
    },
    production: false, // Set to true for production environment
  });

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })

  const notification = new apn.Notification();

  
  notification.title = 'New Notification';
  notification.body = alt_message || 'Hello, this is a push notification!'; // Use the provided message or a default message

  const topic = 'all'; // Send to all devices subscribed to the topic 'all'

  const message = {
    notification,
    topic,
  };

  apnProvider.send(notification, deviceToken).then((result) => {
    console.log('Push notification sent:', result.sent);
    console.log('Failed tokens:', result.failed);
  });

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent push notification:', response);
    })
    .catch((error) => {
      console.error('Error sending push notification:', error);
    });

  sendPushNotification(deviceToken, title, body);
}