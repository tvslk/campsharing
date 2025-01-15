import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Force reset scroll position
  }, [pathname]); // Runs every time the route changes

  return null; // Component doesn't render any UI
};