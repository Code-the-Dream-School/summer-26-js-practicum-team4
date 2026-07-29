export const initialState = {
  user: null,
  isAuthenticated: false,
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
        error: null
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
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

    default:
      return state;
  }
};
