import React from 'react';
import Donation from '../components/Donation';
import CTA from '../components/CTA';

const DonatePage: React.FC = () => {
    return (
        <div className="pt-24 md:pt-32">
            <Donation />
            <CTA />
        </div>
    );
};

export default DonatePage;
