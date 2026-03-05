'use strict';

module.exports = (sequelize, DataTypes) => {
  const CardMechanic = sequelize.define('CardMechanic', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      references: { model: 'cards', key: 'id' },
    },
    light_delta: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dark_delta: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stability_delta: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    heal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    depth_mod: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '+1 harder, -1 easier for next level',
    },
    hand_size_mod: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    keeper_favor_keeper: {
      type: DataTypes.ENUM('surveyor', 'smuggler'),
      allowNull: true,
    },
    keeper_favor_amount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'card_mechanics',
    underscored: true,
    timestamps: false,
  });

  CardMechanic.associate = (models) => {
    CardMechanic.belongsTo(models.Card, { foreignKey: 'card_id', as: 'card' });
  };

  return CardMechanic;
};
