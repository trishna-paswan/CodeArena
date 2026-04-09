"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { LEVEL_DATA } from "@/lib/levelData";

const ROBOT_SVG = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="10" width="50" height="40" rx="10" fill="#2a2a2a" stroke="#8A2BE2" stroke-width="3" />
        <circle cx="40" cy="30" r="5" fill="#8A2BE2">
            <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="30" r="5" fill="#8A2BE2">
            <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <line x1="50" y1="10" x2="50" y2="2" stroke="#8A2BE2" stroke-width="3" />
        <circle cx="50" cy="2" r="3" fill="#8A2BE2" />
        <rect x="30" y="55" width="40" height="35" rx="5" fill="#2a2a2a" stroke="#8A2BE2" stroke-width="3" />
        <rect x="15" y="60" width="10" height="25" rx="5" fill="#8A2BE2" />
        <rect x="75" y="60" width="10" height="25" rx="5" fill="#8A2BE2" />
        <rect x="37" y="65" width="26" height="15" rx="2" fill="#1a1a1a" stroke="#8A2BE2" stroke-width="1" />
    </svg>`;

const INSTRUCTIONS: Record<string, string> = {
    '/': 'Welcome to CodeArena! Click Initiate Combat to start.',
    '/gate': 'Please log in or create a new Game ID.',
    '/setup': 'Enter your name, choose a Game ID and difficulty level.',
    '/login': 'Welcome back! Enter your Game ID to continue.',
    '/dashboard': 'This is your dashboard. Track your progress and choose a challenge.',
    '/game/algorithm': 'Solve the algorithmic sequence to proceed.',
    '/game/frog-game': 'Help the frog navigate using logic.',
    '/game/coding-arena': 'Solve these C++ problems to prove your mastery.',
    '/grades/': 'Review your grades and performance here.',
    '/class': 'Check your grades across different levels here.',
    '/level': 'Detailed performance breakdown for this level.'
};

export default function RobotAssistant() {
    const pathname = usePathname();
    const [bubbleText, setBubbleText] = useState("");
    const [isBubbleActive, setIsBubbleActive] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const bubbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
            // Cancel any leftover speech on mount
            synthRef.current.cancel();
        }
        return () => {
            if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []);

    const getFemaleVoice = () => {
        if (!synthRef.current) return null;
        const voices = synthRef.current.getVoices();
        const voice = voices.find(v => 
            v.name.toLowerCase().includes('female') || 
            v.name.toLowerCase().includes('google us english') ||
            v.name.toLowerCase().includes('samantha') ||
            v.name.toLowerCase().includes('zira') ||
            v.name.toLowerCase().includes('victoria') ||
            v.name.toLowerCase().includes('google uk english female')
        );
        return voice || voices[0] || null;
    };

    const speak = (text: string) => {
        if (!synthRef.current) return;

        if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);

        // Always cancel existing speech before starting new
        synthRef.current.cancel();

        setBubbleText(text);
        setIsBubbleActive(true);

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = getFemaleVoice();
        if (voice) utterance.voice = voice;
        
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            bubbleTimeoutRef.current = setTimeout(() => {
                if (!synthRef.current?.speaking) {
                    setIsBubbleActive(false);
                }
            }, 3000);
        };

        synthRef.current.speak(utterance);
    };

    useEffect(() => {
        let instruction = INSTRUCTIONS['/grades/']; 
        
        // Handle level specific explanations
        if (pathname.startsWith('/level/')) {
            const levelId = pathname.split('/').pop() || "";
            if (LEVEL_DATA[levelId]) {
                instruction = LEVEL_DATA[levelId].explanation;
            }
        } else {
            for (const key in INSTRUCTIONS) {
                if (pathname.startsWith(key) && key !== '/') {
                    instruction = INSTRUCTIONS[key];
                    break;
                }
            }
        }
        
        if (pathname === '/') {
            instruction = INSTRUCTIONS['/'];
        }

        const timer = setTimeout(() => {
            speak(instruction);
        }, 1500);

        return () => {
            clearTimeout(timer);
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
    }, [pathname]);

    const handleIconClick = () => {
        let instruction = INSTRUCTIONS['/grades/'];
        
        if (pathname.startsWith('/level/')) {
            const levelId = pathname.split('/').pop() || "";
            if (LEVEL_DATA[levelId]) {
                instruction = LEVEL_DATA[levelId].explanation;
            }
        } else {
            for (const key in INSTRUCTIONS) {
                if (pathname.startsWith(key) && key !== '/') {
                    instruction = INSTRUCTIONS[key];
                    break;
                }
            }
        }
        
        if (pathname === '/') {
            instruction = INSTRUCTIONS['/'];
        }
        speak(instruction);
    };

    return (
        <div className="robot-assistant-container">
            <div className={`robot-speech-bubble ${isBubbleActive ? "active" : ""}`}>
                {bubbleText}
            </div>
            <div 
                className="robot-icon floating" 
                onClick={handleIconClick}
                dangerouslySetInnerHTML={{ __html: ROBOT_SVG }}
            />
        </div>
    );
}
