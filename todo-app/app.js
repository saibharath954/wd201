const express = require("express");
const app = express();
const { Todo } = require("./models");
var csurf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csurf("this_should_be_32_character_long",["POST","PUT","DELETE"]));

const path = require("path");
app.use(express.static(path.join(__dirname,'public')));

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const todos = await Todo.findAll();
  const overdue = todos.filter(todo => todo.isOverdue());
  const dueToday = todos.filter(todo => todo.isDueToday());
  const dueLater = todos.filter(todo => todo.isDueLater());
  const completedItems = todos.filter(todo => todo.isCompleted());
  if(request.accepts("html")) {
    response.render('index',{
      overdue: overdue,
      dueToday: dueToday,
      dueLater: dueLater,
      completedItems: completedItems,
      csrfToken: request.csrfToken(),
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
    await Todo.addTodo(request.body);
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  console.log("Updating a Todo with ID: ",request.params.id);
  try {
    const { completed } = request.body;
    const todo = await Todo.findByPk(request.params.id);

    if (todo) {
      await todo.setCompletionStatus(completed);
      return response.json(todo);
    } else {
      return response.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Deleting a Todo with ID: ",request.params.id);
  try {
    const deleted = await Todo.remove(request.params.id);
    return response.json(deleted ? true : false);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
