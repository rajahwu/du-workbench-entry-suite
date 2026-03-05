'use strict';

module.exports = (sequelize, DataTypes) => {
  const Vessel = sequelize.define('Vessel', {
    id: {
      type: DataTypes.STRING(16),
      primaryKey: true,
      comment: 'Canonical lowercase: seraph, shadow, exile, penitent, rebel',
    },
    display_name: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    short_label: {
      type: DataTypes.STRING(4),
      allowNull: false,
      comment: 'Roman numeral I-V',
    },
    subtitle: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: 'e.g. "the burning ones"',
    },
    alignment: {
      type: DataTypes.ENUM('light', 'dark', 'balanced'),
      allowNull: false,
    },
    draft_bias: {
      type: DataTypes.ENUM('light', 'dark', 'neutral'),
      allowNull: false,
    },
    starting_light: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    starting_dark: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_health: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hand_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    engine_note: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    // Theology and playstyle — long text for CLI/API consumers
    theology: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    playstyle: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    primary_hue: {
      type: DataTypes.STRING(7),
      allowNull: true,
      comment: 'Hex color code — e.g. #D4A843',
    },
  }, {
    tableName: 'vessels',
    underscored: true,
    timestamps: true,
  });

  Vessel.associate = (models) => {
    Vessel.hasMany(models.VesselMechanic, { foreignKey: 'vessel_id', as: 'mechanics' });
    Vessel.hasMany(models.VesselTag, { foreignKey: 'vessel_id', as: 'tags' });
    Vessel.hasMany(models.CardVesselInteraction, { foreignKey: 'vessel_id', as: 'card_interactions' });
  };

  return Vessel;
};
