'use strict';

const { v4: uuidv4 } = require('uuid');

// ─── VESSEL SEED DATA ──────────────────────────────────────────────
// Source of truth: data/vessels/vessels.ts + data/vessels/data.ts

const vessels = [
  {
    id: 'seraph', display_name: 'The Seraph', short_label: 'I', subtitle: 'the burning ones',
    alignment: 'light', draft_bias: 'light', starting_light: 3, starting_dark: 0,
    max_health: 10, hand_size: 2, primary_hue: '#D4A843',
    engine_note: 'High Light start. Dark voices are most destabilizing.',
    theology: 'Six-winged throne guardians. Their proximity to the source burns away impurity — or annihilates those too fragile to withstand it. In the Dudael Drop, a Seraph vessel channels light as both weapon and liability.',
    playstyle: 'High-light aggressive. Cards skew toward sanctified damage and purification effects. Vulnerable in deep Dark zones but devastating in Light-dominant encounters.',
  },
  {
    id: 'shadow', display_name: 'The Shadow', short_label: 'II', subtitle: 'the hidden ones',
    alignment: 'dark', draft_bias: 'dark', starting_light: 0, starting_dark: 3,
    max_health: 10, hand_size: 2, primary_hue: '#7B4FA2',
    engine_note: 'Absorbs Risk cards. Miss forgiveness every 3rd hit.',
    theology: 'Those who chose to dwell between the cracks. Shadow vessels operate in the negative space of the theological order — not fallen, but absent. In Dudael, they exploit blind spots in both Light and Dark systems.',
    playstyle: 'Stealth-oriented Dark specialist. Cards emphasize evasion, misdirection, and exploiting opponent positioning. Thrives in ambiguity, struggles in direct confrontation.',
  },
  {
    id: 'exile', display_name: 'The Exile', short_label: 'III', subtitle: 'the displaced ones',
    alignment: 'balanced', draft_bias: 'neutral', starting_light: 2, starting_dark: 2,
    max_health: 10, hand_size: 2, primary_hue: '#8BA0B5',
    engine_note: 'Balanced. Adaptive. Mechanics reflect removal, not choice.',
    theology: 'Neither aligned nor condemned. Exile vessels were stripped of their original assignment and exist in a state of jurisdictional limbo. In Dudael, they adapt to whatever parity the Depth demands.',
    playstyle: 'Adaptive generalist. Cards can shift between Light and Dark depending on context. No ceiling advantage but no floor weakness — the balanced survivor.',
  },
  {
    id: 'penitent', display_name: 'The Penitent', short_label: 'IV', subtitle: 'the bowed ones',
    alignment: 'light', draft_bias: 'neutral', starting_light: 3, starting_dark: 1,
    max_health: 12, hand_size: 2, primary_hue: '#D4A04A',
    engine_note: 'Reads the record. Insight unlocks card clarity in Draft.',
    theology: 'Former transgressors seeking restoration through descent. The Penitent enters Dudael voluntarily as an act of atonement — the Drop is their liturgy. Each Depth cleared is a step toward rehabilitation.',
    playstyle: 'Endurance tank with Light lean. Cards emphasize absorption, sacrifice effects, and gradual Light accumulation. Slow but incredibly durable across long Depth runs.',
  },
  {
    id: 'rebel', display_name: 'The Rebel', short_label: 'V', subtitle: 'the defiant ones',
    alignment: 'dark', draft_bias: 'dark', starting_light: 1, starting_dark: 3,
    max_health: 8, hand_size: 3, primary_hue: '#C04050',
    engine_note: 'Chose the Drop. High Dark start. High risk, high reward.',
    theology: 'Those who rejected both the original order and the quarantine. Rebel vessels view Dudael not as containment but as a system to be broken. Their descent is not penance — it is siege.',
    playstyle: 'Aggressive Dark-leaning disruptor. Cards emphasize breaking enemy defenses, parity manipulation, and high-risk/high-reward plays. Glass cannon with momentum mechanics.',
  },
];

const vesselTags = {
  seraph:   ['SANCTIFIED', 'HIGH-LIGHT', 'PURIFIER'],
  shadow:   ['QUARANTINE', 'HIGH-DARK', 'INFILTRATOR'],
  exile:    ['CONTAINMENT', 'NEUTRAL', 'ADAPTIVE'],
  penitent: ['EVIDENCE', 'MED-LIGHT', 'ENDURANCE'],
  rebel:    ['BREACH', 'MED-DARK', 'DISRUPTOR'],
};

// Key-value mechanics from vessels.ts VesselMechanics
const vesselMechanics = {
  seraph: [
    { key: 'extra_light_pool_cards', numeric: 1 },
    { key: 'timer_multiplier', numeric: 1.0 },
  ],
  shadow: [
    { key: 'extra_dark_pool_cards', numeric: 1 },
    { key: 'miss_forgiveness_every_n', numeric: 3 },
    { key: 'timer_multiplier', numeric: 1.0 },
  ],
  exile: [
    { key: 'timer_multiplier', numeric: 1.0 },
  ],
  penitent: [
    { key: 'uses_insight', boolean: true },
    { key: 'insight_read_threshold_secs', numeric: 2.5 },
    { key: 'insight_cap', numeric: 3 },
    { key: 'timer_multiplier', numeric: 0.85 },
    { key: 'perfect_level_heal', numeric: 1 },
    { key: 'show_door_cost_breakdown', boolean: true },
    { key: 'meta_counter', string: 'confessions' },
    { key: 'meta_counter_condition', string: 'insight_gt_0' },
    { key: 'meta_unlock_threshold', numeric: 3 },
  ],
  rebel: [
    { key: 'extra_dark_pool_cards', numeric: 1 },
    { key: 'extra_points_per_hit', numeric: 1 },
    { key: 'extra_damage_per_miss', numeric: 1 },
    { key: 'dark_door_cost_mod', numeric: -1 },
    { key: 'light_door_cost_mod', numeric: 1 },
    { key: 'secret_door_threshold', numeric: 2 },
    { key: 'shows_instability', boolean: true },
    { key: 'instability_threshold', numeric: 3 },
    { key: 'meta_counter', string: 'breach' },
    { key: 'meta_counter_condition', string: 'dark_gt_light_plus_3' },
    { key: 'meta_unlock_threshold', numeric: 3 },
  ],
};

// ─── CARD SEED DATA ────────────────────────────────────────────────
// Source of truth: data/cards/pool.ts + data/cards/types.ts

const cards = [
  // Light pool
  { id: 'card_sanctum_ward', name: 'Sanctum Ward', keeper: 'surveyor', rarity: 'common',
    lore: 'A ward of light pressed into the walls of the upper passages.',
    quote: 'Hold this close.', quote_attribution: null, depth_min: null, depth_max: null,
    mechanics: { light_delta: 2 }, tags: ['STABILITY'] },

  { id: 'card_grace_thread', name: 'Grace Thread', keeper: 'surveyor', rarity: 'common',
    lore: 'A thin filament of sanctified weave, carried since before the sealing.',
    quote: 'Even threads hold weight.', quote_attribution: null, depth_min: null, depth_max: null,
    mechanics: { light_delta: 1 }, tags: ['STABILITY'] },

  { id: 'card_beacon_pulse', name: 'Beacon Pulse', keeper: 'surveyor', rarity: 'common',
    lore: "A burst of light from the Surveyor's own reserves. Brief, blinding.",
    quote: 'See everything. Once.', quote_attribution: null, depth_min: null, depth_max: null,
    mechanics: { light_delta: 3 }, tags: ['SANCTIFIED'] },

  { id: 'card_covenant_seal', name: 'Covenant Seal', keeper: 'surveyor', rarity: 'common',
    lore: 'A seal pressed by the old order. It still holds a charge.',
    quote: 'The covenant endures.', quote_attribution: null, depth_min: null, depth_max: null,
    mechanics: { light_delta: 1, heal: 1 }, tags: ['STABILITY', 'SANCTIFIED'] },

  { id: 'card_lantern_threshold', name: 'Lantern at the Threshold', keeper: 'surveyor', rarity: 'common',
    lore: 'A small flame held steady against the descent. The Surveyor marks this as a sanctified offering—once carried by those who walked the upper rings before the quarantine.',
    quote: 'It still burns.', quote_attribution: 'The Surveyor, on the night of the first sealing',
    depth_min: 1, depth_max: 4,
    mechanics: { light_delta: 2, stability_delta: 1, heal: 1 }, tags: ['STABILITY', 'SANCTIFIED'],
    vessel_interactions: [
      { vessel_id: 'penitent', light_delta_override: 3, additional_effect: 'Insight increased by 1 for next Staging visit.' },
      { vessel_id: 'rebel', stability_delta_override: 0, additional_effect: 'Stability bonus negated. The flame flickers.' },
    ]},

  // Dark pool
  { id: 'card_root_cutters_venom', name: "Root-Cutter's Venom", keeper: 'smuggler', rarity: 'common',
    lore: 'Distilled from the root systems below the containment grid.',
    quote: 'It burns differently down here.', quote_attribution: null, depth_min: null, depth_max: null,
    mechanics: { dark_delta: 2 }, tags: ['CORRUPTION'] },

  { id: 'card_veil_fragment', name: 'Veil Fragment', keeper: 'smuggler', rarity: 'common',
    lore: 'A shard of the veil between levels. The Smuggler trades in these.',
    quote: 'Every crack is a door.', quote_attribution: null, depth_min: null, depth_max: null,
    mechanics: { dark_delta: 1 }, tags: ['RISK'] },

  { id: 'card_abyssal_echo', name: 'Abyssal Echo', keeper: 'smuggler', rarity: 'common',
    lore: 'A sound that returns from depths no vessel has survived.',
    quote: 'It called your name.', quote_attribution: null, depth_min: null, depth_max: null,
    mechanics: { dark_delta: 3 }, tags: ['CORRUPTION', 'RISK'] },

  { id: 'card_smugglers_cut', name: "Smuggler's Cut", keeper: 'smuggler', rarity: 'common',
    lore: "The Smuggler skims from every transaction. This is the fee.",
    quote: 'Everyone pays.', quote_attribution: null, depth_min: null, depth_max: null,
    mechanics: { dark_delta: 1, points: 2 }, tags: ['CORRUPTION'] },

  { id: 'card_root_whisper', name: 'Root-Whisper', keeper: 'smuggler', rarity: 'uncommon',
    lore: "Voices from below the containment grid. The Smuggler knows their language—most do not survive learning it.",
    quote: 'Listen closely. Once.', quote_attribution: 'Unknown. The record was sealed.',
    depth_min: 1, depth_max: 5,
    mechanics: { dark_delta: 3, stability_delta: -1, points: 2 }, tags: ['RISK', 'CORRUPTION'],
    vessel_interactions: [
      { vessel_id: 'shadow', stability_delta_override: 0, additional_effect: 'The voices are familiar. Stability cost negated.' },
      { vessel_id: 'seraph', stability_delta_override: -2, additional_effect: 'The voices are unbearable. Stability cost doubled.' },
    ]},
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {

    // ── Vessels ──
    const now = new Date();
    await queryInterface.bulkInsert('vessels',
      vessels.map(v => ({ ...v, created_at: now, updated_at: now }))
    );

    // ── Vessel Tags ──
    const tagRows = [];
    for (const [vid, tags] of Object.entries(vesselTags)) {
      for (const tag of tags) {
        tagRows.push({ id: uuidv4(), vessel_id: vid, tag });
      }
    }
    await queryInterface.bulkInsert('vessel_tags', tagRows);

    // ── Vessel Mechanics ──
    const mechRows = [];
    for (const [vid, mechs] of Object.entries(vesselMechanics)) {
      for (const m of mechs) {
        mechRows.push({
          id: uuidv4(),
          vessel_id: vid,
          mechanic_key: m.key,
          value_numeric: m.numeric ?? null,
          value_string: m.string ?? null,
          value_boolean: m.boolean ?? null,
          created_at: now,
          updated_at: now,
        });
      }
    }
    await queryInterface.bulkInsert('vessel_mechanics', mechRows);

    // ── Cards ──
    await queryInterface.bulkInsert('cards',
      cards.map(c => ({
        id: c.id, name: c.name, keeper: c.keeper, rarity: c.rarity,
        lore: c.lore, quote: c.quote, quote_attribution: c.quote_attribution,
        depth_min: c.depth_min, depth_max: c.depth_max,
        created_at: now, updated_at: now,
      }))
    );

    // ── Card Mechanics ──
    await queryInterface.bulkInsert('card_mechanics',
      cards.map(c => ({
        id: uuidv4(),
        card_id: c.id,
        light_delta: c.mechanics.light_delta ?? 0,
        dark_delta: c.mechanics.dark_delta ?? 0,
        stability_delta: c.mechanics.stability_delta ?? 0,
        heal: c.mechanics.heal ?? 0,
        points: c.mechanics.points ?? 0,
        depth_mod: c.mechanics.depth_mod ?? 0,
        hand_size_mod: c.mechanics.hand_size_mod ?? 0,
        keeper_favor_keeper: c.mechanics.keeper_favor_keeper ?? null,
        keeper_favor_amount: c.mechanics.keeper_favor_amount ?? null,
      }))
    );

    // ── Card Tags ──
    const cardTagRows = [];
    for (const c of cards) {
      for (const tag of c.tags) {
        cardTagRows.push({ id: uuidv4(), card_id: c.id, tag });
      }
    }
    await queryInterface.bulkInsert('card_tags', cardTagRows);

    // ── Card Vessel Interactions ──
    const interactionRows = [];
    for (const c of cards) {
      if (!c.vessel_interactions) continue;
      for (const vi of c.vessel_interactions) {
        interactionRows.push({
          id: uuidv4(),
          card_id: c.id,
          vessel_id: vi.vessel_id,
          light_delta_override: vi.light_delta_override ?? null,
          dark_delta_override: vi.dark_delta_override ?? null,
          stability_delta_override: vi.stability_delta_override ?? null,
          heal_override: vi.heal_override ?? null,
          points_override: vi.points_override ?? null,
          additional_effect: vi.additional_effect ?? null,
        });
      }
    }
    if (interactionRows.length > 0) {
      await queryInterface.bulkInsert('card_vessel_interactions', interactionRows);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('card_vessel_interactions', null, {});
    await queryInterface.bulkDelete('card_tags', null, {});
    await queryInterface.bulkDelete('card_mechanics', null, {});
    await queryInterface.bulkDelete('cards', null, {});
    await queryInterface.bulkDelete('vessel_mechanics', null, {});
    await queryInterface.bulkDelete('vessel_tags', null, {});
    await queryInterface.bulkDelete('vessels', null, {});
  }
};
