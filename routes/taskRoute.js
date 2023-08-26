const express = require("express");

const Task = require("../models/Task");
const router = express.Router();

const common = require("../common");

const fs = require("fs").promises;

router.get("/", async (req, res) => {
  let tasks = await Task.find();
  
  res.send(tasks);
  res.end();
});


router.post("/", async (req, res) => {
  const task = new Task({
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    isdone: req.body.isdone
  });
  try {
    await task.save();
    res.send(task);
    res.end();

  } catch (err) {
    res.status(404);
    res.send(err);
    res.end();
  }
});


router.delete('/:id', async (req, res) => {
    try{
     await Task.deleteOne({_id: req.params.id});
     res.status(200);
     res.send(await Task.find())
     res.end();
    }

    catch(err){
     res.status(500);
     res.send(err);
     res.end();
    }
})
module.exports = router;
