const express = require('express');
const { Ingest , Search } = require('sonic-channel')
const { v4: uuid } = require('uuid');

const app =  express();
app.use(express.json());

const sonicChannelIngest = new Ingest({
  host: 'localhost',
  port: 1491,
  auth: 'SecretPassword',
})

sonicChannelIngest.connect({ 
  connected: () => {
    console.log('Connected to Ingest');
  }
})

const sonicChannelSearch = new Search({
  host: 'localhost',
  port: 1491,
  auth: 'SecretPassword',
})

sonicChannelSearch.connect({ 
  connected: () => {
    console.log('Connected to Search');
  }
})

app.post('/pages', async (req, res) => {
  const { title , content } = req.body;
  const id = uuid();
  
  //save on db
  await sonicChannelIngest.push('pages', 'default', `page:${id}`, `${title} ${content}`, { 
    lang: 'por'
  })
  
  return res.status(201).send()
})


app.get('/search', async  (req,res) => {
  //Search
  const { q } = req.query;

  const results = await sonicChannelSearch.query(
    'pages', 
    'default',
    q,
    { lang: 'por' }
  )

  return res.json(results);
})

app.get('/suggest', async (req, res) => {
  const { q } = req.query;

  const results = await sonicChannelSearch.suggest(
    'pages', 
    'default',
    q,
    { limit: 5 }
  ) 

  return res.json(results);

})


app.listen(3333, () => { 
  console.log('Server listening on port 3333');
})