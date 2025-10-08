
import React, { useState, useEffect } from 'react';
import CoffeeIcon from './icons/CoffeeIcon';
import CpuIcon from './icons/CpuIcon';
import UsersIcon from './icons/UsersIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import ClipboardCheckIcon from './icons/ClipboardCheckIcon';


const donationTiers = [
    {
        icon: <CoffeeIcon />,
        title: "Buy us a Coffee",
        amount: "$5",
        description: "Your support helps keep our small team motivated and focused on building the best tools for parents like you.",
    },
    {
        icon: <CpuIcon />,
        title: "Help with Server Costs",
        amount: "$20",
        description: "Help us cover the costs of our AI services and secure hosting, ensuring CustodyBuddy remains fast, reliable, and available 24/7.",
    },
    {
        icon: <UsersIcon />,
        title: "Sponsor a Parent",
        amount: "$50",
        description: "Your generous contribution helps us expand our features and outreach, making sure no parent has to face their custody battle alone.",
    }
];

const Donation: React.FC = () => {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('custodybuddyai@gmail.com');
        setIsCopied(true);
    };


    return (
        <section id="donation" className="bg-slate-900 py-16 md:py-20 text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-up">
                    Your Support <span className="text-amber-400">Keeps Us</span> Free.
                </h2>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 font-medium text-gray-300 animate-fade-in-up delay-100">
                    CustodyBuddy is a self-funded project built to help every parent, regardless of their financial situation. Your contribution helps us provide this vital toolkit at no cost.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {donationTiers.map((tier, index) => (
                        <div key={index} className={`bg-slate-800/50 backdrop-blur-sm h-full p-8 rounded-2xl shadow-xl flex flex-col items-center animate-fade-in-up delay-${(index + 2) * 100} transition-all duration-300 ease-out hover:bg-slate-700/80 motion-safe:hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-400/10 border border-slate-700 hover:border-amber-400`}>
                            <div className="p-4 rounded-full bg-amber-400 text-slate-900 mb-4">
                                {tier.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-balance text-white">
                                {tier.title}
                            </h3>
                            <p className="text-4xl font-bold text-amber-400 my-4">{tier.amount}</p>
                            <p className="text-gray-400 flex-grow text-balance">{tier.description}</p>
                        </div>
                    ))}
                </div>
                
                <div className="mt-16 max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-amber-400/50 animate-fade-in-up delay-500">
                    <h3 className="text-2xl font-bold text-amber-400 mb-4">How to Donate</h3>
                    <p className="text-gray-300 mb-6">
                        You can send your contribution securely via Interac e-Transfer. Your support is deeply appreciated and helps us keep this service free for all parents.
                    </p>
                    <div className="space-y-4 text-left text-base">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <span className="font-semibold text-gray-400 w-28 flex-shrink-0 mb-1 sm:mb-0">RECIPIENT:</span>
                            <span className="text-white font-semibold">CustodyBuddy.com</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <span className="font-semibold text-gray-400 w-28 flex-shrink-0 mb-1 sm:mb-0">EMAIL:</span>
                            <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-md flex-grow w-full">
                                <span className="text-amber-300 font-mono break-all flex-grow">custodybuddyai@gmail.com</span>
                                <button
                                    onClick={handleCopyEmail}
                                    className="flex-shrink-0 flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-3 rounded-md transition-all text-xs"
                                    aria-label="Copy email address to clipboard"
                                >
                                    {isCopied ? <ClipboardCheckIcon /> : <ClipboardIcon />}
                                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <span className="font-semibold text-gray-400 w-28 flex-shrink-0 mb-1 sm:mb-0">NOTE:</span>
                            <span className="text-gray-400 text-sm">No security question is needed as auto-deposit is enabled for your convenience.</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default React.memo(Donation);
