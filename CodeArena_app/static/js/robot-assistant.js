(function() {
    const ROBOT_SVG = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Robot Head -->
        <rect x="25" y="10" width="50" height="40" rx="10" fill="#2a2a2a" stroke="#8A2BE2" stroke-width="3" />
        <!-- Eyes -->
        <circle cx="40" cy="30" r="5" fill="#8A2BE2">
            <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="30" r="5" fill="#8A2BE2">
            <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <!-- Antennas -->
        <line x1="50" y1="10" x2="50" y2="2" stroke="#8A2BE2" stroke-width="3" />
        <circle cx="50" cy="2" r="3" fill="#8A2BE2" />
        <!-- Robot Body -->
        <rect x="30" y="55" width="40" height="35" rx="5" fill="#2a2a2a" stroke="#8A2BE2" stroke-width="3" />
        <!-- Arms -->
        <rect x="15" y="60" width="10" height="25" rx="5" fill="#8A2BE2" />
        <rect x="75" y="60" width="10" height="25" rx="5" fill="#8A2BE2" />
        <!-- Screen on Chest -->
        <rect x="37" y="65" width="26" height="15" rx="2" fill="#1a1a1a" stroke="#8A2BE2" stroke-width="1" />
    </svg>`;

    const INSTRUCTIONS = {
        '/': 'Welcome to CodeArena! Click Initiate Combat to start.',
        '/gate': 'Please log in or create a new Game ID.',
        '/setup': 'Enter your name, choose a Game ID and difficulty level.',
        '/login': 'Welcome back! Enter your Game ID to continue.',
        '/dashboard': 'This is your dashboard. Track your progress and choose a challenge.',
        '/game/algorithm': 'Solve the algorithmic sequence to proceed.',
        '/game/frog-game': 'Help the frog navigate using logic.',
        '/game/coding-arena': 'Solve these C++ problems to prove your mastery.',
        '/grades/': 'Review your grades and performance here.',
        '/game/grades-dashboard': 'Review your grades and performance here.'
    };

    let synth = window.speechSynthesis;
    let speaking = false;
    let bubbleTimeout = null;

    // Immediately cancel any leftover speech from previous page
    if (synth) {
        synth.cancel();
    }

    function getFemaleVoice() {
        const voices = synth.getVoices();
        const voice = voices.find(v => 
            v.name.toLowerCase().includes('female') || 
            v.name.toLowerCase().includes('google us english') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('victoria') ||
            v.name.toLowerCase().includes('google uk english female')
        );
        return voice || voices[0] || null;
    }

    function speak(text) {
        if (!synth) return;

        // Clear any pending bubble removal
        if (bubbleTimeout) clearTimeout(bubbleTimeout);

        // Always cancel before speaking new text
        synth.cancel();

        const bubble = document.getElementById('robot-bubble');
        if (bubble) {
            bubble.textContent = text;
            bubble.classList.add('active');
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = getFemaleVoice();
        if (voice) utterance.voice = voice;
        
        utterance.rate = 1.0;
        utterance.pitch = 1.0; 
        
        utterance.onend = () => {
            speaking = false;
            bubbleTimeout = setTimeout(() => {
                if (!speaking && bubble && !synth.speaking) {
                    bubble.classList.remove('active');
                }
            }, 3000);
        };

        utterance.onstart = () => {
            speaking = true;
        };

        synth.speak(utterance);
    }

    function initRobot() {
        const container = document.createElement('div');
        container.className = 'robot-assistant-container';
        
        const bubble = document.createElement('div');
        bubble.className = 'robot-speech-bubble';
        bubble.id = 'robot-bubble';
        
        const robotIcon = document.createElement('div');
        robotIcon.className = 'robot-icon floating';
        robotIcon.innerHTML = ROBOT_SVG;
        
        container.appendChild(bubble);
        container.appendChild(robotIcon);
        document.body.appendChild(container);

        const path = window.location.pathname;
        let instruction = INSTRUCTIONS[path];
        
        if (!instruction) {
            for (const key in INSTRUCTIONS) {
                if (path.startsWith(key) && key !== '/') {
                    instruction = INSTRUCTIONS[key];
                    break;
                }
            }
        }
        
        if (!instruction) instruction = INSTRUCTIONS['/'];

        robotIcon.addEventListener('click', () => {
            speak(instruction);
        });

        // Delay initial speech to allow page to load and voices to initialize
        setTimeout(() => {
            speak(instruction);
        }, 1500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRobot);
    } else {
        initRobot();
    }

    // Some browsers need this to load voices
    if (synth && synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = () => {
            // Just triggers voice loading
            getFemaleVoice();
        };
    }
})();
