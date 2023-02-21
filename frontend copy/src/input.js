import { useEffect, useState } from "react";

export default function LP(props) {
  return (
    <div>
      <ObjVector
        n={props.n}
        objVector={props.objVector}
        setObjVector={props.setObjVector}
        setObjConstant={props.setObjConstant}
        objConstant={props.objConstant}
      />
      <NumOfConstraints
        n={props.n}
        constraintVector={props.constraintVector}
        setConstraintVector={props.setConstraintVector}
        matrix={props.matrix}
        setMatrix={props.setMatrix}
        numConstraints={props.numConstraints}
        setNumConstraints={props.setNumConstraints}
        numSubmitted={props.numSubmitted}
        setNumSubmitted={props.setNumSubmitted}
      />
      <Basis n={props.n} basis={props.basis} setBasis={props.setBasis} />
      <SubmitButton
        objVector={props.objVector}
        objConstant={props.objConstant}
        constraintVector={props.constraintVector}
        matrix={props.matrix}
        basis={props.basis}
        setAnswer={props.setAnswer}
        setComputed={props.setComputed}
      />
    </div>
  );
}

function Checkbox(props) {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={() => {
        setIsChecked(!isChecked);
        let vec = [];
        if (!isChecked) {
          vec = props.basis;
          vec.push(Number(props.i) + 1);
        } else {
          vec = [];
          for (const num in props.basis) {
            if (!(num === Number(props.i) + 1)) {
              vec.push(num);
            }
          }
        }
        props.setBasis(vec.sort());
      }}
    />
  );
}

function Basis(props) {
  return (
    <div>
      <label>Input the Basis</label>
      <div className="objective">
        <table>
          <tbody>
            <tr>
              {[...Array(Number(props.n)).keys()].map((i) => (
                <td key={i}>
                  <label>{i + 1}</label>
                  <Checkbox
                    basis={props.basis}
                    setBasis={props.setBasis}
                    i={i}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubmitButton(props) {
  const [error, setError] = useState(false);
  async function getAnswer(props) {
    try {
      setError(false);
      const json = {
        objective_vector: props.objVector,
        objective_constant: props.objConstant,
        A_matrix: props.matrix,
        constraint_constant: props.constraintVector,
        basis: props.basis,
      };
      await fetch("/calculator/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      })
        .then((response) => response.json())
        .then((data) => props.setAnswer(data));

      props.setComputed(true);
    } catch (error) {
      setError(true);
    }
  }
  if (error) {
    return <div>There was an error! Please check the input is valid.</div>;
  }
  return (
    <button
      onClick={() => {
        getAnswer(props);
      }}
    >
      Go!
    </button>
  );
}

function ObjVector(props) {
  return (
    <div>
      <label>Input the Objective Function</label>
      <div className="objective">
        <table>
          <tbody>
            <tr>
              {[...Array(Number(props.n)).keys()].map((i) => (
                <td key={i}>
                  <input
                    className="cell"
                    id={i}
                    type="number"
                    name="vars"
                    min="-100"
                    max="100"
                    onChange={(e) => {
                      let vec = props.objVector;
                      vec[i] = Number(e.target.value);
                      props.setObjVector(vec);
                    }}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        X +
        <table>
          <tbody>
            <tr>
              <td>
                <input
                  className="cell"
                  type="number"
                  name="vars"
                  min="-100"
                  max="100"
                  onChange={(e) => {
                    props.setObjConstant(Number(e.target.value));
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConstVector(props) {
  return (
    <div className="vertivector">
      <table>
        <tbody>
          {[...Array(Number(props.n)).keys()].map((i, index) => (
            <tr key={i}>
              <td>
                <input
                  className="cell"
                  id={i}
                  type="number"
                  name="vars"
                  min="-100"
                  max="100"
                  onChange={(e) => {
                    let vec = props.constraintVector;
                    vec[i] = Number(e.target.value);
                    props.setConstraintVector(vec);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NumOfConstraints(props) {
  if (props.numSubmitted) {
    return (
      <div>
        <label>Input the Constraints</label>
        <div className="constraints">
          <Matrix
            m={props.numConstraints}
            n={props.n}
            matrix={props.matrix}
            setMatrix={props.setMatrix}
          />
          <div className="equals">X =</div>
          <ConstVector
            n={props.n}
            constraintVector={props.constraintVector}
            setConstraintVector={props.setConstraintVector}
          />
        </div>
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
            if (Number(e.target.value) > 0 && Number(e.target.value) <= 15) {
              props.setNumConstraints(Number(e.target.value));
              props.setNumSubmitted(true);
              e.preventDefault();
            }
          }
        }}
      ></input>
    </div>
  );
}

function Matrix(props) {
  const [temp, setTemp] = useState(
    new Array(Number(props.m)).fill(new Array(Number(props.n)).fill(0))
  );

  useEffect(() => {
    props.setMatrix(temp);
  }, [temp, props]);
  return (
    <div className="Matrix">
      <table>
        {[...Array(Number(props.m)).keys()].map((i) => (
          <tbody key={i}>
            <tr>
              {[...Array(Number(props.n)).keys()].map((j) => (
                <td key={j}>
                  <input
                    className="cell"
                    id={j}
                    type="number"
                    name="vars"
                    min="-100"
                    max="100"
                    onChange={(e) => {
                      setTemp(
                        temp.map((x, index) => {
                          if (index === i) {
                            return x.map((y, jndex) => {
                              if (jndex === j) {
                                return Number(e.target.value);
                              }
                              return y;
                            });
                          }
                          return x;
                        })
                      );
                    }}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        ))}
        <tbody />
      </table>
    </div>
  );
}
