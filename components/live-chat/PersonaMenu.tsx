
import React from 'react';
import { Persona } from '../../prompts';
import LightbulbIcon from '../icons/LightbulbIcon';
import GavelIcon from '../icons/GavelIcon';
import HeartIcon from '../icons/HeartIcon';
import CheckCheckIcon from '../icons/CheckCheckIcon';

const personaDetails: Record<Persona, { icon: React.ReactNode; description: string; }> = {
    'Strategic Advisor': {
        icon: <LightbulbIcon className="w-5 h-5" />,
        description: "Balanced, calm, and focuses on strategy.",
    },
    'Strict but Fair': {
        icon: <GavelIcon className="w-5 h-5" />,
        description: "Formal, direct, and focuses on rules.",
    },
    'Empathetic Listener': {
        icon: <HeartIcon className="w-5 h-5" />,
        description: "Supportive, validating, and patient.",
    },
};

interface PersonaMenuProps {
    isOpen: boolean;
    selectedPersona: Persona;
    onSelectPersona: (persona: Persona) => void;
}

const PersonaMenu: React.FC<PersonaMenuProps> = ({ isOpen, selectedPersona, onSelectPersona }) => {
    if (!isOpen) return null;

    return (
        <div 
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="persona-menu-button"
            className="absolute top-full right-0 mt-2 w-64 bg-slate-700 rounded-lg shadow-2xl z-10 border border-slate-600 animate-fade-in-up-fast"
        >
            <div className="p-3 border-b border-slate-600">
                <p className="font-semibold text-white text-sm">Select Persona</p>
            </div>
            <div className="py-1">
                {Object.keys(personaDetails).map((p) => {
                    const persona = p as Persona;
                    const details = personaDetails[persona];
                    const isSelected = selectedPersona === persona;
                    return (
                        <button
                            key={persona}
                            onClick={() => onSelectPersona(persona)}
                            role="menuitemradio"
                            aria-checked={isSelected}
                            className="w-full text-left px-3 py-2 text-sm flex items-center gap-3 hover:bg-slate-600 transition-colors group"
                        >
                            <span className="text-amber-400">{details.icon}</span>
                            <div className="flex-grow">
                                <p className="text-white font-medium">{persona}</p>
                                <p className="text-gray-400 text-xs">{details.description}</p>
                            </div>
                            {isSelected && <CheckCheckIcon />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PersonaMenu;