const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// all midelwere is here
app.use(cors());
app.use(express.json());



// Monodb connection is here
const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Password}@cluster0.85env82.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri,{
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(){
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

        const AllToys = client.db("PlayCarZone").collection("alltoys");


        // post new toys route is here
        app.post("/inserttoy", async(req, res)=>{
            try {
              const toy = req.body;
              const result = await AllToys.insertOne(toy);
              res.send(result);
            } catch (error) {
              console.log(error);
            }
        });

        // get img from toy for gallery route here
        app.get("/galleryimg",async(req,res)=>{
          const query = {};
          const option = {
            projection : {thumbnail: 1}
          };

          const result = await AllToys.find(query, option).limit(18).toArray();
          res.send(result);
          
        });


        // get img from toy for gallery route here
        app.get("/alltoys",async(req,res)=>{
          const query = {};
          const option = {
            projection : {thumbnail: 1, name:1, price: 1, rating:1, catagory:1}
          };

          const result = await AllToys.find(query, option).toArray();
          res.send(result);
          
        });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// Mongodb connection is end here




// default route is here
app.get("/",(req,res)=>{
    res.send("PlayCarZone server is running")
});

// app listen is here
app.listen(port, ()=>{
    console.log(`This server is running with ${port}`);   
});