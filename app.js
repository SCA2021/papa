require('dotenv').config()
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000;  
const bodyParser = require('body-parser')

const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

app.use(bodyParser.urlencoded({ extended: true }))

//app.set('view engine', 'ejs');
app.set('view engine', 'ejs');




async function cxnDB(){

  try{
    client.connect; 
    const collection = client.db("chillAppz").collection("drinkz");

    // const collection = client.db("papa").collection("dev-profiles");
    const result = await collection.find().toArray();
    //const result = await collection.findOne(); 
    console.log("cxnDB result: ", result);
    return result; 
  }
  catch(e){
      console.log(e)
  }
  finally{
    client.close; 
  }
}


app.get('/', async (req, res) => {

  let result = await cxnDB().catch(console.error); 

  // console.log("get/: ", result);

  res.render('index', {  drinkData : result })
})

app.get('/mongo', async (req, res) => {

  // res.send("check your node console, bro");
  let result = await cxnDB().catch(console.error); 
  console.log('in get to slash mongo', result[1].drink_name); 

  res.send(`here ya go, joe. ${ result[1].drink_name }` ); 

})

app.get('/update', async (req, res) => {

    // want to get data from the form
    console.log("in get to slash update:", req.query.ejsFormName); 
    myName = req.query.ejsFormName; 
    // update into the db
    client.connect; 
    const collection = client.db("chillAppz").collection("drinkz");
    let result = await collection.insertOne({
      drink_name: myName
    }).then(result => {
      console.log(result);
      res.redirect('/');

    })
})



app.get('/up', async (req, res) => {

    // want to get data from the form
    console.log("in get to slash update:", req.query.ejsFormName2); 
    myName = req.query.ejsFormName2;
    myName2 = req.query.ejsFormName22;
    // update into the db
    client.connect; 
    const collection = client.db("chillAppz").collection("drinkz");
    let result = await collection.updateOne(
      {drink_name: myName},
      {$set :{drink_name:myName2}}
    ).then(result => {
      console.log(result);
      res.redirect('/');

    })
})
app.get('/del', async (req, res) => {

  // want to get data from the form
  console.log("in get to slash update:", req.query.ejsFormName3); 
  myName = req.query.ejsFormName3; 
  // update into the db
  client.connect; 
  const collection = client.db("chillAppz").collection("drinkz");
  let result = await collection.deleteOne(
    {drink_name: myName}
    ).then(result => {
      console.log(result);
      res.redirect('/');

    })
})

console.log('in the node console');

app.listen(PORT, () => {
  console.log(`Example app listening on port ${ PORT }`)
})