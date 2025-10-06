import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from '../routes';
import MenuIcon from './icons/MenuIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface HeaderProps {
    currentPath: string;
    navLinks: NavLink[];
}

const Header: React.FC<HeaderProps> = ({ currentPath, navLinks }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Accessibility: Trap focus within the mobile menu
    useFocusTrap(mobileMenuRef, isMenuOpen, toggleMenu);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navClass = isScrolled
        ? 'fixed top-0 left-0 w-full z-50 bg-slate-900/80 backdrop-blur-sm shadow-md transition-all duration-300'
        : 'fixed top-0 left-0 w-full z-50 bg-transparent transition-all duration-300';

    const renderLink = (link: NavLink, isMobile: boolean = false) => {
        const isActive = !link.isExternal && link.href === currentPath;

        const commonClasses = 'transition-colors duration-200 ease-out flex items-center';
        const desktopClasses = `gap-1.5 text-sm font-semibold ${isActive ? 'text-amber-400' : 'hover:text-amber-400'}`;
        const mobileClasses = `justify-center gap-2 text-xl ${isActive ? 'text-amber-400 font-bold' : 'hover:text-amber-400'}`;

        const classes = isMobile ? `${commonClasses} ${mobileClasses}` : `${commonClasses} ${desktopClasses}`;

        return (
            <a 
                key={link.text} 
                href={link.href} 
                className={classes}
                target={link.isExternal ? '_blank' : '_self'} 
                rel={link.isExternal ? 'noopener noreferrer' : undefined}
                onClick={isMobile ? toggleMenu : undefined}
                aria-current={isActive ? 'page' : undefined}
            >
                {link.text === 'Template Library' && <BookOpenIcon className={isMobile ? "w-5 h-5" : "w-4 h-4"} />}
                {link.text}
            </a>
        );
    };

    return (
        <>
            <nav id="main-nav" className={navClass}>
                <div className="container mx-auto px-4">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex flex-col items-center py-3">
                        <a href="#/" className="text-xl md:text-2xl font-black transition-transform transform hover:scale-105 mb-3">
                            <span className="text-amber-400">CUSTODY</span>
                            <span>BUDDY</span>
                            <span className="text-amber-400">.COM</span>
                        </a>
                        <div className="flex items-center gap-6">
                            {navLinks.map(link => renderLink(link))}
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="md:hidden flex items-center justify-center relative py-4">
                        <a href="#/" className="text-xl font-black transition-transform transform hover:scale-105">
                            <span className="text-amber-400">CUSTODY</span>
                            <span>BUDDY</span>
                            <span className="text-amber-400">.COM</span>
                        </a>
                        <button id="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded={isMenuOpen} aria-controls="mobile-menu" className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-amber-400 transition-colors duration-200 ease-out" onClick={toggleMenu}>
                            <MenuIcon />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div ref={mobileMenuRef} id="mobile-menu" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title" className={`fixed top-0 left-0 w-full h-full bg-slate-900 z-40 md:hidden transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <h2 id="mobile-menu-title" className="sr-only">Main Menu</h2>
                <div className="p-6 flex flex-col items-center space-y-6 text-center pt-24">
                    {navLinks.map(link => renderLink(link, true))}
                    <a href="#/features" className="inline-block bg-amber-400 text-black font-semibold py-3 px-8 rounded-full shadow-lg mt-4" onClick={toggleMenu}>
                        Start Now
                    </a>
                </div>
            </div>
        </>
    );
};

export default React.memo(Header);