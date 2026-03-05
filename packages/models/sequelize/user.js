'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    display_name: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    color_mode: {
      type: DataTypes.ENUM('dark', 'light', 'system'),
      defaultValue: 'dark',
    },
    telemetry_consent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Supabase auth UID — nullable for guest/local users
    supabase_uid: {
      type: DataTypes.STRING(128),
      allowNull: true,
      unique: true,
    },
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    paranoid: true, // soft delete — never lose a player
  });

  User.associate = (models) => {
    User.hasMany(models.Runner, { foreignKey: 'user_id', as: 'runners' });
    User.hasMany(models.MetaCounter, { foreignKey: 'user_id', as: 'meta_counters' });
    User.hasMany(models.CodexEntry, { foreignKey: 'user_id', as: 'codex_entries' });
  };

  return User;
};
