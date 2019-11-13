const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser');

const PUBLIC_VAPID = 'BClP3jkMffUZv11IBPTzZGWqbgmTbjRO7LauIBh66vdb-zJjY5vvedETpWZ9wmynSUzObo2rrQQZdFBS6qhe-68';
const PRIVATE_VAPID = 'hE5xhj7at5vKliWRGiV28hothLtCg1uYfBQcGFcoXNc';

const fakeDatabase = [];
const app = express();

app.use(cors());
app.use(bodyParser.json());

webpush.setVapidDetails('mailto:monyou@abv.bg', PUBLIC_VAPID, PRIVATE_VAPID);

app.post('/AddSubscription', (req, res) => {
    const subscription = req.body
    fakeDatabase.push(subscription)
});

app.post('/SendPushNotification', (req, res) => {
    const notificationPayload = {
        notification: {
            title: "KABI.NET Laundry Status",
            body: "The laundry is available now!",
            icon: "../../../../../assets/logo/main-logo.png",
            vibrate: [100, 50, 100]
            // data: {
            //   dateOfArrival: Date.now(),
            //   primaryKey: 1
            // },
            // actions: [{
            //   action: "explore",
            //   title: "Check it out"
            // }]
        }
    };

    const promises = [];
    fakeDatabase.forEach(subscription => {
        promises.push(
            webpush.sendNotification(
                subscription,
                JSON.stringify(notificationPayload)
            )
        )
    })

    Promise.all(promises).then();
});

app.listen(8769, () => {
    console.log('Push notifications server started on port 8630!');
})