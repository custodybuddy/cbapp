import React from 'react';
import { NavLink } from '../routes';

interface FooterProps {
    currentPath: string;
    navLinks: NavLink[];
    "aria-hidden"?: boolean;
}

const Footer: React.FC<FooterProps> = ({ currentPath, navLinks, "aria-hidden": ariaHidden }) => {
    return (
        <footer className="bg-slate-900 py-8 text-center text-gray-400 border-t border-slate-800" aria-hidden={ariaHidden}>
            <div className="container mx-auto px-4">
                <nav className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-y-2 gap-x-6 mb-6">
                    {navLinks.map(link => (
                        <a 
                            key={link.href}
                            href={link.href} 
                            className={`${!link.isExternal && link.href === currentPath ? 'text-amber-400' : 'hover:text-amber-400'} transition-colors duration-200 ease-out`}
                            aria-current={!link.isExternal && link.href === currentPath ? 'page' : undefined}
                            target={link.isExternal ? '_blank' : '_self'}
                            rel={link.isExternal ? 'noopener noreferrer' : undefined}
                        >
                            {link.text}
                        </a>
                    ))}
                </nav>

                <p className="text-sm">&copy; {new Date().getFullYear()} CustodyBuddy.com. All Rights Reserved.</p>
                <p className="text-xs mt-4 max-w-4xl mx-auto">
                    **Disclaimer: CustodyBuddy is for informational purposes only and is not a substitute for a qualified legal professional. The use of this tool does not create a lawyer-client relationship.**
                </p>
            </div>
        </footer>
    );
};

export default React.memo(Footer);