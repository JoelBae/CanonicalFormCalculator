import "./App.css";
import { useEffect, useState } from "react";
import LP from "./input.js";
import Output from "./output";
import History from "./history";

function App() {
  const [numVars, setNumVars] = useState(0);
  const [numSubmitted, setNumSubmitted] = useState(false);
  const [answer, setAnswer] = useState();
  const [computed, setComputed] = useState(false);

  //for lp
  const [objVector, setObjVector] = useState([0]);
  const [objConstant, setObjConstant] = useState(0);
  const [constraintVector, setConstraintVector] = useState();
  const [matrix, setMatrix] = useState([]);
  const [basis, setBasis] = useState([]);
  const [numConstraints, setNumConstraints] = useState();
  const [constSubmitted, setConstSubmitted] = useState(false);
  const [hist, setHist] = useState();

  fetch("/calculator/history", {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => setHist(data));

  useEffect(() => {
    setObjVector(new Array(Number(numVars)));
    setConstraintVector(new Array(Number(numVars)));
  }, [numVars]);
  if (numSubmitted) {
    return (
      <div className="App">
        <h2 className="top">
          Canonical Form Calculator for Linear Programs in Standard Equality
          Form
        </h2>
        <div className="wrapper">
          <header className="App-header">
            <LP
              n={numVars}
              setAnswer={setAnswer}
              setComputed={setComputed}
              objVector={objVector}
              setObjVector={setObjVector}
              objConstant={objConstant}
              setObjConstant={setObjConstant}
              constraintVector={constraintVector}
              setConstraintVector={setConstraintVector}
              matrix={matrix}
              setMatrix={setMatrix}
              basis={basis}
              setBasis={setBasis}
              numConstraints={numConstraints}
              setNumConstraints={setNumConstraints}
              numSubmitted={constSubmitted}
              setNumSubmitted={setConstSubmitted}
            />
          </header>
          <Output answer={answer} computed={computed} />
        </div>
        <div className="histWrapper">
          Server History
          <History
            history={[
              {
                objective_vector: [1, 2],
                objective_constant: 3,
                A_matrix: [
                  [4, 5],
                  [6, 7],
                ],
                constraint_constant: [8, 9],
                basis: [1, 2],
              },
            ]}
            setNumVars={setNumVars}
            setObjVector={setObjVector}
            setMatrix={setMatrix}
            setConstraintVector={setConstraintVector}
            setObjConstant={setObjConstant}
            setBasis={setBasis}
            setNumConstraints={setNumConstraints}
            numSubmitted={constSubmitted}
            setNumSubmitted={setConstSubmitted}
          />
        </div>
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
