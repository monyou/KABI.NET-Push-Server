const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser');

const subscriptionsDatabase = [];
const app = express();

app.use(cors());
app.use(bodyParser.json());


app.post('/AddSubscription', (req, res) => {
    const subscription = req.body;
    if (subscriptionsDatabase.findIndex(s => s.endpoint === subscription.endpoint) === -1) {
        subscriptionsDatabase.push(subscription);
    }
});

app.post('/SendPushNotification', (req, res) => {
    const notificationPayload = req.body.pushPayload;

    webpush.setVapidDetails(`mailto:${req.body.webPushConf.email}`, req.body.webPushConf.publicVapidKey, req.body.webPushConf.privateVapidKey);

    const usersToBeSendTo = [];

    subscriptionsDatabase.forEach(subscription => {
        usersToBeSendTo.push(
            webpush.sendNotification(
                subscription,
                JSON.stringify(notificationPayload)
            )
        );
    });

    Promise.all(usersToBeSendTo).then(() => console.log("Subscription Sent!")).catch(err => console.log("Subscription failed!"));
});

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log('Push notifications server started on random port!');
});