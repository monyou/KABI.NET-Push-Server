const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser');

const PUBLIC_VAPID = 'BClP3jkMffUZv11IBPTzZGWqbgmTbjRO7LauIBh66vdb-zJjY5vvedETpWZ9wmynSUzObo2rrQQZdFBS6qhe-68';
const PRIVATE_VAPID = 'hE5xhj7at5vKliWRGiV28hothLtCg1uYfBQcGFcoXNc';

const subsDatabase = [];
const app = express();

app.use(cors());
app.use(bodyParser.json());

webpush.setVapidDetails('mailto:monyou@abv.bg', PUBLIC_VAPID, PRIVATE_VAPID);

app.post('/AddSubscription', (req, res) => {
    const subscription = req.body;
    if (subsDatabase.findIndex(s => s.endpoint === subscription.endpoint) === -1) {
        subsDatabase.push(subscription);
    }
});

app.post('/SendPushNotification', (req, res) => {
    const notificationPayload = {
        notification: {
            title: "KABI.NET Laundry Status",
            body: "The laundry is available now!",
            icon: "./main-logo.png",
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [{
                action: "explore",
                title: "Check it out"
            }]
        }
    };

    const allSubsToSendTo = [];
    subsDatabase.forEach(subscription => {
        allSubsToSendTo.push(
            webpush.sendNotification(
                subscription,
                JSON.stringify(notificationPayload)
            )
        );
    });

    Promise.all(allSubsToSendTo).then(() => console.log("Subscription Sent!")).catch(err => console.log("Subscription failed!"));
});

app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
    console.log('Push notifications server started on random port!');
})