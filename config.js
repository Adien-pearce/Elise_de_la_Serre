// ===== Melo Application Configuration =====

const CONFIG = {
    // App Information
    APP_NAME: "Melo",
    VERSION: "1.0.0",
    BUILD: "2024.10.24",
    
    // API Configuration
    API_KEY: typeof window !== 'undefined' && window.GEMINI_API_KEY 
        ? window.GEMINI_API_KEY 
        : (typeof process !== 'undefined' && process.env ? (process.env.VITE_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY || '') : ''),
    GEMINI_MODEL: 'gemini-2.5-flash',
    API_TIMEOUT: 10000,
    
    // Feature Flags
    FEATURES: {
        AURI_CHAT: true,
        JOURNAL: true,
        INSIGHTS: true,
        TOOLKIT: true,
        AID: true,
        VENT_ROOM: true,
        SETTINGS: true
    },
    
    // User Settings Defaults
    DEFAULT_SETTINGS: {
        theme: "dark",
        notifications: true,
        auriType: "supportive",
        emergencyContact: {
            name: "",
            phone: ""
        }
    },
    
    // Mood Configuration
    MOOD_SCORE_MAP: {
        '🤯': 1,
        '😔': 2,
        '😶': 3,
        '😴': 4,
        '😀': 5
    },
    
    // Breathing Exercise Configuration
    BREATHING: {
        INHALE: 4,
        HOLD: 4,
        EXHALE: 6,
        CYCLES: 5
    },

    // Toolkit Resources
    AFFIRMATIONS: [
        "I am capable of handling whatever this day brings.",
        "My feelings are valid, but they do not define my reality.",
        "I deserve peace, love, and happiness.",
        "I am growing and learning every single day.",
        "I have the power to create change in my life.",
        "I am enough, exactly as I am.",
        "I choose to be kind to myself today.",
        "This moment is temporary; I am resilient.",
        "I am worthy of taking up space.",
        "My potential is limitless."
    ],
    
    // Thought Challenge Configuration
    THOUGHT_CHALLENGE: {
        CHALLENGES: [
            { 
                task: "“This is a gift to future me.”", 
                reward: "🎉 Quest Complete: Kindness to Future Self → +50 Compassion Points | Unlocked: Calmer Tomorrow Aura" 
            },
            { 
                task: "One-minute rule challenge", 
                reward: "⚡ Speed Run Achieved: Micro-Task Blitz → +20 Momentum | New Streak Counter Unlocked!" 
            },
            { 
                task: "“I’m allowed to do it imperfectly.”", 
                reward: "🌟 Achievement Unlocked: Good Enough Hero → +30 Self-Kindness | Badge: Imperfection Master" 
            },
            { 
                task: "Pair it with something you love", 
                reward: "🎧 Side Quest Complete: Pleasure Pairing → +40 Joy | Reward Track: Favorite Podcast Episode Buff" 
            },
            { 
                task: "The 5-second countdown", 
                reward: "🚀 Launch Sequence Success → +25 Action Energy | Ability Unlocked: Instant Start" 
            },
            { 
                task: "“Body first, mind follows.”", 
                reward: "🏃 Tutorial Complete: Motion Creates Emotion → +35 Willpower | New Gear: Momentum Boots" 
            },
            { 
                task: "Gratitude anchor", 
                reward: "✨ Daily Gratitude Logged → +50 Peace Points | Bonus: Warm Glow Status Effect (lasts all day)" 
            },
            { 
                task: "Environment as motivator", 
                reward: "🧹 Area Cleared: 5-Minute Tidy → +30 Clarity | Environment Buff: Focused Zone Activated" 
            },
            { 
                task: "“What would caring for myself look like right now?”", 
                reward: "❤️ Self-Care Choice Made → +60 Healing | Title Earned: Gentle Guardian" 
            },
            { 
                task: "Celebrate micro-progress", 
                reward: "🏆 Victory Pose Triggered → +20 Confidence | Combo Multiplier Active for Next Task" 
            },
            { 
                task: "The “two-minute extension” challenge", 
                reward: "⏱️ Over-Time Bonus Earned → +40 Flow State | Secret Achievement: Kept Going Anyway" 
            },
            { 
                task: "Imagine the relief", 
                reward: "😌 Future Relief Cashed In → +55 Satisfaction | Loot Drop: Peace of Mind Potion" 
            },
            { 
                task: "Make it social", 
                reward: "👥 Co-op Mode Activated → +45 Connection | Friend Buff: Shared Energy +20%" 
            },
            { 
                task: "One-task-at-a-time rule", 
                reward: "🎯 Focus Target Locked → +30 Discipline | Reward: Clear Quest Log (mental clutter removed)" 
            },
            { 
                task: "Sensory reward", 
                reward: "🌈 Sensory Upgrade Installed → +50 Enjoyment | Permanent Perk: Tasks Feel Better" 
            },
            { 
                task: "“I’m building trust with myself.”", 
                reward: "🤝 Trust Level Increased → +70 Self-Respect | New Stat: Reliability +10 (permanent)" 
            },
            { 
                task: "Reframe as therapy", 
                reward: "🧠 Therapy Session Complete → +60 Emotional XP | Skill Up: Mindful Action Level 2" 
            },
            { 
                task: "The “good enough” day", 
                reward: "☀️ Daily Objective Met: Progress > Perfection → +40 Resilience | Bonus: Rest Guilt Removed" 
            },
            { 
                task: "Connect it to a bigger why", 
                reward: "🌱 Growth Path Advanced → +80 Purpose | Milestone Reached: Future Self Closer" 
            },
            { 
                task: "End-of-day reflection", 
                reward: "🌙 Daily Review Complete → +100 Victory Points | End-of-Day Cutscene: Chain of Quiet Wins | Save Point Created" 
            }
        ],
        COMPLETION_MESSAGE: "You’re leveling up every single day—keep going, hero! 🎮🏆"
    },
    
    // Vent Room Configuration
    VENT: {
        MAX_MESSAGES: 50,
        MESSAGE_LIMIT: 500,
        ANONYMITY: true
    },
    
    // Indian Crisis Helplines
    INDIAN_HOTLINES: [
        {
            name: "Kiran Mental Health Helpline",
            description: "Ministry of Social Justice & Empowerment",
            number: "1800-599-0019",
            type: "toll-free",
            hours: "24/7",
            languages: "Multilingual"
        },
        {
            name: "Vandrevala Foundation",
            description: "Mental health & suicide prevention",
            numbers: ["9999 666 555", "915 298 7821"],
            type: "phone",
            hours: "24/7",
            features: ["WhatsApp available", "Professional counselors"]
        },
        {
            name: "iCall Psychosocial Helpline",
            description: "Tata Institute of Social Sciences",
            number: "915 298 7821",
            type: "phone",
            hours: "Mon-Sat 10AM-8PM",
            email: "icall@tiss.edu"
        },
        {
            name: "Police & Emergency",
            description: "Immediate life-threatening situations",
            numbers: ["100", "112"],
            type: "emergency",
            hours: "24/7"
        }
    ],
    
    // Local Storage Keys
    STORAGE_KEYS: {
        AURI_HISTORY: "auri_history",
        JOURNAL_ENTRIES: "journal_entries",
        VENT_MESSAGES: "vent_messages",
        USER_PROFILE: "user_profile",
        LOGGED_IN: "melo_logged_in",
        USER_ID: "melo_user_id",
        USER_EMAIL: "melo_user_email"
    },
    
    // Error Messages
    ERRORS: {
        NETWORK: "Network error. Please check your connection.",
        OFFLINE: "You're offline. Some features may be limited.",
        SAVE_FAILED: "Failed to save. Trying locally...",
        LOAD_FAILED: "Failed to load data."
    }
};