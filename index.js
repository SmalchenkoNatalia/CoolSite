const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const fs = require('fs');
   
const app = express();
const jsonParser = express.json();
 
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useUnifiedTopology: true });
const pathToConfigFile = "config.json";
 
let dbClient;
 
app.use(express.static(__dirname));
app.set('view engine', 'pug');

let pageTitle;
let domen;
let menuButtons;
let confirmationMode;
let imgFileName;
let color;

try {
	let data = JSON.parse(fs.readFileSync(pathToConfigFile));
	pageTitle = data.pageTitle;
	domen = data.domen;
	menuButtons = data.menuButtons;
	confirmationMode = data.confirmationMode;
	imgFileName = data.imgFileName;
	color = data.color;
} catch(err){
	console.error(err);
}
 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals = client.db("courses");
    app.listen(3000);
});


app.get("/",function (req, res) {
  res.redirect("/home/ua");
});

app.get("/home/ua",function (req, res) {
  res.render("main", 
      {pageTitle: pageTitle, 
      lang: "UKR", 
      domen: domen, 
      menuButtons: menuButtons,
      selectedButtonID: 1,
      confirmationMode: confirmationMode,
      address: "/home",
      imgFileName: imgFileName,
      color: color});
});

app.get("/home/en",function (req, res) {
  res.render("main", 
      {pageTitle: pageTitle, 
      lang: "ENG", 
      domen: domen, 
      menuButtons: menuButtons,
      selectedButtonID: 1,
      confirmationMode: confirmationMode,
      address: "/home",
      imgFileName: imgFileName,
      color: color});
});

app.get("/trainings/ua",function (req, res) {
  res.render("trainings", 
      {pageTitle: pageTitle, 
      lang: "UKR", 
      domen: domen, 
      menuButtons: menuButtons,
      selectedButtonID: 2,
      confirmationMode: confirmationMode,
      address: "/trainings",
      color: color});
});

app.get("/trainings/en",function (req, res) {
  res.render("trainings", 
      {pageTitle: pageTitle, 
      lang: "ENG", 
      domen: domen, 
      menuButtons: menuButtons,
      selectedButtonID: 2,
      confirmationMode: confirmationMode,
      address: "/trainings",
      color: color});
});

app.get("/about/ua",function (req, res) {
  res.render("about", 
      {pageTitle: pageTitle, 
      lang: "UKR", 
      domen: domen, 
      menuButtons: menuButtons,
      selectedButtonID: 3,
      confirmationMode: confirmationMode,
      address: "/about",
      color: color});
});

app.get("/about/en",function (req, res) {
  res.render("about", 
      {pageTitle: pageTitle, 
      lang: "ENG", 
      domen: domen, 
      menuButtons: menuButtons,
      selectedButtonID: 3,
      confirmationMode: confirmationMode,
      address: "/about",
      color: color});
});

app.post("/api/applies", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const clientName = req.body.clientName;
    const clientSurname = req.body.clientSurname;
    const clientEmail = req.body.clientEmail;
    const clientPhone = req.body.clientPhone;
    const application = req.body.application;
    const confirmed = req.body.confirmed;
    const newApply = {name: clientName, surname: clientSurname, email: clientEmail, phone: clientPhone, application: application, confirmed: confirmed};
    const collection = req.app.locals.collection("applies");
    collection.insertOne(newApply, function(err, result){
        if(err) return console.log(err);
        res.send(newApply);
    });
});

app.get("/admin", function(req,res) {
  res.render("admin_trainings");
});
 
app.get("/api/articles", function(req, res){
        
    const collection = req.app.locals.collection("articles");
    collection.find({}).toArray(function(err, articles){
         
        if(err) return console.log(err);
        res.send(articles)
    });
     
});

app.get("/api/articles/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection("articles");
    collection.findOne({_id: id}, function(err, article){
               
        if(err) return console.log(err);
        res.send(article);
    });
});

app.post("/api/setconfmode", jsonParser, function (req, res) {
	if(!req.body) return res.sendStatus(400);
	confirmationMode = req.body.confirmationMode;
	try {
		fs.writeFileSync(pathToConfigFile, JSON.stringify({pageTitle: pageTitle, domen: domen, confirmationMode: confirmationMode, imgFileName: imgFileName, color: color, menuButtons: menuButtons}));
	} catch(err) {
		console.error(err);
	}
});
   
app.post("/api/articles", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
       
    const name = req.body.name;
    const article = req.body.article;
    const lang = req.body.lang;
    const newArticle = {name: name, article: article, lang: lang};
       
    const collection = req.app.locals.collection("articles");
    collection.insertOne(newArticle, function(err, result){
               
        if(err) return console.log(err);
        res.send(newArticle);
    });
});
    
app.delete("/api/articles/:id", function(req, res){
        
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection("articles");
    collection.findOneAndDelete({_id: id}, function(err, result){
               
        if(err) return console.log(err);    
        let article = result.value;
        res.send(article);
    });
});
   
app.put("/api/articles", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const name = req.body.name;
    const article = req.body.article;
    const lang = req.body.lang;
       
    const collection = req.app.locals.collection("articles");
    collection.findOneAndUpdate({_id: id}, { $set: {article: article, name: name, lang: lang}},
         {returnOriginal: false },function(err, result){
               
        if(err) return console.log(err);     
        const article = result.value;
        res.send(article);
    });
});
 
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});

