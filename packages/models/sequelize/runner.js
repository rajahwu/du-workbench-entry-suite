'use strict';

module.exports = (sequelize, DataTypes) => {
  const Runner = sequelize.define('Runner', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    run_id: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      comment: 'Application-generated run identifier (e.g. run-{timestamp})',
    },
    display_name: {
      type: DataTypes.STRING(64),
      allowNull: true,
      defaultValue: 'Wanderer',
    },
    vessel_id: {
      type: DataTypes.ENUM('seraph', 'shadow', 'exile', 'penitent', 'rebel'),
      allowNull: true,
      comment: 'Set after Gate lock. Null until vessel is chosen.',
    },
    sigil_key: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: 'Lore key, not brand identity',
    },
    // Run lifecycle
    status: {
      type: DataTypes.ENUM('active', 'completed', 'abandoned'),
      defaultValue: 'active',
    },
    started_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ended_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'runners',
    underscored: true,
    timestamps: true,
  });

  Runner.associate = (models) => {
    Runner.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Runner.hasOne(models.GateLock, { foreignKey: 'runner_id', as: 'gate_lock' });
    Runner.hasOne(models.RunProgress, { foreignKey: 'runner_id', as: 'progress' });
    Runner.hasOne(models.Inventory, { foreignKey: 'runner_id', as: 'inventory' });
    Runner.hasMany(models.InventoryItem, { foreignKey: 'runner_id', as: 'items' });
    Runner.hasMany(models.PhaseTransition, { foreignKey: 'runner_id', as: 'transitions' });
    Runner.hasMany(models.DoorChoice, { foreignKey: 'runner_id', as: 'door_choices' });
    Runner.hasMany(models.DropEvent, { foreignKey: 'runner_id', as: 'drop_events' });
  };

  return Runner;
};
