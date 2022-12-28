const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
   res.send('server is running')
})


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.lbeakpf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
      const newTask = client.db('todo').collection('task');

      app.get('/task', async(req,res)=>{
         res.send('all okay')
      })
   }
   finally{

   }
}




app.listen(port, (req,res)=>{
   console.log(`port is running at${port}`)
})


