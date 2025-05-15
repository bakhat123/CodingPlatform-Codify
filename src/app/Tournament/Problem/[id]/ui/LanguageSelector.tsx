import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface LanguageSelectorProps {
  language: string;
  setLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = [
    { id: "javascript", name: "JavaScript", version: "Node.js 12.14.0", logo: "js" },
    { id: "python", name: "Python", version: "3.8.1", logo: "py" },
    { id: "cpp", name: "C++", version: "GCC 9.2.0", logo: "cpp" },
    { id: "java", name: "Java", version: "OpenJDK 13.0.1", logo: "java" },
  ];

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.id === language) || languages[0];
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectLanguage = (langId: string) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  const getLanguageLogo = (logo: string) => {
    switch (logo) {
      case 'js':
        return (
          <div className="w-6 h-6 rounded-full bg-yellow-300 flex items-center justify-center text-black font-bold text-xs">JS</div>
        );
      case 'py':
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500 flex items-center justify-center">
              <span className="text-white font-semibold text-xs">PY</span>
            </div>
          </div>
        );
      case 'cpp':
        return (
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">C++</div>
        );
      case 'java':
        return (
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">JV</div>
        );
      default:
        return null;
    }
  };

  const currentLang = getCurrentLanguage();

  return (
    <div className="relative">
      <motion.button
        onClick={toggleDropdown}
        className="flex items-center justify-between min-w-[220px] bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg px-3 py-2 focus:outline-none transition-colors duration-200 shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center">
          {getLanguageLogo(currentLang.logo)}
          <div className="ml-2 text-left">
            <div className="text-white font-medium">{currentLang.name}</div>
            <div className="text-xs text-gray-400">{currentLang.version}</div>
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {isOpen && (
        <motion.div 
          className="absolute mt-2 right-0 z-[100] w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {languages.map((lang) => (
            <motion.div
              key={lang.id}
              onClick={() => selectLanguage(lang.id)}
              className={`flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer transition-colors duration-150 ${
                lang.id === language ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''
              }`}
              whileHover={{ x: 2 }}
            >
              {getLanguageLogo(lang.logo)}
              <div className="ml-2">
                <div className={`font-medium ${lang.id === language ? 'text-blue-400' : 'text-white'}`}>{lang.name}</div>
                <p className="text-xs text-gray-400">{lang.version}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LanguageSelector;