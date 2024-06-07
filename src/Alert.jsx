import React from "react";
import "./style.css";

/** Presentational component for showing bootstrap-style alerts.
 *
 * { LoginForm, SignupForm, ProfileForm } -> Alert
 **/

function Alert({ type = "danger", messages = [] }) {

  return (
      <div className= "alert">
        {messages.map(error => (
            <div className="red-text" key={error}>
              {error}
            </div>
        ))}
      </div>
  );
}

export default Alert;
