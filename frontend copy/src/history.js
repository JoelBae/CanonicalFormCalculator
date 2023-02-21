import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export default function History(props) {
  if (props.computed) {
    return (
      <div className="history">
        {props.history.map((i, index) => (
          <LatexLP
            LP={i}
            key={index}
            setNumVars={props.setNumVars}
            setObjVector={props.setObjVector}
            setMatrix={props.setMatrix}
            setConstraintVector={props.setConstraintVector}
            setObjConstant={props.setObjConstant}
            setBasis={props.setBasis}
            setNumConstraints={props.setNumConstraints}
            numSubmitted={props.numSubmitted}
            setNumSubmitted={props.setNumSubmitted}
          />
        ))}
      </div>
    );
  }
  return;
}

function LatexLP(props) {
  function loadLPFromHistory() {
    props.setNumVars(props.LP.objective_vector.length);
    props.setObjVector(props.LP.objective_vector);
    props.setMatrix(props.LP.A_matrix);
    props.setConstraintVector(props.LP.constraint_constant);
    props.setObjConstant(props.LP.objective_constant);
    props.setBasis(props.LP.basis);
    props.setNumConstraints(props.LP.A_matrix.length);
    props.setNumSubmitted(true);
  }
  return (
    <div className="histLP">
      <Objective LP={props.LP} />
      <Constraints LP={props.LP} />
      <Basis LP={props.LP} />
    </div>
  );
}

function Objective(props) {
  let objectiveFunction =
    "\\begin{pmatrix}\n" +
    props.LP.objective_vector
      .map((n, i) => {
        if (i === props.LP.objective_vector.length - 1) {
          return String(n);
        }
        return String(n) + " & ";
      })
      .join("") +
    "\\end{pmatrix}x";

  if (props.LP.objective_constant >= 0) {
    objectiveFunction += ` \\:+ ${props.LP.objective_constant}`;
  } else {
    objectiveFunction += ` \\:- ${-props.LP.objective_constant}`;
  }
  return <BlockMath math={objectiveFunction} />;
}

function renderMatrix(matrix) {
  return (
    "\\begin{pmatrix}\n" +
    matrix
      .map((row, index) => {
        if (index === matrix.length) return row.join(" & ") + "\n";
        else return row.join(" & ") + "\\\\\n";
      })
      .join("") +
    "\\end{pmatrix}"
  );
}

function renderVector(vector) {
  return (
    "\\begin{pmatrix}\n" +
    vector
      .map((n, i) => {
        if (i === vector.length - 1) {
          return String(n);
        }
        return String(n) + " \\\\ ";
      })
      .join("") +
    "\\end{pmatrix}"
  );
}

function Constraints(props) {
  let matrix = renderMatrix(props.LP.A_matrix);
  let constant = renderVector(props.LP.constraint_constant);
  return (
    <div className="constraintOutput">
      <BlockMath math={matrix + "x"} />
      <BlockMath math={"= " + constant} />
    </div>
  );
}

function Basis(props) {
  let basis =
    "Basis = (" +
    props.LP.basis
      .map((n, i) => {
        if (i === props.LP.basis.length - 1) {
          return String(n);
        }
        return String(n) + ", ";
      })
      .join("") +
    ")";

  return <BlockMath math={basis} />;
}
