import React, { useEffect, useReducer } from "react";

// Component Imports
import DisplayToggle from "../components/features/dashboard/DisplayToggle";

import PrevNextView from "../components/features/dashboard/ViewModes/PrevNextView";
import AllPatternView from "../components/features/dashboard/ViewModes/AllPatternView";
import CreateNewPatternIcon from "../components/features/dashboard/PatternDisplays/CreateNewPatternIcon";

// Context
import { DashGallContext } from "../state/dashboardGallery/dashGallContext";

// Loader
import Loader from "../components/Loader/Loader";

// Service Imports
import { fetchAllUserPatterns } from "../services/patternService";

// State Imports
import {
  dashGallInitState,
  dashGallReducer,
  dashGallActions,
} from "../state/dashboardGallery/dashGallReducer";

function GalleryPage() {
  const [dashGallState, dispatch] = useReducer(
    dashGallReducer,
    dashGallInitState,
  );

  useEffect(() => {
    async function getPatterns() {
      const userPatterns = await fetchAllUserPatterns();
      dispatch({ userPatterns, type: dashGallActions.setUserPatterns });
    }

    dispatch({ type: dashGallActions.beginFetch }); // displays loader

    getPatterns();

    dispatch({ type: dashGallActions.endFetch });

    // Set page in reducer to gallery as well as view to all
    dispatch({ page: "gallery", type: dashGallActions.setPage });
    dispatch({ type: dashGallActions.setAllView });
  }, [dashGallState.isDeleting, dashGallState.isSaving]);

  return (
    <>
      <DashGallContext value={{ dashGallState, dispatch, dashGallActions }}>
        <div className="bg-background">
          <h1 className="text-5xl font-heading ml-19">Gallery Page</h1>
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
            <AllPatternView />
          </div>
        </div>
      </DashGallContext>
    </>
  );
}

export default GalleryPage;
