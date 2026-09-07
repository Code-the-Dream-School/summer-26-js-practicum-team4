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
    <div className="min-h-screen w-full">
      <div className="relative z-10 ml-25 my-5 flex items-center gap-3 text-primary">
        <span className="h-px w-24 bg-primary" />
        <span className="font-bold">×</span>
        <span className="h-px w-24 bg-primary" />
      </div>

      <div className="w-[90%] mx-auto">
        <CreateNewPatternIcon />
      </div>
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

function GridIcon({ active }) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-4 w-4 rounded-md ${
            active ? "bg-primary" : "bg-primary/20"
          }`}
        />
      ))}
    </div>
  );
}

function SingleIcon({ active }) {
  const arrowColor = active ? "border-primary" : "border-primary/20";
  const squareColor = active ? "bg-primary" : "bg-primary/20";

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`h-2 w-2 -rotate-45 border-t-2 border-l-2 ${arrowColor}`}
      />
      <span className={`block h-8 w-8 rounded-md ${squareColor}`} />
      <span
        className={`h-2 w-2 rotate-45 border-t-2 border-r-2 ${arrowColor}`}
      />
    </div>
  );
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
         <div className="relative z-10 ml-auto flex w-fit items-center gap-2 mr-25 -mt-16 print:hidden">
            <button
              type="button"
              onClick={() => dispatch({ type: dashActions.setScrollView })}
              aria-label="Single pattern view"
              aria-pressed={dashState.view === "scroll"}
              className="rounded-lg p-2"
            >
              <SingleIcon active={dashState.view === "scroll"} />
            </button>

            <button
              type="button"
              onClick={() => dispatch({ type: dashActions.setAllView })}
              aria-label="Grid pattern view"
              aria-pressed={dashState.view === "all"}
              className="rounded-lg p-2"
            >
              <GridIcon active={dashState.view === "all"} />
            </button>
          </div>
          <h1 className="text-5xl font-bold text-secondary ml-25 m-5 print:hidden">
            Dashboard
          </h1>
          <div className="relative print:hidden">
            {dashState.isFetching ? (
              <>
                {" "}
                <div className=" absolute h-full w-full"></div>
                <div className="flex min-h-screen w-full items-center justify-center bg-background print:hidden">
                  <Loader />
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
