import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";
// import NavbarUser from "./NavbarUser/NavbarUser";
import dashbg from "../Assets/dashbg.jpg";

export default function Dashboard({ userName, onLogout }) {
  const token = localStorage.getItem("token");
  const [lineData, setLineData] = useState([]);
  const [genderRisk, setGenderRisk] = useState([]);
  const [barData, setBarData] = useState({ Female: [], Male: [] });
  const [riskSummary, setRiskSummary] = useState({});
  const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#FFBB28", "#AA00FF", "#FF0066"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/dashboard-analysis", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLineData(res.data.line_data);
        setGenderRisk(res.data.gender_risk);
        setBarData(res.data.bar_data);
        setRiskSummary(res.data.risk_summary);
      } catch (err) {
        alert(err.message);
      }
    };
    fetchData();
  }, [token]);

  const pieRiskData = Object.entries(riskSummary).map(([name, value]) => ({ name, value }));

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        color: "#fff",
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${dashbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        boxSizing: "border-box",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Navbar at the top */}
      {/* <NavbarUser userName={userName} onLogout={onLogout} /> */}

      {/* Overlay inside content container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          zIndex: -1,
        }}
      />

      <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "36px", fontWeight: "500" }}>
        Heart Attack Risk Dashboard
      </h2>

      {/* Line Chart */}
      <ChartCard title="Risk by Age (Line Chart)">
        <LineChart
          width={900}
          height={300}
          data={lineData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="age" label={{ value: "Age (years)", position: "insideBottomRight", offset: -5 }} />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="risk" stroke="#2763b7ff" strokeWidth={3} />
        </LineChart>
      </ChartCard>

      {/* Pie Charts */}
      <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "30px" }}>
        <ChartCard title="Risk by Gender (Pie Chart)" width={400}>
          <PieChart width={400} height={300}>
            <Pie data={genderRisk} dataKey="risk" nameKey="gender_label" cx="50%" cy="50%" outerRadius={100} label>
              {genderRisk.map((entry, index) => (
                <Cell key={`cell-gender-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard title="Dataset Distribution by Risk (Pie Chart)" width={400}>
          <PieChart width={400} height={300}>
            <Pie data={pieRiskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieRiskData.map((entry, index) => (
                <Cell key={`cell-risk-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>

      {/* Bar Charts */}
      {["Female", "Male"].map((gender) => (
        <ChartCard key={gender} title={`${gender} - Average Feature Values (Bar Chart)`}>
          <BarChart
            width={900}
            height={300}
            data={barData[gender]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" interval={0} angle={-30} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#873d98ff" />
          </BarChart>
        </ChartCard>
      ))}
    </div>
  );
}

// Reusable Chart Card Component
const ChartCard = ({ title, children, width = 950 }) => (
  <div
    style={{
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      padding: "25px",
      marginBottom: "50px",
      width: width,
      maxWidth: "100%",
      boxShadow: "0 12px 25px rgba(0,0,0,0.5)",
      textAlign: "center",
    }}
  >
    <h3 style={{ marginBottom: "20px", fontSize: "22px", fontWeight: "500" }}>
      {title}
    </h3>
    {children}
  </div>
);
