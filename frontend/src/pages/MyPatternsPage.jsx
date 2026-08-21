import React, { useEffect, useReducer } from "react";

// Component Imports
import DisplayToggle from "../components/features/dashboard/DisplayToggle";

import PrevNextView from "../components/features/dashboard/ViewModes/PrevNextView";
import AllPatternView from "../components/features/dashboard/ViewModes/AllPatternView";
import CreateNewPatternIcon from "../components/features/dashboard/PatternDisplays/CreateNewPatternIcon";

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
      dispatch({ type: dashActions.beginFetch }); // displays loader

      const userPatterns = await fetchCurrentUserPatterns();

      dispatch({ type: dashActions.endFetch });

      dispatch({ userPatterns, type: dashActions.setUserPatterns });
    }

    getPatterns();
  }, [dashState.isDeleting, dashState.isSaving]);

  // Function that processes user's view choice into rendered component
  function userChosenView(patterns) {
    if (patterns.length === 0) {
      return (
        <div>
          <h3 className="ml-20 my-5">
            Welcome! Let's add your first pattern.{" "}
          </h3>
          <CreateNewPatternIcon />
        </div>
      );
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
        <div className="bg-background">
          <div className="flex flex-row-reverse mx-auto content-end">
            {" "}
            <DisplayToggle
              name="Show All"
              onClick={() => dispatch({ type: dashActions.setAllView })}
              displayImagePath={"images/all-pattern-view-toggle.png"}
            />
            <DisplayToggle
              name="Scroll"
              onClick={() => dispatch({ type: dashActions.setScrollView })}
              displayImagePath={"images/scroll-view-toggle.png"}
            />
          </div>
          <h1 className="text-5xl font-heading ml-19">Dashboard</h1>
          <div className="relative">
            {dashState.isFetching ? (
              <>
                {" "}
                <div className=" absolute h-full w-full bg-gray-300 opacity-70"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Loader size="300" />
                </div>
              </>
            ) : (
              <div></div>
            )}
            {userChosenView(dashState.patterns)}
          </div>
        </div>
      </DashContext>
    </>
  );
}

export default MyPatternsPage;
