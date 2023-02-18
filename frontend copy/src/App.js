import "./App.css";
import { useState } from "react";

function App() {
  const [numVars, setNumVars] = useState();
  const [numSubmitted, setNumSubmitted] = useState(false);
  if (numSubmitted) {
    return (
      <div className="App">
        <h2 className="top">
          Canonical Form Calculator for Linear Programs in Standard Equality
          Form
        </h2>
        <header className="App-header">
          <LP n={numVars} />
        </header>
      </div>
    );
  }
  return (
    <div className="App">
      <h2 className="top">
        Canonical Form Calculator for Linear Programs in Standard Equality Form
      </h2>
      <header className="App-header">
        <label>Please Select the Number of Variables (1-15):</label>
        <input
          type="number"
          id="size_of_vars"
          name="size_of_vars"
          min="1"
          max="15"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.target.value > 0 && e.target.value <= 15) {
                setNumVars(e.target.value);
                setNumSubmitted(true);
                e.preventDefault();
              }
            }
          }}
        ></input>
      </header>
    </div>
  );
}

function LP(props) {
  return (
    <div>
      <ObjVector n={props.n} />
      <NumOfConstraints n={props.n} />
    </div>
  );
}

function ObjVector(props) {
  return (
    <div className="horiVector">
      <label>Input the Objective Vector</label>
      <div>
        {[...Array(Number(props.n)).keys()].map((i) => (
          <input
            className="cell"
            key={i}
            id={i}
            type="number"
            name="vars"
            min="-100"
            max="100"
          />
        ))}
      </div>
    </div>
  );
}

function NumOfConstraints(props) {
  const [numConstraints, setNumConstraints] = useState();
  const [numSubmitted, setNumSubmitted] = useState(false);
  if (numSubmitted) {
    return (
      <div>
        <Matrix m={numConstraints} n={props.n} />
      </div>
    );
  }
  return (
    <div>
      <label>Please Select the Number of constraints (1-15):</label>
      <input
        type="number"
        id="size_of_vars"
        name="size_of_vars"
        min="1"
        max="15"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (e.target.value > 0 && e.target.value <= 15) {
              setNumConstraints(e.target.value);
              setNumSubmitted(true);
              e.preventDefault();
            }
          }
        }}
      ></input>
    </div>
  );
}

function Matrix(props) {
  return (
    <div className="Matrix">
      <label>Input the Constraint Matrix</label>
      <table>
        {[...Array(Number(props.m)).keys()].map((i) => (
          <tr>
            {[...Array(Number(props.n)).keys()].map((i) => (
              <td>
                <input
                  className="cell"
                  key={i}
                  id={i}
                  type="number"
                  name="vars"
                  min="-100"
                  max="100"
                />
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
