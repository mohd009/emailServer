const nodemailer = require('nodemailer')
const express = require('express');
const app = express();
const port=  process.env.PORT || 3000;

var path = require('path');   


app.use('/images',express.static('images/galleryimages'));

  

//frontend calls to server when it starts automatically 
//---------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'dist/woodstove')));

//Any routes will be redirected to the angular app
app.get('*', function(req, res) {
   res.sendFile(path.join(__dirname, 'dist/woodstove/index.html'));
});
//-----------------------------------------------------------------------


//for our mongoDB 
const mongoose = require('mongoose') //mongo object
const mongo_uri = "mongodb+srv://woodstove_user:ToOS7w4VWp3cJMuh@woodstove.uyr0p.mongodb.net/woodstove-customers?retryWrites=true&w=majority"
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log('monggose connexted');
})
//make a schema
const Schema = mongoose.Schema;
const MyData = new Schema({
    firstName : String,
    lastName :String,
    email : String,
    phone: Number,
    details: String
    //price: int --for later
});

// define how we want model to be 
//our collection db online is customerinfos -- but mongo will auto pluralize the customerInfo in the code
const makeCustomerModel = mongoose.model('customerInfo', MyData) //collection in our db called 'customerInfo'

//add data and save //just a test sample but should put this in the request
const data = {
    "firstName": "Moh2121",
    "lastName": "mo",
    "email": "mohdbd99@gmail.com",
    "phone": 2222,
    "details": "okkk"
}

function saveToDB(custData){
     //now we save to mongoDB
     const newData = new makeCustomerModel(custData)
     newData.save((error)=> {
     if (error){
        console.log("issue")
     }else{
        console.log("added to dattabse")
    }
 })
}
//const newData = new makeCustomerModel(data)
//newData.save((error)=> {
  //  if (error){
  //      console.log("issue")
  //  }else{
 //       console.log("added to dattabse")
 //   }
//})

//---------------------------------------------------------------------
//my requests
//----------------------------------------------------------------------
//for post
const parser = require('body-parser');
app.use(parser.json());
app.use(parser.urlencoded({extended: true}))

//creating gallery images static folder middleware with express

//-----------------------------    images








//transporter - makes the connction for us
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'johnbasic23@gmail.com',
        pass: 'uasrjgheikdgrdsl'

    }
});
//what we want to send and from who
//modify for both business and client
let mailOptions = {
    from: 'johnbasic23@gmail.com',
    to: '',
    subject: '',
    text: '',
    replyTo: ''
}




//step 3
function sendmail(){
    transporter.sendMail(mailOptions, function(err, data){
    if (err){
        console.log("Error sending"+err);
    }else{
        console.log("Email sent!!");
    }
})
}



//- for the post request
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "PUT, PATCH, DELETE"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept");
    next(); })


//----------------------------
    // ALL MY REQUESTS

//-----------------------------    
app.get('/', (req, res)=> {
    res.send("Hello, server running")
})



//request for post to send email
app.post('/apis/send', (req, res)=> {
    
    
    const val = req.body.cust
    saveToDB(val);
    console.log(val)
    //send to clinet
    mailOptions.to = val.email;
    
    mailOptions.subject = 'Order received'
    mailOptions.text = ('Hi,' + (val.firstName)+ '\n , We have recived your order' 
    +'We will look it it and please await confirmation once its processed, thank you')
    sendmail();
    
    //send to business
    mailOptions.replyTo = val.email //reply to client
    mailOptions.to = mailOptions.from; //to business
    mailOptions.subject = 'Incoming custom order'
     mailOptions.text = ('Incoming order received \n'+ 
    'Order details: \n'+ val.firstName + val.details )
    sendmail();

    //
    res.send("done sending emailing")


    
        
    })

app.listen(port, () => {
    
    console.log(`Woodstove Leather Goods server running on port:${port} `);
    
      });