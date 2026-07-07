import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import HeroBiography from "./components/HeroBiography";
import Timeline from "./components/Timeline";
import Encyclopedia from "./components/Encyclopedia";
import Gallery from "./components/Gallery";
import Cancionero from "./components/Cancionero";
import StudentCredits from "./components/StudentCredits";
import InstitutionalThanks from "./components/InstitutionalThanks";
import EditorHub from "./components/EditorHub";
import { AppDataProvider } from "./context/AppDataContext";
import { ArrowUp, Award, Compass, Heart, Shield } from "lucide-react";

function AppContent() {
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Scroll visibility handler for Back-to-Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sections switchboard mapper
  const renderActiveSection = () => {
    switch (activeSection) {
      case "inicio":
        return <HeroBiography />;
      case "cronologia":
        return <Timeline />;
      case "enciclopedia":
        return <Encyclopedia />;
      case "galeria":
        return <Gallery />;
      case "cancionero":
        return <Cancionero />;
      case "creditos":
        return <StudentCredits />;
      case "agradecimiento":
        return <InstitutionalThanks />;
      default:
        return <HeroBiography />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col parchment-pattern selection:bg-colonial-terracotta selection:text-white">
      {/* Dynamic Header / Navigation */}
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Container Wrapper */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-10">
        
        {/* Animated slide and fade transition for section switches */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Decorative Colonial Separator */}
      <div className="w-full bg-colonial-cream py-6 border-t border-b border-colonial-gold/20">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-colonial-terracotta/10 rounded-full text-colonial-terracotta border border-colonial-terracotta/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-bold text-xs uppercase tracking-widest text-colonial-terracotta-dark">
                Nicaragua Indómita y Libre
              </p>
              <p className="text-xs text-colonial-dark/60 font-sans">
                Diriangén • El primer grito soberano del istmo centroamericano.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 font-display text-xs text-colonial-gold font-bold uppercase tracking-wider">
            <span>❖ Patria Libre o Morir ❖</span>
          </div>
        </div>
      </div>

      {/* Main Footer Block */}
      <footer className="bg-colonial-dark text-colonial-beige border-t-2 border-colonial-gold/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Column 1: Historical Intro */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-colonial-terracotta rounded-full" />
                <span className="font-display font-extrabold text-lg text-colonial-gold-light tracking-wider">
                  HISTORIA Y CANTO
                </span>
              </div>
              <p className="text-xs sm:text-sm text-colonial-sand leading-relaxed font-sans">
                Plataforma interactiva concebida para salvaguardar y divulgar la gesta de Cacique Diriangén y la herencia de lucha de los pueblos indígenas de Nicaragua, entrelazada con el vibrante cancionero testimonial y revolucionario de nuestra patria.
              </p>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-4">
              <h4 className="font-display font-bold text-sm text-white tracking-widest uppercase border-b border-colonial-gold/10 pb-2">
                Secciones de la Plataforma
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-xs font-mono">
                <li>
                  <button
                    onClick={() => { setActiveSection("inicio"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-colonial-sand hover:text-white transition-colors cursor-pointer"
                  >
                    ✦ Biografía
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveSection("cronologia"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-colonial-sand hover:text-white transition-colors cursor-pointer"
                  >
                    ✦ Cronología
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveSection("enciclopedia"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-colonial-sand hover:text-white transition-colors cursor-pointer"
                  >
                    ✦ Enciclopedia
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveSection("galeria"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-colonial-sand hover:text-white transition-colors cursor-pointer"
                  >
                    ✦ Galería de Fotos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveSection("cancionero"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-colonial-sand hover:text-white transition-colors cursor-pointer"
                  >
                    ✦ Cancionero
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveSection("creditos"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-colonial-sand hover:text-white transition-colors cursor-pointer"
                  >
                    ✦ Créditos
                  </button>
                </li>
                <li className="col-span-2 border-t border-colonial-gold/10 pt-2 mt-1">
                  <button
                    onClick={() => { setActiveSection("agradecimiento"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="text-colonial-gold-light hover:text-white transition-colors cursor-pointer font-bold flex items-center space-x-1"
                  >
                    <span>✦ Agradecimiento Institucional</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Emblem & Dedication */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="font-display font-bold text-sm text-white tracking-widest uppercase border-b border-colonial-gold/10 pb-2">
                  Memoria Histórica
                </h4>
                <div className="flex items-start space-x-3 text-xs text-colonial-sand leading-relaxed">
                  <Shield className="w-5 h-5 text-colonial-clay shrink-0 mt-0.5" />
                  <span>"Nicaragua, Nicaragüita, la flor más linda de mi querer, abonada con la bendita sangre de Diriangén."</span>
                </div>
              </div>

              {/* Legal / Credits */}
              <div className="pt-4 border-t border-colonial-gold/10 flex items-center justify-between text-[11px] font-mono text-colonial-sand/50">
                <span>© {new Date().getFullYear()} Resistencia Indígena</span>
                <span className="flex items-center space-x-1">
                  <span>Hecho con</span>
                  <Heart className="w-3 h-3 text-colonial-terracotta fill-colonial-terracotta" />
                  <span>por la Patria</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Back-To-Top button shifted to bottom-24 */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollTop}
            className="fixed bottom-24 right-6 p-3 rounded-xl bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white shadow-xl hover:shadow-colonial-terracotta/20 border border-colonial-gold-light/40 z-40 cursor-pointer transition-all"
            aria-label="Subir al inicio"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Editor floating hub controls */}
      <EditorHub />
    </div>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}
