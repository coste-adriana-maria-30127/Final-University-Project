import React, { useReducer, useEffect } from "react";
import Select from "react-select";

import { validate } from "../../util/validators.js";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state, ///copie
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const InputSelect = (props) => {
  //   const [enteredValue, setEnteredValue] = useState("");
  //   const [isValid, setisValid] = useState(false);

  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isTouched: false,
    isValid: props.initialValid || false,
  });

  const { id, onInput } = props; /// props.id
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid); // apelam onInput ca sa schimbam starea
  }, [id, value, isValid, onInput, inputState.value]); // cand una din astea se schimba

  const changeHandler = (event) => {
    event &&
      dispatch({
        type: "CHANGE",
        val: event.value,
        validators: props.validators,
      });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <Select
        id={props.id}
        type={props.type}
        options={props.options}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        isSearchable={false}
        isClearable
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default InputSelect;
