const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const path = require("path");
app.use(express.static(path.join(__dirname,'public')));

// Set EJS as view engine

app.set("view engine", "ejs");

app.get("https://bharath-todo-app.onrender.com/", async (request, response) => {
  const todos = await Todo.findAll();
  const overdue = todos.filter(todo => todo.isOverdue());
  const dueToday = todos.filter(todo => todo.isDueToday());
  const dueLater = todos.filter(todo => todo.isDueLater());
  if(request.accepts("html")) {
    response.render('index',{
      overdue: overdue,
      dueToday: dueToday,
      dueLater: dueLater
    });
  } else {
    response.json({
      overdue: overdue,
      dueToday: dueToday,
      dueLater: dueLater
    })
  }
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
  try {
    const todos = await Todo.findAll();
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async (request, response) => {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  console.log("Creating a Todo", request.body);
  try {
    const todo = await Todo.addTodo(request.body);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("Updating a Todo with ID: ",request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Deleting a Todo with ID: ",request.params.id);
  // FILL IN YOUR CODE HERE

  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
  try {
    const deleted = await Todo.destroy({ where: { id: request.params.id } });
    // If a record was deleted, `deleted` will be 1; otherwise, it will be 0.
    return response.json(deleted ? true : false);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/", async (request, response) => {
  const todos = await Todo.findAll();
  const overdue = todos.filter(todo => todo.isOverdue());
  const dueToday = todos.filter(todo => todo.isDueToday());
  const dueLater = todos.filter(todo => todo.isDueLater());
  if(request.accepts("html")) {
    response.render('index',{
      overdue: overdue,
      dueToday: dueToday,
      dueLater: dueLater
    });
  } else {
    response.json({
      overdue: overdue,
      dueToday: dueToday,
      dueLater: dueLater
    })
  }
});


module.exports = app;
