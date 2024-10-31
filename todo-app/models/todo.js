'use strict';
const {
  Model,
  Op
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
      Todo.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }

    static addTodo({title, dueDate, userId}) {
      return this.create({title: title, dueDate: dueDate, completed: false, userId});
    }

    setCompletionStatus( status ) {
      return this.update({completed: status});
    }

    markAsIncomplete() {
      return this.update({completed: false});
    }

    static getTodos() {
      return this.findAll();
    }

    static async isOverdue(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toISOString().split('T',1)[0],
          },
          userId: userId,
          completed: false
        },
      });
    }

    static async isDueToday(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toISOString().split('T',1)[0],
          },
          userId,
          completed: false
        },
      });
    }

    static async isDueLater(userId) {
      return this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toISOString().split('T',1)[0],
          },
          userId,
          completed: false
        }  
      });
    }

    static async isCompleted(userId) {
      return this.findAll({
        where: {
          userId,
          completed: true
        },
      });
    }

    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId
        },
      });
    }

  }
  Todo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        notNull: true
      }
    },
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};