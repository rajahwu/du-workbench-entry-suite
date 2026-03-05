-- ============================================================================
-- DUDAEL: BOUND CONFIGURATIONS SEED SCRIPT
-- ============================================================================
-- Purpose: Initialize Vessel, Guide, and Descent Mode data
-- Tables: bounds, guides, descent_modes
-- Version: 1.0.0
-- Date: March 5, 2026
-- ============================================================================

-- Drop existing tables if re-seeding
DROP TABLE IF EXISTS descent_modes CASCADE;
DROP TABLE IF EXISTS guides CASCADE;
DROP TABLE IF EXISTS bounds CASCADE;

-- ============================================================================
-- TABLE: bounds (The Five Bound Vessels)
-- ============================================================================

CREATE TABLE bounds (
    id SERIAL PRIMARY KEY,
    vessel_name VARCHAR(50) NOT NULL UNIQUE,
    sigil_path VARCHAR(200),
    alignment VARCHAR(20) NOT NULL CHECK (alignment IN ('light', 'dark', 'threshold')),
    theology_summary TEXT NOT NULL,
    playstyle_summary TEXT,
    
    -- Core Stats
    base_hp INTEGER NOT NULL,
    base_hand_size INTEGER NOT NULL DEFAULT 5,
    light_bias DECIMAL(3,2) NOT NULL,  -- 0.00 to 1.00 (0 = pure Dark, 1 = pure Light)
    dark_bias DECIMAL(3,2) NOT NULL,   -- 0.00 to 1.00
    
    -- Unlock Conditions
    unlocked_by_default BOOLEAN DEFAULT false,
    unlock_condition TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Seraph: Radiant Obedience (Light-aligned)
INSERT INTO bounds (
    vessel_name, sigil_path, alignment, theology_summary, playstyle_summary,
    base_hp, base_hand_size, light_bias, dark_bias,
    unlocked_by_default, unlock_condition
) VALUES (
    'Seraph',
    'assets/characters/sigil_seraph.png',
    'light',
    'The Seraph never fell—they are messengers who maintain perfect obedience to divine order. Their presence in Dudael is voluntary, serving as witnesses to the containment. They carry the weight of seeing their kin imprisoned.',
    'Defensive playstyle with high Light bias. Strong in Sanctum zones, struggles in Abyss. Prefers Light doors, gains bonuses from radiant cards.',
    100,
    5,
    0.85,
    0.15,
    true,
    NULL
);

-- Shadow: Concealment and Mystery (Dark-aligned)
INSERT INTO bounds (
    vessel_name, sigil_path, alignment, theology_summary, playstyle_summary,
    base_hp, base_hand_size, light_bias, dark_bias,
    unlocked_by_default, unlock_condition
) VALUES (
    'Shadow',
    'assets/characters/sigil_shadow.png',
    'dark',
    'The Shadow chose concealment over revelation. They abandoned their habitation not in rebellion but in withdrawal—preferring darkness and secrecy to the demands of divine visibility.',
    'Evasive playstyle with high Dark bias. Strong in Abyss zones, struggles in Sanctum. Prefers Dark doors, gains bonuses from concealment cards.',
    90,
    6,
    0.15,
    0.85,
    true,
    NULL
);

-- Exile: Lost Habitation (Threshold)
INSERT INTO bounds (
    vessel_name, sigil_path, alignment, theology_summary, playstyle_summary,
    base_hp, base_hand_size, light_bias, dark_bias,
    unlocked_by_default, unlock_condition
) VALUES (
    'Exile',
    'assets/characters/sigil_exile.png',
    'threshold',
    'The Exile abandoned their proper habitation and now exists between states—neither fully Light nor Dark. Their chains are broken but the weight remains. They are forensic evidence of loss itself.',
    'Adaptive balanced playstyle. Neutral starting parity allows flexibility. Can access Secret doors more easily. Bonuses from Threshold cards.',
    95,
    5,
    0.50,
    0.50,
    false,
    'Complete first run with Seraph or Shadow'
);

-- Penitent: Seeking Redemption (Light-seeking)
INSERT INTO bounds (
    vessel_name, sigil_path, alignment, theology_summary, playstyle_summary,
    base_hp, base_hand_size, light_bias, dark_bias,
    unlocked_by_default, unlock_condition
) VALUES (
    'Penitent',
    'assets/characters/sigil_penitent.png',
    'light',
    'The Penitent fell and now seeks return. They carry the crushing weight of contrition and the fragile hope of redemption. Every choice is a plea for restoration of their habitation.',
    'Light-seeking playstyle with moderate bias. Gains strength from suffering. Bonuses when HP is low. Prefers Light doors, penalized by Dark choices.',
    85,
    5,
    0.70,
    0.30,
    false,
    'Reach Depth 5 with any Bound'
);

-- Rebel: Active Defiance (Dark-defiant)
INSERT INTO bounds (
    vessel_name, sigil_path, alignment, theology_summary, playstyle_summary,
    base_hp, base_hand_size, light_bias, dark_bias,
    unlocked_by_default, unlock_condition
) VALUES (
    'Rebel',
    'assets/characters/sigil_rebel.png',
    'dark',
    'The Rebel abandoned their habitation in active defiance—not withdrawal but rejection. They raise their fist against divine order itself. Their imprisonment is evidence of cosmic rebellion.',
    'Aggressive Dark-aligned playstyle. High risk, high reward. Strong when defying expectations. Bonuses from rebellious choices, penalties from obedience.',
    110,
    4,
    0.10,
    0.90,
    false,
    'Choose 5 Dark doors in a single run'
);

-- ============================================================================
-- TABLE: guides (Staging Area Guides)
-- ============================================================================

CREATE TABLE guides (
    id SERIAL PRIMARY KEY,
    guide_name VARCHAR(50) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('surveyor', 'smuggler', 'keeper', 'warden')),
    appearance_description TEXT,
    personality TEXT,
    
    -- Mechanical Effects
    draft_bias VARCHAR(20) CHECK (draft_bias IN ('light', 'dark', 'balanced', 'chaotic')),
    special_ability TEXT,
    
    -- Barks (sample dialogue)
    greeting_bark TEXT,
    draft_bark TEXT,
    farewell_bark TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

-- Surveyor: Balanced, Analytical Guide
INSERT INTO guides (
    guide_name, role, appearance_description, personality,
    draft_bias, special_ability,
    greeting_bark, draft_bark, farewell_bark
) VALUES (
    'Surveyor',
    'surveyor',
    'A child in clean forensic garb, carrying a clipboard and measurement tools. Their eyes are too old for their face.',
    'Clinical, precise, curious. Treats the Bound as specimens to document rather than prisoners to judge. Innocent in demeanor but unsettling in their matter-of-fact acceptance of cosmic horror.',
    'balanced',
    'Card offerings have equal Light/Dark distribution. Provides detailed card statistics.',
    'Another specimen for the archives. Let me take your measurements.',
    'These cards came from the last one. They didn''t need them anymore.',
    'The descent continues. Try not to break anything irreplaceable.',
    NOW()
);

-- Smuggler: Chaotic, Opportunistic Guide
INSERT INTO guides (
    guide_name, role, appearance_description, personality,
    draft_bias, special_ability,
    greeting_bark, draft_bark, farewell_bark
) VALUES (
    'Smuggler',
    'smuggler',
    'A child in tattered layers, pockets full of contraband. Perpetual mischievous grin. Fingers move like they''re always counting coins.',
    'Playful, opportunistic, morally flexible. Sees the Drop as a business opportunity. Offers deals and trades. Innocent exterior masks shrewd calculation.',
    'chaotic',
    'Card offerings are unpredictable—may include rare cards or trash. Offers trades and gambles.',
    'Looking to make a deal? I''ve got merchandise the Wardens don''t know about.',
    'Picked this up from someone who thought they were clever. Your turn.',
    'Try not to lose everything down there. I prefer repeat customers.',
    NOW()
);

-- ============================================================================
-- TABLE: descent_modes (Steward vs Solo)
-- ============================================================================

CREATE TABLE descent_modes (
    id SERIAL PRIMARY KEY,
    mode_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    
    -- Mechanical Effects
    allows_guide_interaction BOOLEAN NOT NULL,
    meta_write_target VARCHAR(50) CHECK (meta_write_target IN ('staging', 'profile', 'both', 'none')),
    difficulty_modifier DECIMAL(3,2) DEFAULT 1.00,
    
    -- Narrative Framing
    lore_context TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

-- Steward Mode: Guided Descent
INSERT INTO descent_modes (
    mode_name, description,
    allows_guide_interaction, meta_write_target, difficulty_modifier,
    lore_context
) VALUES (
    'Steward',
    'Descend with a Guide (Surveyor or Smuggler) who manages your staging area, offers cards, and provides commentary. Meta-progression writes to both Staging and Profile.',
    true,
    'both',
    1.00,
    'The Steward mode represents a documented descent—your run is witnessed and archived. Guides ensure the forensic record is maintained. Memory Fragments are carefully preserved.'
);

-- Solo Mode: Unwitnessed Descent
INSERT INTO descent_modes (
    mode_name, description,
    allows_guide_interaction, meta_write_target, difficulty_modifier,
    lore_context
) VALUES (
    'Solo',
    'Descend alone without a Guide. No staging area interaction, no card offerings, no witness. Meta-progression writes only to Profile (bypasses Staging).',
    false,
    'profile',
    1.25,
    'The Solo mode represents an undocumented descent—you enter the Abyss without witness. No Guide records your choices. Memory Fragments are volatile and may be lost. The containment system notices the absence.'
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_bounds_alignment ON bounds(alignment);
CREATE INDEX idx_bounds_unlocked ON bounds(unlocked_by_default);
CREATE INDEX idx_guides_role ON guides(role);
CREATE INDEX idx_descent_modes_name ON descent_modes(mode_name);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Unlocked Bounds (for new players)
CREATE VIEW unlocked_bounds AS
SELECT vessel_name, sigil_path, alignment, theology_summary, playstyle_summary,
       base_hp, base_hand_size, light_bias, dark_bias
FROM bounds
WHERE unlocked_by_default = true
ORDER BY vessel_name;

-- View: All Bounds with Stats
CREATE VIEW bounds_overview AS
SELECT 
    vessel_name,
    alignment,
    base_hp,
    light_bias,
    dark_bias,
    CASE 
        WHEN unlocked_by_default THEN 'Available'
        ELSE 'Locked: ' || unlock_condition
    END as availability,
    playstyle_summary
FROM bounds
ORDER BY 
    CASE alignment
        WHEN 'light' THEN 1
        WHEN 'threshold' THEN 2
        WHEN 'dark' THEN 3
    END,
    vessel_name;

-- ============================================================================
-- SEED SCRIPT COMPLETE
-- ============================================================================
-- Total Records:
--   bounds: 5 vessels (Seraph, Shadow, Exile, Penitent, Rebel)
--   guides: 2 guides (Surveyor, Smuggler)
--   descent_modes: 2 modes (Steward, Solo)
-- TOTAL: 9 records
-- ============================================================================
