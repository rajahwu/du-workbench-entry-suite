import Image from 'next/image';
import hero from '@/assets/identity/13304cc8-dcf1-40ff-82c8-8c83b2f33c77.png'; // adjust path

export default function ArchiveHome() {
    return (
        <>
            <Image src={hero} alt="Dudael Hero" priority className="w-full h-64 object-cover" />
            <div className="grid grid-cols-3 gap-6 p-8">
                {/* Domain icons as links to /lore, /bound, /systems etc. */}
            </div>
        </>
    );
}