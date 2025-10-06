import React from 'react';

interface TopLoadingBarProps {
    isLoading: boolean;
}

const TopLoadingBar: React.FC<TopLoadingBarProps> = ({ isLoading }) => {
    return (
        <div
            className={`fixed top-0 left-0 w-full h-1 z-[9999] transition-opacity duration-300 ease-out ${
                isLoading ? 'opacity-100' : 'opacity-0'
            }`}
            role="progressbar"
            aria-valuetext={isLoading ? 'Loading new page' : 'Page loaded'}
            aria-busy={isLoading}
        >
            <div
                className="h-full bg-amber-400 shadow-[0_0_10px_#facc15,0_0_5px_#facc15] transition-all ease-out"
                style={{
                    width: isLoading ? '90%' : '100%',
                    transitionDuration: isLoading ? '10s' : '0.3s',
                }}
            />
        </div>
    );
};

export default TopLoadingBar;
