"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

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
    '/': 'Welcome to CodeArena, the digital coliseum where logic meets combat. Click Initiate Combat to start your journey.',
    '/gate': 'Identify yourself! You can either log in with your existing Game ID or set up a new identity if it is your first time here.',
    '/setup': 'Tell me about yourself. Enter your name and choose a unique Game ID to enter the arena. Don\'t forget to pick your difficulty level!',
    '/login': 'Welcome back, warrior! Please enter your unique Game ID to regain access to your dashboard and progress.',
    '/dashboard': 'This is your mission control. Here you can track your activity, view your progress, and choose your next challenge from the Combat Arenas.',
    '/game/algorithm': 'Test your algorithmic thinking here. Follow the steps and solve the sequence to proceed.',
    '/game/frog-game': 'In the Frog Game, use your coding logic to help the frog navigate through the obstacles. Precision is key!',
    '/game/coding-arena': 'The ultimate challenge! Write real code to solve these C++ problems. Prove your mastery over syntax and logic.',
    '/grades/': 'Review your performance here. Check your grades across different levels and see where you need to improve.',
    '/class': 'Review your performance here. Check your grades across different levels and see where you need to improve.',
    '/level': 'Review your performance here. Check your grades across different levels and see where you need to improve.'
};

export default function RobotAssistant() {
    const pathname = usePathname();
    const [bubbleText, setBubbleText] = useState("");
    const [isBubbleActive, setIsBubbleActive] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
        }
    }, []);

    const speak = (text: string) => {
        if (!synthRef.current) return;

        if (isSpeaking) {
            synthRef.current.cancel();
        }

        setBubbleText(text);
        setIsBubbleActive(true);

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            setIsSpeaking(false);
            setTimeout(() => {
                setIsBubbleActive(false);
            }, 3000);
        };

        synthRef.current.speak(utterance);
    };

    useEffect(() => {
        let instruction = INSTRUCTIONS['/grades/']; // Default for grades dashboard
        
        // Find if any key matches
        for (const key in INSTRUCTIONS) {
            if (pathname.startsWith(key) && key !== '/') {
                instruction = INSTRUCTIONS[key];
                break;
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
        for (const key in INSTRUCTIONS) {
            if (pathname.startsWith(key) && key !== '/') {
                instruction = INSTRUCTIONS[key];
                break;
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
