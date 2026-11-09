import { Pizza } from "lucide-react";

export default function Loading() {
    return (
        <main className="min-h-[70vh] bg-[#FFF8EF] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto border-4 border-orange-200 border-t-[#E94B35] rounded-full animate-spin" />

                <h2 className="text-2xl font-bold text-[#171717] mt-6">
                    Pizza <span className="text-[#E94B35]">House</span>
                </h2>

                <p className="text-gray-500 mt-2">
                    Preparing something delicious...
                </p>
            </div>
        </main>
    );
}