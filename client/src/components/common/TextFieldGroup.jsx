import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";

const TextFieldGroup = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled,
  className
}) => {
  return (
    <div className="form-group">
      <input
        type={type}
        // need to change input txt to white for login component (form-control form-control:focus)
        className={classnames(
          "form-control form-control-md transparent-input",
          {
            "is-invalid": error,
            "white-input": className
          }
        )}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        label={label}
      />
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};
TextFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  info: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.string
};

TextFieldGroup.defaultProps = {
  type: "text"
};

export default TextFieldGroup;
