import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Resources from '../components/Resources';
import Donation from '../components/Donation';
import CTA from '../components/CTA';
import Contact from '../components/Contact';

const HomePage: React.FC = () => {
    return (
        <>
            <Hero />
            <Features />
            <Testimonials />
            <Resources />
            <Donation />
            <CTA />
            <Contact />
        </>
    );
};

export default HomePage;
