import React, { useEffect, useReducer } from "react";

// Component Imports
import DisplayToggle from "../components/features/dashboard/DisplayToggle";

import PrevNextView from "../components/features/dashboard/ViewModes/PrevNextView";
import AllPatternView from "../components/features/dashboard/ViewModes/AllPatternView";

import { DashContext } from "../state/dashboard/dashContext";

// Service Imports
import { fetchCurrentUserPatterns } from "../services/patternService";

// State Import
import {
  dashInitState,
  dashReducer,
  dashActions,
} from "../state/dashboard/dashReducer";

function MyPatternsPage() {
  const [dashState, dispatch] = useReducer(dashReducer, dashInitState);

  // Retrieve user patterns when page loads
  useEffect(() => {
    async function getPatterns() {
      // ==== UNCOMMENT ONCE USER AUTHENTICATION AND SIGN IN ON FRONT END IS WORKING ====== //
      // const userPatterns = await fetchCurrentUserPatterns();

      // dispatch({ userPatterns, type: dashActions.setUserPatterns });

      // ===== TESTING ONLY: UNCOMMENT BELOW TO TEST FRONTEND FEATURES ====== //
      const userPatterns = [
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
      dispatch({ userPatterns, type: dashActions.setUserPatterns });
    }

    getPatterns();
  }, [dashState.isDeleting]);

  // Function that processes user's view choice into rendered component
  function userChosenView(patterns) {
    if (patterns.length === 0) {
      return <h1>You have no patterns. </h1>;
    }
    if (dashState.view === "scroll") {
      return <PrevNextView />;
    } else if (dashState.view === "all") {
      return <AllPatternView />;
    }
  }

  return (
    <>
      <DashContext value={{ dashState, dispatch, dashActions }}>
        <div>
          <h1>My Patterns Page</h1>
          <DisplayToggle
            name="Scroll"
            onClick={() => dispatch({ type: dashActions.setScrollView })}
            deletingStatus={deletingStatus}
            setDeletingStatus={setDeletingStatus}
          />
          <DisplayToggle
            name="Show All"
            onClick={() => dispatch({ type: dashActions.setAllView })}
          />
          {userChosenView(dashState.patterns)}
        </div>
      </DashContext>
    </>
  );
}

export default MyPatternsPage;
