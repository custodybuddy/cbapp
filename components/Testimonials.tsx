
import React from 'react';

const Testimonials: React.FC = () => {
    return (
        <section id="social-proof" className="py-12 md:py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in">A <span className="text-amber-400">Partner</span> Who <span className="text-amber-400">Understands.</span></h2>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 animate-fade-in delay-100">
                    Don't just take our word for it. See how CustodyBuddy has helped parents like you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-800/50 backdrop-blur-sm h-full p-8 rounded-2xl shadow-xl text-left animate-fade-in-up delay-200 border border-amber-400/50 transition-all duration-300 ease-out hover:bg-slate-700/80 motion-safe:hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/10 hover:border-amber-400">
                        <p className="text-xl italic mb-4">"CustodyBuddy gave me the confidence to stand my ground. I finally have court-ready evidence to expose the lies my ex has been telling."</p>
                        <p className="font-bold text-amber-400">Sarah M., Toronto</p>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm h-full p-8 rounded-2xl shadow-xl text-left animate-fade-in-up delay-300 border border-amber-400/50 transition-all duration-300 ease-out hover:bg-slate-700/80 motion-safe:hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/10 hover:border-amber-400">
                        <p className="text-xl italic mb-4">"As a self-represented father, I felt completely outmatched. The 'Fathers' Rights Ontario' tool was a game-changer. I'm no longer fighting blind."</p>
                        <p className="font-bold text-amber-400">David P., Ottawa</p>
                    </div>
                </div>
                <div className="mt-12 animate-fade-in-up delay-400">
                    <span className="text-3xl font-bold text-amber-400">89%</span>
                    <p className="text-gray-400">of users report improved case outcomes after using CustodyBuddy.</p>
                </div>
            </div>
        </section>
    );
};

export default React.memo(Testimonials);