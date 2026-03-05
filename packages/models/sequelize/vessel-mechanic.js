'use strict';

module.exports = (sequelize, DataTypes) => {
  const VesselMechanic = sequelize.define('VesselMechanic', {
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
    mechanic_key: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'Maps to VesselMechanics field name — e.g. extra_points_per_hit, timer_multiplier',
    },
    value_numeric: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Numeric mechanic value',
    },
    value_string: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: 'String mechanic value (for enums like meta_counter_condition)',
    },
    value_boolean: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: 'Boolean mechanic value (for flags like uses_insight)',
    },
  }, {
    tableName: 'vessel_mechanics',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['vessel_id', 'mechanic_key'],
        name: 'idx_unique_vessel_mechanic',
      },
    ],
  });

  VesselMechanic.associate = (models) => {
    VesselMechanic.belongsTo(models.Vessel, { foreignKey: 'vessel_id', as: 'vessel' });
  };

  return VesselMechanic;
};
