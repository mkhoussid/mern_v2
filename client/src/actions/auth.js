import axios from "axios";
import { setAlert } from "./alert";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR
} from "./types";

import setAuthToken from "../utils/setAuthToken";

// Load user
export const loadUser = () => async dispatch => {
  const token = localStorage.token;

  if (token) {
    setAuthToken(token);
  }

  try {
    const response = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register user
export const register = ({ name, email, password }) => async dispatch => {
  // Config needed because we're sending data
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const response = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};
