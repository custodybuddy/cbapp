import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="pt-24 md:pt-40 pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl shadow-xl p-6 md:p-10 animate-fade-in-up">
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-amber-400 text-center">About CustodyBuddy.com</h1>
                    <div className="text-gray-300 text-lg leading-relaxed space-y-6 prose prose-invert prose-p:my-2 prose-strong:text-amber-300 max-w-none">
                        <p className="text-xl">
                            <strong>Our mission is to empower self-represented parents with the tools and information they need to navigate the complexities of high-conflict co-parenting and the family law system.</strong>
                        </p>
                        <p>
                            We believe that every parent deserves the ability to present their case clearly and factually, free from the emotional manipulation and strategic abuse often present in these situations. We're here to turn stress into strategy and provide a lifeline of clarity in the chaos.
                        </p>
                        
                        <div className="border-t border-slate-700 my-8"></div>

                        <h2 className="text-3xl font-bold text-amber-400 text-center">A Note from Our Founder</h2>

                        <p>
                            CustodyBuddy.com was born from necessity and forged in the fire of personal experience. My name is Danielle Pike, and I am the founder of this platform. I am also a visually impaired/legally blind mother to two wonderful autistic children, and I am a survivor of post-separation abuse.
                        </p>
                        <p>
                            Navigating the family law system is a daunting task for anyone, but doing so with a visual disability while co-parenting with a toxic ex felt like an insurmountable mountain. The constant barrage of manipulative communication, the complex legal documents, and the emotional toll were overwhelming. I knew I needed a better way to fight for my children and my sanity.
                        </p>
                        <p>
                            That's when I discovered the transformative power of Artificial Intelligence.
                        </p>
                        <p>
                            AI became my equalizer. It could read and summarize dense legal filings for me, analyze hostile emails to extract objective facts, and help me draft responses that were professional, strategic, and stripped of the emotion my ex was trying to provoke. It was my tireless research assistant, helping me fact-check and find the information I needed to represent myself effectively.
                        </p>
                        <p>
                            This was more than just a legal tool; it was a revolution for my mental health. By using AI to filter out the noise and focus on the facts, I took back my power.
                        </p>
                        <p>
                            I created CustodyBuddy.com to share that power with you. My experience drives our core commitment: to deliver strictly factual and educational AI-powered tools. We are obsessed with accuracy and ensuring our AI provides clear, helpful information without the "hallucinations" or inaccuracies that can be so dangerous in a legal context.
                        </p>
                        <p>
                            We are not lawyers, and this is not legal advice. We are a shield, a translator, and a strategic partner, here to help you build the strongest case possible to protect what matters most.
                        </p>
                        <p className="font-semibold text-center text-amber-300">
                            You are not alone. Let's build your case, together.
                        </p>
                         <p className="text-center font-bold text-white text-xl">
                            - Danielle Pike
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;