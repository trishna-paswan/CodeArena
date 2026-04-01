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
        '/': 'Welcome to CodeArena, the digital coliseum where logic meets combat. Click Initiate Combat to start your journey.',
        '/gate': 'Identify yourself! You can either log in with your existing Game ID or set up a new identity if it is your first time here.',
        '/setup': 'Tell me about yourself. Enter your name and choose a unique Game ID to enter the arena. Don\'t forget to pick your difficulty level!',
        '/login': 'Welcome back, warrior! Please enter your unique Game ID to regain access to your dashboard and progress.',
        '/dashboard': 'This is your mission control. Here you can track your activity, view your progress, and choose your next challenge from the Combat Arenas.',
        '/game/algorithm': 'Test your algorithmic thinking here. Follow the steps and solve the sequence to proceed.',
        '/game/frog-game': 'In the Frog Game, use your coding logic to help the frog navigate through the obstacles. Precision is key!',
        '/game/coding-arena': 'The ultimate challenge! Write real code to solve these C++ problems. Prove your mastery over syntax and logic.',
        '/grades/': 'Review your performance here. Check your grades across different levels and see where you need to improve.',
        '/game/grades-dashboard': 'Review your performance here. Check your grades across different levels and see where you need to improve.'
    };

    function initRobot() {
        // Create container
        const container = document.createElement('div');
        container.className = 'robot-assistant-container';
        
        // Create speech bubble
        const bubble = document.createElement('div');
        bubble.className = 'robot-speech-bubble';
        bubble.id = 'robot-bubble';
        
        // Create robot icon
        const robotIcon = document.createElement('div');
        robotIcon.className = 'robot-icon floating';
        robotIcon.innerHTML = ROBOT_SVG;
        
        container.appendChild(bubble);
        container.appendChild(robotIcon);
        document.body.appendChild(container);

        // Get instruction based on current path
        const path = window.location.pathname;
        let instruction = INSTRUCTIONS[path] || INSTRUCTIONS['/'];
        
        // Special case for Next.js routes under /grades/
        if (path.startsWith('/grades/')) {
            instruction = INSTRUCTIONS['/grades/'];
        }

        // Add click listener to repeat instruction
        robotIcon.addEventListener('click', () => {
            speak(instruction);
        });

        // Delay initial speech to allow page to load
        setTimeout(() => {
            speak(instruction);
        }, 1500);
    }

    let synth = window.speechSynthesis;
    let speaking = false;

    function speak(text) {
        if (speaking) {
            synth.cancel();
        }

        const bubble = document.getElementById('robot-bubble');
        bubble.textContent = text;
        bubble.classList.add('active');

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher pitch for a robot feel
        
        utterance.onend = () => {
            speaking = false;
            // Keep bubble visible for a few seconds after speaking
            setTimeout(() => {
                if (!speaking) {
                    bubble.classList.remove('active');
                }
            }, 3000);
        };

        utterance.onstart = () => {
            speaking = true;
        };

        synth.speak(utterance);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRobot);
    } else {
        initRobot();
    }
})();
