-- ============================================================================
-- DUDAEL: BRAND IDENTITY SEED SCRIPT
-- ============================================================================
-- Purpose: Initialize Sinerine design system in Supabase
-- Tables: vfapalette, vfatypography, vfaguidelines, vfaicons
-- Version: 1.0.0
-- Date: March 5, 2026
-- ============================================================================

-- Drop existing tables if re-seeding
DROP TABLE IF EXISTS vfaicons CASCADE;
DROP TABLE IF EXISTS vfaguidelines CASCADE;
DROP TABLE IF EXISTS vfatypography CASCADE;
DROP TABLE IF EXISTS vfapalette CASCADE;

-- ============================================================================
-- TABLE: vfapalette (Color Tokens)
-- ============================================================================

CREATE TABLE vfapalette (
    id SERIAL PRIMARY KEY,
    token_name VARCHAR(50) NOT NULL UNIQUE,
    hex_value VARCHAR(7) NOT NULL,
    rgb_value VARCHAR(20),
    theme VARCHAR(20) NOT NULL CHECK (theme IN ('light', 'dark', 'threshold', 'shared')),
    category VARCHAR(30) NOT NULL CHECK (category IN ('primary', 'accent', 'background', 'text', 'border', 'status')),
    usage_context TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Light Theme Colors (Amber scales)
INSERT INTO vfapalette (token_name, hex_value, rgb_value, theme, category, usage_context) VALUES
('light-primary', '#FFA500', '255, 165, 0', 'light', 'primary', 'Main Light alignment color, Seraph/Penitent'),
('light-accent', '#FFD700', '255, 215, 0', 'light', 'accent', 'Highlight color for Light-aligned elements'),
('light-soft', '#FFE4B5', '255, 228, 181', 'light', 'background', 'Soft amber backgrounds'),
('light-muted', '#D4A574', '212, 165, 116', 'light', 'text', 'Muted Light text');

-- Dark Theme Colors (Violet/Indigo scales)
INSERT INTO vfapalette (token_name, hex_value, rgb_value, theme, category, usage_context) VALUES
('dark-primary', '#4B0082', '75, 0, 130', 'dark', 'primary', 'Main Dark alignment color, Shadow/Rebel'),
('dark-accent', '#8A2BE2', '138, 43, 226', 'dark', 'accent', 'Highlight color for Dark-aligned elements'),
('dark-deep', '#2E0854', '46, 8, 84', 'dark', 'background', 'Deep violet backgrounds'),
('dark-muted', '#6A4C93', '106, 76, 147', 'dark', 'text', 'Muted Dark text');

-- Threshold Colors (Gray blends)
INSERT INTO vfapalette (token_name, hex_value, rgb_value, theme, category, usage_context) VALUES
('threshold-gray', '#808080', '128, 128, 128', 'threshold', 'primary', 'Neutral Threshold state, Exile'),
('threshold-light-blend', '#BFA580', '191, 165, 128', 'threshold', 'accent', 'Threshold leaning Light'),
('threshold-dark-blend', '#6B5B7F', '107, 91, 127', 'threshold', 'accent', 'Threshold leaning Dark'),
('threshold-neutral', '#999999', '153, 153, 153', 'threshold', 'text', 'Neutral gray text');

-- Background Colors (Shared)
INSERT INTO vfapalette (token_name, hex_value, rgb_value, theme, category, usage_context) VALUES
('bg-dark-mode', '#1a1a1a', '26, 26, 26', 'shared', 'background', 'Primary dark mode background'),
('bg-light-mode', '#f5f5f5', '245, 245, 245', 'shared', 'background', 'Primary light mode background'),
('bg-surface-dark', '#2d2d2d', '45, 45, 45', 'shared', 'background', 'Elevated surface dark'),
('bg-surface-light', '#ffffff', '255, 255, 255', 'shared', 'background', 'Elevated surface light');

-- Text Colors (Shared)
INSERT INTO vfapalette (token_name, hex_value, rgb_value, theme, category, usage_context) VALUES
('text-primary-dark', '#f5f5f5', '245, 245, 245', 'shared', 'text', 'Primary text on dark backgrounds'),
('text-primary-light', '#1a1a1a', '26, 26, 26', 'shared', 'text', 'Primary text on light backgrounds'),
('text-secondary-dark', '#b3b3b3', '179, 179, 179', 'shared', 'text', 'Secondary text dark mode'),
('text-secondary-light', '#666666', '102, 102, 102', 'shared', 'text', 'Secondary text light mode');

-- Border Colors (Shared)
INSERT INTO vfapalette (token_name, hex_value, rgb_value, theme, category, usage_context) VALUES
('border-subtle-dark', '#404040', '64, 64, 64', 'shared', 'border', 'Subtle borders dark mode'),
('border-subtle-light', '#e0e0e0', '224, 224, 224', 'shared', 'border', 'Subtle borders light mode'),
('border-emphasis', '#FFA500', '255, 165, 0', 'shared', 'border', 'Emphasized borders (Light accent)');

-- Status Colors (Shared)
INSERT INTO vfapalette (token_name, hex_value, rgb_value, theme, category, usage_context) VALUES
('status-success', '#10b981', '16, 185, 129', 'shared', 'status', 'Success states, complete badges'),
('status-warning', '#f59e0b', '245, 158, 11', 'shared', 'status', 'Warning states, in-progress badges'),
('status-error', '#ef4444', '239, 68, 68', 'shared', 'status', 'Error states, failure indicators'),
('status-info', '#3b82f6', '59, 130, 246', 'shared', 'status', 'Info states, backlog badges');

-- ============================================================================
-- TABLE: vfatypography (Typography Tokens)
-- ============================================================================

CREATE TABLE vfatypography (
    id SERIAL PRIMARY KEY,
    token_name VARCHAR(50) NOT NULL UNIQUE,
    font_family VARCHAR(100) NOT NULL,
    font_weight INTEGER,
    font_size VARCHAR(20),
    line_height VARCHAR(20),
    letter_spacing VARCHAR(20),
    usage_context TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Cinzel (Headings, Lore)
INSERT INTO vfatypography (token_name, font_family, font_weight, font_size, line_height, letter_spacing, usage_context) VALUES
('heading-xl', 'Cinzel, serif', 600, '3rem', '1.2', '-0.02em', 'Page titles, main headings'),
('heading-lg', 'Cinzel, serif', 600, '2.25rem', '1.2', '-0.01em', 'Section headings'),
('heading-md', 'Cinzel, serif', 600, '1.875rem', '1.3', '-0.01em', 'Subsection headings'),
('heading-sm', 'Cinzel, serif', 600, '1.5rem', '1.4', 'normal', 'Card titles, small headings'),
('lore-text', 'Cinzel, serif', 400, '1rem', '1.6', 'normal', 'Lore content, narrative text');

-- Inter (Body, UI)
INSERT INTO vfatypography (token_name, font_family, font_weight, font_size, line_height, letter_spacing, usage_context) VALUES
('body-lg', 'Inter, sans-serif', 400, '1.125rem', '1.6', 'normal', 'Large body text'),
('body-base', 'Inter, sans-serif', 400, '1rem', '1.5', 'normal', 'Standard body text'),
('body-sm', 'Inter, sans-serif', 400, '0.875rem', '1.5', 'normal', 'Small body text, captions'),
('ui-label', 'Inter, sans-serif', 500, '0.875rem', '1.4', 'normal', 'UI labels, buttons'),
('ui-label-bold', 'Inter, sans-serif', 600, '0.875rem', '1.4', 'normal', 'Emphasized UI labels');

-- JetBrains Mono (Code, Stats)
INSERT INTO vfatypography (token_name, font_family, font_weight, font_size, line_height, letter_spacing, usage_context) VALUES
('code-block', 'JetBrains Mono, monospace', 400, '0.875rem', '1.6', 'normal', 'Code blocks, technical content'),
('code-inline', 'JetBrains Mono, monospace', 400, '0.9em', '1.4', 'normal', 'Inline code snippets'),
('stats-display', 'JetBrains Mono, monospace', 600, '1.25rem', '1.2', '0.05em', 'Character stats, numeric data'),
('stats-small', 'JetBrains Mono, monospace', 500, '0.875rem', '1.3', 'normal', 'Small stat displays');

-- ============================================================================
-- TABLE: vfaguidelines (Usage Guidelines)
-- ============================================================================

CREATE TABLE vfaguidelines (
    id SERIAL PRIMARY KEY,
    guideline_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('color', 'typography', 'spacing', 'layout', 'accessibility', 'voice')),
    rule_type VARCHAR(20) NOT NULL CHECK (rule_type IN ('do', 'dont', 'must', 'avoid')),
    description TEXT NOT NULL,
    example TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Color Guidelines
INSERT INTO vfaguidelines (guideline_name, category, rule_type, description, example) VALUES
('Light Alignment Usage', 'color', 'do', 'Use amber/gold colors for Light-aligned content: Seraph, Penitent, Light doors, radiant effects', 'Apply #FFA500 to Seraph sigil glow, Light door indicators'),
('Dark Alignment Usage', 'color', 'do', 'Use violet/indigo colors for Dark-aligned content: Shadow, Rebel, Dark doors, mysterious effects', 'Apply #4B0082 to Shadow cloak, Dark door indicators'),
('Threshold Usage', 'color', 'do', 'Use gray or gradient blends for Threshold/Exile content, neutral states', 'Apply #808080 to Exile sigil, neutral UI elements'),
('Avoid Color Mixing', 'color', 'dont', 'Do not mix Light and Dark colors outside of Threshold contexts. Maintain clear alignment identity.', 'Never use amber + violet together except for Exile or Secret doors'),
('Contrast Requirements', 'color', 'must', 'Ensure 4.5:1 contrast ratio for body text, 3:1 for large text and UI elements', 'Text on dark backgrounds must use light colors (#f5f5f5 or lighter)');

-- Typography Guidelines
INSERT INTO vfaguidelines (guideline_name, category, rule_type, description, example) VALUES
('Cinzel for Lore', 'typography', 'do', 'Use Cinzel for all lore content, narrative text, theological references, and sacred content', 'Lore Bible entries, Bound descriptions, world-building text'),
('Inter for UI', 'typography', 'do', 'Use Inter for all UI elements, body text, documentation, and interface labels', 'Button labels, form inputs, documentation paragraphs'),
('JetBrains Mono for Data', 'typography', 'do', 'Use JetBrains Mono for all numeric data, stats, code, and technical content', 'HP values, parity counters, code snippets, technical specs'),
('No Font Mixing', 'typography', 'dont', 'Do not use multiple fonts within the same content block. Choose one appropriate font per context.', 'Never mix Cinzel and Inter in the same paragraph'),
('Readable Sizes', 'typography', 'must', 'Body text must be at least 1rem (16px). Small text (captions) minimum 0.875rem (14px).', 'Never use font sizes below 14px except for fine print');

-- Spacing Guidelines
INSERT INTO vfaguidelines (guideline_name, category, rule_type, description, example) VALUES
('8px Grid System', 'spacing', 'must', 'All spacing must be multiples of 8px: 8, 16, 24, 32, 40, 48, etc.', 'Margins: 16px, Padding: 24px, Gaps: 32px'),
('Consistent Gaps', 'spacing', 'do', 'Use consistent gap sizes within related elements. Standard: 16px between cards, 24px between sections.', 'Card grids use 16px gap, major sections use 32px gap'),
('Breathing Room', 'spacing', 'do', 'Provide generous whitespace around important elements. Minimum 24px padding for cards/containers.', 'Character sigils have 32px padding around them');

-- Accessibility Guidelines
INSERT INTO vfaguidelines (guideline_name, category, rule_type, description, example) VALUES
('Keyboard Navigation', 'accessibility', 'must', 'All interactive elements must be keyboard-accessible with visible focus states', 'Tab through UI, visible outline on focused buttons'),
('Alt Text Required', 'accessibility', 'must', 'All images must have descriptive alt text. Decorative images use empty alt=""', 'Sigil images: alt="Seraph sigil - six-winged radiant figure"'),
('No Color-Only Meaning', 'accessibility', 'avoid', 'Never rely solely on color to convey information. Use icons, labels, or patterns as well.', 'Status badges have both color AND text label');

-- Voice & Tone Guidelines
INSERT INTO vfaguidelines (guideline_name, category, rule_type, description, example) VALUES
('Forensic Tone', 'voice', 'do', 'Use clinical, precise language for technical content. Measured, documentary style.', '"The containment protocols require three-layer validation"'),
('Theological Weight', 'voice', 'do', 'Lore content should carry gravitas. Avoid casual language for sacred/fallen angel content.', '"They abandoned their proper habitation" not "They left home"'),
('Avoid Humor', 'voice', 'dont', 'Do not use humor, jokes, or casual memes in lore or sacred content. Tone is serious.', 'Never use "lol" or casual slang in theological contexts');

-- ============================================================================
-- TABLE: vfaicons (Icon Registry)
-- ============================================================================

CREATE TABLE vfaicons (
    id SERIAL PRIMARY KEY,
    icon_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('identity', 'navigation', 'character', 'phase', 'alignment', 'status', 'ui')),
    file_name VARCHAR(100) NOT NULL,
    storage_path TEXT,
    size VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Identity Icons
INSERT INTO vfaicons (icon_name, category, file_name, storage_path, size, description) VALUES
('Hero Banner', 'identity', 'hero_banner.png', 'assets/identity/hero_banner.png', '1920x600', 'Main archive header banner'),
('Logo Icon', 'identity', 'logo_icon.png', 'assets/identity/logo_icon.png', '256x256', 'Hourglass with sacred geometry'),
('Domain Icons', 'identity', 'domain_icons.png', 'assets/identity/domain_icons.png', '6-pack', 'Navigation category icons');

-- Navigation Banners
INSERT INTO vfaicons (icon_name, category, file_name, storage_path, size, description) VALUES
('Architecture Banner', 'navigation', 'banner_architecture.png', 'assets/navigation/banner_architecture.png', '1200x300', 'Architecture doc header'),
('Lore Banner', 'navigation', 'banner_lore.png', 'assets/navigation/banner_lore.png', '1200x300', 'Lore Bible doc header'),
('Bound Banner', 'navigation', 'banner_bound.png', 'assets/navigation/banner_bound.png', '1200x300', 'Bound Spec doc header'),
('Systems Banner', 'navigation', 'banner_systems.png', 'assets/navigation/banner_systems.png', '1200x300', 'Systems Spec doc header'),
('Brand Banner', 'navigation', 'banner_brand.png', 'assets/navigation/banner_brand.png', '1200x300', 'Brand Guide doc header'),
('Pipeline Banner', 'navigation', 'banner_pipeline.png', 'assets/navigation/banner_pipeline.png', '1200x300', 'Pipeline doc header'),
('Refactor Banner', 'navigation', 'banner_refactor.png', 'assets/navigation/banner_refactor.png', '1200x300', 'Refactor Log doc header');

-- Character Sigils
INSERT INTO vfaicons (icon_name, category, file_name, storage_path, size, description) VALUES
('Seraph Sigil', 'character', 'sigil_seraph.png', 'assets/characters/sigil_seraph.png', '256x256', 'Six-winged radiant Light Bound'),
('Shadow Sigil', 'character', 'sigil_shadow.png', 'assets/characters/sigil_shadow.png', '256x256', 'Cloaked mysterious Dark Bound'),
('Exile Sigil', 'character', 'sigil_exile.png', 'assets/characters/sigil_exile.png', '256x256', 'Broken chain Threshold Bound'),
('Penitent Sigil', 'character', 'sigil_penitent.png', 'assets/characters/sigil_penitent.png', '256x256', 'Kneeling Light-seeking Bound'),
('Rebel Sigil', 'character', 'sigil_rebel.png', 'assets/characters/sigil_rebel.png', '256x256', 'Raised fist Dark-defiant Bound');

-- Phase Icons
INSERT INTO vfaicons (icon_name, category, file_name, storage_path, size, description) VALUES
('Phase Icons Mini', 'phase', 'phase_icons_mini.png', 'assets/ui/phase_icons_mini.png', '7x32x32', 'Mini phase indicator icons');

-- Alignment Icons
INSERT INTO vfaicons (icon_name, category, file_name, storage_path, size, description) VALUES
('Alignment Indicators', 'alignment', 'alignment_indicators.png', 'assets/ui/alignment_indicators.png', '3x48x48', 'Light/Secret/Dark indicators');

-- Status Icons
INSERT INTO vfaicons (icon_name, category, file_name, storage_path, size, description) VALUES
('Status Badges', 'status', 'status_badges.png', 'assets/ui/status_badges.png', '3x80x24', 'Complete/In Progress/Backlog badges');

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_palette_theme ON vfapalette(theme);
CREATE INDEX idx_palette_category ON vfapalette(category);
CREATE INDEX idx_typography_usage ON vfatypography(usage_context);
CREATE INDEX idx_guidelines_category ON vfaguidelines(category);
CREATE INDEX idx_icons_category ON vfaicons(category);

-- ============================================================================
-- SEED SCRIPT COMPLETE
-- ============================================================================
-- Total Records:
--   vfapalette: 27 color tokens
--   vfatypography: 14 typography tokens
--   vfaguidelines: 14 usage guidelines
--   vfaicons: 20 icon entries
-- TOTAL: 75 records
-- ============================================================================
