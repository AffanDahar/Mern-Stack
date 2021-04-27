import React, { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { AuthContext } from "../../shared/context/AuthContext";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./Auth.css";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false)
  const [error, setError]  = useState(null)
  const { Login } = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchHandler = () => {
    if (isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.name.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogin((prev) => !prev);
  };

  const inputSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      setLoading(true)
      try {
        const response = await fetch("http://localhost:5000/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        const data = await response.json();
        if(!response.ok){
          throw  new Error(data.message)
        }
        Login();
        setLoading(false)
      } catch (err) {
        console.log(err)
        setError(err.message)
        setLoading(false)
      }


    } else {
      try {
        const response = await fetch("http://localhost:5000/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        const data = await response.json();
        if(!response.ok){
          throw  new Error(data.message)
        }
        console.log(data);
        Login();
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
       }
    }
  
  };

  const  errorHanddlerr  = () => {
    setError(null)
  }
  return (
    <>
    <ErrorModal error={error} onClear={errorHanddlerr}/>
    
   
    <Card className="authentication">
    {loading && <LoadingSpinner/>} 
      <h1>Login Required</h1>

      <hr />
      <form type="submit" onSubmit={inputSubmit}>
        {!isLogin && (
          <Input
            id="name"
            onInput={inputHandler}
            element="input"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name"
          />
        )}
        <Input
          id="email"
          onInput={inputHandler}
          element="input"
          type="text"
          label="Email"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email."
        />
        <Input
          id="password"
          onInput={inputHandler}
          element="input"
          type="text"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(8)]}
          errorText="Please enter a valid description (at least 8 characters)"
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLogin  ? 'Login' : 'Sign up'}
        </Button>
      </form>
      <Button inverse onClick={switchHandler}>
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </Button>
    </Card>
</>
  );

};

export default Auth;
