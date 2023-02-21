import "katex/dist/katex.min.css";
import { BlockMath } from "react-katex";

export default function Output(props) {
  if (props.computed) {
    return (
      <div className="output">
        <p>The Canonical Form is</p>
        <Objective answer={props.answer} />
        <Constraints answer={props.answer} />
      </div>
    );
  } else {
    return;
  }
}

function Objective(props) {
  let objectiveFunction =
    "\\begin{pmatrix}\n" +
    props.answer.objective_vector
      .map((n, i) => {
        if (i === props.answer.objective_vector.length - 1) {
          return String(n);
        }
        return String(n) + " & ";
      })
      .join("") +
    "\\end{pmatrix}x";

  if (props.answer.objective_constant >= 0) {
    objectiveFunction += ` \\:+ ${props.answer.objective_constant}`;
  } else {
    objectiveFunction += ` \\:- ${-props.answer.objective_constant}`;
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
  let matrix = renderMatrix(props.answer.A_matrix);
  let constant = renderVector(props.answer.constraint_constant);
  return (
    <div className="constraintOutput">
      <BlockMath math={matrix + "x"} />
      <BlockMath math={"= " + constant} />
    </div>
  );
}
