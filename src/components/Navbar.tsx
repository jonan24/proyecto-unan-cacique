import { useState } from "react";
import { Menu, X, Landmark, Music, BookOpen, Clock, Image as ImageIcon, Home, Users } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { id: "inicio", label: "Inicio / Biografía", icon: Home },
    { id: "cronologia", label: "Línea de Tiempo", icon: Clock },
    { id: "enciclopedia", label: "Enciclopedia", icon: BookOpen },
    { id: "galeria", label: "Galería de Fotos", icon: ImageIcon },
    { id: "cancionero", label: "Cancionero Revolucionario", icon: Music },
    { id: "creditos", label: "Créditos", icon: Users },
    { id: "agradecimiento", label: "Agradecimiento", icon: Landmark },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-colonial-dark text-colonial-beige border-b-2 border-colonial-gold/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <button
            onClick={() => handleNavClick("inicio")}
            className="flex items-center space-x-3 group text-left cursor-pointer"
          >
            <div className="bg-colonial-terracotta p-2.5 rounded-lg border border-colonial-gold/40 shadow-md group-hover:bg-colonial-terracotta-dark transition-colors duration-300">
              <Landmark className="w-6 h-6 text-colonial-gold-light" />
            </div>
            <div>
              <span className="font-display font-bold text-xl sm:text-2xl block tracking-wide text-colonial-gold-light group-hover:text-white transition-colors">
                DIRIANGÉN
              </span>
              <span className="text-[10px] font-mono tracking-widest text-colonial-clay block uppercase">
                Resistencia y Patria
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-md font-medium text-sm tracking-wide transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-colonial-terracotta text-white shadow-md border-b-2 border-colonial-gold-light"
                      : "text-colonial-sand hover:bg-colonial-dark-light hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-colonial-gold-light" : "text-colonial-clay"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-colonial-sand hover:text-white hover:bg-colonial-dark-light focus:outline-none cursor-pointer"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-colonial-dark-light border-t border-colonial-gold/20 animate-fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "bg-colonial-terracotta text-white border-l-4 border-colonial-gold-light"
                      : "text-colonial-sand hover:bg-colonial-dark hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 text-colonial-clay" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
