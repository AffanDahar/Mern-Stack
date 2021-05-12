import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/AuthContext";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./Place.css";

const UpdatePlace = () => {
  
  const placeId = useParams().pId;
  const {user } = useContext(AuthContext)
  
  const history = useHistory()

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );


  useEffect(() => {

    const fetchPlace = async() => {
      const responseData = await sendRequest(`http://localhost:5000/api/places/${placeId}`)
      console.log(responseData.place)
      setLoadedPlaces(responseData.place)
      setFormData(
        {
          title: {
            value: responseData.place.title,
            isValid: true,
          },
          description: {
            value: responseData.place.description,
            isValid: true,
          },
        },
        true
      );
    }

    fetchPlace()
    
  }, [sendRequest, placeId , setFormData])


const submitHandler = async(e) => {
  e.preventDefault()

  await sendRequest(`http://localhost:5000/api/places/${placeId}`,"PATCH",
  JSON.stringify({
    title: formState.inputs.title.value,
    description: formState.inputs.description.value,
 
  }),
  {
    "Content-Type": "application/json",
  })
  history.push(`/${user._id}/places`)
}

  if (isLoading) {
    return (
      <div className="center">
       <LoadingSpinner/>
      </div>
    );
  }
  
// if(!isLoading && !error){
//   return (
//     <div className='center'>
//     <Card>No Place is identified</Card>
//     </div>
//   )
// }


  return (
    <>
     {error && <ErrorModal error={error} onClear={clearError} />}
     {!isLoading && loadedPlaces && <form className="place-form">
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        value={loadedPlaces.title}
        valid={true}
      />
      <Input
        id="title"
        element="textarea"
        label="Title"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)"
        onInput={inputHandler}
        value={loadedPlaces.description}
        valid={true}
      />
      <Button type="submit" disabled={false} onClick={submitHandler}>
        Update Place
      </Button>
    </form>
}
</>
  );
};

export default UpdatePlace;
