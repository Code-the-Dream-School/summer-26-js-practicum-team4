import React, { useState, useEffect } from "react";

// Component Imports
import DisplayToggle from "../components/features/PatternDisplay/DisplayToggle";

import PrevNextView from "../components/features/PatternDisplay/ViewModes/PrevNextView";
import AllPatternView from "../components/features/PatternDisplay/ViewModes/AllPatternView";

// Service Imports
import { fetchCurrentUserPatterns } from "../services/patternRetrieval";

function MyPatternsPage() {
  const [view, setView] = useState("scroll");
  const [patterns, setPatterns] = useState([]);

  // Retrieve user patterns when page loads
  useEffect(() => {
    async function getPatterns() {
      const userPatterns = await fetchCurrentUserPatterns();

      // xxxxx Comment will be removed when functionality is achieved xxxxx
      // patterns is an array of objects with keys id, patternName, createdAt, updatedAt
      setPatterns(userPatterns);
    }

    getPatterns();
  }, []);

  // Function that processes user's view choice into rendered component
  function userChosenView(patterns) {
    if (view === "scroll") {
      return <PrevNextView patterns={patterns} />;
    } else if (view === "all") {
      return <AllPatternView patterns={patterns} />;
    }
  }

  return (
    <div>
      <h1>My Patterns Page</h1>
      <DisplayToggle name="Scroll" onClick={() => setView("scroll")} />
      <DisplayToggle name="Show All" onClick={() => setView("all")} />
      {userChosenView(patterns)}
    </div>
  );
}

export default MyPatternsPage;
