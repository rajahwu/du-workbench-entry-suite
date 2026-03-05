'use strict';

module.exports = (sequelize, DataTypes) => {
  const CodexEntry = sequelize.define('CodexEntry', {
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
    codex_key: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'Unique lore entry identifier (e.g. lore_watchers_origin)',
    },
    unlocked_by_vessel: {
      type: DataTypes.ENUM('seraph', 'shadow', 'exile', 'penitent', 'rebel'),
      allowNull: true,
      comment: 'Which vessel class first unlocked this entry',
    },
    unlocked_at_depth: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'codex_entries',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'codex_key'],
        name: 'idx_unique_codex_per_user',
      },
    ],
  });

  CodexEntry.associate = (models) => {
    CodexEntry.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return CodexEntry;
};
