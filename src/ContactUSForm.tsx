import * as React from "react";
import { Form, IFields, required,  isEmail, minLength} from "./Form";
import { Field } from "./Field";

export const ContactUSForm: React.SFC= () => {
  
  const fields: IFields = {
  
    email: {
      id: "email",
      label: "Email",
      validation: { rule: isEmail}
    },
    password: {
      id: "password",
      label: "Password",
      validation: { rule: minLength, args:8},
     
    },
    colour: {
      id: "colour",
      label: "Colour",
      editor: "dropdown",
      options: ["", "Blue", "Green", "Red", "Black","Brown"]
      
    },
    animals:{
      id: "animals",
      label:"Animals",
      editor:"multiple",
      options:["Bear", "Tiger", "Snake", "Donkey"],
      validation: { rule: required }
    }
  };
  
  return (
    <Form
      action=""
      fields={fields}
      render={() => (
        <React.Fragment>
          <div className="alert bg-primary text-light display-4" role="alert">
           Contact form
          </div>

          <Field {...fields.email}/>
          <Field {...fields.password} />
          <Field {...fields.colour} />
          <Field {...fields.animals}/>
          
        </React.Fragment>
      )}
    />
  );
};

