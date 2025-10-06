
import React from 'react';
import CheckCheckIcon from './icons/CheckCheckIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

const Hero: React.FC = () => {
    return (
        <section className="flex items-center justify-center pt-32 pb-12 md:pt-40 md:pb-16 text-center relative overflow-hidden">
            <div className="container mx-auto px-4 z-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 animate-fade-in-down">
                    <span className="text-amber-400">Your Ally</span> in Co-Parenting <br className="hidden sm:inline" />
                    with a <span className="text-amber-400">Toxic Ex</span>.
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl font-light max-w-3xl mx-auto mb-6 text-gray-300 animate-fade-in delay-200">
                    AI-Powered Legal Toolkit for Self-Represented Parents. <br className="hidden sm:inline" />
                    Transform stress into strategy, turn manipulation into court evidence.
                </p>
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-400">
                    <a href="#features" className="inline-block bg-amber-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-out motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 animate-pulse-bright">
                        Document Their Lies
                    </a>
                    <a href="#social-proof" className="inline-block bg-transparent text-amber-400 border-2 border-amber-400 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 ease-out hover:bg-amber-400 hover:text-black motion-safe:hover:scale-105 motion-safe:active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                        See Success Stories
                    </a>
                </div>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-gray-400 animate-fade-in-up delay-500">
                    <span className="flex items-center space-x-2">
                        <CheckCheckIcon />
                        <span>Court-Ready Format</span>
                    </span>
                    <span className="flex items-center space-x-2">
                       <ShieldCheckIcon />
                        <span>AI-Powered Insights</span>
                    </span>
                </div>
            </div>
        </section>
    );
};

export default React.memo(Hero);