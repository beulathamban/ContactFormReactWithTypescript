import * as React from "react";
import {IFieldProps, IErrors,IFormContext,FormContext } from "./Form";



/**
 * Gets the validation error for the field
 * @param {IErrors} errors - All the errors from the form
 * @returns {string[]} - The validation error
 */
 const getError = (errors: IErrors): string => (errors ? errors[0] : "");

/**
 * Gets the inline styles for editor
 * @param {IErrors} errors - All the errors from the form
 * @returns {any} - The style object
 */
 const getEditorStyle = (errors: IErrors): any =>
 getError(errors) ? { borderColor: "purple" } : {};


export const Field: React.SFC<IFieldProps> = ({
  id,
  label,
  editor,
  options,
  value
}) => {
  return (
    <FormContext.Consumer>
      {(context: IFormContext) => (
    <div className="form-group">
      {label && <label htmlFor={id}>{label}</label>}

      {editor!.toLowerCase() === "textbox" && (
        
        <input
          id={id}
          type="email"
          value={value}
          style={getEditorStyle(context.errors)}
          onChange={
            (e: React.FormEvent<HTMLInputElement>) =>
            context.setValues({ [id]: e.currentTarget.value })
          }
          onBlur={
            ()=>context.validate(id)}
          
          className="form-control my-3"
        />
      )}

 
      

      {editor!.toLowerCase() === "dropdown" && (
        <select
          id={id}
          name={id}
          value={value}
          style={getEditorStyle(context.errors)}
          onChange={
            (e: React.FormEvent<HTMLSelectElement>) =>
            context.setValues({ [id]: e.currentTarget.value })
          }
          onBlur={() => context.validate(id)}
          className="form-control my-3"
        >
          {options &&
            options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      )}

      {editor!.toLowerCase() === "multiple" && (
        <select multiple
          id={id}
          name={id}
          value={value}
          style={getEditorStyle(context.errors)}
          onChange={
            (e: React.FormEvent<HTMLSelectElement>) =>
            context.setValues({ [id]: e.currentTarget.value })
          }
          onBlur={() => context.validate(id)}
          className="form-control my-3"
        >
          {options &&
            options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      )}

      

        {getError(context.errors) && (
          <div style={{ color: "red", fontSize: "80%" }}>
            <p>{getError(context.errors)}</p>
          </div>
        )}
    </div>
    
  )}
  </FormContext.Consumer>
  )
  };

  Field.defaultProps = {
    editor: "textbox"
  };