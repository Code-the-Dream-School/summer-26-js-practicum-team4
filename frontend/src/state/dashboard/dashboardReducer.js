const dashInitState = {
  view: "scroll",
  patterns: [],
  deletingStatus: "false",
};

const dashActions = {
  setScrollView: "setScrollView",
  setAllView: "setAllView",
  setUserPatterns: "setUserPatterns",
};

function dashReducer(state, action) {
  switch (action.type) {
    case dashActions.setScrollView:
      return { ...state, view: "scroll" };
    case dashActions.setAllView:
      return { ...state, view: "all" };
    case dashActions.setUserPatterns:
      return { ...state, patterns: action.userPatterns };
  }
}

export { dashInitState, dashReducer, dashActions };
