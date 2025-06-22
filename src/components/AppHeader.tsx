import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { User, History, LogOut, BookOpen } from "lucide-react";
import BasketballIcon from "./BasketballIcon";

interface AppHeaderProps {
  showHistoryButton?: boolean;
  showProfileButton?: boolean;
  onViewTestHistory?: () => void;
  onViewProfile?: () => void;
  onSignOut?: () => void;
}

const AppHeader = ({
  showHistoryButton = false,
  showProfileButton = false,
  onViewTestHistory = () => {},
  onViewProfile = () => {},
  onSignOut = () => {},
}: AppHeaderProps) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-navy">
      <Link
        to="/"
        className="flex items-center gap-3 hover:opacity-90 transition-opacity"
      >
        <BasketballIcon size="md" />
        <div>
          <h1 className="text-3xl font-bold text-white">RULE IQ</h1>
          <p className="text-sm text-white/60">
            PERFECT YOUR OFFICIATING KNOWLEDGE
          </p>
        </div>
      </Link>
      <div className="flex gap-2 w-full sm:w-auto">
        <Link to="/resources">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-white/30 text-white hover:bg-white/10"
          >
            <BookOpen className="h-4 w-4" />
            Resources
          </Button>
        </Link>
        {showHistoryButton && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-white/30 text-white hover:bg-white/10"
            onClick={onViewTestHistory}
          >
            <History className="h-4 w-4" />
            History
          </Button>
        )}
        {showProfileButton && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 border-white/30 text-white hover:bg-white/10"
            onClick={onViewProfile}
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-white/30 text-white hover:bg-white/10"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" />
          Exit
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
