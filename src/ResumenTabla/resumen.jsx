import React from "react";

const TablaResumen = () => {
  const data = [
    { area: "GENERAL", tolerable: 2, moderado: 0, notable: 0, elevado: 1, grave: 0 },
    { area: "ADMINISTRATIVO", tolerable: 1, moderado: 0, notable: 0, elevado: 0, grave: 1 },
    { area: "SISTEMAS", tolerable: 1, moderado: 0, notable: 0, elevado: 1, grave: 0 },
  ];

  const total = data.reduce(
    (acc, row) => {
      return {
        tolerable: acc.tolerable + row.tolerable,
        moderado: acc.moderado + row.moderado,
        notable: acc.notable + row.notable,
        elevado: acc.elevado + row.elevado,
        grave: acc.grave + row.grave,
      };
    },
    { tolerable: 0, moderado: 0, notable: 0, elevado: 0, grave: 0 }
  ); /*hago como qur trabajo xd */

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th rowSpan="2" style={{ border: "1px solid black", backgroundColor: "#d3d3d3" }}>Área</th>
            <th colSpan="5" style={{ border: "1px solid black", backgroundColor: "#d3d3d3" }}>Magnitud de riesgo</th>
          </tr>
          <tr>
            <th style={{ border: "1px solid black", backgroundColor: "#00bfff" }}>Tolerable</th>
            <th style={{ border: "1px solid black", backgroundColor: "#90ee90" }}>Moderado</th>
            <th style={{ border: "1px solid black", backgroundColor: "#ffff99" }}>Notable</th>
            <th style={{ border: "1px solid black", backgroundColor: "#ffa07a" }}>Elevado</th>
            <th style={{ border: "1px solid black", backgroundColor: "#ff4500", color: "white" }}>Grave</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black" }}>{row.area}</td>
              <td style={{ border: "1px solid black" }}>{row.tolerable}</td>
              <td style={{ border: "1px solid black" }}>{row.moderado}</td>
              <td style={{ border: "1px solid black" }}>{row.notable}</td>
              <td style={{ border: "1px solid black" }}>{row.elevado}</td>
              <td style={{ border: "1px solid black" }}>{row.grave}</td>
            </tr>
          ))}
          <tr>
            <th style={{ border: "1px solid black", backgroundColor: "#d3d3d3" }}>TOTAL</th>
            <th style={{ border: "1px solid black" }}>{total.tolerable}</th>
            <th style={{ border: "1px solid black" }}>{total.moderado}</th>
            <th style={{ border: "1px solid black" }}>{total.notable}</th>
            <th style={{ border: "1px solid black" }}>{total.elevado}</th>
            <th style={{ border: "1px solid black" }}>{total.grave}</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TablaResumen;
