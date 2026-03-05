'use strict';

module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    id: {
      type: DataTypes.STRING(64),
      primaryKey: true,
      comment: 'Canonical card id — e.g. card_lantern_threshold',
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    keeper: {
      type: DataTypes.ENUM('surveyor', 'smuggler'),
      allowNull: false,
    },
    lore: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Theological flavor text. Written for Insight 0.',
    },
    quote: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    quote_attribution: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: 'Revealed at Insight 3',
    },
    rarity: {
      type: DataTypes.ENUM('common', 'uncommon', 'rare', 'relic'),
      defaultValue: 'common',
      allowNull: false,
    },
    depth_min: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Minimum depth this card can appear at',
    },
    depth_max: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Maximum depth this card can appear at',
    },
  }, {
    tableName: 'cards',
    underscored: true,
    timestamps: true,
  });

  Card.associate = (models) => {
    Card.hasOne(models.CardMechanic, { foreignKey: 'card_id', as: 'mechanics' });
    Card.hasMany(models.CardTag, { foreignKey: 'card_id', as: 'tags' });
    Card.hasMany(models.CardVesselInteraction, { foreignKey: 'card_id', as: 'vessel_interactions' });
    Card.hasMany(models.CardVesselExclusion, { foreignKey: 'card_id', as: 'vessel_exclusions' });
  };

  return Card;
};
