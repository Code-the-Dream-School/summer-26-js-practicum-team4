import React, { useEffect, useReducer } from "react";

// Component Imports
import DisplayToggle from "../components/features/dashboard/DisplayToggle";

import PrevNextView from "../components/features/dashboard/ViewModes/PrevNextView";
import AllPatternView from "../components/features/dashboard/ViewModes/AllPatternView";
import CreateNewPatternIcon from "../components/features/dashboard/PatternDisplays/CreateNewPatternIcon";

// Context
import { DashContext } from "../state/dashboard/dashContext";

// Loader
import Loader from "../components/Loader/Loader";

// Service Imports
import { fetchAllUserPatterns } from "../services/patternService";

// State Imports
import {
  dashInitState,
  dashReducer,
  dashActions,
} from "../state/dashboard/dashReducer";

function GalleryPage() {
  const [dashState, dispatch] = useReducer(dashReducer, dashInitState);

  useEffect(() => {
    async function getPatterns() {
      dispatch({ type: dashActions.beginFetch }); // displays loader

      const userPatterns = await fetchAllUserPatterns();
      dispatch({ userPatterns, type: dashActions.setUserPatterns });

      dispatch({ type: dashActions.endFetch });
    }

    getPatterns();

    // Set page in reducer to gallery as well as view to all
    dispatch({ page: "gallery", type: dashActions.setPage });
    dispatch({ type: dashActions.setAllView });
  }, [dashState.isDeleting, dashState.isSaving]);

  return (
    <>
      <DashContext value={{ dashState, dispatch, dashActions }}>
        <div className="bg-background">
          <h1 className="text-5xl font-heading ml-19 pt-15">Gallery Page</h1>
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
            <AllPatternView />
          </div>
        </div>
      </DashContext>
    </>
  );
}

export default GalleryPage;
