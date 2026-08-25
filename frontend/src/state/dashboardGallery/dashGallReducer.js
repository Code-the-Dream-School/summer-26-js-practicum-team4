const dashGallInitState = {
  view: "scroll",
  page: "dashboard",
  patterns: [],
  isDeleting: false,
  isFetching: false,
  isEditing: false,
  isSaving: false,
  scrollPatternIx: 0,
};

const dashGallActions = {
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
  setPage: "setPage",
};

function dashGallReducer(state, action) {
  switch (action.type) {
    case dashGallActions.setScrollView:
      return { ...state, view: "scroll" };
    case dashGallActions.setAllView:
      return { ...state, view: "all" };
    case dashGallActions.setUserPatterns:
      return { ...state, patterns: action.userPatterns };

    case dashGallActions.setScrollPatternIx: {
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
    case dashGallActions.beginDelete:
      return {
        ...state,
        isDeleting: true,
      };
    case dashGallActions.endDelete:
      return {
        ...state,
        scrollPatternIx: 0,
        isDeleting: false,
      };

    case dashGallActions.beginFetch:
      return {
        ...state,
        isFetching: true,
      };
    case dashGallActions.endFetch:
      return {
        ...state,
        isFetching: false,
      };
    case dashGallActions.beginEditing:
      return {
        ...state,
        isEditing: true,
      };
    case dashGallActions.endEditing:
      return {
        ...state,
        isEditing: false,
      };

    case dashGallActions.beginSaving:
      return { ...state, isSaving: true };

    case dashGallActions.endSaving:
      return { ...state, isSaving: false };

    case dashGallActions.setPage:
      return { ...state, page: action.page };
    default:
      return state;
  }
}

export { dashGallInitState, dashGallReducer, dashGallActions };
