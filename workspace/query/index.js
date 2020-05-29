require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

const eventHandler = (type, data) => {
  if ( type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if ( type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if ( type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    
    const post = posts[postId];
    const comment = post.comments.find(comment => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
}

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  
  eventHandler(type, data);
  
  res.send({});
});

app.listen(process.env.QUERY_PORT, async () => {
  console.log('Listening 4002');
  
  const res = await axios.get(`${process.env.EVENT_BUS_SRV_HOST}/events`);
  for (let event of res.data) {
    console.log('Processing event ... ', event.type);
    eventHandler(event.type, event.data);
  }
});
