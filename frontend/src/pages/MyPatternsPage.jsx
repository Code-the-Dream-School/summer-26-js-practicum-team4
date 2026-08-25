import React, { useEffect, useReducer } from "react";

// Component Imports
import DisplayToggle from "../components/features/dashboard/DisplayToggle";

import PrevNextView from "../components/features/dashboard/ViewModes/PrevNextView";
import AllPatternView from "../components/features/dashboard/ViewModes/AllPatternView";
import CreateNewPatternIcon from "../components/features/dashboard/PatternDisplays/CreateNewPatternIcon";

// Contexts
import { DashGallContext } from "../state/dashboardGallery/dashGallContext";
import { useAuth } from "../state/auth/useAuth";

// Loader
import Loader from "../components/Loader/Loader";

// Service Imports
import { fetchCurrentUserPatterns } from "../services/patternService";

// State Imports
import {
  dashGallInitState,
  dashGallReducer,
  dashGallActions,
} from "../state/dashboardGallery/dashGallReducer";

function MyPatternsPage() {
  const [dashGallState, dispatch] = useReducer(
    dashGallReducer,
    dashGallInitState,
  );
  const {
    state: { user },
  } = useAuth();

  // Retrieve user patterns when page loads
  useEffect(() => {
    async function getPatterns() {
      const userPatterns = await fetchCurrentUserPatterns();
      console.log("Patterns are being fetched!");

      dispatch({ userPatterns, type: dashGallActions.setUserPatterns });
    }

    dispatch({ type: dashGallActions.beginFetch }); // displays loader

    getPatterns();

    dispatch({ type: dashGallActions.endFetch });
  }, [dashGallState.isDeleting, dashGallState.isSaving]);

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
    if (dashGallState.view === "scroll") {
      return <PrevNextView />;
    } else if (dashGallState.view === "all") {
      return <AllPatternView />;
    }
  }

  return (
    <>
      <DashGallContext value={{ dashGallState, dispatch, dashGallActions }}>
        <div className="bg-background">
          <div className="flex flex-row-reverse mx-auto content-end">
            {" "}
            <DisplayToggle
              name="Show All"
              onClick={() => dispatch({ type: dashGallActions.setAllView })}
              displayImagePath={"images/all-pattern-view-toggle.png"}
            />
            <DisplayToggle
              name="Scroll"
              onClick={() => dispatch({ type: dashGallActions.setScrollView })}
              displayImagePath={"images/scroll-view-toggle.png"}
            />
          </div>
          <h1 className="text-5xl font-heading ml-19">Dashboard</h1>
          <div className="relative">
            {dashGallState.isFetching ? (
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
            {userChosenView(dashGallState.patterns)}
          </div>
        </div>
      </DashGallContext>
    </>
  );
}

export default MyPatternsPage;
