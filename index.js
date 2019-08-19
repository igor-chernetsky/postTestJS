const express = require('express');
const app = express();
const axios = require('axios');
const {renderArticles, wrapHtml} = require('./utils');

app.get('/', (req, res) => {
  const articleId = req.query.id || '6sIR7uLfAksK0WAaqIw0CY';
  axios.get(`https://article.omgcheckitout.com/articles/${articleId}.js`)
    .then(response => {
      const result = renderArticles(response.data, req.query);

      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(wrapHtml(result));
      res.end();
    })
    .catch(e => {
      res.writeHead(400, {
        'Content-Type': 'text/html'
      });
      res.send('Error occured!');
    })
});

app.listen(3000, () => console.log('Check port 3000'));