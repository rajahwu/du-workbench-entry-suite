'use strict';

module.exports = (sequelize, DataTypes) => {
  const GateLock = sequelize.define('GateLock', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    runner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // one gate lock per run — enforced at schema level
      references: { model: 'runners', key: 'id' },
    },
    guide: {
      type: DataTypes.ENUM('light', 'dark'),
      allowNull: false,
    },
    mode: {
      type: DataTypes.ENUM('steward', 'solo'),
      allowNull: false,
    },
    vessel_id: {
      type: DataTypes.ENUM('seraph', 'shadow', 'exile', 'penitent', 'rebel'),
      allowNull: false,
    },
    locked_at_phase: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: '03_staging',
      comment: 'Phase where the gate was locked — typically 03_staging',
    },
  }, {
    tableName: 'gate_locks',
    underscored: true,
    timestamps: true,
    updatedAt: false, // immutable — created once, never updated
  });

  GateLock.associate = (models) => {
    GateLock.belongsTo(models.Runner, { foreignKey: 'runner_id', as: 'runner' });
  };

  return GateLock;
};
