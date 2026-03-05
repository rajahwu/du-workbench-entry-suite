'use strict';

module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    runner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'runners', key: 'id' },
    },
    memory_fragments: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: { min: 0 },
    },
  }, {
    tableName: 'inventories',
    underscored: true,
    timestamps: true,
  });

  Inventory.associate = (models) => {
    Inventory.belongsTo(models.Runner, { foreignKey: 'runner_id', as: 'runner' });
  };

  return Inventory;
};
