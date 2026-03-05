'use strict';

module.exports = (sequelize, DataTypes) => {
  const VesselTag = sequelize.define('VesselTag', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vessel_id: {
      type: DataTypes.STRING(16),
      allowNull: false,
      references: { model: 'vessels', key: 'id' },
    },
    tag: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: 'e.g. SANCTIFIED, QUARANTINE, CONTAINMENT, EVIDENCE, BREACH',
    },
  }, {
    tableName: 'vessel_tags',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['vessel_id', 'tag'],
        name: 'idx_unique_vessel_tag',
      },
    ],
  });

  VesselTag.associate = (models) => {
    VesselTag.belongsTo(models.Vessel, { foreignKey: 'vessel_id', as: 'vessel' });
  };

  return VesselTag;
};
