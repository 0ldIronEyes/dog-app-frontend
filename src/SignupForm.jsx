import React, { useState, useContext } from "react";
import UserContext from "./UserContext";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert.jsx";
import "./loginform.css";

/** Signup form.
 *
 * Called from HomeSignedOut
 */

function SignupForm() {
  const { signup } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    userlocation: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState([]);
/*
  console.debug(
      "SignupForm",
      "signup=", typeof signup,
      "formData=", formData,
      "formErrors=", formErrors,
  );
*/
  /** Handle form submit:
   *
   * 
   */

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await signup(formData);
    if (result.success) {
      navigate("/");
    } else {
      setFormErrors(result.errors);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return (
      <div className="LoginForm">
        <div>
          <h2>Sign Up</h2>
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
                  />
                </div>
                <div className="formField">
                  <label>Email</label>
                  <input
                      type="email"
                      name="email"
                      className="formInput"
                      value={formData.email}
                      onChange={handleChange}
                  />
                </div>
              </div>
              <div className="formRow">
                <div className="formField">
                    <label>First name</label>
                    <input
                        name="firstName"
                        className="formInput"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                  </div>
                <div className="formField">
                  <label>Last name</label>
                  <input
                      name="lastName"
                      className="formInput"
                      value={formData.lastName}
                      onChange={handleChange}
                  />
                </div>
                <div className="formField">
                  <label>Zip Code</label>
                  <input
                      name="userlocation"
                      className="formInput"
                      value={formData.userlocation}
                      onChange={handleChange}
                  />
                </div>
              </div>
                {formErrors.length
                    ? <Alert type="danger" messages={formErrors} />
                    : null
                }

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

export default SignupForm;