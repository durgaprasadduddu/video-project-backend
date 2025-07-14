
const express = require("express");
const cors = require("cors");
const { send } = require("vite");
const mongoClient = require("mongodb").MongoClient;

const app = express();

app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());

// get categories
app.get("/categories", (req, res) => {
    mongoClient.connect("mongodb://127.0.0.1:27017")
        .then(clientObj => {
            var database = clientObj.db("video-project");
            database.collection('tblcategories').find({}).toArray().then(documents => {
                res.send(documents);
                res.end();
            });
        });
});

// get videos
app.get("/videos",(req,res)=>{
    mongoClient.connect("mongodb://127.0.0.1:27017")
    .then(clientObj => {
        var database = clientObj.db("video-project");
        database.collection('tblvideos').find({}).toArray()
        .then(documents => {
            res.send(documents);
            res.end();
        });
    });
});
// Home 
app.get("/",(req,res)=>{
    res.writeHead(200,{"content-type":"text/html"});
    res.write("<h3>Welcome to Video Project</h3>");
    res.end();
});

// get admin
app.get("/admin",(request,response)=>{
    mongoClient.connect("mongodb://127.0.0.1:27017")
    .then(clientObj =>{ 
        var database = clientObj.db("video-project");
        database.collection("tbladmin").find({}).toArray()
        .then(documents => {
            response.send(documents);
            response.end();
        });
    });
});

//  get Users
app.get("/users",(req,res)=>{
    mongoClient.connect("mongodb://127.0.0.1:27017")
    .then(clientObj => {
        var database = clientObj.db("video-project");
        database.collection("tblusers").find({}).toArray()
        .then(documents => {
            res.send(documents);
            res.end();
        });
    });
});

//  get videos by id
app.get("/video/:id",(req,res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect("mongodb://127.0.0.1:27017")
    .then(clientObj =>{
        var database = clientObj.db("video-project");
        database.collection("tblvideos").find({video_id:id}).toArray()
        .then(documents =>{
            res.send(documents);
            res.end();
        });
    });
});

// Post Users
 app.post("/register",(req,res)=>{
    var user = {
        user_id : req.body.user_id,
        user_name : req.body.user_name,
        password : req.body.password,
        email : req.body.email,
        mobile : req.body.mobile
        // confirm_password : req.body.confirm_password
    }
    mongoClient.connect("mongodb://127.0.0.1:27017")
    .then(clientObj => {
        var database = clientObj.db("video-project");
        database.collection("tblusers").insertOne(user).then(()=>{
            console.log('User Rgisterd...');
            // res.writeHead(200,{"content-type":"application/json"})
            res.end();
        });
    });
 });

//  post videos 
 app.post("/add-video",(req,res)=>{
    var video = {
        video_id : parseInt(req.body.video_id),
        title : req.body.title,
        description : req.body.description,
        comments : req.body.comments,
        likes : parseInt(req.body.likes),
        views : parseInt(req.body.views),
        url : req.body.url,
        category_id : parseInt(req.body.category_id)
    }
    mongoClient.connect("mongodb://127.0.0.1:27017")
    .then(clientObj =>{
        var db = clientObj.db("video-project");
        db.collection("tblvideos").insertOne(video).then(()=>{
            console.log("video addede...");
            res.end();
        });
    });
 });

// Put update videos
  app.put("/edit-video/:id",(req,res)=>{
    var id = parseInt(req.params.id)
    var video = {
        video_id : parseInt(req.body.video_id),
        title : req.body.title,
        description : req.body.description,
        comments : req.body.comments,
        likes : parseInt(req.body.likes),
        views : parseInt(req.body.views),
        url : req.body.url,
        category_id : parseInt(req.body.category_id)
    }
    mongoClient.connect("mongodb://127.0.0.1:27017")
    .then(clientObj =>{
        var db = clientObj.db("video-project");
        db.collection("tblvideos").updateOne({video_id:id},{$set: req.body}).then(()=>{
            console.log("video updated...");
            res.redirect("/videos");
        });
    });
 });

 app.put("/likes/:id",(req,res)=>{
    var liked = {
        likes : parseInt(req.body.Likes),
        views : parseInt(req.body.Views)
    }
    mongoClient.connect("mongodb://127.0.0.1:27017")
    .then(clientObj =>{
        let db = clientObj.db("video-project");
        db.collection("tblvideos").updateOne({video_id : parseInt(req.params.id)}, {$set : liked}).then(()=>{
            res.redirect("/videos");
        })
    })
 })

 app.delete("/delete-video/:id",(req,res)=>{
    var id = parseInt(req.params.id);
    mongoClient.connect("mongodb://127.0.0.1:27017")
    .then(clientObj => {
        var db = clientObj.db("video-project");
        db.collection("tblvideos").deleteOne({video_id:id}).then(()=>{
            console.log('Video Deleted...');
            res.end();
        });
    });
 });

 app.get("/category-video/:id",(req,res)=>{
    var id = parseInt(req.params.id)
    mongoClient.connect("mongodb://127.0.0.1:27017")
    .then(clientObj => {
        var db = clientObj.db("video-project");
        db.collection("tblvideos").find({category_id:id}).toArray()
        .then((documents)=>{
            res.send(documents);
            res.end();
        });
    });
 });

app.listen(5053);
console.log(`API Satred : http://127.0.0.1:5053`);
