import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { getCurrentProfile } from "../../actions/profile";

const Dashboard = ({ profile, auth, getCurrentProfile }) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);
  return <div>Dashboard</div>;
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
