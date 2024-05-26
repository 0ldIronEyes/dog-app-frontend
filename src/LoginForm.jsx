import React, { useState, useContext } from "react";
import UserContext from "./UserContext";
import { useNavigate } from "react-router-dom";
import "./loginform.css";
import Alert from "./Alert";

/** Login form.
 *
 * Called from HomeSignedOut
 * 
 */

function LoginForm() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
      "LoginForm",
      "login=", typeof login,
      "formData=", formData,
      "formErrors", formErrors,
  );

  /** Handle form submit:
   *
   * Calls login func prop and, if successful, redirect to /companies.
   */

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await login(formData);
    if (result.success) {
      navigate("/");
    } else {
      setFormErrors(result.errors);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  return (
      <div className="LoginForm">
        <div>
          <h3>Log In</h3>

          <div className="card">
            <div className="formBody">
              <form onSubmit={handleSubmit}>
                 <div className="formRow">
                    <div className="formField">
                      <label>Username</label>
                      <input
                          name="username"
                          className="formInput"
                          value={formData.username}
                          onChange={handleChange}
                          autoComplete="username"
                          required
                      />
                    </div>
                    <div className="formField">
                      <label>Password</label>
                      <input
                          type="password"
                          name="password"
                          className="formInput"
                          value={formData.password}
                          onChange={handleChange}
                          autoComplete="current-password"
                          required
                      />
                    </div>

                    {formErrors.length
                        ? <Alert type="danger" messages={formErrors} />
                        : null}

                  </div>
                  <button
                        className="submitButton"
                        onSubmit={handleSubmit}
                    >
                      Submit
                    </button>
                </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default LoginForm;
