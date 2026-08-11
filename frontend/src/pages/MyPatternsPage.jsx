import React, { useEffect, useReducer } from "react";

// Component Imports
import DisplayToggle from "../components/features/dashboard/DisplayToggle";

import PrevNextView from "../components/features/dashboard/ViewModes/PrevNextView";
import AllPatternView from "../components/features/dashboard/ViewModes/AllPatternView";

import { DashContext } from "../state/dashboard/dashContext";

import Loader from "../components/Loader/Loader";

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
      dispatch({ type: dashActions.resetScrollPatternIx }); // reset scroll interface to display first image
      dispatch({ type: dashActions.beginFetch }); // displays loader

      const userPatterns = await fetchCurrentUserPatterns();

      dispatch({ type: dashActions.endFetch });
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
          />
          <DisplayToggle
            name="Show All"
            onClick={() => dispatch({ type: dashActions.setAllView })}
          />
          {dashState.isFetching ? (
            <Loader />
          ) : (
            userChosenView(dashState.patterns)
          )}
        </div>
      </DashContext>
    </>
  );
}

export default MyPatternsPage;
