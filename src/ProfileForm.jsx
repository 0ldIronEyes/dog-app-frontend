import React, { useState, useContext } from "react";
import Alert from "./Alert";
import UserContext from "./UserContext";
import { Link, redirect } from "react-router-dom";
import DogBreedApi from "./api";
import "./profileform.css";

/** Profile editing form.
 *
 * Displays profile form and handles changes to local form state.
 * Submitting the form calls the API to save, and triggers user reloading
 * throughout the site.
 */

function ProfileForm() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    username: currentUser.username,
    userlocation: currentUser.userlocation,
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);


  // switch to use our fancy limited-time-display message hook
  const [saveConfirmed, setSaveConfirmed] = useState(false);
  // const [saveConfirmed, setSaveConfirmed] = useTimedMessage()

  console.debug(
      "ProfileForm",
      "currentUser=", currentUser,
      "formData=", formData,
      "formErrors=", formErrors,
      "saveConfirmed=", saveConfirmed,
  );

  /** on form submit:
   * - attempt save to backend & report any errors
   * - if successful
   *   - clear previous error messages and password
   *   - show save-confirmed message
   *   - set current user info throughout the site
   */

  async function handleSubmit(evt) {
    evt.preventDefault();

    let profileData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      userlocation: formData.userlocation,
      password: formData.password,
    };

    let username = formData.username;
    let updatedUser;

    try {
      updatedUser = await DogBreedApi.saveProfile(username, profileData);
    } catch (errors) {
      setFormErrors(errors);
      return;
    }

    setFormData(f => ({ ...f, password: "" }));
    setFormErrors([]);
    setSaveConfirmed(true);

    // trigger reloading of user information throughout the site
    setCurrentUser(updatedUser);
  }

  /** Handle form data changing */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(f => ({
      ...f,
      [name]: value,
    }));
    setFormErrors([]);
  }

  return (
      <div id="profile-container">
        <h2 id="profile-heading">Profile</h2>
        <div>
          <div className="form-section">
            <form id="profile-form">
              <div  className="form-group" >
                <div id="username" >{formData.username}</div>
                <p> Change account info </p>
              </div>
              <div className="form-group">
                <label for="firstName">First Name</label>
                <input
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                />
              </div>
              <div  className="form-group">
                <label for="lastName">Last Name</label>
                <input
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                />
              </div>
              <div  className="form-group">
                <label for="email">Email</label>
                <input
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label for="userlocation">User Location</label>
                <input
                    name="userlocation"
                    id="userlocation"
                    value={formData.userlocation}
                    onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label for="password">Confirm password to make changes:</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                />
              </div>

              {formErrors.length
                  ? <Alert type="danger" messages={formErrors} />
                  : null}

              {saveConfirmed
                  ?
                  <Alert type="success"  messages={["Updated successfully."]} />
                  : null}

              <button
                  id="save-changes-btn"
                  onClick={handleSubmit}
              >
                Save Changes
              </button>
               <div className="back-button"><Link to={`/`}> Back to Search </Link>  </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default ProfileForm;
