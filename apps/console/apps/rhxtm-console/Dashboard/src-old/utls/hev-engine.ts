type SovereigntyTier = 'BRICK' | 'STONE' | 'STICK' | 'CARD';

const TIER_MODIFIERS: Record<SovereigntyTier, number> = {

BRICK: 2.0,  // Infrastructure / Core Logic

STONE: 1.5,  // Feature Development

STICK: 1.0,  // Documentation / Maintenance

CARD: 0.5    // Experimental / Temporary

};

const ENERGY_MODIFIERS = {

HIGH: 2.0,

MED: 1.0,

LOW: 0.5

};

export const calculateHEV = (seconds: number, energy: keyof typeof ENERGY_MODIFIERS, tier: SovereigntyTier) => {

const hours = seconds / 3600;

const rawValue = (hours * ENERGY_MODIFIERS[energy]) * TIER_MODIFIERS[tier];

// Return a structured valuation

return {

value: rawValue.toFixed(2),

label: `${rawValue.toFixed(2)} HE_UNITS`,

intensity: energy === 'HIGH' ? 'OVERDRIVE' : energy === 'LOW' ? 'CONSERVATION' : 'STABLE',

rationale: `${energy} energy input on a ${tier} tier node.`

};

};
