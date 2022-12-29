const express = require('express');
const bodyParser = require("body-parser")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(bodyParser.json())


app.get('/', (req, res)=>{
   res.send('server is running')
})


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.lbeakpf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
      const newTaskCollection = client.db('todolist').collection('task');
      const usersCollection = client.db('todolist').collection('users');
      const commentCollection = client.db('todolist').collection('comment');

      app.post('/task', async(req, res)=>{
         const task = req.body;
         const result = await newTaskCollection.insertOne(task);
         res.send(result);
      })

      app.post('/users', async(req, res)=>{
         const user = req.body;
         const result = await usersCollection.insertOne(user);
         res.send(result);
      })

      app.get('/all-task/:email',async(req, res)=>{
         const email = req.params.email
         const query = {email};
         const result = await newTaskCollection.find(query).toArray();
         res.send(result)
      })

      app.delete('/task-delete/:id', async(req, res)=>{
         const id = req.params.id
         const query = {
            _id: ObjectId(id)
         }
         const result = await newTaskCollection.deleteOne(query)
         res.send(result)
      })

      app.put('/update-task', async(req, res)=>{
         const id = req.body.taskId
         const query = {
            _id: ObjectId(id)
         }
         const updateTask = req.body.updatedText
         const options = {upsert: true}
         const updatedDoc = {
            $set:{
               task: updateTask
            }
         }
         const result = await newTaskCollection.updateOne(query, updatedDoc, options)
         res.send(result)
      })
      
      app.put('/task-complete/:id', async(req, res)=>{
         const id = req.params.id
         const query = {
            _id: ObjectId(id)
         }
         const options = {upsert: true}
         const updatedDoc = {
            $set:{
               status: 'completed'
            }
         }
         const result = await newTaskCollection.updateOne(query, updatedDoc, options)
         res.send(result)
      })

      app.get('/completed-task/:email',async(req, res)=>{
         const email = req.params.email
         const query = {email};
         const allTasks = await newTaskCollection.find(query).toArray();
         const completedTasks = allTasks.filter(task=> {
            return task.status == 'completed'})
         
         res.send(completedTasks)
      })

      app.put('/task-incomplete/:id', async(req, res)=>{
         const id = req.params.id
         const query = {
            _id: ObjectId(id)
         }
         const options = {upsert: true}
         const updatedDoc = {
            $set:{
               status: 'incompleted'
            }
         }
         const result = await newTaskCollection.updateOne(query, updatedDoc, options)
         res.send(result)
      })

      app.post('/comment', async(req, res)=>{
         const data = req.body;
         console.log(data.commentId)
         const query = {
            _id: ObjectId(data.commentId)
         }
         const task =await newTaskCollection.findOne(query)
         const options = {upsert: true}
         const updatedDoc = {
            $set:{
               comment: data.comment
            }
         }
         const result = await newTaskCollection.updateOne(task, updatedDoc, options)
         res.send(result);
      })
   }
   finally{

   }
}
run().catch(err => console.log(err))




app.listen(port, (req,res)=>{
   console.log(`port is running at${port}`)
})


