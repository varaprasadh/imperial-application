const Router=require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const { handleJob }=require("../services/taskqueue");
const Application=require("../models/Application");


Router.post("/form/",multer({storage}).array("images"),(req,res)=>{
    const files=req.files || [];
    const body=req.body;

    res.status(200).send("done");

    const job = {
        data: {
            files,
            body
        }
    };

    handleJob(job, () => {
        console.log("done");
    })

    // queue.create("application",{
    //     body,
    //     files
    // }).save();
})


Router.get("/applications/",(req,res)=>{
    const skip= Number(req.query.skip) || 0;
    // console.log("here");

    Application.find().sort({timestamp:-1}).skip(skip).limit(20).then(applications=>{
         res.status(200).json({
             applications:applications,
             completed:applications.length<20
         })
    }).catch(err=>{
        console.log(err);
        res.status(400).json({
            error:err
        })
})
});



module.exports=Router;
