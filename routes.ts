import React from 'react';

// Import all page components
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ResourcesPage from './pages/ResourcesPage';
import DonatePage from './pages/DonatePage';
import ContactPage from './pages/ContactPage';
import TemplateLibraryPage from './pages/TemplateLibraryPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';

export interface RouteConfig {
    path: string;
    label: string;
    component: React.FC;
    inHeader: boolean;
    inFooter: boolean;
}

export interface ExternalLinkConfig {
    href: string;
    text: string;
    inHeader: boolean;
    inFooter: boolean;
}

export interface NavLink {
    href: string;
    text: string;
    isExternal?: boolean;
}

export const routes: RouteConfig[] = [
    { path: '#/', label: 'Home', component: HomePage, inHeader: true, inFooter: false },
    { path: '#/about', label: 'About Us', component: AboutPage, inHeader: true, inFooter: true },
    { path: '#/features', label: 'Features', component: FeaturesPage, inHeader: true, inFooter: true },
    { path: '#/template-library', label: 'Template Library', component: TemplateLibraryPage, inHeader: true, inFooter: false },
    { path: '#/resources', label: 'Resources', component: ResourcesPage, inHeader: true, inFooter: false },
    { path: '#/testimonials', label: 'Testimonials', component: TestimonialsPage, inHeader: true, inFooter: true },
    { path: '#/donate', label: 'Donate', component: DonatePage, inHeader: true, inFooter: true },
    { path: '#/contact', label: 'Contact', component: ContactPage, inHeader: true, inFooter: true },
    { path: '#/privacy', label: 'Privacy Policy', component: PrivacyPolicyPage, inHeader: false, inFooter: true },
    { path: '#/terms', label: 'Terms of Use', component: TermsOfUsePage, inHeader: false, inFooter: true },
];

export const externalLinks: ExternalLinkConfig[] = [
    { href: 'https://blog.custodybuddy.com', text: 'Blog', inHeader: true, inFooter: true },
];