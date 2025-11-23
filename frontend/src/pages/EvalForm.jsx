import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { predict } from "../api";
import doc from "../Assets/doc.jpg";
// import NavbarUser from "./NavbarUser/NavbarUser";

export default function EvalForm({ userName, onLogout }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isMedic = localStorage.getItem("is_medic") === "true";

  // Redirect medic users
  useEffect(() => {
  if (isMedic) navigate("/dashboard");
}, [isMedic, navigate]);


  const [form, setForm] = useState({
    age: 30,
    gender: 1,
    weight: 70,
    cholesterol: 0,
    ap_hi: 0,
    ap_lo: 0,
    smoke: false,
    active: true,
  });

  const [result, setResult] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const animatedStyle = (delay = 0) => ({
    opacity: animate ? 1 : 0,
    transform: animate ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await predict(form, token);
      setResult(res);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {/* Navbar at the top */}
      {/* <NavbarUser userName={userName} onLogout={onLogout}/> */}

      {/* Main content wrapper */}
      <div
        style={{
          position: "relative",
          width: "100%",
          fontFamily: "sans-serif",
          color: "white",
          display: "flex",
          justifyContent: "center",
          paddingTop: "10x",
          paddingBottom: "40px",
          boxSizing: "border-box",
         
        }}
      >
        {/* Background */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${doc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(50%)",
            zIndex: -2,
          }}
        />
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.8))",
            zIndex: -1,
          }}
        />

        {/* Content */}
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Heading */}
          <h2
            style={{
              marginBottom: "25px",
              fontSize: "32px",
              fontWeight: "500",
              ...animatedStyle(0.2),
            }}
          >
            Self Evaluation
          </h2>

          {/* Form */}
          <form
            onSubmit={submit}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              width: "100%",
              // background: "linear-gradient(to bottom, rgba(157,61,90,0.4), rgba(157,61,90,0.85))",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
              ...animatedStyle(0.4),
            }}
          >
            {/* AGE */}
            <div style={inputWrapper}>
              <label>Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>

            {/* GENDER */}
            <div style={inputWrapper}>
              <label>Gender</label>
              <select
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: Number(e.target.value) })
                }
                style={inputStyle}
              >
                <option value={1}>Woman</option>
                <option value={2}>Man</option>
              </select>
            </div>

            {/* WEIGHT */}
            <div style={inputWrapper}>
              <label>Weight (kg)</label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) =>
                  setForm({ ...form, weight: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>

            {/* CHOLESTEROL */}
            <div style={inputWrapper}>
              <label>Cholesterol</label>
              <input
                type="number"
                value={form.cholesterol}
                onFocus={() =>
                  form.cholesterol === 0 &&
                  setForm({ ...form, cholesterol: "" })
                }
                onChange={(e) =>
                  setForm({ ...form, cholesterol: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>

            {/* AP High */}
            <div style={inputWrapper}>
              <label>AP High (Systolic BP)</label>
              <input
                type="number"
                value={form.ap_hi}
                onFocus={() =>
                  form.ap_hi === 0 && setForm({ ...form, ap_hi: "" })
                }
                onChange={(e) =>
                  setForm({ ...form, ap_hi: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>

            {/* AP Low */}
            <div style={inputWrapper}>
              <label>AP Low (Diastolic BP)</label>
              <input
                type="number"
                value={form.ap_lo}
                onFocus={() =>
                  form.ap_lo === 0 && setForm({ ...form, ap_lo: "" })
                }
                onChange={(e) =>
                  setForm({ ...form, ap_lo: Number(e.target.value) })
                }
                style={inputStyle}
              />
            </div>

            {/* SMOKE */}
            <div style={inputWrapper}>
              <label>Do you smoke?</label>
              <select
                value={form.smoke ? "yes" : "no"}
                onChange={(e) =>
                  setForm({ ...form, smoke: e.target.value === "yes" })
                }
                style={inputStyle}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>

            {/* ACTIVE */}
            <div style={inputWrapper}>
              <label>Are you physically active?</label>
              <select
                value={form.active ? "yes" : "no"}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.value === "yes" })
                }
                style={inputStyle}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </form>

          <button
            type="submit"
            onClick={submit}
            style={{
              ...buttonStyle,
              marginTop: "20px",
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(20px)",
              // transition:
              //   "opacity 0.8s ease-out 0.5s, transform 0.8s ease-out 0.5s",
            }}
            onMouseEnter={(e) => hoverIn(e)}
            onMouseLeave={(e) => hoverOut(e)}
          >
            Check Risk
          </button>

          {/* Prediction Box */}
          {result && (
            <div
              style={{
                width: "100%",
                maxWidth: "600px",
                marginTop: "25px",
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
                textAlign: "left",
                ...animatedStyle(0.6),
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>Prediction</h3>
              <p style={{ fontSize: "18px", marginBottom: "15px" }}>
                Probability:{" "}
                <strong>{(result.result.probability * 100).toFixed(1)}%</strong>
              </p>

              <h4 style={{ marginBottom: "10px" }}>Recommendations</h4>
              <ul style={{ paddingLeft: "20px", lineHeight: "1.6" }}>
                {result.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

              {/* Health Guide button with same style as Check Risk */}
              <button
                onClick={() => navigate("/health-guide")}
                style={{
                  ...buttonStyle,
                  display: "block",
                  margin: "20px auto 0 auto",
                }}
                onMouseEnter={(e) => hoverIn(e)}
                onMouseLeave={(e) => hoverOut(e)}
              >
                Check Health Guide
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputWrapper = { display: "flex", flexDirection: "column" };
const inputStyle = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "none",
  outline: "none",
  fontSize: "16px",
  backgroundColor: "rgba(255,255,255,0.2)",
  color: "white",
  marginTop: "5px",
};
const buttonStyle = {
  padding: "12px",
  fontSize: "18px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#BE6B84",
  color: "white",
  fontWeight: "500",
  cursor: "pointer",
  transition: "transform 0.2s, background-color 0.2s",
};

/* Hover Animations */
const hoverIn = (e) => {
  e.currentTarget.style.transform = "scale(1.05)";
  e.currentTarget.style.backgroundColor = "#64384A";
};

const hoverOut = (e) => {
  e.currentTarget.style.transform = "scale(1)";
  e.currentTarget.style.backgroundColor = "#BE6B84";
};
