-- ============================================================================
-- DUDAEL: LITE GAME CONTENT SEED SCRIPT
-- ============================================================================
-- Purpose: Initialize game content (levels, cards, skills)
-- Tables: levels, cards, skills, card_tags
-- Version: 1.0.0
-- Date: March 5, 2026
-- ============================================================================

-- Drop existing tables if re-seeding
DROP TABLE IF EXISTS card_tags CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS levels CASCADE;

-- ============================================================================
-- TABLE: levels (Level Container Cartridges)
-- ============================================================================

CREATE TABLE levels (
    id SERIAL PRIMARY KEY,
    level_name VARCHAR(100) NOT NULL UNIQUE,
    level_type VARCHAR(50) NOT NULL CHECK (level_type IN ('choice', 'combat', 'puzzle', 'narrative', 'rest')),
    description TEXT,
    
    -- Hourglass Architecture
    entry_data JSONB,  -- What data this level needs on entry
    exit_data JSONB,   -- What data this level returns on exit
    
    -- Parity Effects
    light_delta INTEGER DEFAULT 0,  -- How this level shifts Light parity
    dark_delta INTEGER DEFAULT 0,   -- How this level shifts Dark parity
    
    -- Requirements
    min_depth INTEGER DEFAULT 1,
    max_depth INTEGER,
    required_alignment VARCHAR(20) CHECK (required_alignment IN ('light', 'dark', 'threshold', 'any')),
    
    -- Metadata
    lore_context TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Starter Levels (Depth 1-3)
INSERT INTO levels (level_name, level_type, description, entry_data, exit_data, light_delta, dark_delta, min_depth, max_depth, required_alignment, lore_context) VALUES
(
    'The Threshold Chamber',
    'narrative',
    'Your first step into Dudael. A liminal space where reality becomes uncertain. Choose how you perceive the containment.',
    '{"requires": ["vessel_id"], "optional": ["alignment"]}',
    '{"returns": ["parity_snapshot", "threshold_acknowledged"]}',
    0,
    0,
    1,
    1,
    'any',
    'The Threshold is neither punishment nor mercy—it is measurement. Every angel who enters is documented, their state preserved as forensic evidence.'
),
(
    'Light Chamber: The Sanctum',
    'choice',
    'A room flooded with clinical brightness. Everything is visible, measured, documented. The Light reveals all—even what you wish remained hidden.',
    '{"requires": ["vessel_id", "current_parity"], "optional": ["hp"]}',
    '{"returns": ["light_choice_made", "parity_shift", "revelation_fragment"]}',
    15,
    -5,
    2,
    5,
    'any',
    'The Sanctum is where truth is extracted through radiance. Nothing can hide from forensic Light—not guilt, not intent, not the weight of abandonment.'
),
(
    'Dark Chamber: The Concealment',
    'choice',
    'A room swallowed by violet shadow. What cannot be seen cannot be judged. The Dark offers refuge from scrutiny—and from truth.',
    '{"requires": ["vessel_id", "current_parity"], "optional": ["hp"]}',
    '{"returns": ["dark_choice_made", "parity_shift", "shadow_fragment"]}',
    -5,
    15,
    2,
    5,
    'any',
    'The Concealment is where angels withdraw from divine gaze. In darkness, choices are made without witness—but the containment records even absence.'
),
(
    'Crossroads: Three Paths',
    'choice',
    'Three doors stand before you. Light (amber glow), Dark (violet glow), Secret (unstable gray). Each path costs more as you descend deeper.',
    '{"requires": ["vessel_id", "current_depth", "current_parity"], "optional": ["door_history"]}',
    '{"returns": ["door_chosen", "parity_snapshot", "depth_increment"]}',
    0,
    0,
    1,
    NULL,
    'any',
    'The Crossroads is the heart of the Drop. Every door choice is irreversible, every path a theological commitment. The Secret door appears only to those balanced perfectly between Light and Dark.'
),
(
    'Rest: The Staging Echo',
    'rest',
    'A fragment of the Staging Area bleeds into the descent. Catch your breath. The Guides watch from a distance but cannot intervene here.',
    '{"requires": ["vessel_id", "current_hp"], "optional": ["memory_fragments"]}',
    '{"returns": ["hp_restored", "cards_refreshed", "staging_memory"]}',
    0,
    0,
    3,
    NULL,
    'any',
    'Rest chambers are echoes of surfaces—reminders that escape is theoretically possible. But depth has gravity. Few who descend this far ever return.'
);

-- ============================================================================
-- TABLE: cards (Draft Phase Cards)
-- ============================================================================

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    card_name VARCHAR(100) NOT NULL UNIQUE,
    card_type VARCHAR(50) NOT NULL CHECK (card_type IN ('action', 'reaction', 'passive', 'curse', 'blessing')),
    description TEXT NOT NULL,
    
    -- Parity Effects
    light_delta INTEGER DEFAULT 0,
    dark_delta INTEGER DEFAULT 0,
    
    -- Mechanical Effects
    hp_effect INTEGER DEFAULT 0,
    hand_size_effect INTEGER DEFAULT 0,
    special_effect JSONB,
    
    -- Cost and Rarity
    draft_cost INTEGER DEFAULT 0,  -- Cost in insight or other currency
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'mythic')),
    
    -- Flavor
    flavor_text TEXT,
    lore_reference TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

-- Common Light Cards
INSERT INTO cards (card_name, card_type, description, light_delta, dark_delta, hp_effect, rarity, flavor_text, lore_reference) VALUES
('Radiant Shield', 'reaction', 'Block incoming damage. Gain +5 Light parity.', 5, 0, 0, 'common', 'The Light does not ask permission to reveal.', 'Seraph doctrine'),
('Divine Measurement', 'action', 'Examine enemy weaknesses. Gain +3 Light parity.', 3, 0, 0, 'common', 'To measure is to know. To know is to control.', 'Surveyor teaching'),
('Confession', 'action', 'Reveal hidden information. Gain +4 Light parity. Lose 5 HP.', 4, 0, -5, 'common', 'Truth has weight. Bearing it costs blood.', 'Penitent burden');

-- Common Dark Cards
INSERT INTO cards (card_name, card_type, description, light_delta, dark_delta, hp_effect, rarity, flavor_text, lore_reference) VALUES
('Shadow Step', 'reaction', 'Evade incoming attack. Gain +5 Dark parity.', 0, 5, 0, 'common', 'What cannot be seen cannot be struck.', 'Shadow technique'),
('Concealed Intent', 'passive', 'Your next action cannot be predicted. Gain +3 Dark parity.', 0, 3, 0, 'common', 'The Watchers taught us to hide from the Most High.', 'Fallen angel wisdom'),
('Defiant Strike', 'action', 'Deal heavy damage. Gain +4 Dark parity. Take 3 damage.', 0, 4, -3, 'common', 'To rebel is to bleed. Worth it.', 'Rebel creed');

-- Uncommon Threshold Cards
INSERT INTO cards (card_name, card_type, description, light_delta, dark_delta, hp_effect, rarity, flavor_text, lore_reference) VALUES
('Broken Chain', 'action', 'Remove one status effect. Shift parity toward balance (±5 toward 0:0).', 0, 0, 0, 'uncommon', 'The chain that bound you to your habitation is gone. The weight remains.', 'Exile understanding'),
('Liminal Walk', 'passive', 'Reduce cost of Secret doors by 10. Gain +2 Light, +2 Dark.', 2, 2, 0, 'uncommon', 'Those who walk the threshold belong nowhere—and everywhere.', 'Threshold doctrine'),
('Forensic Clarity', 'action', 'View hidden information about next 2 encounters. No parity shift.', 0, 0, 0, 'uncommon', 'The containment system records everything. You just need to know where to look.', 'Smuggler tip');

-- Rare Power Cards
INSERT INTO cards (card_name, card_type, description, light_delta, dark_delta, special_effect, rarity, flavor_text, lore_reference) VALUES
(
    'Angelic Recall',
    'action',
    'Return to a previous parity state from 3 turns ago. Restore that HP total.',
    0,
    0,
    '{"effect": "time_reversal", "turns": 3, "restores": ["parity", "hp"]}',
    'rare',
    'Some angels remember what it was like before the Fall. The memory is sharp enough to cut.',
    'Watchers gift'
),
(
    'Covenant Break',
    'curse',
    'Permanently lose 10 max HP. Gain +15 Dark parity. Unlock forbidden knowledge.',
    0,
    15,
    '{"effect": "max_hp_reduction", "amount": 10, "grants": "forbidden_knowledge"}',
    'rare',
    'Jude 1:6 — they did not keep their proper habitation. This is the cost.',
    'Oiketrion violation'
),
(
    'Seraphic Witness',
    'blessing',
    'For 3 turns, all Light cards cost 0. Gain +20 Light parity over 3 turns.',
    20,
    0,
    '{"effect": "cost_reduction", "duration": 3, "card_type": "light"}',
    'rare',
    'The Seraphim never fell. They watch, record, and testify. Their gaze is power.',
    'Seraph gift'
);

-- Mythic Cards
INSERT INTO cards (card_name, card_type, description, light_delta, dark_delta, hp_effect, special_effect, rarity, flavor_text, lore_reference) VALUES
(
    'The Drop Itself',
    'action',
    'End current run immediately. Gain maximum Memory Fragments. Write all progress to meta.',
    0,
    0,
    -999,
    '{"effect": "forced_drop", "grants": "max_memory_fragments", "writes": "full_meta"}',
    'mythic',
    'Sometimes the only way forward is down. Sometimes down is the point.',
    'Dudael core truth'
);

-- ============================================================================
-- TABLE: card_tags (Many-to-Many Relationship)
-- ============================================================================

CREATE TABLE card_tags (
    card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (card_id, tag)
);

-- Tag Cards for Filtering/Discovery
INSERT INTO card_tags (card_id, tag) VALUES
(1, 'defense'), (1, 'light'),
(2, 'utility'), (2, 'light'),
(3, 'sacrifice'), (3, 'light'),
(4, 'evasion'), (4, 'dark'),
(5, 'stealth'), (5, 'dark'),
(6, 'aggression'), (6, 'dark'),
(7, 'cleanse'), (7, 'threshold'),
(8, 'navigation'), (8, 'threshold'),
(9, 'insight'), (9, 'threshold'),
(10, 'time'), (10, 'power'),
(11, 'curse'), (11, 'forbidden'),
(12, 'blessing'), (12, 'divine'),
(13, 'meta'), (13, 'endgame');

-- ============================================================================
-- TABLE: skills (Bound-Specific Abilities)
-- ============================================================================

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    bound_vessel VARCHAR(50) REFERENCES bounds(vessel_name),
    description TEXT NOT NULL,
    cooldown INTEGER DEFAULT 0,  -- Turns before can use again
    special_effect JSONB,
    lore_flavor TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seraph Skills
INSERT INTO skills (skill_name, bound_vessel, description, cooldown, special_effect, lore_flavor) VALUES
(
    'Radiant Testimony',
    'Seraph',
    'Force all hidden information to be revealed for 2 turns. Gain +10 Light parity.',
    5,
    '{"effect": "reveal_all", "duration": 2, "light_delta": 10}',
    'The Seraph are witnesses. Their testimony compels truth.'
),
(
    'Divine Aegis',
    'Seraph',
    'Create shield that absorbs next 30 damage. Gain +5 Light parity.',
    3,
    '{"effect": "shield", "amount": 30, "light_delta": 5}',
    'Obedience is its own protection.'
);

-- Shadow Skills
INSERT INTO skills (skill_name, bound_vessel, description, cooldown, special_effect, lore_flavor) VALUES
(
    'Vanish',
    'Shadow',
    'Become untargetable for 1 turn. Gain +10 Dark parity.',
    4,
    '{"effect": "untargetable", "duration": 1, "dark_delta": 10}',
    'What never existed cannot be contained.'
),
(
    'Shadow Duplicate',
    'Shadow',
    'Create decoy that draws attacks. Lasts 2 turns. Gain +5 Dark parity.',
    3,
    '{"effect": "decoy", "duration": 2, "dark_delta": 5}',
    'The Shadow prefers misdirection to confrontation.'
);

-- Exile Skills
INSERT INTO skills (skill_name, bound_vessel, description, cooldown, special_effect, lore_flavor) VALUES
(
    'Threshold Shift',
    'Exile',
    'Instantly balance your parity to 0:0. Gain access to next Secret door.',
    6,
    '{"effect": "parity_balance", "grants": "secret_door_access"}',
    'The Exile walks between worlds. Both welcome them. Neither claims them.'
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_levels_type ON levels(level_type);
CREATE INDEX idx_levels_depth ON levels(min_depth, max_depth);
CREATE INDEX idx_cards_rarity ON cards(rarity);
CREATE INDEX idx_cards_type ON cards(card_type);
CREATE INDEX idx_cards_parity ON cards(light_delta, dark_delta);
CREATE INDEX idx_card_tags_tag ON card_tags(tag);
CREATE INDEX idx_skills_vessel ON skills(bound_vessel);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Starter Levels (for new players)
CREATE VIEW starter_levels AS
SELECT level_name, level_type, description, light_delta, dark_delta, lore_context
FROM levels
WHERE min_depth <= 3
ORDER BY min_depth, level_name;

-- View: Common Cards (for early drafts)
CREATE VIEW common_cards AS
SELECT card_name, card_type, description, light_delta, dark_delta, flavor_text
FROM cards
WHERE rarity = 'common'
ORDER BY card_type, card_name;

-- View: Light-Aligned Cards
CREATE VIEW light_cards AS
SELECT card_name, card_type, description, light_delta, rarity, flavor_text
FROM cards
WHERE light_delta > 0 OR card_name IN (
    SELECT c.card_name 
    FROM cards c 
    JOIN card_tags ct ON c.id = ct.card_id 
    WHERE ct.tag = 'light'
)
ORDER BY rarity, light_delta DESC;

-- View: Dark-Aligned Cards
CREATE VIEW dark_cards AS
SELECT card_name, card_type, description, dark_delta, rarity, flavor_text
FROM cards
WHERE dark_delta > 0 OR card_name IN (
    SELECT c.card_name 
    FROM cards c 
    JOIN card_tags ct ON c.id = ct.card_id 
    WHERE ct.tag = 'dark'
)
ORDER BY rarity, dark_delta DESC;

-- View: Card Catalog (with tags)
CREATE VIEW card_catalog AS
SELECT 
    c.card_name,
    c.card_type,
    c.description,
    c.light_delta,
    c.dark_delta,
    c.rarity,
    c.flavor_text,
    STRING_AGG(ct.tag, ', ' ORDER BY ct.tag) as tags
FROM cards c
LEFT JOIN card_tags ct ON c.id = ct.card_id
GROUP BY c.id, c.card_name, c.card_type, c.description, 
         c.light_delta, c.dark_delta, c.rarity, c.flavor_text
ORDER BY c.rarity, c.card_name;

-- ============================================================================
-- SEED SCRIPT COMPLETE
-- ============================================================================
-- Total Records:
--   levels: 5 starter levels
--   cards: 13 cards (3 common Light, 3 common Dark, 3 uncommon Threshold, 3 rare, 1 mythic)
--   card_tags: 13 tag relationships
--   skills: 5 Bound-specific abilities
-- TOTAL: 36 records
-- ============================================================================
