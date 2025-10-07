import React from 'react';
import UploadIcon from './icons/UploadIcon';
import CpuIcon from './icons/CpuIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';


const HowItWorks: React.FC = () => {
    
    const steps = [
        {
            icon: <UploadIcon />,
            title: "1. Upload or Paste",
            description: "Securely upload court orders, separation agreements, or paste the text of a high-conflict email. Your data is processed in real-time and never stored on our servers.",
        },
        {
            icon: <CpuIcon />,
            title: "2. AI Analyzes & Simplifies",
            description: "Our AI gets to work, reading through the content, identifying key obligations, translating complex legal jargon, and flagging potential conflicts or manipulative language.",
        },
        {
            icon: <ClipboardListIcon />,
            title: "3. Receive Actionable Insights",
            description: "Get a clear, structured report with a plain-English summary, a list of action items, and strategic recommendations, including professional draft emails to send.",
        }
    ];

    return (
        <section id="how-it-works" className="bg-slate-950 py-12 md:py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in-up">
                    From <span className="text-amber-400">Chaos</span> to <span className="text-amber-400">Clarity</span> in 3 Simple Steps
                </h2>
                <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-16 animate-fade-in-up delay-100">
                    Our AI tools are designed to be intuitive, turning your complex documents and stressful emails into straightforward, actionable insights.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {steps.map((step, index) => (
                        <div key={index} className={`bg-slate-800/50 backdrop-blur-sm h-full p-8 rounded-2xl shadow-xl flex flex-col items-center animate-fade-in-up delay-${index * 100} transition-all duration-300 ease-out hover:bg-slate-700/80 motion-safe:hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/10 border border-amber-400/50 hover:border-amber-400`}>
                            <div className="p-4 rounded-full bg-amber-400 text-slate-900 mb-4">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-balance">
                                {step.title}
                            </h3>
                            <p className="text-gray-400 flex-grow text-balance">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;