import { useState, useEffect } from "react";
import plantyMascot from "../assets/planty-mascot.png";

const PlantyMascot = ({
  message = "Hi! I'm Planty, your planting buddy! 🌱",
  animation = "bounce",
  size = "md",
  className = "bg-transparent",
}) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const animationClasses = {
    bounce: "animate-bounce-gentle",
    wiggle: "animate-wiggle",
    float: "animate-float",
    none: "",
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative">
        
      </div>

      {showMessage && (
        <div className="relative bg-white backdrop-blur border  rounded-xl p-3 shadow-lg animate-fade-in-up max-w-xs">
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-card/90"></div>
          <p className="text-sm text-foreground font-medium">{message}</p>
        </div>
      )}
    </div>
  );
};

export default PlantyMascot;