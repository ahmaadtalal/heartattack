import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dashoreval from "../Assets/dashoreval.jpg";

export default function UserSelection() {
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
          backgroundImage: `url(${dashoreval})`,
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
            "linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.65))",
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
        {/* Heading */}
        <h1
          style={{
            marginBottom: "60px",
            fontSize: "30px",
            fontWeight: 490,
            ...animatedStyle(0.2),
          }}
        >
          CHOOSE YOUR PATH
        </h1>

        {/* Buttons Vertical */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            ...animatedStyle(0.4),
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={buttonStyles}
            onMouseEnter={(e) => hoverIn(e)}
            onMouseLeave={(e) => hoverOut(e)}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/eval")}
            style={buttonStyles}
            onMouseEnter={(e) => hoverIn(e)}
            onMouseLeave={(e) => hoverOut(e)}
          >
            Self Evaluation Form
          </button>
        </div>
      </div>
    </div>
  );
}

/* Shared Button Styles */
const buttonStyles = {
  padding: "14px 36px",
  fontSize: "20px",
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
