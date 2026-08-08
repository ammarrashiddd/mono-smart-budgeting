"use client";

import Navbar from "@/components/nav/Navbar";
import BeforeAfterSimulation from "@/components/ui/main/BeforeAfterSimulation";
import Description from "@/components/ui/main/Description";
import MainImage from "@/components/ui/main/MainImage";
import MiniFaq from "@/components/ui/main/MiniFaq";
import { WellnessRadar } from "@/components/ui/main/WellnessRadar";

export default function Home() {
  return (
    <div className="bg-primary min-h-screen w-full overflow-x-hidden">
      <nav className="h-20 mb-4 md:mb-6 px-6 md:px-12 bg-tertiary flex items-center shadow-sm">
        <Navbar />
      </nav>
      <main>
        {/* description */}
        <div className="px-6 md:px-12">
          <Description />
        </div>

        {/* before/after simulation */}
        <div className="px-6 md:px-12 mt-16">
          <BeforeAfterSimulation />
        </div>

        <div className="px-6 md:px-12 mt-16">
          <MiniFaq />
        </div>

        {/* main image */}
        <div className="px-6 md:px-12 mt-15 mb-15">
          <MainImage />
        </div>
      </main>
    </div>
  );
}
