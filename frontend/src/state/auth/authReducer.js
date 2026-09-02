export const initialState = {
  user: null,
  isAuthenticated: false,
  isEditing: false,
  isSaving: false,
  isDeleting: false,
  loading: true,
  error: null,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_CHECKED":
      return {
        ...state,
        loading: false,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case "SET_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "BEGIN_PATTERN_NAME_EDITING":
      return {
        ...state,
        isEditing: true,
      };
    case "END_PATTERN_NAME_EDITING":
      return {
        ...state,
        isEditing: false,
      };

    case "BEGIN_PATTERN_NAME_SAVING":
      return { ...state, isSaving: true };

    case "END_PATTERN_NAME_SAVING":
      return { ...state, isSaving: false };

    case "BEGIN_PATTERN_DELETING":
      return {
        ...state,
        isDeleting: true,
      };
    case "END_PATTERN_DELETING":
      return {
        ...state,
        scrollPatternIx: 0,
        isDeleting: false,
      };

    default:
      return state;
  }
};
