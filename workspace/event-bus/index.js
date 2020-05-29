require('dotenv').config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
  const event  = req.body;
  
  events.push(event);

  axios.post(`${process.env.POST_CLUSTER_IP_SRV}/events`, event);
  axios.post(`${process.env.COMMENT_SRV}/events`, event);
  axios.post(`${process.env.QUERY_SRV}/events`, event);
  axios.post(`${process.env.MODERATION_SRV}/events`, event);
  
  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(process.env.EVENT_BUS_PORT, () => {
  console.log('Listening 4005');
});
