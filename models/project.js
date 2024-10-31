'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
    }
  }

  Project.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    technologies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'projects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Project;
};