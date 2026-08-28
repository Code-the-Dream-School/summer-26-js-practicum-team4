const dashInitState = {
  view: "scroll",
  patterns: [],
  isDeleting: false,
  isFetching: false,
  isEditing: false,
  isSaving: false,
  scrollPatternIx: 0,
};

const dashActions = {
  setScrollView: "setScrollView",
  setAllView: "setAllView",
  setUserPatterns: "setUserPatterns",
  setScrollPatternIx: "setScrollPatternIx",
  beginDelete: "beginDelete",
  endDelete: "endDelete",
  beginFetch: "beginFetch",
  endFetch: "endFetch",
  beginEditing: "beginEditing",
  endEditing: "endEditing",
  beginSaving: "beginSaving",
  endSaving: "endSaving",
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
    case dashActions.beginDelete:
      return {
        ...state,
        isDeleting: true,
      };
    case dashActions.endDelete:
      return {
        ...state,
        scrollPatternIx: 0,
        isDeleting: false,
      };

    case dashActions.beginFetch:
      return {
        ...state,
        isFetching: true,
      };
    case dashActions.endFetch:
      return {
        ...state,
        isFetching: false,
      };
    case dashActions.beginEditing:
      return {
        ...state,
        isEditing: true,
      };
    case dashActions.endEditing:
      return {
        ...state,
        isEditing: false,
      };

    case dashActions.beginSaving:
      return { ...state, isSaving: true };

    case dashActions.endSaving:
      return { ...state, isSaving: false };
    default:
      return state;
  }
}

export { dashInitState, dashReducer, dashActions };
