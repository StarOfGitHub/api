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
  const serviceAccount = require('./qbit-prod-firebase-adminsdk-vwacc-fef1c77e50.json')

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })

  const notification = {
    title: 'New Notification',
    body: alt_message || 'Hello, this is a push notification!', // Use the provided message or a default message
  };

  const topic = 'all'; // Send to all devices subscribed to the topic 'all'

  const message = {
    notification,
    topic,
  };

  admin.messaging().send(message)
    .then((response) => {
      console.log('Successfully sent push notification:', response);
    })
    .catch((error) => {
      console.error('Error sending push notification:', error);
    });
}