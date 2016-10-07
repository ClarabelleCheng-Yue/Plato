require('dotenv').config();
<<<<<<< 4d8fe1594da697100178395ca2fab85d0ffb0fda
const slack = require('@slack/client');
const request = require('superagent');

const RTM_EVENTS = slack.RTM_EVENTS;
=======
>>>>>>> Create controller file for sending chat to slack

// Require db so it sets up connection
require('./db');
const express = require('express');
const middleware = require('./config/middleware');

// routing modules
const noteRouter = require('./config/routes');

const app = express();
middleware(app, express);

// Slack API integration:
const rtm = require('./rtm-client');

const IncomingWebhooks = slack.IncomingWebhook;
const slackUrl = process.env.SLACK_WEBHOOK_URL;
const slackAPIUrl = 'https://slack.com/api/';
const token = process.env.SLACK_API_TOKEN || '';
const channel = 'C2KE7FVV3';

const wh = new IncomingWebhooks(slackUrl);

// Socket.io setup
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  // socket connection will be initiated when chat is opened
  // on connection, we will get channel message history
  const endpoint = 'channels.history';
  request
    .get(slackAPIUrl + endpoint)
    .query({ token })
    .query({ channel })
    .query({ pretty: 1 })
    .end((err, res) => {
      // send array of messages to client to fill out chat
      // console.log('superagent messages response: ', res.text);
      socket.emit('slack message archive', res.text);
    });

  console.log('A user connected via socket.io!');

  rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    console.log('A message was captured: ', message);
    socket.emit('incoming slack message', message);
  });
});

// routing
app.use('/api', noteRouter);

app.get('/', (req, res) => {
  console.log(req.user);
});

// initialize server
http.listen(3000, () => {
  console.log('Plato is listening on port 3000 ...');
});

module.exports = app;
