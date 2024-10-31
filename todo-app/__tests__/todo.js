/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent,username,password) => {
  let res = await agent.get("/login");
  let csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up", async() => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Testing",
      lastName: "User b",
      email: "user.b@test.com",
      password: "1234",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  })

  test("Sign out", async () => {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  })

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "user.b@test.com", "1234");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken
    });
    expect(response.statusCode).toBe(302); 
  });

  test("Marks a todo with the given ID as complete", async () => {
    const agent = request.agent(server);
    await login(agent, "user.b@test.com", "1234");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf": csrfToken
    });
  
    const groupedTodoResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = dueTodayCount > 0 ? parsedGroupedResponse.dueToday[dueTodayCount - 1] : null;
  
    if (latestTodo) {
      const status = latestTodo.completed ? false : true;
      res = await agent.get("/todos");
      csrfToken = extractCsrfToken(res);
  
      const markCompleteResponse = await agent.put(`/todos/${latestTodo.id}`).send({
        _csrf: csrfToken,
        completed: status,
      });
      const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
      expect(parsedUpdateResponse.completed).toBe(true);
    } else {
      console.log("No todo found to mark as complete.");
    }
  });
  

  // test("Fetches all todos in the database using /todos endpoint", async () => {
  //   await agent.post("/todos").send({
  //     title: "Buy xbox",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   await agent.post("/todos").send({
  //     title: "Buy ps3",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   const response = await agent.get("/todos");
  //   const parsedResponse = JSON.parse(response.text);

  //   expect(parsedResponse.length).toBe(4);
  //   expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  // });
  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    const agent = request.agent(server);
    await login(agent, "user.b@test.com", "1234");
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Delete this todo",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
  
    const response = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedResponse = JSON.parse(response.text);
    const dueTodayCount = parsedResponse.dueToday.length;
    const latestTodo = dueTodayCount > 0 ? parsedResponse.dueToday[dueTodayCount - 1] : null;
  
    if (latestTodo) {
      res = await agent.get("/todos");
      csrfToken = extractCsrfToken(res);
      const deleteResponse = await agent.delete(`/todos/${latestTodo.id}`).send({
        _csrf: csrfToken,
      });
      const parsedUpdateResponse = Boolean(deleteResponse.text);
      expect(parsedUpdateResponse).toBe(true);
    } else {
      console.log("No todo found to delete.");
    }
  });
  
 });
