import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

import PlaceList from '../components/PlaceList';



const UserPlaces = () => {
  const userId = useParams().userId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState()
  

  useEffect(() => {

    const fetchUserPlaces = async () => {
      try{
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`)
       setLoadedPlaces(responseData.places)
       console.log(responseData)
      } catch(err){

        console.log(err)
      }
    }

    fetchUserPlaces()
   
  }, [sendRequest, userId])

  const deleteHandler = (deletePlaceId) => {
     setLoadedPlaces(prePlace => prePlace.filter(place => place.id !== deletePlaceId))
  }
  return (
  <>
 
 {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDelete={deleteHandler}/>}
  </>
      )
  
  
};

export default UserPlaces;
