export const towerStats = {
    Farm: {
        placement: "Ground",
        unlock: {
            icon: "coin",
            value: 2000
        },
        baseCost: {
            icon: "cash",
            value: 300
        },
        baseSellingCost: {
            icon: "cash",
            value: 100,
        },
        baseDamage: null,
        baseMethod: null,
        baseFirerate: null,
        baseIncome: {
            icon: "cash",
            value: 60,
        },
        hiddenDetection: null,
        leadDetection: null,
        flyingDetection: null,
        immunities: [
            "stun",
            "freeze",
        ],
        baseRange: {
            icon: "range",
            value: 5,
        },
        placementLimit: {
            icon: "placementLimit",
            value: {
                regular: 10,
                pvp: 8
            }
        }
    },
    Accelerator: {
        placement: "Ground",
        unlock: {
            icon: "gem",
            value: 2500
        },
        baseCost: {
            icon: "cash",
            value: 4500
        },
        baseSellingCost: {
            icon: "cash",
            value: 2500
        },
        baseDamage: 12,
        damageMethod: "Burst",
        baseFirerate: 0.15,
        baseRange: {
            icon: "range",
            value: 19
        },
        baseIncome: null,
        hiddenDetection: "Level 1+",
        leadDetection: "Level 0+",
        flyingDetection: null,
        immunities: null,
        placementLimit: {
            icon: "placementLimit",
            value: {
                regular: 5,
                pvp: 5
            }
        },
        placementFootprint: "Above Average (1.75)"
    },
    Engineer: {
        placement: "Ground",
        unlock: [
            {
                type: "gem",
                value: 4500      
            },
            {
                type: "robux",
                value: 2250
            }
        ],
        baseCost: {
            icon: "cash",
            value: 4000
        },
        baseDamage: [
            { source: "Tower", value: 4 },
            { source: "Sentry", value: 2 }
        ],
        damageMethod: [
            { method: "Single" },
            { method: "Splash (Level 6)" }
        ],
        baseFirerate: [
            { source: "Tower", value: 1.4 },
            { source: "Sentry", value: 1.2 }
        ],
        baseRange: {
            icon: "range",
            value: 15
        },
    },
    Commander: {},
    "DJ Booth": {},
    Ranger: {
        placement: "Cliff",
        baseCost: {
            icon: "cash",
            value: 3500
        },
        baseDamage: 30,
        baseFirerate: 4,
        baseRange: {
            icon: "range",
            value: 40
        },
    },
    Minigunner: {
        placement: "Ground",
        baseCost: { icon: "cash", value: 2000 },
        baseDamage: 1,
        baseFirerate: 0.1,
        goldenPerk: {
            baseCost: { icon: "cash", value: 2500 },
            baseDamage: 2,
            baseFirerate: 0.07,
        }
    },
    Cowboy: {
        unlock: [
            {
                type: "coin",
                value: 4000,
                requirement: "Triumph Badlands II",
            },
            {
                type: "robux",
                value: 340,
            },
        ],

        placement: "Ground",
        baseCost: {
            icon: "cash",
            value: 550
        },
        baseSellingCost: {
            icon: "cash",
            value: 183
        },

        baseDamage: 3,
        damageMethod: "Single",
        baseFirerate: 1,

        baseIncome: {
            icon: "cash",
            value: 30
        },

        hiddenDetection: "Level 3+",
        leadDetection: null,
        flyingDetection: null,

        immunities: [
            "Partial Debuff (Spring Time & Mecha Bunny only)",
            "Partial Stun (Spring Time & Mecha Bunny only)"
        ],

        baseRange: {
            icon: "range",
            value: 13
        },

        placementLimit: {
            icon: "placementLimit",
            value: {
                regular: 12,
                pvp: 10
            }
        },

        placementFootprint: "Below Average (1.25)",

        goldenPerk: {
            baseCost: { icon: "cash", value: 600 },
            baseDamage: 4,
            baseFirerate: 0.8,
            baseIncome: { icon: "cash", value: 40 },
        }
    },
    Soldier: {
        placement: "Ground",
        baseCost: { icon: "cash", value: 300 },
        baseDamage: 4,
        baseFirerate: 1.2,
        baseRange: { icon: "range", value: 12 },
        goldenPerk: {
            baseCost: { icon: "cash", value: 400 },
            baseDamage: 6,
            baseFirerate: 1,
        }
    },
    Scout: {
        placement: "Ground",
        baseCost: { icon: "cash", value: 250 },
        baseDamage: 1,
        baseFirerate: 0.5,
        baseRange: { icon: "range", value: 10 },
        goldenPerk: {
            baseCost: { icon: "cash", value: 300 },
            baseDamage: 2,
            baseFirerate: 0.4,
        }
    },
    Demoman: {
        placement: "Cliff",
        baseCost: { icon: "cash", value: 800 },
        baseDamage: 10,
        baseFirerate: 2.5,
        baseRange: { icon: "range", value: 15 },
        goldenPerk: {
            baseCost: { icon: "cash", value: 1000 },
            baseDamage: 15,
            baseFirerate: 2.2,
        }
    },
    Pyro: {
        placement: "Ground",
        baseCost: { icon: "cash", value: 1200 },
        baseDamage: 2,
        baseFirerate: 0.2,
        baseRange: { icon: "range", value: 8 },
        goldenPerk: {
            baseCost: { icon: "cash", value: 1500 },
            baseDamage: 3,
            baseFirerate: 0.15,
        }
    }
}