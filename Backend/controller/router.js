const express = require("express");
const studentRoute = express.Router();
const studentSchema = require("../model/schema");
const messageSchema = require("../model/schema2")
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const Document = require("../model/Document");

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
studentRoute.post("/upload", upload.single("document"), async (req, res) => {
  try {
    const { filename: document } = req.file;
    const newDocument = new Document({ document });
    await newDocument.save();
    res.status(201).send("Document uploaded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


studentRoute.post("/create-doctors",(req,res)=>{
    studentSchema.create(req.body,(err, data)=>{
        if(err)
            return err;
        else
            res.json(data); //whatever has been posted by client will be shown n page
    })
});


studentRoute.get("/", (req,res)=>{
    studentSchema.find((err,data)=>{
        if(err)
            return err;
        else
            res.json(data);
    })
});

studentRoute.route("/message/:id")
.get((req,res)=>{
    studentSchema.findById(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
        if(err)
            return err;
        else 
            res.json(data);
    })
})

studentRoute.post("/message/write",(req,res)=>{
    messageSchema.create(req.body,(err, data)=>{
        if(err)
            return err;
        else
            res.json(data); //whatever has been posted by client will be shown n page
    })
});

studentRoute.get("/messages/fetch", (req,res)=>{
    messageSchema.find((err,data)=>{
        if(err)
            return res.status(500).json({ error: "Internal server error" });
        else
            res.json(data);
    })
});

module.exports = studentRoute;