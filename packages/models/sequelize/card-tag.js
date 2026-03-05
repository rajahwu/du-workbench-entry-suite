'use strict';

module.exports = (sequelize, DataTypes) => {
  const CardTag = sequelize.define('CardTag', {
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
    tag: {
      type: DataTypes.STRING(32),
      allowNull: false,
      comment: 'STABILITY, RISK, SANCTIFIED, CORRUPTION, SEALED, RELIC, THRESHOLD, ECHO',
    },
  }, {
    tableName: 'card_tags',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['card_id', 'tag'],
        name: 'idx_unique_card_tag',
      },
    ],
  });

  CardTag.associate = (models) => {
    CardTag.belongsTo(models.Card, { foreignKey: 'card_id', as: 'card' });
  };

  return CardTag;
};
