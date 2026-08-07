const dashInitState = {
  view: "scroll",
  patterns: [],
  deletingStatus: "false",
  scrollPatternIx: 0,
};

const dashActions = {
  setScrollView: "setScrollView",
  setAllView: "setAllView",
  setUserPatterns: "setUserPatterns",
  setScrollPatternIx: "setScrollPatternIx",
};

function dashReducer(state, action) {
  switch (action.type) {
    case dashActions.setScrollView:
      return { ...state, view: "scroll" };
    case dashActions.setAllView:
      return { ...state, view: "all" };
    case dashActions.setUserPatterns:
      return { ...state, patterns: action.userPatterns };
    case dashActions.setScrollPatternIx: {
      const patternLength = state.patterns.length;
      let newScrollPatternIx = state.scrollPatternIx;

      // "Next" pattern
      if (action.direction === "+") {
        const nextPatternIx = state.scrollPatternIx + 1;

        if (nextPatternIx < patternLength) {
          newScrollPatternIx = nextPatternIx;
        }
      }

      // "Previous" pattern
      else if (action.direction === "-") {
        const prevPatternIx = state.scrollPatternIx - 1;

        if (prevPatternIx >= 0) {
          newScrollPatternIx = prevPatternIx;
        }
      }

      return { ...state, scrollPatternIx: newScrollPatternIx };
    }
  }
}

export { dashInitState, dashReducer, dashActions };
