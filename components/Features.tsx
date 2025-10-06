import React from 'react';
import { features } from '../constants';
import CalendarCheckIcon from './icons/CalendarCheckIcon';
import SwordsIcon from './icons/SwordsIcon';
import MailPlusIcon from './icons/MailPlusIcon';
import { useModal } from '../hooks/useModal';
import { ModalType } from '../contexts/ModalContext';

const featureIcons: { [key: string]: React.ReactNode } = {
    CalendarCheck: <CalendarCheckIcon />,
    Swords: <SwordsIcon />,
    MailPlus: <MailPlusIcon />,
};

const Features: React.FC = () => {
    const { openModal, activeModal } = useModal();

    const handleButtonClick = (featureId: string) => {
        if (featureId === 'case-analysis' || featureId === 'email-buddy' || featureId === 'report-incident') {
            openModal(featureId as ModalType);
        }
    };
    
    return (
        <section id="features" className="bg-slate-950 py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-16 animate-fade-in-up">
                    <span className="text-amber-400">AI Tools</span> to<span className="text-amber-400"> Level</span> the<span className="text-amber-400"> <i>Playing Field</i></span>.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className={`bg-slate-800/50 backdrop-blur-sm h-full p-8 rounded-2xl shadow-xl flex flex-col items-center animate-fade-in-up delay-${index * 100} transition-all duration-300 ease-out hover:bg-slate-700/80 motion-safe:hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/10 border border-amber-400/50 hover:border-amber-400`}>
                            <div className="p-4 rounded-full bg-amber-400 text-slate-900 mb-4">
                                {featureIcons[feature.icon]}
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-balance">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 mb-4 flex-grow text-balance">{feature.description}</p>
                            {feature.id === 'case-analysis' || feature.id === 'email-buddy' || feature.id === 'report-incident' ? (
                                <button
                                    onClick={() => handleButtonClick(feature.id)}
                                    className="inline-block bg-amber-400 text-black font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 mt-auto focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                                    aria-haspopup="dialog"
                                    aria-expanded={activeModal === feature.id}
                                >
                                    {feature.buttonText}
                                </button>
                            ) : (
                                <a 
                                    href={feature.link} 
                                    className="inline-block bg-amber-400 text-black font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 mt-auto focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                                    target={feature.link && feature.link.startsWith('http') ? '_blank' : '_self'}
                                    rel={feature.link && feature.link.startsWith('http') ? 'noopener noreferrer' : ''}
                                >
                                    {feature.buttonText}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;