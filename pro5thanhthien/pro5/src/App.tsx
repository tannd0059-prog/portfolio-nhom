import React from 'react';
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Navbar } from '@/components/ui/Navbar';
import { ImageSequenceCanvas } from '@/components/canvas/ImageSequenceCanvas';
import { LogoCarousel } from '@/components/ui/LogoCarousel';
import { BentoGridSection } from '@/components/ui/BentoGridSection';
import { SkillsSection } from '@/components/ui/SkillsSection';
import { ProjectsSection } from '@/components/ui/ProjectsSection';
import { ContactSection } from '@/components/ui/ContactSection';
import { Footer } from '@/components/ui/Footer';
import { ProjectModal } from '@/components/ui/ProjectModal';

export const App: React.FC = () => {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-slate-50 dark:bg-[#0b0c10] text-slate-900 dark:text-[#c5c6c7] transition-colors duration-300">
        {/* High-Tech Magnetic Custom Cursor & Ambient Spotlight Glow */}
        <CustomCursor />

        {/* 1. Header & Navigation (Tiêu chí #1, #8, #11, #14) */}
        <Navbar />

        {/* 2. Main Semantic Content (Tiêu chí #8) */}
        <main className="w-full">
          {/* CINEMATIC HERO — Image Sequence Canvas (MiladiCode / Apple style scrub) */}
          <ImageSequenceCanvas scrollHeight={4000} />

          {/* 2-Row Infinite Logo Carousel (MiladiCode Inspired Marquee) */}
          <LogoCarousel />

          {/* Bento Grid Section (Tiêu chí #2, #3, #5, #7, #18, #19) */}
          <BentoGridSection />

          {/* Technical Skills Section with Progress Bars (Tiêu chí #4) */}
          <SkillsSection />

          {/* Personal Projects Section with Category Filter Tabs (Tiêu chí #6 & #14) */}
          <ProjectsSection />

          {/* Validated Contact Form Section (Tiêu chí #15) */}
          <ContactSection />
        </main>

        {/* 3. Semantic Footer (Tiêu chí #8 & #13) */}
        <Footer />

        {/* 4. Project Detail Modal (Tiêu chí #14) */}
        <ProjectModal />
      </div>
    </SmoothScrollProvider>
  );
};

export default App;
