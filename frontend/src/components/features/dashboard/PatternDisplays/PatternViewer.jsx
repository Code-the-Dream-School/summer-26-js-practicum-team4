import React, { useState, useContext, useRef, useEffect } from "react";

// Component Imports
import DownloadPatternBtn from "./../PatternManagementTools/DownloadPatternBtn";
import DeletePatternBtn from "./../PatternManagementTools/DeletePatternBtn";
import PatternNameEditInput from "../PatternManagementTools/PatternNameEditInput";

import { DashContext } from "../../../../state/dashboard/dashContext";

const displayStyle = {
  scroll: {
    textStyle: "text-3xl mb-5",
    patternInterface: "mx-auto h-[60dvh]",
    downloadAndDelete: "flex justify-center gap-x-15 my-8",
    image: "mx-auto p-10 h-full object-contain",
  },
  all: {
    textStyle: "text-2xl ml-5",
    patternInterface: "m-2 h-[45dvh]",
    downloadAndDelete: "text-right mr-2 mt-2 object-contain",
    image: "mx-auto p-5 h-[70%] object-contain",
  },
};

const monthsLst = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDate(dateTimeStr) {
  const yrMthDay = dateTimeStr.split("T")[0].split("-");

  const monthStr = monthsLst[parseInt(yrMthDay[1] - 1)];
  const dayStr = yrMthDay[2] + ",";
  const yearStr = yrMthDay[0];

  return [monthStr, dayStr, yearStr].join(" ");
}

function PatternViewer({ pattern, view }) {
  // Relevant states
  const { dashState, dashActions, dispatch } = useContext(DashContext);

  const [editingThisPattern, setEditingThisPattern] = useState(false);
  const [currentPatternName, setCurrentPatternName] = useState(
    pattern.patternName,
  );

  const editFocus = useRef("");

  // Focus on editing field if useRef has a non-empty reference
  useEffect(() => {
    if (editFocus.current) {
      editFocus.current.focus();
    }
  }, [dashState.isEditing]);

  function handleEdit() {
    if (dashState.isEditing) {
      return;
    }

    setCurrentPatternName(pattern.patternName);
    setEditingThisPattern(true);

    dispatch({ type: dashActions.beginEditing });

    return;
  }

  function patternEditInterface() {
    if (dashState.isEditing && editingThisPattern) {
      return (
        <PatternNameEditInput
          patternId={pattern.id}
          defaultPatternName={pattern.patternName}
          currentPatternName={currentPatternName}
          setCurrentPatternName={setCurrentPatternName}
          setEditingThisPattern={setEditingThisPattern}
          ref={editFocus}
          textStyle={displayStyle[view].textStyle}
        />
      );
    } else {
      return (
        <div className="grid grid-cols-5 place-content-center">
          <h2 className={displayStyle[view].textStyle}>
            {pattern.patternName}
          </h2>
          <button className="col-start-6" onClick={handleEdit}>
            <img
              src="images/edit.png"
              className="hover:bg-gray-300 mb-5 w-10"
            />
          </button>
        </div>
      );
    }
  }
  return (
    <>
      <div className="container">
        {
          // if in scroll view, title and pattern edit interface goes above interface
          view === "scroll" ? patternEditInterface() : <></>
        }

        <div
          className={`pattern-interface bg-white border rounded-2xl border-gray-400 ${displayStyle[view].patternInterface}`}
        >
          {
            // download and delete buttons go above image in 'all' view
            view === "all" ? (
              <div className={displayStyle[view].downloadAndDelete}>
                <DownloadPatternBtn pattern={pattern} />
                <DeletePatternBtn pattern={pattern} />
              </div>
            ) : (
              <></>
            )
          }
          <img
            className={displayStyle[view].image}
            src={pattern.patternImgUrl}
            alt={pattern.patternName}
          />
        </div>
        {
          // download and delete buttons go under interface in 'scroll' view
          view === "scroll" ? (
            <div className={displayStyle[view].downloadAndDelete}>
              <DownloadPatternBtn pattern={pattern} />
              <DeletePatternBtn pattern={pattern} />
            </div>
          ) : (
            <></>
          )
        }

        {
          // edit interface goes below pattern interface (along with creation date) in 'all' view
          view === "all" ? (
            <>
              {patternEditInterface()}{" "}
              <h3 className="mb-10 ml-5">
                Created {getDate(pattern.createdAt)}
              </h3>
            </>
          ) : (
            <></>
          )
        }
      </div>
    </>
  );
}

export default PatternViewer;
