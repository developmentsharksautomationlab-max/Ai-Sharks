import React from 'react';
import dynamic from 'next/dynamic';
import AboutusPage from '../components/aboutuspage';
// Dynamically import AboutPage with SSR enabled
// Fixed path to point to the correct component: ../components/aboutuspage
const AboutPage = dynamic(() => import('../components/aboutuspage'), {
    ssr: true,
    loading: () => (
        <div className="w-full h-screen bg-[#052126] text-[#f2f4f4] flex items-center justify-center">
            <div className="text-[#35c4dd] text-xl">Loading...</div>
        </div>
    ),
});

export default function Page() {
    return (
        <div>
            <AboutusPage />
        </div>
    );
}
