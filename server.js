const nodemailer = require('nodemailer')
const express = require('express');
const app = express();
const port=  8887;

//for post
const parser = require('body-parser');
app.use(parser.json());
app.use(parser.urlencoded({extended: true}))


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


//request for post to send email
app.post('/send', (req, res)=> {
    
    const val = req.body
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
    res.send("done")


    
        
    })

app.listen(port, () => {
    console.log(`Server running `);
      });