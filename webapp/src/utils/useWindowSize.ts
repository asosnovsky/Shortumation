import { useState, useEffect } from "react";

// Define general type for useWindowSize hook, which includes width and height
interface Size {
  width: number;
  height: number;
  ratioWbh: number;
  isMobile: boolean;
}

// Hook
export default function useWindowSize(mobileRatioInd: number = 0.8): Size {

  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<Size>(makeUpdate(window, mobileRatioInd));

  // alias


  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize(makeUpdate(window, mobileRatioInd));
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}

const makeUpdate = (w: Window, mobileRatioInd: number): Size => ({
  width: w.innerWidth,
  height: w.innerHeight,
  ratioWbh: w.innerWidth / w.innerHeight,
  isMobile: w.innerWidth / w.innerHeight <= mobileRatioInd,
})