import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PhilosophySection from './components/PhilosophySection';
import FeatureSection from './components/FeatureSection';
import VenueSection from './components/VenueSection';
import ScheduleSection from './components/ScheduleSection';
import PhotoGrid from './components/PhotoGrid';
import SignedPhotographer from './components/SignedPhotographer';
import Footer from './components/Footer';
import SubmissionModal from './components/SubmissionModal';
import SigningModal from './components/SigningModal';
import MessageCenter from './components/MessageCenter';

export default function App() {
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500 selection:text-white">
      <Navbar 
        onOpenSubmission={() => setIsSubmissionOpen(true)} 
        onOpenMessages={() => setIsMessageCenterOpen(true)}
      />
      <main>
        <Hero />
        <PhilosophySection />
        <FeatureSection />
        <PhotoGrid />
        <VenueSection />
        <ScheduleSection />
        <SignedPhotographer onOpenSigning={() => setIsSigningOpen(true)} />
      </main>
      <Footer onOpenSubmission={() => setIsSubmissionOpen(true)} />
      <SubmissionModal 
        isOpen={isSubmissionOpen} 
        onClose={() => setIsSubmissionOpen(false)} 
      />
      <SigningModal
        isOpen={isSigningOpen}
        onClose={() => setIsSigningOpen(false)}
      />
      <MessageCenter
        isOpen={isMessageCenterOpen}
        onClose={() => setIsMessageCenterOpen(false)}
      />
    </div>
  );
}
