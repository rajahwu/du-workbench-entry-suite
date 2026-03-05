'use strict';

module.exports = (sequelize, DataTypes) => {
  const MetaCounter = sequelize.define('MetaCounter', {
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
    vessel_id: {
      type: DataTypes.ENUM('seraph', 'shadow', 'exile', 'penitent', 'rebel'),
      allowNull: false,
    },
    counter_name: {
      type: DataTypes.ENUM('confessions', 'breach', 'loops'),
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: { min: 0 },
    },
    last_incremented_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'meta_counters',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        // One counter per user per vessel per counter type
        unique: true,
        fields: ['user_id', 'vessel_id', 'counter_name'],
        name: 'idx_unique_meta_counter',
      },
    ],
  });

  MetaCounter.associate = (models) => {
    MetaCounter.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return MetaCounter;
};
