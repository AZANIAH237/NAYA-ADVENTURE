// --- game.js ---
// NOTE: Ensure data.js is loaded before game.js in index.html

// --- Game Constants (Structural) ---
const NALA_WIDTH = 200; 
const NALA_HEIGHT = 260; 
const INITIAL_TIME_SECONDS = 120; // Will be overwritten by LEVEL_DATA
const ANIMATION_DURATION = 500; 
const CAMERA_INTRO_DURATION = 2000; 
const VISIBLE_WINDOW_SIZE = 5; 
const GAME_AREA_HEIGHT_VH = 75; 
const CAMERA_CENTER_PERCENT = 50; 
const CAMERA_OFFSET_PX = 100; 
const STEP_RISE_VH = 18; 
const STEP_START_BOTTOM_VH = 25; 

// MODIFIED: NALA_POSES to use 7 distinct sprites
const NALA_POSES = {
    IDLE_FORWARD: 'img/nala_standing.png',      // 1. Default standing (prepares for forward)
    IDLE_BACKWARD: 'img/nala_standing_backward.png', // 2. Standing backward (prepares for backward)
    FORWARD_RIGHT: 'img/nala_step_forward_right.png', // 3. Moving forward (right foot)
    FORWARD_LEFT: 'img/nala_step_forward_left.png',  // 4. Moving forward (left foot)
    BACKWARD_RIGHT: 'img/nala_step_backward_right.png', // 5. Moving backward (right foot)
    BACKWARD_LEFT: 'img/nala_step_backward_left.png',   // 6. Moving backward (left foot)
    FALLING: 'img/nala_falling.png',
    VICTORY: 'img/nala_victory.png',
};

const BACKGROUND_IMAGES = [
    'img/background.png', 'img/background1.png', 'img/background2.png', 
    'img/background3.png' 
];
const HUT_IMAGES = {
    CLOSED: 'img/hut_door_closed.png',
    OPEN: 'img/hut_door_opened.png',
    GLOWING: 'img/hut_door_closed.png' 
};

// 🛠️ UPDATED: Ancestor Power Icon Mapping with New/Consolidated Types
const POWER_ICONS = {
    'GUIDANCE_BASIC': '👣',
    'SHIELD_SOFT': '🛡️',
    'BOOST_STREAK': '✨',
    'RESCUE_PRE_HOLE': '⬆️',
    'RESCUE_PULL_BACK': '⚓',
    'ENERGY_SLOW': '🐌',
    'RESCUE_ENERGY': '🔋',
    'DEFAULT': '❓'
};


// --- GAME STATE ---
let gameState = {
    currentScreen: 'intro', // 'intro', 'dashboard', 'level-intro', 'game', 'win', 'fail'
    hasSeenIntro: false,
    currentLevelId: 1, // Start at level 1
    currentLevelData: null,
    selectedSubjects: [],
    
    // In-Game State
    totalSteps: 0, 
    currentStep: 0, // 0-indexed: current position. Target step is TOTAL_STEPS
    timeRemaining: 0,
    timerInterval: null,
    isGameOver: false,
    correctStreak: 0,
    wrongAnswerCount: 0, // For Energy Mode trigger
    fallCount: 0,
    softShieldActive: true, // Tracks the single-use soft shield
    energyModeUsed: false,
    multiStepBoostsUsed: 0, 
    activePowers: [], // 🛠️ NEW: Holds the mutable power state (e.g., currentTriggers)
};

let stepPositions = [];
let currentFoot = 'LEFT'; // NEW: Track the foot for alternating animation

// --- SOUNDS ---
const SOUNDS = {
    CORRECT: 'audio/correct.mp3',
    WRONG: 'audio/wrong.mp3',
    SHIELD_ACTIVATE: 'audio/shield_activate.mp3',
    RESTORATION: 'audio/restoration.mp3',
    LEVEL_COMPLETE: 'audio/level_complete.mp3',
    GAME_OVER: 'audio/game_over.mp3',
    BACKGROUND_MUSIC: 'audio/background_music.mp3',
};
const audioElements = {}; // Map to hold Audio objects

// --- DOM ELEMENTS (Cached) ---
const D_INTRO_SCREEN = document.getElementById('intro-screen');
const D_DASHBOARD_SCREEN = document.getElementById('dashboard-screen');
const D_LEVEL_INTRO_SCREEN = document.getElementById('level-intro-screen');
const D_SUBJECT_CHOICES = document.getElementById('subject-choices'); 
const D_START_ADVENTURE_BTN = document.getElementById('start-adventure-btn');
const D_CANCEL_SELECTION_BTN = document.getElementById('cancel-selection-btn');
const D_GAME_CONTAINER = document.getElementById('game-container');
const D_SUBJECT_MODAL = document.getElementById('subject-modal');
const D_SETTINGS_MODAL = document.getElementById('settings-modal');

// Game Elements (Existing)
const nalaChar = document.getElementById('nala-character');
const nalaSprite = document.getElementById('nala-sprite');
const stepsPath = document.getElementById('steps-path');
const holeElement = document.getElementById('hole');
const gameScrollLayer = document.getElementById('game-scroll-layer'); 
const messageScreen = document.getElementById('message-screen');
const backgroundElement = document.getElementById('background');
const castleImage = document.getElementById('castle-image'); 
const timerDisplay = document.getElementById('timer');
const questionText = document.getElementById('question-text');
const answerChoicesContainer = document.getElementById('answer-choices');
const powerIndicator = document.getElementById('ancestor-power-indicator'); // Used in calculateStepChange

// --- UTILITY FUNCTIONS ---

function playSound(key) {
    // Check localStorage before playing
    if (localStorage.getItem('soundEffects') === 'off') return; 

    if (!audioElements[key]) {
        audioElements[key] = new Audio(SOUNDS[key]);
    }
    // Prevent stacking sounds by stopping and rewinding if it's not music
    if (key !== 'BACKGROUND_MUSIC') { 
        audioElements[key].pause();
        audioElements[key].currentTime = 0;
    }
    audioElements[key].play().catch(e => console.log("Audio playback failed:", e));
}

function stopMusic() {
    if (audioElements.BACKGROUND_MUSIC) {
        audioElements.BACKGROUND_MUSIC.pause();
    }
}

function startMusic() {
    // Check localStorage before playing
    if (localStorage.getItem('backgroundMusic') === 'off') return; 
    
    if (!audioElements.BACKGROUND_MUSIC) {
        audioElements.BACKGROUND_MUSIC = new Audio(SOUNDS.BACKGROUND_MUSIC);
        audioElements.BACKGROUND_MUSIC.loop = true;
    }
    audioElements.BACKGROUND_MUSIC.play().catch(e => console.log("Music playback failed:", e));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- STATE MANAGEMENT ---

function switchScreen(newScreen) {
    // hide everything first
    [D_INTRO_SCREEN, D_DASHBOARD_SCREEN, D_LEVEL_INTRO_SCREEN, D_GAME_CONTAINER, messageScreen].forEach(el => {
        el.classList.add('hidden');
    });

    // reset body classes
    document.body.classList.remove('game-active', 'screen-active');

    switch (newScreen) {
        case 'intro':
            D_INTRO_SCREEN.classList.remove('hidden');
            document.body.classList.add('screen-active');
            break;
        case 'dashboard':
            D_DASHBOARD_SCREEN.classList.remove('hidden');
            renderDashboard();
            document.body.classList.add('screen-active');
            break;
        case 'level-intro':
            D_LEVEL_INTRO_SCREEN.classList.remove('hidden');
            document.body.classList.add('screen-active');
            renderLevelIntro();
            break;
        case 'game':
            D_GAME_CONTAINER.classList.remove('hidden');
            document.body.classList.add('game-active');
            break;
        case 'win':
        case 'fail':
            D_GAME_CONTAINER.classList.remove('hidden'); // Keep game layer visible for nice transition
            messageScreen.classList.remove('hidden');
            document.body.classList.add('screen-active');
            break;
    }
    gameState.currentScreen = newScreen;
}

// --- 1. INTRO SCREEN LOGIC ---

let currentIntroIndex = 0;
function showIntroScreen() {
    if (gameState.hasSeenIntro) {
        switchScreen('dashboard');
        return;
    }
    
    currentIntroIndex = 0;
    // Assuming GAME_DATA is available (from data.js)
    if (typeof GAME_DATA === 'undefined' || !GAME_DATA.INTRO_STORY_SCREENS) return; 
    
    renderIntroSlide(currentIntroIndex);
    D_INTRO_SCREEN.classList.remove('hidden');
    document.getElementById('intro-next-btn').onclick = nextIntroSlide;
    document.getElementById('intro-skip-btn').onclick = skipIntro;
    document.getElementById('intro-start-btn').onclick = completeIntro;
}

function renderIntroSlide(index) {
    const slide = GAME_DATA.INTRO_STORY_SCREENS[index];
    document.getElementById('intro-image').src = slide.image;
    document.getElementById('intro-title').textContent = slide.title;
    document.getElementById('intro-detail').textContent = slide.story;

    const nextBtn = document.getElementById('intro-next-btn');
    const startBtn = document.getElementById('intro-start-btn');
    
    if (index === GAME_DATA.INTRO_STORY_SCREENS.length - 1) {
        nextBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        startBtn.classList.add('hidden');
    }
}

function nextIntroSlide() {
    currentIntroIndex++;
    if (currentIntroIndex < GAME_DATA.INTRO_STORY_SCREENS.length) {
        renderIntroSlide(currentIntroIndex);
    } else {
        completeIntro();
    }
}

function skipIntro() {
    completeIntro();
}

function completeIntro() {
    gameState.hasSeenIntro = true;
    localStorage.setItem('hasSeenIntro', 'true');
    switchScreen('dashboard');
}

// --- 2. DASHBOARD LOGIC ---

function renderDashboard() {
    stopMusic();
    startMusic(); // Start music only when entering the dashboard
    const gallery = document.getElementById('level-gallery');
    gallery.innerHTML = '';

    GAME_DATA.LEVELS_DATA.forEach(level => {
        const card = document.createElement('div');
        card.className = 'level-card';
        card.innerHTML = `
            <img class="card-image" src="${level.cardImage}" alt="Level ${level.id}" />
            <h3 class="card-title">Level ${level.id}: ${level.title}</h3>
            <div class="level-details hidden" id="details-${level.id}">
                <p>Steps: ${level.totalSteps}</p>
                <p>Time: ${Math.floor(level.timeLimit / 60)}m ${level.timeLimit % 60}s</p>
                <p>${level.mission}</p>
                <p>Ancestor: ${level.ancestor.name} (${level.ancestor.tier})</p>
                <button class="start-adventure-btn main-btn" data-level-id="${level.id}">Start Adventure</button>
            </div>
        `;
        
        // Toggle details on card click
        card.addEventListener('click', () => {
            document.getElementById(`details-${level.id}`).classList.toggle('hidden');
        });

        gallery.appendChild(card);
    });

    document.querySelectorAll('.start-adventure-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card details toggle
            
            // FIX APPLIED HERE: Correctly access the data attribute: dataset.levelId
            gameState.currentLevelId = parseInt(e.target.dataset.levelId); 
            
            gameState.currentLevelData = GAME_DATA.LEVELS_DATA.find(l => l.id === gameState.currentLevelId);
            switchScreen('level-intro');
        });
    });

    document.getElementById('view-story-btn').onclick = () => {
        gameState.hasSeenIntro = false; // Temporarily reset to view again
        showIntroScreen();
    };
    // Settings button handler is here
    document.getElementById('settings-btn').onclick = () => D_SETTINGS_MODAL.classList.remove('hidden');
}

// --- 3. LEVEL INTRO LOGIC ---

let currentIntroStoryIndex = 0;

// --- game.js: The Fixed renderLevelIntro Function ---

// --- game.js: The Fixed renderLevelIntro Function (with null checks) ---

function renderLevelIntro() {
    const data = gameState.currentLevelData;
    if (!data) return switchScreen('dashboard');

    // Ensure the main title is updated (this element is usually safe)
    const titleEl = document.getElementById('level-intro-title');
    if (titleEl) {
        titleEl.textContent = `Level ${data.id}: The Ascent of ${data.title}`;
    }
    
    // START FIX: Update Ancestor Guide Info
    const guideImageEl = document.getElementById('spirit-guide-image');
    const guideNameEl = document.getElementById('spirit-guide-name');

    // ⭐ CRITICAL NULL CHECK: Only proceed if both elements are found ⭐
    if (guideImageEl && guideNameEl) {
        // 1. Get the ancestor's name from the nested 'ancestor' object
        const ancestorName = data.ancestor ? (data.ancestor.name || 'The Ancestor') : 'The Guide';
        
        // 2. Get the image path from the top-level 'spiritGuideImage' property
        const imagePath = data.spiritGuideImage || 'img/ancestor_default.png';

        // Apply the values to the DOM elements
        guideNameEl.textContent = ancestorName;
        guideImageEl.src = imagePath; 
        guideImageEl.alt = `${ancestorName} - Spirit Guide`;
    } else {
        console.error("Level Intro: Missing 'spirit-guide-image' or 'spirit-guide-name' element in the DOM.");
    }
    // END FIX

    // --- CRITICAL BUTTON LOGIC: RUNS ONCE WHEN SCREEN IS SHOWN ---
    const actionButton = document.getElementById('select-subject-btn');
    const subjectsRequired = data.subjectsToSelect;
    const subjectsSelected = gameState.selectedSubjects.length;

    if (actionButton) { // Defensive check for the button too
        if (subjectsSelected === subjectsRequired) {
            actionButton.textContent = 'Start Ascent';
            actionButton.onclick = startAdventure;
        } else {
            actionButton.textContent = 'Select Subject';
            actionButton.onclick = showSubjectSelectionModal;
        }
    }
    
    currentIntroStoryIndex = 0;
    const introTextEl = document.getElementById('level-intro-text');
    if (introTextEl) introTextEl.textContent = ''; 
    
    setTimeout(() => {
        animateLevelIntroStory();
    }, 100);
}
function animateLevelIntroStory() {
    const storyTextEl = document.getElementById('level-intro-text');
    const story = gameState.currentLevelData.levelIntroStory;
    
    if (currentIntroStoryIndex < story.length) {
        storyTextEl.style.opacity = '0';
        setTimeout(() => {
            storyTextEl.textContent = story[currentIntroStoryIndex];
            storyTextEl.style.opacity = '1';
        }, 500); // Wait for fade-out

        setTimeout(() => {
            storyTextEl.style.opacity = '0';
            currentIntroStoryIndex++;
            animateLevelIntroStory(); // Recursive call for next slide
        }, 3000); // Display time
    } else {
        // === FIX: Story animation complete. Now finalize the button text and action. ===
        const data = gameState.currentLevelData;
        const actionButton = document.getElementById('select-subject-btn');
        const subjectsRequired = data.subjectsToSelect;
        const subjectsSelected = gameState.selectedSubjects.length;

        if (subjectsSelected === subjectsRequired) {
            // If the subject selection is complete, the button should say "Start Ascent"
            actionButton.textContent = 'Start Ascent';
            actionButton.onclick = startAdventure;
        } else {
            // If subject selection is still needed (e.g., if the user backed out)
            actionButton.textContent = 'Select Subject';
            actionButton.onclick = showSubjectSelectionModal;
        }
        // ==============================================================================
    }
}

// --- 4. SUBJECT SELECTION LOGIC ---

function showSubjectSelectionModal() {
    const data = gameState.currentLevelData;
    const requiredCountEl = document.getElementById('subject-count');
    const startButton = D_START_ADVENTURE_BTN;
    
    // Clear previous choices
    D_SUBJECT_CHOICES.innerHTML = '';
    
    // Set required count text
    requiredCountEl.textContent = data.subjectsToSelect;

    // Get the full list of available subjects from the quiz bank keys (from data.js)
    const availableSubjects = Object.keys(GAME_DATA.QUIZ_BANK);

    availableSubjects.forEach(subjectKey => {
        const btn = document.createElement('button');
        btn.className = 'subject-btn';
        btn.textContent = subjectKey.toUpperCase();
        
        // CRITICAL: Set the data attribute, which is read by handleStartAdventureFromModal
        btn.dataset.subject = subjectKey; 

        // Listener to toggle selection
        btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
            
            // Update button state based on selection count
            const selectedCount = D_SUBJECT_CHOICES.querySelectorAll('.subject-btn.selected').length;
            startButton.disabled = selectedCount !== data.subjectsToSelect;
        });

        D_SUBJECT_CHOICES.appendChild(btn);
    });

    // Assign handler to the 'Start Ascent' button (This calls your fixed saving logic)
    startButton.onclick = handleStartAdventureFromModal; 
    
    // Assign handler to the 'Cancel' button
    D_CANCEL_SELECTION_BTN.onclick = () => {
        D_SUBJECT_MODAL.classList.add('hidden');
    };
    
    // Ensure the start button is disabled initially
    startButton.disabled = true;

    // Show the modal
    D_SUBJECT_MODAL.classList.remove('hidden');
}

function handleStartAdventureFromModal() {
    const data = gameState.currentLevelData;
    
    // Select all subject buttons that have the 'selected' class
    const selectedButtons = D_SUBJECT_MODAL.querySelectorAll('.subject-btn.selected');
    
    // 1. CRITICAL STEP: SAVE THE SELECTIONS TO THE GAME STATE
    gameState.selectedSubjects = Array.from(selectedButtons).map(btn => {
        const subjectKey = btn.dataset.subject || '';
        return subjectKey.toLowerCase();
    }).filter(key => key !== ''); 

    // 2. Hide the modal
    D_SUBJECT_MODAL.classList.add('hidden');

    // 3. Check subject count and launch
    if (gameState.selectedSubjects.length === data.subjectsToSelect) {
        // State is saved. Start the game!
        startAdventure(); 
    } else {
        console.error("Subject selection failed: required subjects not met.");
        switchScreen('level-intro'); 
    }
}

function startAdventure() {
    D_SUBJECT_MODAL.classList.add('hidden');
    initializeGame();
    switchScreen('game');
}


// --- 5. CORE GAME LOGIC (Heavy Modification) ---

function initializeGame() {
    const data = gameState.currentLevelData;
    gameState.totalSteps = data.totalSteps;
    gameState.currentStep = data.startStep;
    gameState.timeRemaining = data.timeLimit;
    gameState.isGameOver = false;
    gameState.correctStreak = 0;
    gameState.wrongAnswerCount = 0;
    
    // Initialize active power state 🛠️ UPDATED FOR POWER TRACKING
    gameState.activePowers = data.ancestor.powers.map(p => ({
        ...p,
        currentTriggers: p.maxTriggers !== undefined ? p.maxTriggers : 1
    }));
    // Check if soft shield is one of the powers and initialize the separate tracker
    gameState.softShieldActive = gameState.activePowers.some(p => p.type === 'SHIELD_SOFT' && p.currentTriggers > 0);
    
    gameState.energyModeUsed = false;
    gameState.multiStepBoostsUsed = 0;
    gameState.fallCount = 0;
    
    // Stop music during gameplay
    stopMusic(); 

    // SCROLL LAYER HEIGHT: Recalculate based on new totalSteps
    const SCROLL_LAYER_HEIGHT_VH = Math.max(300, (gameState.totalSteps * STEP_RISE_VH) + 100);
    gameScrollLayer.style.height = `${SCROLL_LAYER_HEIGHT_VH}vh`;

    // 1. GENERATE STEPS (This creates fresh elements, hidden ahead of currentStep)
    generateSteps();
    
    updateNalaPosition(gameState.currentStep); 
    setNalaAnimation('IDLE');
    
    // Reset visual elements to a clean state
    gameScrollLayer.style.transition = 'none';
    gameScrollLayer.style.transform = 'none';

    // Reset Nala visual state
    nalaChar.style.opacity = '1';
    nalaChar.style.transform = 'translateX(-50%)';
    nalaChar.classList.remove('nala-small');
    nalaSprite.src = NALA_POSES.IDLE_FORWARD; // Ensure the new default is set

    // Reposition hut according to last step
    updateCastleImage(gameState.currentStep);

    // Load level-specific avatar (Ensure this property exists in your data.js)
    // NOTE: This will override the animation sprites if it exists. Remove this block if you want the 7 poses to be the only sprites used.
    if (gameState.currentLevelData.avatar) {
        nalaSprite.src = gameState.currentLevelData.avatar;
    } 

    // Render the ancestor powers UI 🛠️ CALLED AFTER STATE IS INITIALIZED
    renderAncestorPowers();

    // Intro Sweep
    updateBackground(gameState.currentStep);
    const vhInPx = window.innerHeight / 100;
    const scrollLayerPixelHeight = SCROLL_LAYER_HEIGHT_VH * vhInPx;
    const viewportPixelHeight = GAME_AREA_HEIGHT_VH * vhInPx;
    const startIntroTranslateY = -(scrollLayerPixelHeight - viewportPixelHeight);
    const finalTranslateY = updateCamera(gameState.currentStep); 

    gameScrollLayer.style.transition = `transform ${CAMERA_INTRO_DURATION}ms ease-out`; 
    gameScrollLayer.style.transform = `translateY(${startIntroTranslateY}px)`; 
    updateCastleImage(gameState.currentStep); 

    setTimeout(() => {
        gameScrollLayer.style.transform = `translateY(${finalTranslateY}px)`; 
        
        setTimeout(() => {
            gameScrollLayer.style.transition = `transform 0.5s ease-in-out`;
            
            // Only reveal visible steps (based on current logic)
            updateStepVisibility(gameState.currentStep); 
            
            updateCastleImage(gameState.currentStep);
            startTimer();
            loadQuestion();
        }, CAMERA_INTRO_DURATION + 100); 

    }, 500); 
}

function generateSteps() {
    stepsPath.innerHTML = '';
    stepPositions = []; 

    for (let index = 0; index < gameState.totalSteps; index++) { 
        // Zig-Zag Pattern
        const xPattern = [30, 50, 70, 50]; 
        const leftPos = xPattern[index % 4];
        const bottomPosVH = STEP_START_BOTTOM_VH + (index * STEP_RISE_VH);
        
        stepPositions.push({ left: leftPos, bottomVH: bottomPosVH });

        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.id = `step-${index}`;
        stepDiv.style.left = `${leftPos}%`;
        stepDiv.style.bottom = `${bottomPosVH}vh`; 
        
        const pole = document.createElement('div');
        pole.className = 'step-pole';
        stepDiv.appendChild(pole);

        stepsPath.appendChild(stepDiv);
        
        // --- HIDING LOGIC ---
        if (index <= gameState.currentStep) {
             // Step character is on or has passed: show it
             stepDiv.classList.add('revealed');
        } else {
             // Step is ahead: Explicitly apply inline style to override conflicts
             stepDiv.style.opacity = '0'; 
             // Use the desired hidden size. DO NOT USE scale(0)
             stepDiv.style.transform = 'scale(0.5)'; 
             // CSS handles visibility: hidden by default
        }
    }
}

function updateStepVisibility(centerStepIndex) {
    for (let i = 0; i < gameState.totalSteps; i++) {
        const stepDiv = document.getElementById(`step-${i}`);
        if (!stepDiv) continue;

        const isRevealed = stepDiv.classList.contains('revealed');

        if (isRevealed) {
            // STEP IS REVEALED (Passed or Next Target)
            
            // 1. Force Visible State (overrides CSS visibility:hidden)
            stepDiv.style.opacity = '1';
            stepDiv.style.visibility = 'visible'; 

            // 2. Apply perspective and scale based on distance from center
            const dist = Math.abs(centerStepIndex - i);
            const scale = Math.max(0.8, 1 - (dist * 0.05));
            stepDiv.style.transform = `perspective(200px) rotateX(10deg) scale(${scale})`;
            
        } else {
            // STEP IS NOT REVEALED (Future Step)

            // 1. Force Hidden State (Must hide regardless of proximity)
            stepDiv.style.opacity = '0';
            stepDiv.style.visibility = 'hidden'; 

            // 2. Apply hidden scale
            stepDiv.style.transform = 'scale(0.5)'; 
        }
    }
}

function updateCamera(stepIndex, tempShift = 0) {
    // SCROLL LAYER HEIGHT: Recalculate dynamically
    const SCROLL_LAYER_HEIGHT_VH = Math.max(300, (gameState.totalSteps * STEP_RISE_VH) + 100);
    
    if (!gameScrollLayer || stepIndex < 0) return 0; 
    
    const targetIndex = Math.min(stepIndex, gameState.totalSteps - 1); 
    const targetPos = stepPositions[targetIndex];
    if (!targetPos) return 0;

    const vhInPx = window.innerHeight / 100;
    const scrollLayerPixelHeight = SCROLL_LAYER_HEIGHT_VH * vhInPx;
    const viewportPixelHeight = GAME_AREA_HEIGHT_VH * vhInPx;
    
    const nalaBottomPx = targetPos.bottomVH * vhInPx;
    const nalaDistanceFromTopPx = scrollLayerPixelHeight - nalaBottomPx - (NALA_HEIGHT / 2);
    const cameraCenterPx = (CAMERA_CENTER_PERCENT / 100) * viewportPixelHeight;

    let baseTranslateY = -(nalaDistanceFromTopPx - cameraCenterPx);
    let finalTranslateY = baseTranslateY + tempShift;

    const maxScrollUp = -(scrollLayerPixelHeight - viewportPixelHeight); 
    const maxScrollDown = 100; 

    if (finalTranslateY < maxScrollUp) finalTranslateY = maxScrollUp;
    if (finalTranslateY > maxScrollDown) finalTranslateY = maxScrollDown;

    gameScrollLayer.style.transform = `translateY(${finalTranslateY}px)`;
    
    return finalTranslateY; 
}

function updateNalaPosition(stepIndex) {
    if (typeof stepPositions[stepIndex] === 'undefined') return;

    const targetPos = stepPositions[stepIndex];

    // Use percentage + transform translateX(-50%) to center Nala exactly above the step
    nalaChar.style.left = `${targetPos.left}%`;
    // small offset so Nala feet look on the step (tweak +3vh if you change step height)
    nalaChar.style.bottom = `${targetPos.bottomVH + 3}vh`;

    // Scale Character Down for the final step
    if (stepIndex === gameState.totalSteps - 1) {
        nalaChar.classList.add('nala-small');
    } else {
        nalaChar.classList.remove('nala-small');
    }

    // Reveal only appropriate steps
    updateStepVisibility(stepIndex);
    updateCamera(stepIndex, 0);
    updateBackground(stepIndex);
    updateCastleImage(stepIndex);

    // Make sure only the immediate next step gets the guide glow (don't reveal full future)
    const nextStep = document.getElementById(`step-${stepIndex + 1}`);
    if (nextStep) {
        nextStep.classList.add('revealed', 'next-step-guide');
        // ensure any further steps are NOT revealed
        for (let i = stepIndex + 2; i < gameState.totalSteps; i++) {
            const s = document.getElementById(`step-${i}`);
            if (s) s.classList.remove('revealed', 'next-step-guide');
        }
    }
}

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function startTimer() {
    clearTimeout(gameState.timerInterval);
    timerDisplay.textContent = `Time: ${formatTime(gameState.timeRemaining)}`;

    const tick = () => {
        gameState.timeRemaining--;
        timerDisplay.textContent = `Time: ${formatTime(gameState.timeRemaining)}`;

        if (gameState.timeRemaining <= 0) {
            gameOver("Time's Up!");
            return;
        }
        gameState.timerInterval = setTimeout(tick, 1000);
    };

    gameState.timerInterval = setTimeout(tick, 1000);
}

function loadQuestion() {
    const questionText = document.getElementById('question-text');
    let availableQuestions = [];

    // 1. Safety Check: Ensure data is available
    if(typeof GAME_DATA === 'undefined' || !GAME_DATA.QUIZ_BANK) {
         questionText.textContent = "Error: GAME_DATA or QUIZ_BANK is missing (check data.js)";
         return;
    }
    
    // 2. Compile all questions from selected subjects
    gameState.selectedSubjects.forEach(subjectId => {
        const bank = GAME_DATA.QUIZ_BANK[subjectId];
        if (bank && Array.isArray(bank)) {
            availableQuestions = availableQuestions.concat(bank);
        }
    });
    
    // 3. The Final Check
    if (availableQuestions.length === 0) {
        questionText.textContent = "Error: No questions available! Check data.js subjects and quiz bank.";
        return;
    }

    // 4. Select a random question from the entire pool (Questions recycle)
    const randomIndex = getRandomInt(0, availableQuestions.length - 1);
    const data = availableQuestions[randomIndex];
    
    // 5. Display the question and answers
    questionText.textContent = data.question;
    const ansContainer = document.getElementById('answer-choices');
    ansContainer.innerHTML = '';
    
    data.answers.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.onclick = () => handleAnswer(ans, data.correct); 
        btn.textContent = ans;
        ansContainer.appendChild(btn);
    });
} 

/**
 * Triggers visual effects for ancestral power activation. 🛠️ NEW FUNCTION FOR ANIMATIONS
 * @param {string} powerType - The type of power activated (e.g., 'SHIELD_SOFT', 'BOOST_STREAK').
 * @param {string} [message] - Optional message for the floating overlay.
 */
function handlePowerActivationEffect(powerType, message) {
    const nala = document.getElementById('nala-character');
    const overlay = document.getElementById('power-message-overlay');

    if (!nala) return;

    // --- 1. Character Aura/Glow Effects ---
    if (powerType.includes('SHIELD') || powerType.includes('RESCUE') || powerType.includes('RESTORATION')) {
        nala.classList.add('nala-shield-active');
        setTimeout(() => nala.classList.remove('nala-shield-active'), 1200);
    } else if (powerType.includes('BOOST') || powerType.includes('STREAK') || powerType.includes('ENERGY')) {
        nala.classList.add('nala-boost-active');
        setTimeout(() => nala.classList.remove('nala-boost-active'), 1000);
    }

    // --- 2. Floating Text Overlay ---
    if (message && overlay) {
        overlay.textContent = message;
        overlay.classList.remove('power-text-activated'); // Reset animation
        // Force reflow for re-triggering the animation
        void overlay.offsetWidth; 
        overlay.classList.add('power-text-activated');

        // Hide after animation duration
        setTimeout(() => overlay.classList.remove('power-text-activated'), 1500);
    }
}

/**
 * Gets the mutable ancestor power object by type from the active state.
 * @param {string} powerName - The name of the power to retrieve.
 * @returns {object | null} The mutable power object or null if not found.
 */
function getPower(powerName) {
    if (!gameState.activePowers) return null;
    return gameState.activePowers.find(p => p.type === powerName) || null;
}

/**
 * Checks if the current level's ancestor has a specific power (by existence).
 * @param {string} powerName - The name of the power to check.
 * @returns {boolean} True if the ancestor has the power, false otherwise.
 */
function hasPower(powerName) {
    return !!getPower(powerName); // Simple existence check
}

/**
 * Handles the logic when Nala falls off the path (newStep === -1).
 */
function handleFall() {
    gameState.fallCount++;
    // Play falling animation/sound
    setNalaAnimation('FALLING');
    playSound('GAME_OVER'); 

    // Add visual fall effect (the 'echo text' creation you had)
    if (stepPositions.length > 0) {
        // Use position of step 0 for reference
        const startPos = stepPositions[0]; 
        createEchoText('LOST!', 0, startPos.bottomVH, startPos.left, 1.5);
    }
    
    // After a delay, trigger game over
    setTimeout(() => {
        gameOver(`You fell to the start! Fall count: ${gameState.fallCount}`);
    }, 1500); 
}

/**
 * Renders the ancestor power UI, showing counts and depletion status. 🛠️ MODIFIED FOR ICONS
 */
function renderAncestorPowers() {
    const container = document.getElementById('ancestor-powers');
    if (!container) return; 

    container.innerHTML = ''; // clear

    const powers = gameState.activePowers || []; // Use the mutable state
    
    powers.forEach(p => {
        const pw = document.createElement('div');
        pw.className = 'anc-power';
        pw.dataset.type = p.type;
        
        let count = p.currentTriggers;
        
        // Special case: SHIELD_SOFT is tracked by a boolean (one-time use)
        if (p.type === 'SHIELD_SOFT') {
            count = gameState.softShieldActive ? 1 : 0;
        }

        const icon = POWER_ICONS[p.type] || POWER_ICONS.DEFAULT;

        // 🛠️ CHANGED: Using the icon and count only
        // Hide the power element entirely if it's GUIDANCE_BASIC (which is always 1 step forward)
        if (p.type === 'GUIDANCE_BASIC') return; 

        pw.innerHTML = `<span class="anc-icon" aria-label="${p.type} Power">${icon}</span><span class="anc-count">${count}</span>`;
        
        // Apply greyed class if count is 0
        if (count <= 0) pw.classList.add('anc-depleted'); 
        else pw.classList.remove('anc-depleted');
        
        container.appendChild(pw);
    });
}

/**
 * Calculates the final step change based on answer correctness, streak, 
 * and all ancestral powers/shields.
 */
function calculateStepChange(isCorrect, oldStep) {
    const data = gameState.currentLevelData;
    let autoJumpSteps = 0;
    
    // Helper function to safely update the power indicator text
    const updatePowerIndicator = (text) => {
        if (powerIndicator) {
            powerIndicator.textContent = text;
        } else {
            console.warn("UI Warning: powerIndicator element is null. Cannot display power activation message.");
        }
    };

    // --- 1. Correct Answer Handling ---
    if (isCorrect) {
        gameState.correctStreak++;
        gameState.wrongAnswerCount = 0; 

        // GUIDANCE_BASIC (Always 1 step)
        const guidancePower = getPower('GUIDANCE_BASIC');
        autoJumpSteps = guidancePower ? guidancePower.effect : 1; 


        // Check for Multi-Step Boosts (BOOST_STREAK)
        if (hasPower('BOOST_STREAK')) {
            const streakPowers = gameState.activePowers.filter(p => p.type === 'BOOST_STREAK');

            for (const boostPower of streakPowers) {
                // STREAK_2 trigger (Small Boost, max triggers/progress dependent)
                if (boostPower.trigger === 'STREAK_2' && gameState.correctStreak >= 2) {
                    const maxTriggers = boostPower.maxTriggers || 99;
                    const progressPercent = gameState.currentStep / gameState.totalSteps;
                    const timerPercent = gameState.timeRemaining / data.timeLimit;
                    
                    if (progressPercent <= (boostPower.progressMax || 0.5) && timerPercent > (boostPower.timerMin || 0.5) && gameState.multiStepBoostsUsed < maxTriggers) {
                        autoJumpSteps = boostPower.effect; 
                        gameState.multiStepBoostsUsed++;
                        
                        const message = `+${autoJumpSteps} Steps!`;
                        updatePowerIndicator(`Ancestral Power: ${data.ancestor.name}'s Small Boost! (${message})`);
                        handlePowerActivationEffect(boostPower.type, message); 
                        playSound('CORRECT');
                        break; // Only apply one streak boost per turn
                    }
                }
                
                // STREAK_3 trigger (Mini Multi-Step Reveal)
                if (boostPower.trigger === 'STREAK_3' && gameState.correctStreak >= 3) {
                    // Handle range effect [min, max]
                    if (typeof boostPower.effect === 'string' && boostPower.effect.includes('-')) {
                        const [min, max] = boostPower.effect.split('-').map(Number);
                        autoJumpSteps = getRandomInt(min, max);
                    } else {
                        autoJumpSteps = boostPower.effect;
                    }
                    
                    gameState.correctStreak = 0; // Reset streak
                    
                    const message = `+${autoJumpSteps} Steps!`;
                    updatePowerIndicator(`Ancestral Power: ${data.ancestor.name}'s Multi-Step Reveal! (${message})`);
                    handlePowerActivationEffect(boostPower.type, message);
                    playSound('CORRECT');
                    break; // Only apply one streak boost per turn
                }
            }
        }
    } 

    // --- 2. Wrong Answer Handling (SHIELDS & RESCUES) ---
    else { 
        gameState.correctStreak = 0; 
        gameState.wrongAnswerCount++;

        // SOFT SHIELD (Blocks backward movement once)
        if (gameState.softShieldActive && getPower('SHIELD_SOFT')) {
            autoJumpSteps = 0; 
            gameState.softShieldActive = false; // Consume the shield
            updatePowerIndicator(`Ancestral Power: Soft Shield 🛡️ Used!`);
            handlePowerActivationEffect('SHIELD_SOFT', 'SHIELDED!');
            playSound('SHIELD_ACTIVATE');
            renderAncestorPowers(); // Rerender UI to show depletion
            return autoJumpSteps; // Return immediately, shield prevented the fall
        }

        // Default fall back
        autoJumpSteps = -1; 
        playSound('WRONG');
    
        // If falling backward (autoJumpSteps < 0), check for Rescue Powers
        const newAttemptedStep = oldStep + autoJumpSteps;

        // ENERGY_SLOW (Timer Slowdown) - Triggered by critical fail/wrong answer count
        if (hasPower('ENERGY_SLOW') && !gameState.energyModeUsed) {
            const energySlowPower = getPower('ENERGY_SLOW');
            const progressPercent = oldStep / gameState.totalSteps;
            const timerPercent = gameState.timeRemaining / data.timeLimit;
            
            if (progressPercent < (energySlowPower.progressMax || 0.4) && gameState.wrongAnswerCount >= 3 && timerPercent < (energySlowPower.timerMax || 0.35)) {
                gameState.energyModeUsed = true;
                updatePowerIndicator(`Ancestral Power: ${data.ancestor.name}'s Energy Slow! (Timer +${energySlowPower.effect}s)`);
                handlePowerActivationEffect('ENERGY_SLOW', 'TIME SLOW!');
                
                clearInterval(gameState.timerInterval);
                gameState.timeRemaining += energySlowPower.effect; 
                startTimer();
            }
        }

        // RESCUE_PRE_HOLE (Restoration to a safe step near the start, if about to fall to 0)
        const rescuePreHolePower = getPower('RESCUE_PRE_HOLE');
        if (rescuePreHolePower && newAttemptedStep <= data.startStep) {
            // Restore to the effect step (e.g., step 3)
            autoJumpSteps = rescuePreHolePower.effect - oldStep; 
            updatePowerIndicator(`Ancestral Power: ${data.ancestor.name}'s Pre-Hole Rescue! (To Step ${rescuePreHolePower.effect})`);
            handlePowerActivationEffect('RESCUE_PRE_HOLE', 'RESCUED!');
            playSound('RESTORATION');
            return autoJumpSteps;
        }
        
        // RESCUE_PULL_BACK (Restores when pulled back from high progress)
        const rescuePullbackPower = getPower('RESCUE_PULL_BACK'); 
        const progressPercent = oldStep / gameState.totalSteps;
        if (rescuePullbackPower && newAttemptedStep <= 2 && progressPercent >= (rescuePullbackPower.progressMin || 0.6)) { 
            // Restore to the effect step (e.g., step 5)
            autoJumpSteps = rescuePullbackPower.effect - oldStep; 
            updatePowerIndicator(`Ancestral Power: ${data.ancestor.name}'s Pullback Rescue! (To Step ${rescuePullbackPower.effect})`);
            handlePowerActivationEffect('RESCUE_PULL_BACK', 'PULLBACK!');
            playSound('RESTORATION');
            return autoJumpSteps;
        }

        // RESCUE_ENERGY (Highest level rescue, conditional on high progress & low timer)
        const rescueEnergyPower = getPower('RESCUE_ENERGY'); 
        const timerPercent = gameState.timeRemaining / data.timeLimit;
        if (rescueEnergyPower && newAttemptedStep <= 2 && progressPercent >= (rescueEnergyPower.progressMin || 0.7) && timerPercent <= (rescueEnergyPower.timerMax || 0.3)) { 
            let safeStep = rescueEnergyPower.effect;
            
            // Handle range effect for safe step
            if (typeof safeStep === 'string' && safeStep.includes('-')) {
                const [min, max] = safeStep.split('-').map(Number);
                safeStep = getRandomInt(min, max);
            }
            
            autoJumpSteps = safeStep - oldStep;
            updatePowerIndicator(`Ancestral Power: ${data.ancestor.name}'s Energy Rescue! (To Step ${safeStep})`);
            handlePowerActivationEffect('RESCUE_ENERGY', 'RESCUE!');
            playSound('RESTORATION');

            rescueEnergyPower.currentTriggers--; // 🛠️ DECREMENT TRIGGER
            renderAncestorPowers(); 
            return autoJumpSteps;
        }
        
        // If no rescue was triggered, the fall penalty of -1 remains.
    }

    return autoJumpSteps;
}

function handleAnswer(selected, correct) {
    if (gameState.isGameOver) return;

    // Disable inputs
    answerChoicesContainer.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = true);

    const isCorrect = (selected === correct);
    const oldStep = gameState.currentStep;
    
    // Calculate new step using the consolidated function
    let stepChange = calculateStepChange(isCorrect, oldStep);
    let newStep = oldStep + stepChange;
    
    // Clamp newStep
    if (newStep < 0) newStep = -1; 

    // --- NEW LOGIC: DELAYED MOVEMENT ---

    if (isCorrect && stepChange > 0) {
        // 1. Reveal the new steps first (handling multi-jump boosts too)
        for(let i = oldStep + 1; i <= newStep; i++) {
            const stepToReveal = document.getElementById(`step-${i}`);
            if (stepToReveal) {
                stepToReveal.classList.add('revealed'); // Make it visible
                stepToReveal.classList.add('correct-glow'); // Make it glow
                
                // Remove glow after animation
                setTimeout(() => stepToReveal.classList.remove('correct-glow'), 1000);
            }
        }
        
        playSound('CORRECT'); // Play sound immediately on reveal

        // 2. Wait for user to see the step, THEN move Nala
        setTimeout(() => {
            executeMove(newStep, stepChange, isCorrect);
        }, 800); // 800ms delay for visual comprehension

    } else {
        // Backward movement, shielding, or falling happens immediately
        if(!isCorrect && stepChange !== 0) playSound('WRONG');
        executeMove(newStep, stepChange, isCorrect);
    }
}

// Helper function to actually move the character (extracted from old handleAnswer)
function executeMove(newStep, stepChange, isCorrect) {
    const oldStep = gameState.currentStep;
    let poseKey;

    // Camera shake/shift logic
    const tempShift = isCorrect ? -CAMERA_OFFSET_PX : CAMERA_OFFSET_PX; 
    updateCamera(oldStep, tempShift); 

    // --- NEW ANIMATION LOGIC: Determine the alternating pose ---
    if (isCorrect) {
        poseKey = (currentFoot === 'LEFT') ? 'FORWARD_RIGHT' : 'FORWARD_LEFT';
        nalaSprite.classList.add('step-forward');
        nalaSprite.classList.remove('step-backward');
    } else { 
        poseKey = (currentFoot === 'LEFT') ? 'BACKWARD_RIGHT' : 'BACKWARD_LEFT';
        nalaSprite.classList.add('step-backward');
        nalaSprite.classList.remove('step-forward');
    }

    // Update the foot state for the next step
    currentFoot = (currentFoot === 'LEFT') ? 'RIGHT' : 'LEFT';

    // Set the specific animation key
    setNalaAnimation(poseKey);
    // --- END NEW ANIMATION LOGIC ---
    
    // Fall logic
    if (newStep === -1) { 
        gameState.currentStep = -1; 
        handleFall(); 
        return;
    }
    
    // Move Logic
    if (stepChange !== 0) {
        const duration = stepChange > 1 ? ANIMATION_DURATION * 0.75 : 500;
        
        nalaChar.style.transition = `bottom ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), left ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    } else {
        // Shield used (no movement)
        nalaChar.style.transition = 'none';
        setNalaAnimation('IDLE');
    }
    
    gameState.currentStep = Math.max(0, newStep);
    
    // Level Complete Check
    if (gameState.currentStep >= gameState.totalSteps) {
        updateNalaPosition(gameState.totalSteps - 1); 
        levelComplete();
        return;
    }

    // Execute Move
    updateNalaPosition(gameState.currentStep); 

    // Reset for next question
    setTimeout(() => {
        if (!gameState.isGameOver) {
            setNalaAnimation('IDLE');
            loadQuestion();
            answerChoicesContainer.querySelectorAll('.answer-btn').forEach(btn => btn.disabled = false);
        }
    }, 700); // Wait a short time before loading next question
}

// --- NEW/MODIFIED FUNCTION: LEVEL COMPLETE/GAME OVER SCREENS ---

function levelComplete() {
    gameState.isGameOver = true;
    clearInterval(gameState.timerInterval);
    playSound('LEVEL_COMPLETE');
    
    // 1. Set Nala's pose to VICTORY
    setNalaAnimation('VICTORY');

    // 2. Animate Nala to Zoom in and Fade
    nalaChar.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    nalaChar.style.transform = 'scale(0.7)'; 
    nalaChar.style.opacity = '0';
    
    // 3. Door Closing Animation (Re-used)
    setTimeout(() => {
        nalaChar.classList.remove('nala-small');
        nalaChar.style.transition = 'bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.5s ease-out, opacity 0.5s ease-out';
        nalaChar.style.transform = 'none'; 

        castleImage.src = HUT_IMAGES.CLOSED;
        castleImage.classList.remove('glowing');
        castleImage.classList.add('final-glow-pulse'); 
        
        // 4. Display victory message and story
        setTimeout(() => {
            const winStory = gameState.currentLevelData.winStory;
            document.getElementById('message-text').textContent = winStory.title;
            document.getElementById('result-image').src = winStory.image;
            document.getElementById('result-story-detail').innerHTML = winStory.story;
            
            document.getElementById('next-level-btn').classList.remove('hidden');
            document.getElementById('retry-level-btn').classList.add('hidden');
            
            // Set up buttons
            document.getElementById('next-level-btn').onclick = () => {
                gameState.currentLevelId++;
                // Assuming GAME_DATA is loaded
                if (gameState.currentLevelId > GAME_DATA.LEVELS_DATA.length) {
                    alert('You have completed all levels! Returning to dashboard.');
                    switchScreen('dashboard');
                } else {
                    gameState.currentLevelData = GAME_DATA.LEVELS_DATA.find(l => l.id === gameState.currentLevelId);
                    switchScreen('level-intro');
                }
            };
            document.getElementById('back-home-btn').onclick = () => switchScreen('dashboard');
            
            switchScreen('win');
            
        }, 1000); 
        
    }, 500); 
}

function gameOver(msg) {
    gameState.isGameOver = true;
    clearInterval(gameState.timerInterval);
    playSound('GAME_OVER');

    // Wait for Nala's 1.5s falling animation to complete
    setTimeout(() => {
        document.getElementById('message-text').textContent = "You are Lost!";
        document.getElementById('result-image').src = 'img/ancestor_fail_default.png'; // Placeholder for failure image
        document.getElementById('result-story-detail').innerHTML = `${msg}! The spirit guide's energy is depleted. <br> You need to study harder.`;
        
        document.getElementById('next-level-btn').classList.add('hidden');
        document.getElementById('retry-level-btn').classList.remove('hidden');
        
        // Set up buttons: Retry should go back to subject selection (via level-intro)
        document.getElementById('retry-level-btn').onclick = () => {
             // Go back to subject selection to retry
             switchScreen('level-intro');
             // The subject modal will open from renderLevelIntro if the user clicks 'Select Subject'
        };
        document.getElementById('back-home-btn').onclick = () => switchScreen('dashboard');
        
        switchScreen('fail');
    }, 1500);
}

// --- SETTINGS LOGIC (Fixed to initialize correctly and only appear via Dashboard button) ---
function setupSettings() {
    // These elements now exist in the corrected index.html
    const musicToggle = document.getElementById('music-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    
    if(!musicToggle || !soundToggle) return; // Exit if elements aren't loaded yet

    // 1. Initialize localStorage defaults if not set
    if (localStorage.getItem('backgroundMusic') === null) {
        localStorage.setItem('backgroundMusic', 'on');
    }
    if (localStorage.getItem('soundEffects') === null) {
        localStorage.setItem('soundEffects', 'on');
    }

    // 2. Load initial state for the checkboxes
    musicToggle.checked = localStorage.getItem('backgroundMusic') === 'on';
    soundToggle.checked = localStorage.getItem('soundEffects') === 'on';

    // 3. Event listeners
    musicToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            localStorage.setItem('backgroundMusic', 'on');
            startMusic();
        } else {
            localStorage.setItem('backgroundMusic', 'off');
            stopMusic();
        }
    });

    soundToggle.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        localStorage.setItem('soundEffects', isChecked ? 'on' : 'off');
        if(isChecked) {
            // Play a confirmation sound effect when turning sounds ON
            playSound('CORRECT'); 
        }
    });
    
    // FIX: Ensure the close button works
    const closeBtn = document.getElementById('close-settings-btn');
    if(closeBtn) {
       closeBtn.onclick = () => D_SETTINGS_MODAL.classList.add('hidden');
    }
}


// --- DOMContentLoaded & INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup the settings functionality first (reads/sets localStorage and adds listeners)
    setupSettings(); 
    
    // 2. Check if user has seen intro before
    gameState.hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
    
    // 3. Start the flow: Intro -> Dashboard -> ... (Settings modal remains hidden)
    showIntroScreen(); 

    // Re-use existing functions (moved here)
    window.addEventListener('resize', () => updateCamera(gameState.currentStep));
});

// --- Existing/Modified Helper Functions (Keeping for reference/re-use) ---

function updateBackground(stepIndex) {
    const level = gameState.currentLevelData;
    // Check if the current level data has a 'backgrounds' array; if not, fall back to the global BACKGROUND_IMAGES array
    const images = (level && level.backgrounds && level.backgrounds.length) ? level.backgrounds : BACKGROUND_IMAGES;
    // Cycle through backgrounds every 2 steps
    const bgIndex = Math.floor(stepIndex / 2) % images.length;
    backgroundElement.style.backgroundImage = `url('${images[bgIndex]}')`;
}

function updateCastleImage(stepIndex) {
    castleImage.classList.remove('glowing', 'final-glow-pulse');
    castleImage.style.opacity = '0';

    if (!stepPositions.length) return;

    const lastStepPos = stepPositions[gameState.totalSteps - 1];
    // place hut slightly above the last step
    castleImage.style.bottom = `${(lastStepPos.bottomVH + 12)}vh`;
    castleImage.style.left = `50%`;
    castleImage.style.transform = 'translateX(-50%)';

    const hutVisibilityThreshold = gameState.totalSteps - 5;

    if (stepIndex >= hutVisibilityThreshold) {
        castleImage.style.opacity = '1';
        if (stepIndex === gameState.totalSteps - 2) {
            castleImage.src = HUT_IMAGES.CLOSED;
        } else if (stepIndex === gameState.totalSteps - 1) {
            castleImage.src = HUT_IMAGES.OPEN;
            castleImage.classList.add('glowing');
        } else if (stepIndex >= gameState.totalSteps) {
            castleImage.src = HUT_IMAGES.GLOWING;
            castleImage.classList.add('final-glow-pulse');
        } else {
            castleImage.src = HUT_IMAGES.CLOSED;
        }
    }
}

// MODIFIED: Set Nala's animation
function setNalaAnimation(poseKey) {
    // Determine the correct IDLE pose based on the last movement
    if (poseKey === 'IDLE') {
        if (nalaSprite.classList.contains('step-forward')) {
            poseKey = 'IDLE_FORWARD';
        } else if (nalaSprite.classList.contains('step-backward')) {
            poseKey = 'IDLE_BACKWARD';
        } else {
            poseKey = 'IDLE_FORWARD'; // Default starting pose
        }
    }

    // Ensure the poseKey exists in NALA_POSES before setting the source
    if(nalaSprite.src && NALA_POSES[poseKey]) {
        nalaSprite.src = NALA_POSES[poseKey];
    }
}

// NEW: Echo Text Creation (Re-used for fall)
function createEchoText(text, delay, startTop, startLeft, duration) {
    const textEl = document.createElement('div');
    textEl.className = 'echo-text';
    textEl.textContent = text;
    textEl.style.top = `${startTop}vh`;
    textEl.style.left = `${startLeft}%`;
    textEl.style.opacity = '0';
    textEl.style.transition = `transform ${duration}s ease-out, opacity ${duration}s ease-out, top ${duration}s ease-out`;

    gameScrollLayer.appendChild(textEl);

    setTimeout(() => {
        textEl.style.opacity = '0.5'; 
        textEl.style.transform = 'translate(-50%, 0) scale(1.5)';
        textEl.style.top = `${startTop - 15}vh`; 

        setTimeout(() => {
            textEl.style.opacity = '0'; 
            textEl.style.transform = 'translate(-50%, 0) scale(2)';
            
            setTimeout(() => textEl.remove(), duration * 1000); 
        }, 50); 
        
    }, delay);
}