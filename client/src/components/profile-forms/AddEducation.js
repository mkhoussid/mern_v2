import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";

import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { addEducation } from "../../actions/profile";

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    from: "",
    to: "",
    current: false,
    description: ""
  });

  const [toDateDisabled, toggleToDateDisabled] = useState(false);

  const {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
  } = formData;

  const onChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Add Education</h1>
      <p className="lead">
        <i className="fas fa-code-branch" /> Add education here
      </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={e => {
          e.preventDefault();
          addEducation(formData, history);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="* School"
            name="school"
            value={school}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree"
            name="degree"
            value={degree}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Field of Study"
            name="fieldOfStudy"
            value={fieldOfStudy}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={from}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              onChange={e => {
                setFormData({
                  ...formData,
                  current: !current
                });
                toggleToDateDisabled(!toDateDisabled);
              }}
            />{" "}
            Current School
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type={toDateDisabled ? "text" : "date"}
            name="to"
            disabled={toDateDisabled}
            value={toDateDisabled ? "" : to}
            style={
              toDateDisabled
                ? { backgroundColor: "#f4f2f2" }
                : { backgroundColor: "" }
            }
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Description"
            value={description}
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

const styles = {
  backgroundColor: "grey"
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
};

export default connect(
  null,
  { addEducation }
)(withRouter(AddEducation));
