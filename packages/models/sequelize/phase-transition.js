'use strict';

module.exports = (sequelize, DataTypes) => {
  const PhaseTransition = sequelize.define('PhaseTransition', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    runner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'runners', key: 'id' },
    },
    from_phase: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    to_phase: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    wall_payload_kind: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: 'Maps to PhaseWallPayload.kind — e.g. title->select, select->staging',
    },
    depth_at_transition: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Snapshot of current depth when transition occurred',
    },
    sequence_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Monotonically increasing per runner — position in phase trail',
    },
  }, {
    tableName: 'phase_transitions',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ['runner_id', 'sequence_number'],
        unique: true,
        name: 'idx_runner_sequence',
      },
      {
        fields: ['runner_id', 'created_at'],
        name: 'idx_runner_timeline',
      },
    ],
  });

  PhaseTransition.associate = (models) => {
    PhaseTransition.belongsTo(models.Runner, { foreignKey: 'runner_id', as: 'runner' });
  };

  return PhaseTransition;
};
