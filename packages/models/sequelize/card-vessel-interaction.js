'use strict';

module.exports = (sequelize, DataTypes) => {
  const CardVesselInteraction = sequelize.define('CardVesselInteraction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    card_id: {
      type: DataTypes.STRING(64),
      allowNull: false,
      references: { model: 'cards', key: 'id' },
    },
    vessel_id: {
      type: DataTypes.STRING(16),
      allowNull: false,
      references: { model: 'vessels', key: 'id' },
    },
    // Mechanic overrides — only populated fields differ from card base mechanics
    light_delta_override: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dark_delta_override: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stability_delta_override: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    heal_override: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    points_override: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    additional_effect: {
      type: DataTypes.STRING(256),
      allowNull: true,
      comment: 'Prose description of vessel-specific effect',
    },
  }, {
    tableName: 'card_vessel_interactions',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['card_id', 'vessel_id'],
        name: 'idx_unique_card_vessel',
      },
    ],
  });

  CardVesselInteraction.associate = (models) => {
    CardVesselInteraction.belongsTo(models.Card, { foreignKey: 'card_id', as: 'card' });
    CardVesselInteraction.belongsTo(models.Vessel, { foreignKey: 'vessel_id', as: 'vessel' });
  };

  return CardVesselInteraction;
};
