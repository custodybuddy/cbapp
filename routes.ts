import React, { lazy } from 'react';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TemplateLibraryPage = lazy(() => import('./pages/TemplateLibraryPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));

export interface RouteConfig {
    path: string;
    label: string;
    component: React.ComponentType;
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
    { path: '#/how-it-works', label: 'How It Works', component: HowItWorksPage, inHeader: true, inFooter: true },
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