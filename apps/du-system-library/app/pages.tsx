// apps/du-system-library/app/pages.tsx
import React from 'react';
// Assuming Vite handling of static assets
import hero from '../../assets/identity/13304cc8-dcf1-40ff-82c8-8c83b2f33c77.png';

export default function ArchiveHome() {
    return (
        <div className="w-full">
            <img
                src={hero}
                alt="Dudael Hero"
                className="w-full h-64 object-cover"
            />
            <div className="grid grid-cols-3 gap-6 p-8">
                {/* Domain icons will map here */}
                <div className="p-4 border border-amber-500/20 text-amber-100">Lore Bible</div>
                <div className="p-4 border border-amber-500/20 text-amber-100">Systems Spec</div>
                <div className="p-4 border border-amber-500/20 text-amber-100">Brand Guide</div>
            </div>
        </div>
    );
}