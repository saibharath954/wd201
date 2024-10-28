/* eslint-disable no-unused-vars */
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static addTodo({title, dueDate}) {
      return this.create({title: title, dueDate: dueDate, completed: false})
    }

    markAsCompleted() {
      return this.update({completed: true})
    }

    static getTodos() {
      return this.findAll();
    }

    isOverdue() {
      return this.dueDate < new Date().toISOString().split('T',1)[0];
    }

    isDueToday() {
      return this.dueDate == new Date().toISOString().split('T',1)[0];
    }

    isDueLater() {
      return this.dueDate > new Date().toISOString().split('T',1)[0];
    }

  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};