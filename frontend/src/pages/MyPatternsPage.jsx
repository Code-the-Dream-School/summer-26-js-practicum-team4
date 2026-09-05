import React, { useEffect, useRef, useReducer, useState } from "react";

// Component Imports
import DisplayToggle from "../components/features/dashboard/DisplayToggle";

import PrevNextView from "../components/features/dashboard/ViewModes/PrevNextView";
import AllPatternView from "../components/features/dashboard/ViewModes/AllPatternView";
import CreateNewPatternIcon from "../components/features/dashboard/PatternDisplays/CreateNewPatternIcon";

import PatternResult from "../components/features/pattern/PatternResult";

// Contexts
import { DashContext } from "../state/dashboard/dashContext";
import { useAuth } from "../state/auth/useAuth";

// Loader
import Loader from "../components/Loader/Loader";

// Service Imports
import { fetchCurrentUserPatterns } from "../services/patternService";

// State Imports
import {
  dashInitState,
  dashReducer,
  dashActions,
} from "../state/dashboard/dashReducer";

function MyPatternsPage() {
  const [dashState, dispatch] = useReducer(dashReducer, dashInitState);
  const [patternToPrint, setPatternToPrint] = useState("");
  const { state } = useAuth();

  const canvasRef = useRef(null);

  // Retrieve user patterns when page loads
  useEffect(() => {
    async function getPatterns() {
      dispatch({ type: dashActions.beginFetch }); // displays loader

      const userPatterns = await fetchCurrentUserPatterns();
      if (userPatterns?.error?.message) {
        dispatch({ type: "SET_ERROR", payload: userPatterns.error.message });
      } else {
        dispatch({ userPatterns, type: dashActions.setUserPatterns });
      }
      // Check if pattern we were previously on still exists
      dispatch({ type: dashActions.handleScrollPatternIx });

      dispatch({ type: dashActions.endFetch });
    }

    getPatterns();
  }, [state.isDeleting, state.isSaving]);

  // Function that processes user's view choice into rendered component
  function userChosenView(patterns) {
    if (patterns.length === 0) {
      return (
        <div>
          <h3 className="ml-20 my-5">
            Welcome! Let us add your first pattern.{" "}
          </h3>
          <CreateNewPatternIcon patternDisplayScaling="ml-8" />
        </div>
      );
    }
    if (dashState.view === "scroll") {
      return (
        <PrevNextView
          setPatternToPrint={setPatternToPrint}
          canvasRef={canvasRef}
        />
      );
    } else if (dashState.view === "all") {
      return (
        <AllPatternView
          setPatternToPrint={setPatternToPrint}
          canvasRef={canvasRef}
        />
      );
    }
  }

  if (patternToPrint) {
    console.log(patternToPrint);
  }

  return (
    <>
      <DashContext value={{ dashState, dispatch, dashActions }}>
        <div className="bg-background">
          <div className={"hidden print:flex"}>
            {patternToPrint ? (
              <PatternResult
                pattern={patternToPrint}
                fileName={"generated_pattern"}
                canvasRef={canvasRef}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-row-reverse mx-auto content-end print:hidden">
            {" "}
            <DisplayToggle
              onClick={() => dispatch({ type: dashActions.setAllView })}
              displayImagePath={"images/all-pattern-view-toggle.png"}
            />
            <DisplayToggle
              onClick={() => dispatch({ type: dashActions.setScrollView })}
              displayImagePath={"images/scroll-view-toggle.png"}
            />
          </div>
          <h1 className="text-5xl font-heading ml-19 print:hidden">
            Dashboard
          </h1>
          <div className="relative print:hidden">
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
            {state.error && (
              <p className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
                {state.error}
              </p>
            )}
          </div>
        </div>
      </DashContext>
    </>
  );
}

export default MyPatternsPage;
