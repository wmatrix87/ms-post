require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

const posts = {};


app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  if ( type === 'CommentCreated' ) {
    const status = data.content.includes('asshole') ? 'rejected' : 'approved';
    await axios.post(`${process.env.EVENT_BUS_SRV_HOST}/events`, {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      }
    })
  }
  
  res.send({});
});

app.listen(process.env.MODERATION_PORT, () => {
  console.log('Listening 4003');
});
