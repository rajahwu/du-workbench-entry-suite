'use strict';

module.exports = (sequelize, DataTypes) => {
  const InventoryItem = sequelize.define('InventoryItem', {
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
    item_id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'References card_id, relic_id, or candy_id from content tables',
    },
    item_type: {
      type: DataTypes.ENUM('relic', 'card', 'candy'),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      validate: { min: 1 },
      comment: 'Candy stacks (quantity > 1). Relics and cards are unique (quantity = 1).',
    },
    acquired_at_depth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'inventory_items',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        // Relics and cards cannot duplicate per run.
        // Candy can — handled in application logic via quantity increment.
        unique: true,
        fields: ['runner_id', 'item_id', 'item_type'],
        where: { item_type: ['relic', 'card'] },
        name: 'idx_unique_non_stackable_items',
      },
    ],
  });

  InventoryItem.associate = (models) => {
    InventoryItem.belongsTo(models.Runner, { foreignKey: 'runner_id', as: 'runner' });
  };

  return InventoryItem;
};
