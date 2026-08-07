import React, { useState, useEffect } from "react";

// Component Imports
import DisplayToggle from "../components/features/DashboardDisplay/DisplayToggle";

import PrevNextView from "../components/features/DashboardDisplay/ViewModes/PrevNextView";
import AllPatternView from "../components/features/DashboardDisplay/ViewModes/AllPatternView";

// Service Imports
import { fetchCurrentUserPatterns } from "../services/patternService";

function MyPatternsPage() {
  const [view, setView] = useState("scroll");
  const [patterns, setPatterns] = useState("flowers");

  // Retrieve user patterns when page loads
  useEffect(() => {
    async function getPatterns() {
      // ==== UNCOMMENT ONCE USER AUTHENTICATION AND SIGN IN ON FRONT END IS WORKING ====== //
      // const userPatterns = await fetchCurrentUserPatterns();

      // setPatterns(userPatterns);

      // ===== TESTING ONLY: UNCOMMENT BELOW TO TEST FRONTEND FEATURES ====== //
      const testPatterns = [
        {
          id: 1,
          patternName: "Hocus Peocus 1",
          patternImgUrl:
            "https://www.thoughtco.com/thmb/8C2FBXodnXWHUPkbBfgUj2NvUNg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/close-up-of-abstract-background-724324851-5aea0559875db90037921761.jpg",
          createdAt: "2026-08-04T22:06:42.999Z",
          updatedAt: "2026-08-04T22:06:42.999Z",
        },
        {
          id: 2,
          patternName: "Charlie",
          patternImgUrl:
            "https://hips.hearstapps.com/hmg-prod/images/spring-bedding-display-in-a-public-park-in-england-royalty-free-image-1770827145.pjpeg?crop=1.00xw:0.753xh;0,0.122xh&resize=1400:*",
          createdAt: "2026-08-04T22:06:46.618Z",
          updatedAt: "2026-08-04T22:06:46.618Z",
        },
        {
          id: 3,
          patternName: "Wutzitgoin",
          patternImgUrl:
            "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          createdAt: "2026-08-04T22:06:47.783Z",
          updatedAt: "2026-08-04T22:06:47.783Z",
        },
      ];
      setPatterns(testPatterns);
    }

    getPatterns();
  }, []);

  // Function that processes user's view choice into rendered component
  function userChosenView(patterns) {
    if (patterns.length === 0) {
      return <h1>You have no patterns. </h1>;
    }
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
