// models/todo.js
"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async delete(id) {
      return await Todo.destroy({
        where: {
          id: id,
        },
      });
    }

    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdue = await this.overdue();
      overdue.forEach((task) => console.log(task.displayableString()));
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const duetoday = await this.dueToday();
      duetoday.forEach((task) => console.log(task.displayableString()));
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const duelater = await this.dueLater();
      duelater.forEach((task) => console.log(task.displayableString()));
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: today },
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: today,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: today },
        },
        order: [["id", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      return await Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        },
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let dateDisplay =
        this.dueDate === new Date().toISOString().split("T")[0]
          ? ""
          : this.dueDate;
      return `${this.id}. ${checkbox} ${this.title} ${dateDisplay}`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
