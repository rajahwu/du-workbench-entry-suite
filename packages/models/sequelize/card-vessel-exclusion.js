'use strict';

module.exports = (sequelize, DataTypes) => {
  const CardVesselExclusion = sequelize.define('CardVesselExclusion', {
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
  }, {
    tableName: 'card_vessel_exclusions',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['card_id', 'vessel_id'],
        name: 'idx_unique_card_vessel_exclusion',
      },
    ],
  });

  CardVesselExclusion.associate = (models) => {
    CardVesselExclusion.belongsTo(models.Card, { foreignKey: 'card_id', as: 'card' });
    CardVesselExclusion.belongsTo(models.Vessel, { foreignKey: 'vessel_id', as: 'vessel' });
  };

  return CardVesselExclusion;
};
