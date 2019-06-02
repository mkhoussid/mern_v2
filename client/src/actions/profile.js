import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  DELETE_ACCOUNT,
  CLEAR_PROFILE
} from "./types";

// Get current user profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const response = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: response.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create or update profile
export const createOrUpdateProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await axios.post("/api/profile", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: response.data
    });

    dispatch(setAlert(edit ? "Profile updated" : "Profile created", "success"));

    if (!edit) {
      history.push("/dashboard");
    } else {
      window.scrollTo(0, 0);
    }
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });

    const errors = err.response.data.errors;

    if (errors) {
      window.scrollTo(0, 0);

      errors.forEach(error => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
  }
};

// Add experience
export const addExperience = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await axios.put(
      "/api/profile/experience",
      formData,
      config
    );

    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert("Experience added", "success"));

    history.push("/dashboard");
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });

    const errors = err.response.data.errors;

    if (errors) {
      window.scrollTo(0, 0);

      errors.forEach(error => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
  }
};

// Add education
export const addEducation = (formData, history) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const response = await axios.put(
      "/api/profile/education",
      formData,
      config
    );

    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert("Education added", "success"));

    history.push("/dashboard");
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });

    const errors = err.response.data.errors;

    if (errors) {
      window.scrollTo(0, 0);

      errors.forEach(error => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
  }
};

//  Delete experience
export const deleteExperience = id => async dispatch => {
  try {
    const response = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert("Experience deleted", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//  Delete education
export const deleteEducation = id => async dispatch => {
  try {
    const response = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: response.data
    });

    dispatch(setAlert("Education deleted", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete account and profile
//  Delete education
export const deleteAccount = () => async dispatch => {
  if (window.confirm("Are you sure? This cannot be undone!")) {
    try {
      const response = await axios.delete("/api/profile/");

      dispatch({
        type: CLEAR_PROFILE
      });

      dispatch({
        type: DELETE_ACCOUNT,
        payload: response.data
      });

      dispatch(setAlert("Account deleted"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status }
      });
    }
  }
};
