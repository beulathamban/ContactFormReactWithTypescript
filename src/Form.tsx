import * as React from "react";

/* The available editors for the field */
type Editor = "textbox" | "dropdown" | "multiple";


export interface IValues {
  /* Key value pairs for all the field values with key being the field name */
  [key: string]: any;
}

export interface IValidation {
  rule: (values: IValues, fieldName: string, args: any) => string;
  args?: any;
}


export interface IFieldProps {
  /* The unique field name */
  id: string;

  /* The label text for the field */
  label?: string;

  /* The editor for the field */
  editor?: Editor;

  /* The drop down items for the field */
  options?: string[];

  /* The field value */
  value?: any;

   /* The field validator function and argument */
   validation?: IValidation;
}

export interface IFields {
  [key: string]: IFieldProps;
}

export interface IFormProps {
  /* The http path that the form will be posted to */
  action: string;
   /* The props for all the fields on the form */
   fields: IFields;
  render: () => React.ReactNode;
}

export interface IErrors {
  /* The validation error messages for each field (key is the field name */
  [key: string]: string;
}

export interface IFormState {
  /* The field values */
  values: IValues;

  /* The field validation error messages */
  errors: IErrors;

  /* Whether the form has been successfully submitted */
  submitSuccess?: boolean;
}



export interface IFormContext extends IFormState {
  /* Function that allows values in the values state to be set */
  setValues: (values: IValues) => void;

  /* Function that validates a field */
  validate: (fieldName: string) => void;
}
/*
 * The context which allows state and functions to be shared with Field.
 * Note that we need to pass createContext a default value which is why undefined is unioned in the type
 */
export const FormContext = React.createContext<IFormContext|any>(undefined);


/**
 * Validates whether a field has a value
 * @param {IValues} values - All the field values in the form
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
 export const required = (values: IValues, fieldName: string): string =>
 values[fieldName] === undefined ||
 values[fieldName] === null ||
 values[fieldName] === ""
   ? "This must be selected"
   : "";

/**
* Validates whether a field is a valid email
* @param {IValues} values - All the field values in the form
* @param {string} fieldName - The field to validate
* @returns {string} - The error message
*/
export const isEmail = (values: IValues, fieldName: string): string =>
 values[fieldName] &&
 values[fieldName].search(
   /^[a-zA-Z0-9.!#$%&???*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
 )
   ? "This must be in a valid email format"
   : "";


/**
* Validates whether a field is within a certain amount of characters
* @param {IValues} values - All the field values in the form
* @param {string} fieldName - The field to validate
* @param {number} length - The maximum number of characters
* @returns {string} - The error message
*/
export const minLength = (
 values: IValues,
 fieldName: string,
 length: number
): string =>
 values[fieldName] && values[fieldName].length < length
   ? `This can not be less than ${length} characters`
   : "";


export class Form extends React.Component<IFormProps, IFormState> {
  constructor(props: IFormProps) {
    super(props);

    const errors: IErrors = {};
    const values: IValues = {};
    this.state = {
      errors,
      values
    };
  }



/**
 * Executes the validation rule for the field and updates the form errors
 * @param {string} fieldName - The field to validate
 * @returns {string} - The error message
 */
 private validate = (fieldName: string): string => {
  let newError: string = "";

  if (
    this.props.fields[fieldName] &&
    this.props.fields[fieldName].validation
  ) {
    newError = this.props.fields[fieldName].validation!.rule(
      this.state.values,
      fieldName,
      this.props.fields[fieldName].validation!.args
    );
  }
  this.state.errors[fieldName] = newError;
  this.setState({
     errors: { ...this.state.errors, [fieldName]: newError }
  });
  return newError;
};


  
  /**
 * Stores new field values in state
 * @param {IValues} values - The new field values
 */
private setValues = (values: IValues) => {
  this.setState({ values: { ...this.state.values, ...values } });
 };

  /**
   * Returns whether there are any errors in the errors object that is passed in
   * @param {IErrors} errors - The field errors
   */
  private haveErrors(errors: IErrors) {
    let haveError: boolean = false;
    Object.keys(errors).map((key: string) => {
      if (errors[key].length > 0) {
        haveError = true;
      }
    });
    return haveError;
  }


   /**
   * Executes the validation rules for all the fields on the form and sets the error state
   * @returns {boolean} - Whether the form is valid or not
   */
    private validateForm(): boolean {
      const errors: IErrors = {};
      Object.keys(this.props.fields).map((fieldName: string) => {
        errors[fieldName] = this.validate(fieldName);
      });
      this.setState({ errors });
      return !this.haveErrors(errors);
    }


     /**
   * Submits the form to the http api
   * @returns {boolean} - Whether the form submission was successful or not
   */
  private async submitForm(): Promise<boolean> {
    // TODO - submit the form
    return true;
  }



  /**
   * Handles form submission
   * @param {React.FormEvent<HTMLFormElement>} e - The form event
   */
  private handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    console.log(this.state.values);
    if (this.validateForm()) {
      const submitSuccess: boolean = await this.submitForm();
      this.setState({ submitSuccess });
    }
  };

  
  public render() {
    const { submitSuccess, errors } = this.state;
    const context: IFormContext = {
      ...this.state,
      setValues: this.setValues,
      validate:this.validate
    };
  

    return (
      <div>
      <FormContext.Provider value={context}>
      <form onSubmit={this.handleSubmit} noValidate={true}>
        <div className="container">
        {this.props.render()}
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={this.haveErrors(errors)}
            >
              Submit
            </button>
          </div>
          {submitSuccess && (
            <div className="alert alert-info" role="alert">
              The form was successfully submitted!
            </div>
          )}
          {submitSuccess === false &&
            !this.haveErrors(errors) && (
              <div className="alert alert-danger" role="alert">
                Sorry, an unexpected error has occurred
              </div>
            )}
          {submitSuccess === false &&
            this.haveErrors(errors) && (
              <div className="alert alert-danger" role="alert">
                Sorry, the form is invalid. Please review, adjust and try again
              </div>
            )}
        </div>
      </form>
      </FormContext.Provider>
      </div>
    );
  }
}