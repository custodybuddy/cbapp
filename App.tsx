import React, { useState, useEffect, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { routes, externalLinks, NavLink } from './routes';
import { ModalProvider } from './contexts/ModalContext';
import GlobalModals from './components/GlobalModals';
import { useConsent } from './hooks/useConsent';
import ConsentModal from './components/ConsentModal';
import SpinnerIcon from './components/icons/SpinnerIcon';

const PageFallback: React.FC = () => (
    <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-gray-400">
            <SpinnerIcon className="w-12 h-12 mx-auto mb-4 text-amber-400" />
            <p>Loading Page...</p>
        </div>
    </div>
);


const App: React.FC = () => {
    const [route, setRoute] = useState(window.location.hash || '#/');
    const { consentGiven, acceptConsent } = useConsent();

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash || '#/');
            window.scrollTo(0, 0); // Scroll to top on page change
        };

        // Set initial route
        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const currentRoute = routes.find(r => r.path === route) || routes.find(r => r.path === '#/');
    const PageComponent = currentRoute!.component;

    // Logic to prepare links for Header and Footer
    const headerNavLinks: NavLink[] = [
        ...routes
            .filter(r => r.inHeader)
            .map(r => ({ href: r.path, text: r.label, isExternal: false })),
        ...externalLinks
            .filter(l => l.inHeader)
            .map(l => ({ href: l.href, text: l.text, isExternal: true }))
    ];

    const footerNavLinks: NavLink[] = [
        ...routes
            .filter(r => r.inFooter)
            .map(r => ({ href: r.path, text: r.label, isExternal: false })),
        ...externalLinks
            .filter(l => l.inFooter)
            .map(l => ({ href: l.href, text: l.text, isExternal: true }))
    ];

    return (
        <ModalProvider>
            <div className="bg-slate-900 text-white">
                <Header currentPath={route} navLinks={headerNavLinks} />
                <main>
                    <Suspense fallback={<PageFallback />}>
                        <PageComponent />
                    </Suspense>
                </main>
                <Footer currentPath={route} navLinks={footerNavLinks} />
                <GlobalModals />
                {!consentGiven && <ConsentModal onAccept={acceptConsent} />}
            </div>
        </ModalProvider>
    );
};

export default App;