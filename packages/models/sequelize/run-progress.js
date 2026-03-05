'use strict';

module.exports = (sequelize, DataTypes) => {
  const RunProgress = sequelize.define('RunProgress', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    runner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true, // one progress row per run
      references: { model: 'runners', key: 'id' },
    },
    depth: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: { min: 0 },
    },
    loop_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: { min: 0 },
    },
    current_light: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    current_dark: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    insight: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: { min: 0, max: 3 },
      comment: 'Penitent accumulates via lore reading. 0-3 scale.',
    },
  }, {
    tableName: 'run_progress',
    underscored: true,
    timestamps: true,
  });

  RunProgress.associate = (models) => {
    RunProgress.belongsTo(models.Runner, { foreignKey: 'runner_id', as: 'runner' });
  };

  return RunProgress;
};
