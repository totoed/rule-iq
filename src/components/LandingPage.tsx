import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import BasketballIcon from "./BasketballIcon";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-navy text-white overflow-hidden relative">
      {/* Basketball court background */}
      <div className="absolute inset-0 z-0 opacity-20">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-2 border-white/30 rounded-full"></div>

        {/* Three-point lines */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-[250px] h-[500px] border-2 border-white/30 rounded-r-[250px]"></div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[250px] h-[500px] border-2 border-white/30 rounded-l-[250px]"></div>

        {/* Free throw lines */}
        <div className="absolute top-1/2 left-[15%] transform -translate-y-1/2 w-[150px] h-[200px] border-2 border-white/30"></div>
        <div className="absolute top-1/2 right-[15%] transform -translate-y-1/2 w-[150px] h-[200px] border-2 border-white/30"></div>

        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30"></div>

        {/* Baseline */}
        <div className="absolute top-[10%] left-0 right-0 h-0.5 bg-white/30"></div>
        <div className="absolute bottom-[10%] left-0 right-0 h-0.5 bg-white/30"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <BasketballIcon size="md" />
          <span className="text-xl font-bold tracking-wider">RULE IQ</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#"
            className="text-white/80 hover:text-white transition-colors text-sm font-medium tracking-wider"
          >
            HOME
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white transition-colors text-sm font-medium tracking-wider"
          >
            RULES
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white transition-colors text-sm font-medium tracking-wider"
          >
            ABOUT
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white transition-colors text-sm font-medium tracking-wider"
          >
            RESOURCES
          </a>
        </nav>
        <Link to="/signup">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6 py-2 font-medium text-sm tracking-wider">
            SIGN UP
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 text-center max-w-4xl mx-auto">
        {/* Center basketball icon */}
        <div className="mb-8">
          <BasketballIcon size="lg" />
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
          RULE IQ
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-2xl">
          PERFECT YOUR OFFICIATING KNOWLEDGE
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center">
          <Link to="/login" className="w-full sm:w-auto">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-5 text-base font-medium tracking-wider">
              LOGIN
            </Button>
          </Link>
          <Link to="/signup" className="w-full sm:w-auto">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-5 text-base font-medium tracking-wider">
              SIGN UP
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
