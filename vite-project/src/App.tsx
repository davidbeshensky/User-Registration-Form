import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  //these are form options fetched from the server
  const [occupations, setOccupations] = useState([]);
  const [statesUS, setStatesUS] = useState<
    { abbreviation: string; name: string }[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    occupation: "",
    state: "",
  });
  const [errors, setErrors] = useState<{
    nameError?: string;
    emailError?: string;
    passwordError?: string;
    occupationError?: string;
    stateError?: string;
  }>({
    nameError: undefined,
    emailError: undefined,
    passwordError: undefined,
    occupationError: undefined,
    stateError: undefined,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formValidationState = {
      nameError: validateName(formData.name),
      emailError: validateEmail(formData.email),
      passwordError: validatePassword(formData.password),
      occupationError: validateOccupation(formData.occupation),
      stateError: validateState(formData.state),
    };

    setErrors(formValidationState);

    if (
      Object.values(formValidationState).some(
        (errorMessage) => errorMessage !== ""
      )
    ) {
      return;
    } else {
      try {
        const response = await axios.post(
          "https://frontend-take-home.fetchrewards.com/form",
          formData
        );
        setIsSubmitted(true);
      } catch (error) {
        console.log(error);
        alert(
          "There was an error submitting the form. Please try again later."
        );
      }
    }
  };

  const handleInputChange = ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const validationFunctions = {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
      occupation: validateOccupation,
      state: validateState,
    };

    const name = target.name as keyof typeof validationFunctions;
    const { value } = target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const errorMessage = validationFunctions[name](value);

    setErrors((prevState) => ({
      ...prevState,
      [name + "Error"]: errorMessage,
    }));

    if (errorMessage) {
      target.setAttribute("aria-invalid", "true");
    } else {
      target.removeAttribute("aria-invalid");
    }
  };

  //gets the state and occupation information
  useEffect(() => {
    axios
      .get("https://frontend-take-home.fetchrewards.com/form")
      .then((response) => {
        setOccupations(response.data.occupations);
        setStatesUS(response.data.states);
      })
      .catch(console.log);
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateName = (name: string) => {
    switch (true) {
      case name.length === 0 || name === undefined:
        return "name is required";
      case name.length > 30:
        return "name cannot exceed 30 characters";
      default:
        return "";
    }
  };

  const validateEmail = (email: string) => {
    switch (true) {
      case email.length === 0 || email === undefined:
        return "Email is required";
      case !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email):
        return "Email is invalid";
      default:
        return "";
    }
  };

  const validatePassword = (password: string) => {
    switch (true) {
      case password.length === 0 || password === undefined:
        return "Password is required";
      case password.length <= 8:
        return "Password must be at least 8 characters";
      case !/[a-z]/.test(password):
        return "Password must contain at least one lowercase letter";
      case !/[A-Z]/.test(password):
        return "Password must contain at least one uppercase letter";
      case !/[0-9]/.test(password):
        return "Password must contain at least one number";
      case !/[^a-zA-Z0-9]/.test(password):
        return "Password must contain at least one special character";
      default:
        return "";
    }
  };

  const validateOccupation = (occupation: string) => {
    switch (true) {
      case occupation.length === 0 || occupation === undefined:
        return "Occupation is required";
      default:
        return "";
    }
  };

  const validateState = (state: string) => {
    switch (true) {
      case state.length === 0 || state === undefined:
        return "State is required";
      default:
        return "";
    }
  };

  return (
    <div className="appContainer">
      {!isSubmitted && <div id="title">User Registration Form</div>}
      {isSubmitted && (
        <div className="successMessage">Thank you for registering!</div>
      )}
      {!isSubmitted && (
        <form onSubmit={handleSubmit} className="formContainer">
          <input
            type="text"
            name="name"
            id="name"
            aria-invalid="false"
            aria-errormessage="errorName"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="full name"
          />
          <span id="errorName" className="error">
            {errors.nameError}
          </span>
          <input
            type="email"
            name="email"
            id="email"
            aria-invalid="false"
            aria-errormessage="errorEmail"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="email"
          />
          <span id="errorEmail" className="error">
            {errors.emailError}
          </span>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              aria-invalid="false"
              aria-errormessage="errorPassword"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              id="toggle-visibility"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <span id="errorPassword" className="error">
            {errors.passwordError}
          </span>

          <select
            name="state"
            id="state"
            aria-invalid="false"
            aria-errormessage="errorState"
            value={formData.state}
            onChange={handleInputChange}
          >
            <option value="">Select a state</option>
            {statesUS.map((state, idx) => (
              <option key={idx} value={state.abbreviation}>
                {state.name}
              </option>
            ))}
          </select>
          <span id="errorState" className="error">
            {errors.stateError}
          </span>

          <select
            name="occupation"
            id="occupation"
            aria-invalid="false"
            aria-errormessage="errorOccupation"
            value={formData.occupation}
            onChange={handleInputChange}
          >
            <option value="">Select an occupation</option>
            {occupations.map((occupation, idx) => (
              <option key={idx} value={occupation}>
                {occupation}
              </option>
            ))}
          </select>
          <span id="errorOccupation" className="error">
            {errors.occupationError}
          </span>

          <button className="btn" type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};
export default App;
