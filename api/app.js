const express=require("express");

const cors=require("cors");
const postHandler = require("./Routes/postHandler");
const path=require("path");


const app=express();
const connection= require("./dbconnection");


const PATH_TO_INDEX=path.join(__dirname,'build','index.html');

// const kue=require("kue");

connection.then((db)=>{
    console.log("db connected");
}).catch(err=>{
    console.log("db errror",err);
})
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("build"));


// app.use("/kue-api",kue.app);


app.use(postHandler);

const PORT=process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.send("app is running");
});

app.get("/dashboard",(req,res)=>{
    res.sendFile(PATH_TO_INDEX);
})


app.listen(PORT,()=>{
    console.log(`server listening at port ${PORT}`);
})