'use strict';

/**
 * DUDAEL — Initial Schema Migration
 * 
 * 17 tables across 4 domains:
 *   Identity:    users, runners, gate_locks
 *   Progress:    run_progress, inventories, inventory_items
 *   History:     phase_transitions, door_choices, drop_events
 *   Meta:        meta_counters, codex_entries
 *   Content:     vessels, vessel_mechanics, vessel_tags,
 *                cards, card_mechanics, card_tags,
 *                card_vessel_interactions, card_vessel_exclusions
 * 
 * Design principles:
 *   - Every game rule that can be enforced at schema level IS enforced.
 *   - Gate locks are insert-only (no updatedAt).
 *   - History tables are append-only (no updatedAt).
 *   - Users are soft-deleted (paranoid: true).
 *   - All UUIDs are V4, application-generated.
 *   - ENUMs are used for closed sets; strings for open sets.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { UUID, UUIDV4, STRING, TEXT, INTEGER, FLOAT, BOOLEAN, DATE, ENUM, NOW } = Sequelize;

    // ─── IDENTITY LAYER ────────────────────────────────────────────────

    await queryInterface.createTable('users', {
      id:                 { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      display_name:       { type: STRING(64), allowNull: true },
      color_mode:         { type: ENUM('dark', 'light', 'system'), defaultValue: 'dark' },
      telemetry_consent:  { type: BOOLEAN, defaultValue: false },
      supabase_uid:       { type: STRING(128), allowNull: true, unique: true },
      created_at:         { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at:         { type: DATE, allowNull: false, defaultValue: NOW },
      deleted_at:         { type: DATE, allowNull: true },
    });

    await queryInterface.createTable('runners', {
      id:                 { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      user_id:            { type: UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      run_id:             { type: STRING(128), allowNull: false, unique: true },
      display_name:       { type: STRING(64), allowNull: true, defaultValue: 'Wanderer' },
      vessel_id:          { type: ENUM('seraph', 'shadow', 'exile', 'penitent', 'rebel'), allowNull: true },
      sigil_key:          { type: STRING(64), allowNull: true },
      status:             { type: ENUM('active', 'completed', 'abandoned'), defaultValue: 'active' },
      started_at:         { type: DATE, defaultValue: NOW },
      ended_at:           { type: DATE, allowNull: true },
      created_at:         { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at:         { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.addIndex('runners', ['user_id'], { name: 'idx_runners_user' });
    await queryInterface.addIndex('runners', ['status'], { name: 'idx_runners_status' });

    await queryInterface.createTable('gate_locks', {
      id:                 { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      runner_id:          { type: UUID, allowNull: false, unique: true, references: { model: 'runners', key: 'id' }, onDelete: 'CASCADE' },
      guide:              { type: ENUM('light', 'dark'), allowNull: false },
      mode:               { type: ENUM('steward', 'solo'), allowNull: false },
      vessel_id:          { type: ENUM('seraph', 'shadow', 'exile', 'penitent', 'rebel'), allowNull: false },
      locked_at_phase:    { type: STRING(16), allowNull: false, defaultValue: '03_staging' },
      created_at:         { type: DATE, allowNull: false, defaultValue: NOW },
    });

    // ─── PROGRESS LAYER ────────────────────────────────────────────────

    await queryInterface.createTable('run_progress', {
      id:                 { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      runner_id:          { type: UUID, allowNull: false, unique: true, references: { model: 'runners', key: 'id' }, onDelete: 'CASCADE' },
      depth:              { type: INTEGER, defaultValue: 0, allowNull: false },
      loop_count:         { type: INTEGER, defaultValue: 0, allowNull: false },
      current_light:      { type: INTEGER, defaultValue: 0, allowNull: false },
      current_dark:       { type: INTEGER, defaultValue: 0, allowNull: false },
      insight:            { type: INTEGER, defaultValue: 0, allowNull: false },
      created_at:         { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at:         { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.createTable('inventories', {
      id:                 { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      runner_id:          { type: UUID, allowNull: false, unique: true, references: { model: 'runners', key: 'id' }, onDelete: 'CASCADE' },
      memory_fragments:   { type: INTEGER, defaultValue: 0, allowNull: false },
      created_at:         { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at:         { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.createTable('inventory_items', {
      id:                 { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      runner_id:          { type: UUID, allowNull: false, references: { model: 'runners', key: 'id' }, onDelete: 'CASCADE' },
      item_id:            { type: STRING(128), allowNull: false },
      item_type:          { type: ENUM('relic', 'card', 'candy'), allowNull: false },
      quantity:           { type: INTEGER, defaultValue: 1, allowNull: false },
      acquired_at_depth:  { type: INTEGER, allowNull: true },
      created_at:         { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.addIndex('inventory_items', ['runner_id', 'item_id', 'item_type'], {
      unique: true,
      name: 'idx_unique_non_stackable_items',
    });

    // ─── HISTORY LAYER ─────────────────────────────────────────────────

    await queryInterface.createTable('phase_transitions', {
      id:                   { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      runner_id:            { type: UUID, allowNull: false, references: { model: 'runners', key: 'id' }, onDelete: 'CASCADE' },
      from_phase:           { type: STRING(16), allowNull: false },
      to_phase:             { type: STRING(16), allowNull: false },
      wall_payload_kind:    { type: STRING(32), allowNull: false },
      depth_at_transition:  { type: INTEGER, allowNull: true },
      sequence_number:      { type: INTEGER, allowNull: false },
      created_at:           { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.addIndex('phase_transitions', ['runner_id', 'sequence_number'], {
      unique: true,
      name: 'idx_runner_sequence',
    });
    await queryInterface.addIndex('phase_transitions', ['runner_id', 'created_at'], {
      name: 'idx_runner_timeline',
    });

    await queryInterface.createTable('door_choices', {
      id:                 { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      runner_id:          { type: UUID, allowNull: false, references: { model: 'runners', key: 'id' }, onDelete: 'CASCADE' },
      depth:              { type: INTEGER, allowNull: false },
      choice:             { type: ENUM('light', 'dark', 'secret'), allowNull: false },
      light_at_choice:    { type: INTEGER, allowNull: true },
      dark_at_choice:     { type: INTEGER, allowNull: true },
      created_at:         { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.addIndex('door_choices', ['runner_id', 'depth'], {
      unique: true,
      name: 'idx_one_door_per_depth',
    });

    await queryInterface.createTable('drop_events', {
      id:                 { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      runner_id:          { type: UUID, allowNull: false, references: { model: 'runners', key: 'id' }, onDelete: 'CASCADE' },
      depth:              { type: INTEGER, allowNull: false },
      reason:             { type: ENUM('death', 'math_fail', 'exit'), allowNull: false },
      survived:           { type: BOOLEAN, allowNull: false, defaultValue: false },
      points:             { type: INTEGER, defaultValue: 0, allowNull: false },
      light_at_drop:      { type: INTEGER, allowNull: true },
      dark_at_drop:       { type: INTEGER, allowNull: true },
      fragments_awarded:  { type: INTEGER, defaultValue: 0, allowNull: false },
      loop_number:        { type: INTEGER, allowNull: false },
      created_at:         { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.addIndex('drop_events', ['runner_id'], { name: 'idx_drop_runner' });

    // ─── META-PROGRESSION LAYER ────────────────────────────────────────

    await queryInterface.createTable('meta_counters', {
      id:                   { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      user_id:              { type: UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      vessel_id:            { type: ENUM('seraph', 'shadow', 'exile', 'penitent', 'rebel'), allowNull: false },
      counter_name:         { type: ENUM('confessions', 'breach', 'loops'), allowNull: false },
      count:                { type: INTEGER, defaultValue: 0, allowNull: false },
      last_incremented_at:  { type: DATE, allowNull: true },
      created_at:           { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at:           { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.addIndex('meta_counters', ['user_id', 'vessel_id', 'counter_name'], {
      unique: true,
      name: 'idx_unique_meta_counter',
    });

    await queryInterface.createTable('codex_entries', {
      id:                   { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      user_id:              { type: UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
      codex_key:            { type: STRING(128), allowNull: false },
      unlocked_by_vessel:   { type: ENUM('seraph', 'shadow', 'exile', 'penitent', 'rebel'), allowNull: true },
      unlocked_at_depth:    { type: INTEGER, allowNull: true },
      created_at:           { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.addIndex('codex_entries', ['user_id', 'codex_key'], {
      unique: true,
      name: 'idx_unique_codex_per_user',
    });

    // ─── CONTENT LAYER ─────────────────────────────────────────────────

    await queryInterface.createTable('vessels', {
      id:               { type: STRING(16), primaryKey: true },
      display_name:     { type: STRING(32), allowNull: false },
      short_label:      { type: STRING(4), allowNull: false },
      subtitle:         { type: STRING(64), allowNull: true },
      alignment:        { type: ENUM('light', 'dark', 'balanced'), allowNull: false },
      draft_bias:       { type: ENUM('light', 'dark', 'neutral'), allowNull: false },
      starting_light:   { type: INTEGER, allowNull: false },
      starting_dark:    { type: INTEGER, allowNull: false },
      max_health:       { type: INTEGER, allowNull: false },
      hand_size:        { type: INTEGER, allowNull: false },
      engine_note:      { type: STRING(256), allowNull: true },
      theology:         { type: TEXT, allowNull: true },
      playstyle:        { type: TEXT, allowNull: true },
      primary_hue:      { type: STRING(7), allowNull: true },
      created_at:       { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at:       { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.createTable('vessel_mechanics', {
      id:               { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      vessel_id:        { type: STRING(16), allowNull: false, references: { model: 'vessels', key: 'id' }, onDelete: 'CASCADE' },
      mechanic_key:     { type: STRING(64), allowNull: false },
      value_numeric:    { type: FLOAT, allowNull: true },
      value_string:     { type: STRING(64), allowNull: true },
      value_boolean:    { type: BOOLEAN, allowNull: true },
      created_at:       { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at:       { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.addIndex('vessel_mechanics', ['vessel_id', 'mechanic_key'], {
      unique: true,
      name: 'idx_unique_vessel_mechanic',
    });

    await queryInterface.createTable('vessel_tags', {
      id:               { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      vessel_id:        { type: STRING(16), allowNull: false, references: { model: 'vessels', key: 'id' }, onDelete: 'CASCADE' },
      tag:              { type: STRING(32), allowNull: false },
    });

    await queryInterface.addIndex('vessel_tags', ['vessel_id', 'tag'], {
      unique: true,
      name: 'idx_unique_vessel_tag',
    });

    await queryInterface.createTable('cards', {
      id:                   { type: STRING(64), primaryKey: true },
      name:                 { type: STRING(128), allowNull: false },
      keeper:               { type: ENUM('surveyor', 'smuggler'), allowNull: false },
      lore:                 { type: TEXT, allowNull: false },
      quote:                { type: STRING(256), allowNull: false },
      quote_attribution:    { type: STRING(128), allowNull: true },
      rarity:               { type: ENUM('common', 'uncommon', 'rare', 'relic'), defaultValue: 'common', allowNull: false },
      depth_min:            { type: INTEGER, allowNull: true },
      depth_max:            { type: INTEGER, allowNull: true },
      created_at:           { type: DATE, allowNull: false, defaultValue: NOW },
      updated_at:           { type: DATE, allowNull: false, defaultValue: NOW },
    });

    await queryInterface.createTable('card_mechanics', {
      id:                     { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      card_id:                { type: STRING(64), allowNull: false, unique: true, references: { model: 'cards', key: 'id' }, onDelete: 'CASCADE' },
      light_delta:            { type: INTEGER, defaultValue: 0 },
      dark_delta:             { type: INTEGER, defaultValue: 0 },
      stability_delta:        { type: INTEGER, defaultValue: 0 },
      heal:                   { type: INTEGER, defaultValue: 0 },
      points:                 { type: INTEGER, defaultValue: 0 },
      depth_mod:              { type: INTEGER, defaultValue: 0 },
      hand_size_mod:          { type: INTEGER, defaultValue: 0 },
      keeper_favor_keeper:    { type: ENUM('surveyor', 'smuggler'), allowNull: true },
      keeper_favor_amount:    { type: INTEGER, allowNull: true },
    });

    await queryInterface.createTable('card_tags', {
      id:               { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      card_id:          { type: STRING(64), allowNull: false, references: { model: 'cards', key: 'id' }, onDelete: 'CASCADE' },
      tag:              { type: STRING(32), allowNull: false },
    });

    await queryInterface.addIndex('card_tags', ['card_id', 'tag'], {
      unique: true,
      name: 'idx_unique_card_tag',
    });

    await queryInterface.createTable('card_vessel_interactions', {
      id:                       { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      card_id:                  { type: STRING(64), allowNull: false, references: { model: 'cards', key: 'id' }, onDelete: 'CASCADE' },
      vessel_id:                { type: STRING(16), allowNull: false, references: { model: 'vessels', key: 'id' }, onDelete: 'CASCADE' },
      light_delta_override:     { type: INTEGER, allowNull: true },
      dark_delta_override:      { type: INTEGER, allowNull: true },
      stability_delta_override: { type: INTEGER, allowNull: true },
      heal_override:            { type: INTEGER, allowNull: true },
      points_override:          { type: INTEGER, allowNull: true },
      additional_effect:        { type: STRING(256), allowNull: true },
    });

    await queryInterface.addIndex('card_vessel_interactions', ['card_id', 'vessel_id'], {
      unique: true,
      name: 'idx_unique_card_vessel',
    });

    await queryInterface.createTable('card_vessel_exclusions', {
      id:               { type: UUID, defaultValue: UUIDV4, primaryKey: true },
      card_id:          { type: STRING(64), allowNull: false, references: { model: 'cards', key: 'id' }, onDelete: 'CASCADE' },
      vessel_id:        { type: STRING(16), allowNull: false, references: { model: 'vessels', key: 'id' }, onDelete: 'CASCADE' },
    });

    await queryInterface.addIndex('card_vessel_exclusions', ['card_id', 'vessel_id'], {
      unique: true,
      name: 'idx_unique_card_vessel_exclusion',
    });
  },

  async down(queryInterface) {
    // Drop in reverse dependency order
    await queryInterface.dropTable('card_vessel_exclusions');
    await queryInterface.dropTable('card_vessel_interactions');
    await queryInterface.dropTable('card_tags');
    await queryInterface.dropTable('card_mechanics');
    await queryInterface.dropTable('cards');
    await queryInterface.dropTable('vessel_tags');
    await queryInterface.dropTable('vessel_mechanics');
    await queryInterface.dropTable('vessels');
    await queryInterface.dropTable('codex_entries');
    await queryInterface.dropTable('meta_counters');
    await queryInterface.dropTable('drop_events');
    await queryInterface.dropTable('door_choices');
    await queryInterface.dropTable('phase_transitions');
    await queryInterface.dropTable('inventory_items');
    await queryInterface.dropTable('inventories');
    await queryInterface.dropTable('run_progress');
    await queryInterface.dropTable('gate_locks');
    await queryInterface.dropTable('runners');
    await queryInterface.dropTable('users');
  }
};
