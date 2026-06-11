import CustomCursor from './components/CustomCursor';
import InstallPrompt from './components/InstallPrompt';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Features from './components/Features';
import Characters from './components/Characters';
import Leaderboard from './components/Leaderboard';
import Press from './components/Press';
import Multiplayer from './components/Multiplayer';
import Roadmap from './components/Roadmap';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Features />
        <Characters />
        <Leaderboard />
        <Press />
        <Multiplayer />
        <Roadmap />
      </main>
      <Footer />
      <InstallPrompt />
    </>
  );
}
