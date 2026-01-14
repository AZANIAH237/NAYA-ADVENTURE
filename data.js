// --- data.js ---
const GAME_DATA = {
    // --- Story Screens (Expanded to 9 for cinematic intro) ---
    INTRO_STORY_SCREENS: [
        {
            image: 'img/intro_1.png',
            title: 'Welcome to the Ascent',
            story: 'Long before memory had a name, the First Ancestor found a valley glowing with eternal light. He called it “The Place of Beginning.”'
        },
        {
            image: 'img/intro_2.png',
            title: 'THE FIFTEEN SCROLLS',
            story: 'From his wisdom came fifteen sons, and to each he gave a sacred Chronicle — a piece of the truth. Together, they formed the Song of the Land..'
        },
        {
            image: 'img/intro_3.png',
            title: 'THE SECRET SENTENCE',
            story: 'Hidden inside each Chronicle was a secret word, harmless alone… but world-shaping when united. Words that could command rain, calm storms, and awaken rivers!'
        },
        {
            image: 'img/intro_4.png',
            title: 'THE BLACK YEARS',
            story: 'But peace cracked under pride. Brothers fought over land, truth twisted, scrolls rewritten. The river answered their violence… by dying.'
        },
        {
            image: 'img/intro_5.png',
            title: 'THE VANISHED ORIGINAL',
            story: 'When the eldest son sought the Original Chronicle, it was gone. Some said stolen. Some said cursed. Some said guarded.'
        },
        {
            image: 'img/intro_6.png',
            title: 'THE WHISPER OF WAR',
            story: 'Today, the clans sharpen blades and blame each other. None trust their own scrolls anymore. The valley trembles under a war it cannot survive.'
        },
        {
            image: 'img/intro_7.png',
            title: 'NAYA, DAUGHTER OF QUIET STORMS',
            story: 'But one refuses to stand by. Naya, stepdaughter of the 120th ruler, walks with a fire too old for her years. She believes the true Chronicle still exists.'
        },
        {
            image: 'img/intro_8.png',
            title: 'THE TWELVE SPIRIT GUIDES',
            story: 'Twelve ancestors answer her courage. Each carries a fragment of power… and a price.They will guide her — but only if she keeps proving her spirit'
        },
        {
            image: 'img/intro_9.png',
            title: 'THE FIRST STEP',
            story: 'To restore the valley, Naya must find the hidden Chronicle by surviving trials shaped by the ancestors themselves. Her journey begins now.',
            finalScreen: true // Flag for 'Start Now' button
        },
        {
            image: 'img/intro_10.png',
            title: 'Help Naya survive the Whispering Forest.',
            story: 'Choose a subject. Each question shapes Naya’s path. Correct answers move her forward. Wrong answers push her back toward the forest pit. Your ancestors will guide you. Some protect, some restore steps, some buy time. But only your knowledge keeps Naya moving. Study. Answer wisely. Survive the forest.',
            finalScreen: true // Flag for 'Start Now' button
        }
    ],

    // --- Subject Selection (Unchanged) ---
    SUBJECTS: [
        { id: 'math', name: 'Mathematics', icon: '盗' },
        { id: 'history', name: 'History', icon: '糖' },
        { id: 'science', name: 'Science', icon: '溌' },
        { id: 'literature', name: 'Literature', icon: '答' }
    ],

    // --- Sound/Music Placeholders ---
    SOUND_CONFIG: {
        music: {
            background: 'audio/bg_music_main.mp3',
            win: 'audio/bg_music_win.mp3',
            fail: 'audio/bg_music_fail.mp3'
        },
        effects: {
            correctAnswer: 'audio/fx_correct.mp3',
            wrongAnswer: 'audio/fx_wrong.mp3',
            shieldActivate: 'audio/fx_shield.mp3',
            restoreActivate: 'audio/fx_restore.mp3',
            boostActivate: 'audio/fx_boost.mp3',
            stepForward: 'audio/fx_step.mp3',
            fall: 'audio/fx_fall.mp3',
            levelComplete: 'audio/fx_level_complete.mp3'
        }
    },

    // --- Level Configuration (24 Levels) ---
    LEVELS_DATA: [
        // --- LEVEL 1: Elder Kambe ---
        {
            id: 1,
            title: 'The Foothills of Knowledge',
            cardImage: 'img/level_1_card.png',
            mission: 'Mission: Find the Elder Kambe’s first truth.',
            totalSteps: 9,
            startStep: 3,
            timeLimit: 135, // 9 * 15
            subjectsToSelect: 1,
            spiritGuideImage: 'img/ancestor_1_guide.png',
            levelIntroStory: [
                'Welcome, Naya. I am Elder Kambe.',
'These foothills mark the beginning of your journey.',
'Each question reveals a safe step forward.',
'Walk with courage… the forest is watching.'
            ],
            winStory: {
                title: 'First Ascent Achieved!',
                image: 'img/ancestor_1_victory.png',
                story: '150 years ago, after King Njoro handed the 15 scrolls to his sons, voices in the forest whispered that King Kufari the First, the fifth son of King Njoro, seemed to have a secret plan. No one knew what the plan was, but legend holds that Mother Lumena may have the answer to what disturbed the young king during his walk in the forest. You will meet her in the Plateau of Logic.',
                // Buttons: retake, next, home
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_1_fail.png',
                story: 'Elder Kambe whispers: "Patience, young one. Your foundation is weak. Study more before trying again."',
                // Buttons: retry, home
            },
            ancestor: {
                name: 'Elder Kambe',
                tier: 'Weak',
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 2: Mother Lumena ---
        {
            id: 2,
            title: 'The Plateau of Logic',
            cardImage: 'img/level_2_card.png',
            mission: 'Mission: Follow Mother Lumena’s gentle light.',
            totalSteps: 11,
            startStep: 3,
            timeLimit: 165, // 11 * 15
            subjectsToSelect: 1,
            spiritGuideImage: 'img/ancestor_2_guide.png',
            levelIntroStory: [
                'Greetings, student. I am Mother Lumena.',
                'These rocky plateaus hide the truths of the past',
                'Each question will guide you toward the hidden path',
                'Be steady, and I shall grant small boosts.'
            ],
            winStory: {
                title: 'The Plateau is Conquered!',
                image: 'img/ancestor_2_victory.png',
                story: 'King Kufari, who ascended the throne at the age of 25, was a handsome and valiant man. Legend holds that the young king experienced strange visions while walking through the plateaus—some said it was the voices of the forest, others whispered it was the spirits of his ancestors trying to guide him. Upon returning from the forest, he created a secret council called the Ultima 11, charged with a hidden duty. Some called them the Keepers of the Scrolls. Which scrolls? No one could tell. Your journey must take you deeper into the forest, toward the Tranquil Heights, where the next spirit guide awaits you.',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_2_fail.png',
                story: 'Mother Lumena smiles upon you: "Do not rush the ascent. Each question is a foundation. Rest, and try again."',
            },
            ancestor: {
                name: 'Mother Lumena',
                tier: 'Weak–Medium',
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 2, trigger: 'STREAK_2', maxTriggers: 2, progressMax: 0.5, timerMin: 0.5 }, // Small Boost
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 3: Sage Turiko ---
        {
            id: 3,
            title: 'The Tranquil Heights',
            cardImage: 'img/level_3_card.png',
            mission: 'Mission: Seek the wisdom of Sage Turiko.',
            totalSteps: 12,
            startStep: 3,
            timeLimit: 180, // 12 * 15
            subjectsToSelect: 1,
            spiritGuideImage: 'img/ancestor_3_guide.png',
            levelIntroStory: [
                'Welcome, Naya. I am Sage Turiko. Calmness is key.',
                'I will guide you through the Tranquil Heights, where every step must be taken with focus.',
                 'I can restore you to a higher step if you stumble and even reveal multiple steps when your streak is strong.',
                'Trust in my guidance, for fragments of King Zubari’s visions await to be uncovered here, continuing the clues you discovered on the Plateau of Logic.'
            ],
            winStory: {
                title: 'Wisdom Achieved!',
                image: 'img/ancestor_3_victory.png',
                story: 'Sage Turiko reveals a truth: "The greatest obstacle is not the question, but the haste to answer it."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_3_fail.png',
                story: 'Sage Turiko guides your thoughts: "A clear mind is a swift climber. Re-center your focus, and return."',
            },
            ancestor: {
                name: 'Sage Turiko',
                tier: 'Weak',
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 4: Warrior Andeko (2 Subjects) ---
        {
            id: 4,
            title: 'Warrior’s Ridge',
            cardImage: 'img/level_4_card.png',
            mission: 'Mission: Honor Warrior Andeko’s resilience.',
            totalSteps: 14,
            startStep: 3,
            timeLimit: 210, // 14 * 15
            subjectsToSelect: 2,
            spiritGuideImage: 'img/ancestor_4_guide.png',
            levelIntroStory: [
                'I am Warrior Andeko. The path demands dual strength.',
                'Select two subjects to forge your armor.',
                'Be resilient, and I shall pull you from the brink.'
            ],
            winStory: {
                title: 'Ridge Conquered!',
                image: 'img/ancestor_4_victory.png',
                story: 'Warrior Andeko reveals a truth: "Courage is not the absence of fear, but the step taken after a fall."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_4_fail.png',
                story: 'Warrior Andeko’s spirit is with you: "Failures are lessons, not defeats. Stand, and choose your weapons (subjects) wisely."',
            },
            ancestor: {
                name: 'Warrior Andeko',
                tier: 'Weak–Medium',
                restorationStep: 3,
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                  //---  { type: 'RESCUE_PRE_HOLE', effect: 3, trigger: 'WRONG_PRE_HOLE', maxTriggers: 1 }, // Restores to Step 3
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 5: Mira & Siran (Twin Spirits) (2 Subjects) ---
        {
            id: 5,
            title: 'The Twin Peaks',
            cardImage: 'img/level_5_card.png',
            mission: 'Mission: Harmonize with the Twin Spirits.',
            totalSteps: 16,
            startStep: 3,
            timeLimit: 240, // 16 * 15
            subjectsToSelect: 2,
            spiritGuideImage: 'img/ancestor_5_guide.png',
            levelIntroStory: [
                'We are Mira and Siran, the Twin Spirits.',
                'Your knowledge must flow together, like two rivers.',
                'Show us harmony in your answers, and we will quicken your pace.'
            ],
            winStory: {
                title: 'Harmony Achieved!',
                image: 'img/ancestor_5_victory.png',
                story: 'Mira and Siran reveal a truth: "Unity of knowledge creates unstoppable momentum."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_5_fail.png',
                story: 'The Twin Spirits observe: "You must commit. Your path is wavering. Focus your two subjects."',
            },
            ancestor: {
                name: 'Mira & Siran (Twin Spirits)',
                tier: 'Medium',
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 2, trigger: 'STREAK_2', maxTriggers: 2, progressMax: 0.5, timerMin: 0.5 }, // Small Boost (+1 step)
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 6: Elder Zohrei (2 Subjects) ---
        {
            id: 6,
            title: 'Zohrei’s Ascent',
            cardImage: 'img/level_6_card.png',
            mission: 'Mission: Master the path shown by Elder Zohrei.',
            totalSteps: 18,
            startStep: 3,
            timeLimit: 270, // 18 * 15
            subjectsToSelect: 2,
            spiritGuideImage: 'img/ancestor_6_guide.png',
            levelIntroStory: [
                'I am Elder Zohrei. I reward commitment.',
                'You have two guides now. Use them well.',
                'Prove your mastery through streak, and I will illuminate the steps ahead.'
            ],
            winStory: {
                title: 'Zohrei’s Peak Reached!',
                image: 'img/ancestor_6_victory.png',
                story: 'Elder Zohrei reveals a truth: "True progress is found in unwavering, consecutive effort."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_6_fail.png',
                story: 'Elder Zohrei’s voice is firm: "Lack of streak shows lack of focus. Re-engage with your chosen paths."',
            },
            ancestor: {
                name: 'Elder Zohrei',
                tier: 'Medium',
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 2, trigger: 'STREAK_3', progressMax: 0.7 }, // Mini Multi-Step Reveal (2 steps)
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 7: Grandmother Eyota (3 Subjects) ---
        {
            id: 7,
            title: 'Eyota’s Cradle',
            cardImage: 'img/level_7_card.png',
            mission: 'Mission: Find rest in Grandmother Eyota’s guidance.',
            totalSteps: 20,
            startStep: 3,
            timeLimit: 300, // 20 * 15
            subjectsToSelect: 3,
            spiritGuideImage: 'img/ancestor_7_guide.png',
            levelIntroStory: [
                'I am Grandmother Eyota. My love is a shield.',
                'Three roots will hold you steady on this path.',
                'The mountain can be treacherous, but I will not let you fall far.'
            ],
            winStory: {
                title: 'Cradle of Knowledge!',
                image: 'img/ancestor_7_victory.png',
                story: 'Grandmother Eyota reveals a truth: "Even the wisest fall. True strength is in the rise and the knowledge gained from the ground."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_7_fail.png',
                story: 'Grandmother Eyota’s hand is on your back: "Rest, dear Naya. Your three subjects must be more deeply absorbed. Try again."',
            },
            ancestor: {
                name: 'Grandmother Eyota',
                tier: 'Medium',
                restorationStep: 3,
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'RESCUE_PRE_HOLE', effect: 3, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 3
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 8: Elder Joramal (3 Subjects) ---
        {
            id: 8,
            title: 'Joramal’s Gauntlet',
            cardImage: 'img/level_8_card.png',
            mission: 'Mission: Prove your worth to Elder Joramal.',
            totalSteps: 22,
            startStep: 3,
            timeLimit: 330, // 22 * 15
            subjectsToSelect: 3,
            spiritGuideImage: 'img/ancestor_8_guide.png',
            levelIntroStory: [
                'I am Elder Joramal, a harsh, but fair guide.',
                'Three subjects must be your bedrock.',
                'Only flawless streaks will earn my favor and boost your ascent.'
            ],
            winStory: {
                title: 'Gauntlet Mastered!',
                image: 'img/ancestor_8_victory.png',
                story: 'Elder Joramal reveals a truth: "Consistency is the master key to all forgotten knowledge."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_8_fail.png',
                story: 'Elder Joramal shakes his head: "Your concentration is split. Reflect on your chosen subjects. Next time, be perfect."',
            },
            ancestor: {
                name: 'Elder Joramal',
                tier: 'Medium',
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 2, trigger: 'STREAK_3' }, // Mini Multi-Step Reveal (2 steps)
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 9: Kura The Wanderer (3 Subjects) ---
        {
            id: 9,
            title: 'The Wanderer’s Path',
            cardImage: 'img/level_9_card.png',
            mission: 'Mission: Navigate the winding path with Kura.',
            totalSteps: 24,
            startStep: 3,
            timeLimit: 360, // 24 * 15
            subjectsToSelect: 3,
            spiritGuideImage: 'img/ancestor_9_guide.png',
            levelIntroStory: [
                'I am Kura the Wanderer. My path is long and winding.',
                'Three subjects will be your compass.',
                'If you wander too far back, I will restore your footing.'
            ],
            winStory: {
                title: 'Wanderer’s End Found!',
                image: 'img/ancestor_9_victory.png',
                story: 'Kura the Wanderer reveals a truth: "Even in loss, if the heart holds wisdom (above 60% progress), the return is swift."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_9_fail.png',
                story: 'Kura sighs: "You lost your way. The steps of the mountain demand relentless practice. Begin again."',
            },
            ancestor: {
                name: 'Kura The Wanderer',
                tier: 'Medium',
                restorationStep: 5,
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'RESCUE_PULL_BACK', effect: 5, trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS' }, // Restores to Step 5 if pulled back to 1/2 and >60%
                    { type: 'BOOST_STREAK', effect: 2, trigger: 'STREAK_3' }
                ]
            }
        },
        // --- LEVEL 10: Stone Sentinel Kade (4 Subjects) ---
        {
            id: 10,
            title: 'The Sentinel’s Gate',
            cardImage: 'img/level_10_card.png',
            mission: 'Mission: Pass the unyielding Stone Sentinel.',
            totalSteps: 26,
            startStep: 3,
            timeLimit: 390, // 26 * 15
            subjectsToSelect: 4,
            spiritGuideImage: 'img/ancestor_10_guide.png',
            levelIntroStory: [
                'I am Stone Sentinel Kade. My defense is absolute.',
                'Four subjects are needed to bypass my watch.',
                'Should you falter, my strong hand will set you back on Step 5.'
            ],
            winStory: {
                title: 'Gate Passed!',
                image: 'img/ancestor_10_victory.png',
                story: 'Stone Sentinel Kade reveals a truth: "The only impregnable shield is knowledge itself."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_10_fail.png',
                story: 'Stone Sentinel Kade remains unmoved: "Your four pillars are crumbling. Rebuild them before you try to pass."',
            },
            ancestor: {
                name: 'Stone Sentinel Kade',
                tier: 'Medium–Strong',
                restorationStep: 5,
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'RESCUE_PRE_HOLE', effect: 5, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 5
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 11: Elder Najara (4 Subjects) ---
        {
            id: 11,
            title: 'Najara’s Leap',
            cardImage: 'img/level_11_card.png',
            mission: 'Mission: Take the great leap with Elder Najara.',
            totalSteps: 28,
            startStep: 3,
            timeLimit: 420, // 28 * 15
            subjectsToSelect: 4,
            spiritGuideImage: 'img/ancestor_11_guide.png',
            levelIntroStory: [
                'I am Elder Najara. I value efficiency.',
                'Four subjects give you momentum.',
                'Show me a streak, and I will grant you an unprecedented leap.'
            ],
            winStory: {
                title: 'Leap of Faith Successful!',
                image: 'img/ancestor_11_victory.png',
                story: 'Elder Najara reveals a truth: "When three truths align, the path shortens exponentially."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_11_fail.png',
                story: 'Elder Najara shakes her head: "Your momentum is lost. Four subjects require deep focus. Begin again."',
            },
            ancestor: {
                name: 'Elder Najara',
                tier: 'Medium–Strong',
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 3, trigger: 'STREAK_3' }, // Multi-Step Reveal (3 steps)
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 12: The Whispering Child, Lio (4 Subjects) ---
        {
            id: 12,
            title: 'Lio’s Lullaby',
            cardImage: 'img/level_12_card.png',
            mission: 'Mission: Find the rhythm of the Whispering Child.',
            totalSteps: 30,
            startStep: 3,
            timeLimit: 510, // 30 * 17 (Time multiplier changes)
            subjectsToSelect: 4,
            spiritGuideImage: 'img/ancestor_12_guide.png',
            levelIntroStory: [
                'I am Lio, the Whispering Child. I control the flow of time.',
                'Four subjects will steady your heart.',
                'If you struggle and time runs low, I will slow the clock for you.'
            ],
            winStory: {
                title: 'Rhythm Achieved!',
                image: 'img/ancestor_12_victory.png',
                story: 'Lio reveals a truth: "Even in the tightest bind, there is always time for one more true answer."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_12_fail.png',
                story: 'Lio’s whisper fades: "You ran out of time. Next time, allow my small stillness to guide your final decisions. Retry."',
            },
            ancestor: {
                name: 'The Whispering Child, Lio',
                tier: 'Medium–Strong',
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'ENERGY_SLOW', effect: 15, trigger: 'CRITICAL_FAIL_LOW_TIMER', maxTriggers: 1 }, // Timer Slowdown
                    { type: 'BOOST_STREAK', effect: 2, trigger: 'STREAK_3' }, // Mini Multi-Step Reveal (2 steps)
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 13: Mystic Anara (4 Subjects) ---
        {
            id: 13,
            title: 'Anara’s Mysticism',
            cardImage: 'img/level_13_card.png',
            mission: 'Mission: Unravel the secrets of Mystic Anara.',
            totalSteps: 32,
            startStep: 3,
            timeLimit: 544, // 32 * 17
            subjectsToSelect: 4,
            spiritGuideImage: 'img/ancestor_13_guide.png',
            levelIntroStory: [
                'I am Mystic Anara. I see the future of your path.',
                'Four subjects will bring clarity to the mists.',
                'My multi-step reveal may vary, but my rescue is firm.'
            ],
            winStory: {
                title: 'Mysteries Solved!',
                image: 'img/ancestor_13_victory.png',
                story: 'Mystic Anara reveals a truth: "Foresight comes not from magic, but from deep knowledge, allowing leaps of logic."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_13_fail.png',
                story: 'Mystic Anara whispers: "The mists of ignorance consume you. You must strengthen your four foundational subjects."',
            },
            ancestor: {
                name: 'Mystic Anara',
                tier: 'Strong',
                restorationStep: 6,
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'RESCUE_PULL_BACK', effect: 6, trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS' }, // Restores to Step 6 if pulled back to 1/2 and >60%
                    { type: 'BOOST_STREAK', effect: '3-4', trigger: 'STREAK_3' }, // Multi-Step Reveal (3-4 steps)
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 14: Sage Zyra (4 Subjects) ---
        {
            id: 14,
            title: 'Zyra’s Zen',
            cardImage: 'img/level_14_card.png',
            mission: 'Mission: Attain the inner peace of Sage Zyra.',
            totalSteps: 34,
            startStep: 3,
            timeLimit: 578, // 34 * 17
            subjectsToSelect: 4,
            spiritGuideImage: 'img/ancestor_14_guide.png',
            levelIntroStory: [
                'I am Sage Zyra. Balance is your weapon.',
                'Four subjects must move as one.',
                'My streak reward is firm, and my hand will steady you from the fall.'
            ],
            winStory: {
                title: 'Balance Achieved!',
                image: 'img/ancestor_14_victory.png',
                story: 'Sage Zyra reveals a truth: "In the pursuit of knowledge, a strong base will always catch a stumble."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_14_fail.png',
                story: 'Sage Zyra shakes her head: "The ground slips beneath you. Regain your footing in your four chosen fields."',
            },
            ancestor: {
                name: 'Sage Zyra',
                tier: 'Strong',
                restorationStep: 6,
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 3, trigger: 'STREAK_3' },
                    { type: 'RESCUE_PRE_HOLE', effect: 6, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 6
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 15: Eternal Watcher Kayo (5 Subjects) ---
        {
            id: 15,
            title: 'The Eternal Watch',
            cardImage: 'img/level_15_card.png',
            mission: 'Mission: Endure the gaze of the Eternal Watcher.',
            totalSteps: 35,
            startStep: 3,
            timeLimit: 595, // 35 * 17
            subjectsToSelect: 5,
            spiritGuideImage: 'img/ancestor_15_guide.png',
            levelIntroStory: [
                'I am Eternal Watcher Kayo. Five subjects are your dedication.',
                'You must prove your long-term commitment.',
                'If you are near the goal and fail, my rescue will be swift.'
            ],
            winStory: {
                title: 'Vigil Endured!',
                image: 'img/ancestor_15_victory.png',
                story: 'Eternal Watcher Kayo reveals a truth: "The final stretch demands the greatest endurance, powered by your deepest reserves."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_15_fail.png',
                story: 'Eternal Watcher Kayo judges your attempt: "Your five fingers are not yet a fist. Unify your knowledge and return."',
            },
            ancestor: {
                name: 'Eternal Watcher Kayo',
                tier: 'Strong',
                restorationStep: 6,
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'RESCUE_ENERGY', effect: 6, trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS_LOW_TIMER', progressMin: 0.7 }, // Energy Rescue to Step 6
                    { type: 'BOOST_STREAK', effect: 3, trigger: 'STREAK_3' },
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 16: Guardian Toriel (5 Subjects) ---
        {
            id: 16,
            title: 'Toriel’s Fortress',
            cardImage: 'img/level_16_card.png',
            mission: 'Mission: Breach the Fortress of Guardian Toriel.',
            totalSteps: 36,
            startStep: 3,
            timeLimit: 612, // 36 * 17
            subjectsToSelect: 5,
            spiritGuideImage: 'img/ancestor_16_guide.png',
            levelIntroStory: [
                'I am Guardian Toriel. My steps are large and secure.',
                'Five subjects are your key to the fortress.',
                'Show me mastery, and I will grant you a major leap forward.'
            ],
            winStory: {
                title: 'Fortress Breached!',
                image: 'img/ancestor_16_victory.png',
                story: 'Guardian Toriel reveals a truth: "Speed is the reward of solid learning; the fewer steps, the stronger the knowledge."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_16_fail.png',
                story: 'Guardian Toriel is disappointed: "The foundation of your five subjects shook. Retreat and practice your knowledge before returning."',
            },
            ancestor: {
                name: 'Guardian Toriel',
                tier: 'Strong',
                restorationStep: 7,
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 4, trigger: 'STREAK_3' }, // Multi-Step Reveal (4 steps)
                    { type: 'RESCUE_PRE_HOLE', effect: 7, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 7
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 17: Ancient Visionary Lyri (5 Subjects) ---
        {
            id: 17,
            title: 'Lyri’s Prophecy',
            cardImage: 'img/level_17_card.png',
            mission: 'Mission: Fulfill the prophecy of the Ancient Visionary.',
            totalSteps: 37,
            startStep: 3,
            timeLimit: 629, // 37 * 17
            subjectsToSelect: 5,
            spiritGuideImage: 'img/ancestor_17_guide.png',
            levelIntroStory: [
                'I am Ancient Visionary Lyri. I see the flow of fate.',
                'Five subjects are woven into your destiny.',
                'My leap is large, and my rescue is timed to the very end of your strength.'
            ],
            winStory: {
                title: 'Prophecy Fulfilled!',
                image: 'img/ancestor_17_victory.png',
                story: 'Ancient Visionary Lyri reveals a truth: "Even a narrow escape proves the knowledge was held deep within."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_17_fail.png',
                story: 'Ancient Visionary Lyri warns: "Your focus is too split. The five paths you chose must converge into one truth."',
            },
            ancestor: {
                name: 'Ancient Visionary Lyri',
                tier: 'Strong',
                restorationStep: 8,
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'RESCUE_ENERGY', effect: 8, trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS_LOW_TIMER', progressMin: 0.7, timerMax: 0.3 }, // Energy Rescue to Step 8
                    { type: 'BOOST_STREAK', effect: '3-5', trigger: 'STREAK_3' }, // Multi-Step Reveal (3-5 steps)
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 18: Spirit of the River, Velora (6 Subjects) ---
        {
            id: 18,
            title: 'Velora’s Current',
            cardImage: 'img/level_18_card.png',
            mission: 'Mission: Flow with the Spirit of the River.',
            totalSteps: 38,
            startStep: 3,
            timeLimit: 646, // 38 * 17
            subjectsToSelect: 6,
            spiritGuideImage: 'img/ancestor_18_guide.png',
            levelIntroStory: [
                'I am Velora, Spirit of the River. My current is strong.',
                'Six subjects form the breadth of the river’s path.',
                'I offer powerful leaps and dual rescue from the deep.'
            ],
            winStory: {
                title: 'River Conquered!',
                image: 'img/ancestor_18_victory.png',
                story: 'Spirit of the River, Velora reveals a truth: "Knowledge is the river; it flows, yet it is always connected to its source."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_18_fail.png',
                story: 'Velora’s current is too strong: "You were swept away. Your six subjects must be strong enough to resist the flow. Try again."',
            },
            ancestor: {
                name: 'Spirit of the River, Velora',
                tier: 'Strong',
                restorationStep: 7, // For pre-hole rescue
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: '4-5', trigger: 'STREAK_3' }, // Multi-Step Reveal (4-5 steps)
                    { type: 'RESCUE_ENERGY', effect: 8, trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS_LOW_TIMER', progressMin: 0.7 }, // Energy Rescue to Step 8
                    { type: 'RESCUE_PRE_HOLE', effect: 7, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 7
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 19: High Priestess Lumina (6 Subjects) ---
        {
            id: 19,
            title: 'Lumina’s Zenith',
            cardImage: 'img/level_19_card.png',
            mission: 'Mission: Reach the height of the High Priestess.',
            totalSteps: 39,
            startStep: 3,
            timeLimit: 663, // 39 * 17
            subjectsToSelect: 6,
            spiritGuideImage: 'img/ancestor_19_guide.png',
            levelIntroStory: [
                'I am High Priestess Lumina. Your knowledge approaches ultimate truth.',
                'Six subjects are your dedication to the light.',
                'My rescue is now higher and my jumps are faster.'
            ],
            winStory: {
                title: 'Zenith Achieved!',
                image: 'img/ancestor_19_victory.png',
                story: 'High Priestess Lumina reveals a truth: "The highest wisdom is knowing how to recover from the deepest setbacks."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_19_fail.png',
                story: 'High Priestess Lumina is disappointed: "The light of your six subjects is dimming. Recharge your spirit and mind."',
            },
            ancestor: {
                name: 'High Priestess Lumina',
                tier: 'Ultimate',
                restorationStep: 8, // For pre-hole rescue
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: '4-5', trigger: 'STREAK_3' },
                    { type: 'RESCUE_PRE_HOLE', effect: 8, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 8
                    { type: 'RESCUE_ENERGY', effect: '8-9', trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS_LOW_TIMER', progressMin: 0.7, pullBackMax: 3 }, // Energy Rescue to Step 8-9 (if pulled back to 1-3)
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 20: The Veiled Oracle, Syrin (6 Subjects) ---
        {
            id: 20,
            title: 'The Oracle’s Veil',
            cardImage: 'img/level_20_card.png',
            mission: 'Mission: Peek behind the veil with Syrin.',
            totalSteps: 40,
            startStep: 3,
            timeLimit: 680, // 40 * 17
            subjectsToSelect: 6,
            spiritGuideImage: 'img/ancestor_20_guide.png',
            levelIntroStory: [
                'I am Syrin, The Veiled Oracle. Only clear answers pass the veil.',
                'Six subjects are the true questions.',
                'A single flawless streak can reveal five steps ahead.'
            ],
            winStory: {
                title: 'Veil Lifted!',
                image: 'img/ancestor_20_victory.png',
                story: 'The Veiled Oracle, Syrin reveals a truth: "Clarity of mind is the only tool that can cut through illusion."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_20_fail.png',
                story: 'Syrin’s voice is distant: "You were distracted by doubt. Your six subjects are a mess. Re-sort your truths."',
            },
            ancestor: {
                name: 'The Veiled Oracle, Syrin',
                tier: 'Ultimate',
                restorationStep: 9, // For pre-hole rescue
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 5, trigger: 'STREAK_3' }, // Multi-Step Reveal (5 steps)
                    { type: 'RESCUE_PRE_HOLE', effect: 9, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 9
                    { type: 'RESCUE_ENERGY', effect: '9-10', trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS_LOW_TIMER', progressMin: 0.7 }, // Energy Rescue to Step 9-10
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 21: Ancestor of Flames, Vekra (6 Subjects) ---
        {
            id: 21,
            title: 'Vekra’s Forge',
            cardImage: 'img/level_21_card.png',
            mission: 'Mission: Be tempered in the fires of Vekra.',
            totalSteps: 41,
            startStep: 3,
            timeLimit: 697, // 41 * 17
            subjectsToSelect: 6,
            spiritGuideImage: 'img/ancestor_21_guide.png',
            levelIntroStory: [
                'I am Vekra, Ancestor of Flames. I temper your spirit.',
                'Six subjects are the heat of the forge.',
                'My rescue is high. Do not fear the fire, but embrace it.'
            ],
            winStory: {
                title: 'Tempered in Fire!',
                image: 'img/ancestor_21_victory.png',
                story: 'Ancestor of Flames, Vekra reveals a truth: "The process of learning, though painful, yields the strongest weapon: an unshakeable mind."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_21_fail.png',
                story: 'Vekra’s fire nearly consumes you: "You broke under the heat. Strengthen your six subjects to withstand the fire."',
            },
            ancestor: {
                name: 'Ancestor of Flames, Vekra',
                tier: 'Ultimate',
                restorationStep: 10, // For pre-hole rescue
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 5, trigger: 'STREAK_3' },
                    { type: 'RESCUE_PRE_HOLE', effect: 10, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 10
                    { type: 'RESCUE_ENERGY', effect: '10-11', trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS_LOW_TIMER', progressMin: 0.7 }, // Energy Rescue to Step 10-11
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 22: Guardian of the Sky, Althora (7 Subjects) ---
        {
            id: 22,
            title: 'Althora’s Clouds',
            cardImage: 'img/level_22_card.png',
            mission: 'Mission: Ascend into the realm of the Sky Guardian.',
            totalSteps: 42,
            startStep: 3,
            timeLimit: 714, // 42 * 17
            subjectsToSelect: 7,
            spiritGuideImage: 'img/ancestor_22_guide.png',
            levelIntroStory: [
                'I am Althora, Guardian of the Sky. The view is vast from here.',
                'Seven subjects are the winds that carry you.',
                'My steps are final, and my protection absolute.'
            ],
            winStory: {
                title: 'Sky Claimed!',
                image: 'img/ancestor_22_victory.png',
                story: 'Guardian of the Sky, Althora reveals a truth: "When your knowledge is broad (seven subjects), you can rise above all challenges."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_22_fail.png',
                story: 'Althora’s voice booms: "The clouds of confusion blinded you. Your seven fields of study must be mastered simultaneously."',
            },
            ancestor: {
                name: 'Guardian of the Sky, Althora',
                tier: 'Ultimate',
                restorationStep: 11, // For pre-hole rescue
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 5, trigger: 'STREAK_3' },
                    { type: 'RESCUE_PRE_HOLE', effect: 11, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 11
                    { type: 'RESCUE_ENERGY', effect: '11-12', trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS_LOW_TIMER', progressMin: 0.7 }, // Energy Rescue to Step 11-12
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 23: The Timekeeper, Olyrin (7 Subjects) ---
        {
            id: 23,
            title: 'Olyrin’s Domain',
            cardImage: 'img/level_23_card.png',
            mission: 'Mission: Master the shifting sands of time with Olyrin.',
            totalSteps: 43,
            startStep: 3,
            timeLimit: 731, // 43 * 17
            subjectsToSelect: 7,
            spiritGuideImage: 'img/ancestor_23_guide.png',
            levelIntroStory: [
                'I am Olyrin, The Timekeeper. I measure your precision.',
                'Seven subjects are the countless moments in history.',
                'Be flawless, and you will find yourself near the end.'
            ],
            winStory: {
                title: 'Time Mastered!',
                image: 'img/ancestor_23_victory.png',
                story: 'The Timekeeper, Olyrin reveals a truth: "To master a moment is to master the entire past that led to it. Your seven subjects are complete."',
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_23_fail.png',
                story: 'Olyrin’s clock stops: "Your time is over. The pressure overwhelmed your seven-subject grasp. Relearn your lessons."',
            },
            ancestor: {
                name: 'The Timekeeper, Olyrin',
                tier: 'Ultimate',
                restorationStep: 12, // For pre-hole rescue
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 5, trigger: 'STREAK_3' },
                    { type: 'RESCUE_PRE_HOLE', effect: 12, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 12
                    { type: 'RESCUE_ENERGY', effect: '12-13', trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS_LOW_TIMER', progressMin: 0.7 }, // Energy Rescue to Step 12-13
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        },
        // --- LEVEL 24: The Ancestral Council (8 Subjects) ---
        {
            id: 24,
            title: 'The Ancestral Summit',
            cardImage: 'img/level_24_card.png',
            mission: 'Mission: Meet The Ancestral Council.',
            totalSteps: 44,
            startStep: 3,
            timeLimit: 748, // 44 * 17
            subjectsToSelect: 8,
            spiritGuideImage: 'img/ancestor_24_guide.png',
            levelIntroStory: [
                'We are The Ancestral Council. This is your final test.',
                'Eight subjects is the fullness of knowledge.',
                'Every power we possess is now yours. Ascend, Naya.'
            ],
            winStory: {
                title: 'The Council Awaits!',
                image: 'img/ancestor_24_victory.png',
                story: 'The Ancestral Council reveals the ultimate truth: "The connection is restored. You are no longer Naya, but an Ancestor yourself. The journey continues."',
                finalLevel: true // Flag to stop 'Next Level' button
            },
            failStory: {
                title: 'Naya Needs Your Saving',
                image: 'img/ancestor_24_fail.png',
                story: 'The Ancestral Council’s light dims: "The ultimate challenge requires perfection across all eight subjects. Rest, and return when your knowledge is absolute."',
            },
            ancestor: {
                name: 'The Ancestral Council',
                tier: 'Ultimate — Final Level',
                restorationStep: 13, // For pre-hole rescue
                powers: [
                    { type: 'GUIDANCE_BASIC', effect: 1, trigger: 'CORRECT_ANSWER' },
                    { type: 'BOOST_STREAK', effect: 5, trigger: 'STREAK_3' },
                    { type: 'RESCUE_PRE_HOLE', effect: 13, trigger: 'WRONG_PRE_HOLE' }, // Restores to Step 13
                    { type: 'RESCUE_ENERGY', effect: '13-14', trigger: 'WRONG_PULL_BACK_HIGH_PROGRESS_LOW_TIMER', progressMin: 0.7 }, // Energy Rescue to Step 13-14
                    { type: 'SHIELD_SOFT', effect: 1, trigger: 'FIRST_WRONG_ANSWER', maxTriggers: 1 }
                ]
            }
        }
    ],

    // --- Quiz Bank (Unchanged) ---
    QUIZ_BANK: {
        'math': [
            { question: "5 + 3 = ?", answers: ["7", "8", "9", "10"], correct: "8" },
            { question: "What is 7 * 6?", answers: ["42", "49", "56", "63"], correct: "42" },
            { question: "If x=5, what is 2x+1?", answers: ["10", "11", "12", "7"], correct: "11" },
            { question: "How many sides does a hexagon have?", answers: ["5", "6", "7", "8"], correct: "6" },
        ],
        'history': [
            { question: "Capital of UK?", answers: ["Paris", "London", "Berlin", "Rome"], correct: "London" },
            { question: "When did the Titanic sink?", answers: ["1905", "1912", "1918", "1925"], correct: "1912" },
            { question: "Who was the first U.S. President?", answers: ["Jefferson", "Washington", "Lincoln", "Adams"], correct: "Washington" },
        ],
        'science': [
            { question: "Element O?", answers: ["Gold", "Oxygen", "Iron", "Carbon"], correct: "Oxygen" },
            { question: "Planet closest to the sun?", answers: ["Earth", "Mars", "Mercury", "Venus"], correct: "Mercury" },
            { question: "Water's chemical formula?", answers: ["CO2", "O2", "H2O", "NaCl"], correct: "H2O" },
        ],
        'literature': [
            { question: "Who wrote 'Romeo and Juliet'?", answers: ["Hemingway", "Shakespeare", "Twain", "Dickens"], correct: "Shakespeare" },
            { question: "What genre is 'The Hobbit'?", answers: ["Fantasy", "Sci-Fi", "Thriller", "Romance"], correct: "Fantasy" },
        ]
    }
};