const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const _ = require('lodash')

const mongoose =require('mongoose');

const port=3000;
 
const app=express();

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");  

const itemSchema = mongoose.Schema({
    name: {type: String, required: true},
});

const listschema = {
  name :{type: String, required: true},
  items :[itemSchema]
}

const Item = mongoose.model("Item",itemSchema);

const List = mongoose.model("List",listschema);

const item1 = new Item({
    name:"Welcome to your todoList !"
});

const item2 = new Item({
    name:"Hope you are enjoying it !"
});

const item3 = new Item({
    name:"<-- Hit + button to create more list items ! -->"
});

const defaultItems=[item1,item2,item3];



app.set('view engine','ejs');   //watches for the views folder
 
app.use(bodyParser.urlencoded({extended: true}));
 
app.use(express.static("public"));  //for the static css file to get noticed by the server //watches for the public folder


app.get('/',async function(req,res){
    
        try {
          const foundItems = await Item.find({});
          if (foundItems.length === 0) {
            await Item.insertMany(defaultItems);
            res.redirect("/");
          } else {
            res.render('list', { kindofday: "Today", newlistitem: foundItems });
          }
        } catch (error) {
          console.error(error);
          res.status(500).send("An error occurred while processing your request");
        }
      
});


app.get("/:customroute",async function(req,res)
{
  const cus = _.capitalize(req.params.customroute);
  

  const flist = await List.findOne({name:cus});

  if(!flist)
  {
    const llist = new List ({
      name:cus,
      items:defaultItems
    })
    llist.save();
    res.redirect("/"+cus);
  }else
  {

    res.render('list', { kindofday: cus, newlistitem: flist.items });
  }

})



app.post('/',async function(req,res)
{
  const llask = req.body.list;
    let newItem = new Item({
      name: req.body.newItem
  })

  if(llask == "Today")
  {
    newItem.save();
    res.redirect("/");
  }else{

    const fone = await List.findOne({name:llask});
    fone.items.push(newItem);
    fone.save()
    res.redirect("/"+llask);
  }
  
})

app.post('/delete',async function(req,res)
{
  const docname = req.body.listname;
  const checkeditem = req.body.checkbox;
  if(docname === "Today")
  {
    await Item.findByIdAndRemove(checkeditem);
    res.redirect("/");
  }else{
    const fdel = await List.findOneAndUpdate({name:docname},{
      $pull:{items:{_id:checkeditem}}
    });
    res.redirect("/"+docname);
  }
  
  
})


app.listen(port,()=>
{
    console.log('server started at port '+port+'');
});