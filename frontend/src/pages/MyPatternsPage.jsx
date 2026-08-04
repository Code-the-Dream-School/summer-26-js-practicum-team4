import React, { useState, useEffect } from "react";

// Component Imports
import PatternDisplayToggle from "../components/features/PatternDisplay/PatternDisplayToggle";
import PrevNextView from "../components/features/PatternDisplay/PrevNextView";
import AllPatternView from "../components/features/PatternDisplay/AllPatternView";

// Service Imports
import { fetchCurrentUserPatterns } from "../services/patternRetrieval";

function MyPatternsPage() {
  const [view, setView] = useState("scroll");

  // Retrieve user patterns when page loads
  useEffect(() => {
    async function getPatterns() {
      const patterns = await fetchCurrentUserPatterns();
      console.log(patterns);
      return patterns;
    }

    getPatterns();
    return;
  }, []);

  // Function that processes user's view choice into rendered component
  function userChosenView() {
    if (view === "scroll") {
      return <PrevNextView patterns="1" />;
    } else if (view === "all") {
      return <AllPatternView patterns="2" />;
    }
  }

  // Import all patterns to display
  const allCurrentUserPatterns = 5;

  return (
    <div>
      <h1>My Patterns Page</h1>
      <PatternDisplayToggle name="Scroll" onClick={() => setView("scroll")} />
      <PatternDisplayToggle name="Show All" onClick={() => setView("all")} />
      {userChosenView()}
    </div>
  );
}

export default MyPatternsPage;
