const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const Task = require('./models/Task')

const http = require("http");
const io = require("socket.io");

const mongoose = require("mongoose");

const DBurl = "mongodb://127.0.0.1:27017";

const app = express();
const httpServer = http.createServer(app);

const ioServer = io(httpServer, {
  cors: {
    origin: ["http://localhost:4200"],
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const userRoute = require("./routes/userRoute");
app.use("/users", userRoute);

const taskRoute = require("./routes/taskRoute");
app.use("/tasks", taskRoute);

ioServer.on("connection", (socket) => {
  console.log("user connected");

  socket.on('onTaskAdded', async (task) => {
    console.log(`Task: ${task.title} Added !`)


    const newTask = new Task({
      title: task.title,
      description: task.description,
      priority: task.priority,
      isdone: task.isdone,
    });
    try {
      await newTask.save();
      console.log("New task saved to the database.");
    socket.emit('newTask', newTask);
    socket.broadcast.emit('newTask', newTask);
    } catch (err) {
      console.error("Error saving the new task to the database:", err);
    }
  })

  socket.on('onTaskDeleted', async (id) => {
    socket.emit('deletedTask', id);
    socket.broadcast.emit('deletedTask', id);

    try {
      await Task.deleteOne({_id: id});
      console.log("Task deleted from the database.");
    } catch (err) {
      console.error("Error deleting the task from the database:", err);
    }
  })

  socket.on("onTaskDone", async (task) => {
    // socket.emit("taskDone", task);
    // socket.broadcast.emit('taskDone', task);
    try{
      const updatedTask = await Task.findOneAndUpdate(
        { _id: task._id },
        { $set: { isdone: true } },
        { new: true }
      );
      if (updatedTask) {
        console.log(`Task ${updatedTask.title} marked as done.`);
        socket.emit("taskDone", updatedTask);
        socket.broadcast.emit('taskDone', updatedTask);
      }
    }
    catch (err) {
      console.log(err);
    }

  })

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

mongoose
  .connect(DBurl)
  .then(() => {
    console.log("connected to database");

    const server = httpServer.listen(5050, function () {
      const port = server.address().port;
      console.log("server listening on port", port);
    });
  })
  .catch((err) => console.log(err));
