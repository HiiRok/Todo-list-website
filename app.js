const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const date = require(__dirname+"/date.js");
const port=3000;
 
const app=express();

const items =[];
const workitem = [];

app.set('view engine','ejs');
 
app.use(bodyParser.urlencoded({extended: true}));
 
app.use(express.static("public"));

app.get('/',function(req,res){

    let day = date.getday();
    
    res.render('list',{kindofday:day,newlistitem:items});
});



app.post('/',function(req,res)
{

    let item = req.body.newItem;

    let reqbody=req.body.list;

    console.log(reqbody);

    if(reqbody === "work")
    {
        workitem.push(item)
    
         res.redirect("/work");

    }else{

    items.push(item)
    
    res.redirect("/");
    }
})

app.get('/work',function(req,res){
    
    res.render('list',{kindofday:"work",newlistitem:workitem});
});


app.listen(port,()=>
{
    console.log('server started at port '+port+'');
});