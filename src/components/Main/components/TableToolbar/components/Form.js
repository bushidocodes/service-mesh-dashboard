import React from "react";
import { PropTypes } from "prop-types";

const Form = ({ children }) => {
  return <form onSubmit={(e) => e.preventDefault()}>{children}</form>;
};

Form.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.node])
};

export default Form;
