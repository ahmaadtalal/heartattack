import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heartLogo1 from "../Assets/heartLogo1.png";
import bg from "../Assets/bg.jpg";

export default function Landing() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  // Trigger animation after mount
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Common style for animated elements
  const animatedStyle = (delay = 0) => ({
    opacity: animate ? 1 : 0,
    transform: animate ? "translateY(0)" : "translateY(40px)",
    transition: `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`,
  });

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(55%)",
          zIndex: -2,
        }}
      />

      {/* Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85))",
          zIndex: -1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          textAlign: "center",
          color: "white",
          padding: "0 20px",
        }}
      >
        {/* Logo */}
        <img
          src={heartLogo1}
          alt="App Logo"
          style={{
            width: "150px",
            height: "150px",
            objectFit: "contain",
            marginBottom: "20px",
            filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.6))",
            ...animatedStyle(0), // delay 0s
          }}
        />

        {/* Heading */}
        <h1
          style={{
            marginBottom: "20px",
            fontSize: "42px",
            fontWeight: "490",
            ...animatedStyle(0.4), // delay 0.2s
          }}
        >
          CARDIOCARE
        </h1>

        {/* Paragraph */}
        <p
          style={{
            marginBottom: "30px",
            fontSize: "20px",
            color: "#F4C9D4",
            ...animatedStyle(0.4), // delay 0.4s
          }}
        >
          Select Your Role
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", ...animatedStyle(0.6) }}>
          <button
            onClick={() => navigate("/user/login")}
            style={buttonStyles}
            onMouseEnter={(e) => hoverIn(e)}
            onMouseLeave={(e) => hoverOut(e)}
          >
            User
          </button>

          <button
            onClick={() => navigate("/medic/login")}
            style={buttonStyles}
            onMouseEnter={(e) => hoverIn(e)}
            onMouseLeave={(e) => hoverOut(e)}
          >
            Medic
          </button>
        </div>
      </div>
    </div>
  );
}

/* Shared Button Styles */
const buttonStyles = {
  padding: "12px 28px",
  fontSize: "18px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#BE6B84",
  color: "white",
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
