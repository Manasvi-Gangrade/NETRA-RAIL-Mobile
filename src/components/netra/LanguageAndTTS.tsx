import React, { createContext, useContext, useEffect, useState, useCallback, useRef, memo } from "react";

// --- GLOBAL TYPES FOR GOOGLE TRANSLATE ---
declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

// --- PART 1: TEXT-TO-SPEECH (TTS) ON HOVER CONTEXT ---
interface TTSContextType {
    speak: (text: string, lang?: string) => void;
    stop: () => void;
    speaking: boolean;
    supported: boolean;
    ttsEnabled: boolean;
    setTtsEnabled: (enabled: boolean) => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    // Auto-enable Voice on hover by default
    const [ttsEnabled, setTtsEnabled] = useState(true);
    const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

    // Initialize speech synthesis and load voices
    useEffect(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            setSupported(true);
            const updateVoices = () => {
                voicesRef.current = window.speechSynthesis.getVoices();
            };
            window.speechSynthesis.onvoiceschanged = updateVoices;
            updateVoices();
        }
    }, []);

    // Speak Function that auto-detects current Google Translate language
    const speak = useCallback((text: string, manualLang?: string) => {
        if (!supported || typeof window === "undefined") return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();

        // Detect current language from Google Translate Cookie
        let lang = manualLang;
        if (!lang) {
            const googCookie = document.cookie.match(/(^|;)\s*googtrans=([^;]+)/);
            if (googCookie && googCookie[2]) {
                // Extracts target language from cookie (e.g., "/en/hi" -> "hi")
                const parts = googCookie[2].split('/');
                lang = parts.length > 2 ? parts[2] : "en";
            } else {
                lang = "en"; // Default fallback
            }
        }

        const activeLang = lang || "en";

        // BCP-47 Locale mapper for accurate multilingual speech synthesis
        const localeMap: Record<string, string> = {
            hi: "hi-IN", mr: "mr-IN", gu: "gu-IN", ta: "ta-IN", te: "te-IN",
            kn: "kn-IN", bn: "bn-IN", ml: "ml-IN", pa: "pa-IN", ur: "ur-IN",
            as: "as-IN", or: "or-IN", ne: "ne-NP", sa: "sa-IN", ja: "ja-JP",
            ko: "ko-KR", de: "de-DE", fr: "fr-FR", es: "es-ES", it: "it-IT",
            pt: "pt-PT", ru: "ru-RU", "zh-CN": "zh-CN", "zh-TW": "zh-TW",
            ar: "ar-SA", en: "en-US"
        };

        const targetLocale = localeMap[activeLang] || activeLang;
        utterance.lang = targetLocale;

        // Try to find a voice that matches the selected language locale
        let preferredVoice = voices.find(
            v => v.lang.toLowerCase().startsWith(activeLang.toLowerCase()) ||
                 v.lang.toLowerCase().startsWith(targetLocale.toLowerCase())
        );

        // Fallback to default English voice if no regional voice binary is installed on device
        if (!preferredVoice) {
            preferredVoice = voices.find(v => v.lang.startsWith("en-US") || v.name.includes("Google US"));
        }

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported]);

    const stop = useCallback(() => {
        if (!supported || typeof window === "undefined") return;
        window.speechSynthesis.cancel();
        setSpeaking(false);
    }, [supported]);

    // Global Hover Listener to trigger speech
    useEffect(() => {
        if (!ttsEnabled || !supported) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Target elements that usually contain readable text
            const interactable = target.closest('button, a, h1, h2, h3, h4, h5, h6, p, li, span, label');

            if (interactable) {
                // First look for screen-reader text, then alt text, then visible text
                const text = interactable.getAttribute('aria-label') ||
                    interactable.getAttribute('alt') ||
                    (interactable as HTMLElement).innerText;

                if (text && text.trim().length > 0) {
                    // Prevent reading extremely long chunks of text accidentally
                    if (text.length < 300) {
                        speak(text);
                    }
                }
            }
        };

        const handleMouseOut = () => {
            stop();
        };

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
            stop();
        };
    }, [ttsEnabled, supported, speak, stop]);

    return (
        <TTSContext.Provider value={{ speak, stop, speaking, supported, ttsEnabled, setTtsEnabled }}>
            {children}
        </TTSContext.Provider>
    );
};

export const useTTS = () => {
    const context = useContext(TTSContext);
    if (!context) throw new Error("useTTS must be used within a TTSProvider");
    return context;
};

// --- PART 2: GOOGLE TRANSLATE WIDGET COMPONENT ---
export const GoogleTranslateWidget = memo(() => {
    useEffect(() => {
        if (typeof window === "undefined") return;

        window.googleTranslateElementInit = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en', // Base language of your app
                        autoDisplay: false
                    },
                    'google_translate_element'
                );
            }
        };

        // Check if the script is already added
        if (!document.getElementById("google-translate-script")) {
            // Injects the Google Translate Script
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        } else {
            if (window.google && window.google.translate) {
                window.googleTranslateElementInit();
            }
        }
    }, []);

    return (
        <div
            id="google_translate_element"
            style={{ display: "flex", alignItems: "center", minWidth: "140px" }}
        >
            {/* The Google Translate dropdown will be injected here automatically */}
        </div>
    );
});
