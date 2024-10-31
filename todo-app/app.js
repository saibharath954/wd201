const express = require("express");
const app = express();
const { Todo, User } = require("./models");
var csurf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csurf("this_should_be_32_character_long",["POST","PUT","DELETE"]));

app.use(session({
  secret: "my-super-secret-key-58294538568272224",
  resave: false, // Don't resave the session if it hasn't changed
  saveUninitialized: false, // Don't save empty sessions
  cookie: {
    maxAge: 24*60*60*1000 //24hrs
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (username, password, done) => {
  User.findOne({ where: { email: username }})
    .then(async (user) => {
      const result = await bcrypt.compare(password, user.password)
      if (result) {
        return done(null, user)  
      } else {
        return done("Invalid Password");
      }
    }).catch((error) => {
      return (error)
    })
}))

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id)
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user)
    })
    .catch(error => {
      done(error, null)
    })
});

const path = require("path");
app.use(express.static(path.join(__dirname,'public')));

app.set("view engine", "ejs");

app.get("/", async (request, response) => {
    response.render("index",{
      title: "Task Manager",
      csrfToken: request.csrfToken(),
    });
});

app.get("/signup", (request, response) => {
  response.render("signup" , {
    title: "Sign-up",
    csrfToken: request.csrfToken()
  })
})

app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds)
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd
    });
    request.login(user, (err) => {
      if(err) {
        console.log(err);
      }
      response.redirect("/todos");
    })
  } catch (error) {
    console.log(error);
  }
})

app.get("/login", (request, response) => {
  response.render("login", { 
    title : "Login", 
    csrfToken: request.csrfToken()});
})

app.post("/session", passport.authenticate('local', {failureRedirect: "/login"}), (request, response) => {
  response.redirect("/todos");
})

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) { return next(err); }
    response.redirect("/");
  })
})

app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async function (request, response) {
  const loggedInuser = request.user.id;
  const loggedInuserfName = request.user.firstName;
  const loggedInuserlName = request.user.lastName;
  const overdue = await Todo.isOverdue(loggedInuser);
  const dueToday = await Todo.isDueToday(loggedInuser);
  const dueLater = await Todo.isDueLater(loggedInuser);
  const completedItems = await Todo.isCompleted(loggedInuser);
  if (request.accepts("html")) {
    response.render("todos",{
    overdue: overdue,
    dueToday: dueToday,
    dueLater: dueLater,
    completedItems: completedItems,
    csrfToken: request.csrfToken(),
    userfName: loggedInuserfName,
    userlName: loggedInuserlName,
    });
  } else {
    response.json({overdue,dueLater,dueToday,completedItems})
  }
});

app.get("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  console.log("Creating a Todo", request.body);
  try {
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      userId: request.user.id
    });
    return response.redirect("/todos");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
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

app.delete("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  console.log("Deleting a Todo with ID: ",request.params.id);
  try {
    const deleted = await Todo.remove(request.params.id,request.user.id);
    return response.json(deleted ? true : false);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
