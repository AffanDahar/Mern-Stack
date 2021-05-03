import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import UsersList from "../components/UsersList";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  const [loadedUsers, setLoadedUsers] = useState();
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await sendRequest("http://localhost:5000/api/user");
        const data = await res.json();

        setLoadedUsers(data.users);
      } catch (err) {}
    };

    fetchUsers();
  }, [sendRequest]);

  
  return (
    <>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {loading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
};

export default Users;
