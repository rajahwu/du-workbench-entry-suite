'use strict';

module.exports = (sequelize, DataTypes) => {
  const DoorChoice = sequelize.define('DoorChoice', {
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
    choice: {
      type: DataTypes.ENUM('light', 'dark', 'secret'),
      allowNull: false,
    },
    light_at_choice: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Snapshot of current Light when door was chosen',
    },
    dark_at_choice: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Snapshot of current Dark when door was chosen',
    },
  }, {
    tableName: 'door_choices',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['runner_id', 'depth'],
        unique: true,
        name: 'idx_one_door_per_depth',
        comment: 'Cannot choose a door twice at the same depth',
      },
    ],
  });

  DoorChoice.associate = (models) => {
    DoorChoice.belongsTo(models.Runner, { foreignKey: 'runner_id', as: 'runner' });
  };

  return DoorChoice;
};
