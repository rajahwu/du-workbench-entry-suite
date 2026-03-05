'use strict';

module.exports = (sequelize, DataTypes) => {
  const DropEvent = sequelize.define('DropEvent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    runner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'runners', key: 'id' },
    },
    depth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.ENUM('death', 'math_fail', 'exit'),
      allowNull: false,
    },
    survived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    light_at_drop: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dark_at_drop: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fragments_awarded: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Memory fragments converted from this run on drop',
    },
    loop_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Which loop iteration this drop occurred on',
    },
  }, {
    tableName: 'drop_events',
    underscored: true,
    timestamps: true,
    updatedAt: false,
  });

  DropEvent.associate = (models) => {
    DropEvent.belongsTo(models.Runner, { foreignKey: 'runner_id', as: 'runner' });
  };

  return DropEvent;
};
