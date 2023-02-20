import "./App.css";
import { useState } from "react";
import LP from "./input.js";
import Output from "./output";

function App() {
  const [numVars, setNumVars] = useState();
  const [numSubmitted, setNumSubmitted] = useState(false);
  const [answer, setAnswer] = useState();
  const [computed, setComputed] = useState(false);
  if (numSubmitted) {
    return (
      <div className="App">
        <h2 className="top">
          Canonical Form Calculator for Linear Programs in Standard Equality
          Form
        </h2>
        <header className="App-header">
          <LP n={numVars} setAnswer={setAnswer} setComputed={setComputed} />
        </header>
        <Output answer={answer} computed={computed} />
      </div>
    );
  }
  return (
    <div className="App">
      <h2 className="top">
        Canonical Form Calculator for Linear Programs in Standard Equality Form
      </h2>
      <header className="App-header">
        <div className="vars">
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
        </div>
      </header>
    </div>
  );
}

export default App;
