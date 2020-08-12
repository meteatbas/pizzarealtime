require('dotenv').config();

const express=require('express');

const app=express()

const ejs=require('ejs');

const path=require('path');

const expressLayout=require('express-ejs-layouts');

const PORT=process.env.PORT||3300;

const mongoose=require('mongoose');

const session=require('express-session');

const flash=require('express-flash');

const MongoDbStore=require('connect-mongo')(session);




//Database connection

mongoose.connect('mongodb://localhost/pizza',{useFindAndModify:true});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log('DB connected'); 
}).catch(err=>{
    console.log('DB not connected');
})

//Session Store

var mongoStore= new MongoDbStore({
    mongooseConnection:connection,
    collection:'sessions'

})


//Session config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24}// 24 hours
}));


app.use(flash())

//Assests
app.use(express.static('public'))
app.use(express.json())

//Global middleware

app.use((req,res,next)=>{
    res.locals.session = req.session
    next();
})


//Set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine','ejs');

require('./routes/web')(app);






app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`);
})