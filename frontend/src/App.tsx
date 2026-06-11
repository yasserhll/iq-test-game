import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Features from './components/Features';
import Characters from './components/Characters';
import Press from './components/Press';
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
        <Press />
        <Roadmap />
      </main>
      <Footer />
    </>
  );
}
