import React, { useState } from "react";

// Component Imports
import PatternDisplayToggle from "../components/features/PatternDisplay/PatternDisplayToggle";
import PrevNextView from "../components/features/PatternDisplay/PrevNextView";
import AllPatternView from "../components/features/PatternDisplay/AllPatternView";

function MyPatternsPage() {
  const [view, setView] = useState("scroll");

  // Function that processes user's view choice into rendered component
  function userChosenView(view) {
    if (view === "scroll") {
      return <PrevNextView imagesEndpoint={"1"} />;
    } else if (view === "all") {
      return <AllPatternView imagesEndpoint={"2"} />;
    }
  }

  return (
    <div>
      <h1>My Patterns Page</h1>
      <PatternDisplayToggle name="Scroll" onClick={() => setView("scroll")} />
      <PatternDisplayToggle name="Show All" onClick={() => setView("all")} />
      {userChosenView(view)}
    </div>
  );
}

export default MyPatternsPage;
