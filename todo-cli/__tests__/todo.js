const todoList = require("../todo");

describe("Todo List Test Suite", () => {
  let todos;

  beforeEach(() => {
    todos = todoList();
  });

  test("should add a new todo", () => {
    todos.add({ title: "Test todo", dueDate: "2024-10-20", completed: false });
    expect(todos.all.length).toBe(1);
    expect(todos.all[0].title).toBe("Test todo");
  });

  test("should mark a todo as complete", () => {
    todos.add({
      title: "Complete me",
      dueDate: "2024-10-21",
      completed: false,
    });
    todos.markAsComplete(0);
    expect(todos.all[0].completed).toBe(true);
  });

  test("should retrieve overdue items", () => {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0];
    todos.add({ title: "Overdue todo", dueDate: yesterday, completed: false });
    const overdueTodos = todos.overdue();
    expect(overdueTodos.length).toBe(1);
    expect(overdueTodos[0].title).toBe("Overdue todo");
  });

  test("should retrieve due today items", () => {
    const today = new Date().toISOString().split("T")[0];
    todos.add({ title: "Today todo", dueDate: today, completed: false });
    const dueTodayTodos = todos.dueToday();
    expect(dueTodayTodos.length).toBe(1);
    expect(dueTodayTodos[0].title).toBe("Today todo");
  });

  test("should retrieve due later items", () => {
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0];
    todos.add({ title: "Future todo", dueDate: tomorrow, completed: false });
    const dueLaterTodos = todos.dueLater();
    expect(dueLaterTodos.length).toBe(1);
    expect(dueLaterTodos[0].title).toBe("Future todo");
  });
});
