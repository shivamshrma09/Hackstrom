import React, { useState } from "react";
import "./Singupngo.css";

const verifiedNGOs = [
  { name: "Compassion Unlimited Plus Action", regNumber: "KA004/1993" },
  { name: "People for Animals – Bangalore", regNumber: "KA025/2001" },
  { name: "Govanithashraya Trust", regNumber: "KA030/2002" },
  { name: "Captain’s Animal Care Trust", regNumber: "KA073/2019" },
  { name: "Charlie’s Animal Rescue Centre (CARE)", regNumber: "KA067/2018" },
  { name: "Shri Krishan Parnami Gaushala", regNumber: "HR351/2024" },
  { name: "Sarvodaya Foundation", regNumber: "HR352/2024" },
  { name: "Sri Venkataramana Goshala Trust", regNumber: "KA078/2021" },
  { name: "Shree Durgamata Goshala Trust", regNumber: "KA080/2023" },
  { name: "Shri Krishna Viklang Gau Sewa Samiti", regNumber: "HR353/2025" }
];

const Singupngo = () => {
  const [form, setForm] = useState({
    ngoName: "",
    regNumber: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.ngoName.trim()) newErrors.ngoName = "NGO Name is required";
    if (!form.regNumber.trim()) newErrors.regNumber = "Registration number is required";
    if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = "Valid email is required";
    if (!form.phone.match(/^\d{10}$/)) newErrors.phone = "10-digit phone required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (form.password.length < 6) newErrors.password = "Min 6 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    const matchedNGO = verifiedNGOs.find(
      (ngo) =>
        ngo.name.toLowerCase() === form.ngoName.trim().toLowerCase() &&
        ngo.regNumber.toLowerCase() === form.regNumber.trim().toLowerCase()
    );
    if (!matchedNGO) newErrors.regNumber = "NGO Name and Registration Number do not match our records";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.ngoName,
          lastName: form.regNumber,
          email: form.email,
          phone: form.phone,
          gender: form.gender,
          password: form.password,
          role: "ngo"
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.message || "Signup failed");
        setSuccess(false);
        return;
      }
      setSuccess(true);
      setApiError("");
    } catch (err) {
      setApiError("Network error");
      setSuccess(false);
    }
  };

  return (
    <div className="box">
      <div className="cowimg">
        <img className="main-img" src="Singup.jpg" alt="Signup Visual" />
        <img className="logo-img" src="whatsapp.jpg" alt="Company Logo" />
      </div>
      <form className="signup-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="signup-header">
          <button
            className="signup-arrow"
            type="button"
            aria-label="Go back"
            onClick={() => window.history.back()}
          >
            &#8592;
          </button>
          <h2 style={{ margin: 0 }}>Sign up as NGO</h2>
        </div>
        <div className="form-row">
          <div style={{ flex: 1 }}>
            <label>NGO Name</label>
            <input
              name="ngoName"
              value={form.ngoName}
              onChange={handleChange}
              type="text"
              placeholder="NGO Name"
            />
            {errors.ngoName && <span className="error">{errors.ngoName}</span>}
          </div>
          <div style={{ flex: 1 }}>
            <label>Registration Number</label>
            <input
              name="regNumber"
              value={form.regNumber}
              onChange={handleChange}
              type="text"
              placeholder="Registration Number"
            />
            {errors.regNumber && <span className="error">{errors.regNumber}</span>}
          </div>
        </div>
        <div>
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div>
          <label>Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="text"
            placeholder="Phone"
            maxLength={10}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <div>
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
        </div>
        <div>
          <label>Password</label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            type="password"
            placeholder="Confirm Password"
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        <div className="alredy">
          <p>Already have an account?</p>
          <button
            className="h5"
            type="button"
            style={{
              background: "none",
              color: "#1976d2",
              padding: 0,
              fontWeight: 500,
              border: "none",
              borderRadius: 0,
              cursor: "pointer"
            }}
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </button>
        </div>
        <button type="submit">Next</button>
        {apiError && <div className="error">{apiError}</div>}
        {success && <div className="success">Signup successful! You can now log in.</div>}
      </form>
    </div>
  );
};

export default Singupngo;