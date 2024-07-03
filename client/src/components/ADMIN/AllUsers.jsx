import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AllUsers({ somm }) {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const getUsers = async () => {
    try {
      const response = await fetch("/api/somms");
      const result = await response.json();
      console.log(result);
      setUsers(result);
    } catch (error) {
      console.log("Theres been an error");
    }
  };

  // const data={is_admin: true}
  // const handleAuth = async (id) => {
  //  const response= await fetch(/api/somms/$(id), {
  //   method:  "PATCH",
  //   headers:{
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(data)
  //  })
  // const result= await response.json();
  //  console.log(result)
  // };

  const banUser = () => {
    console.log("user is banned!");
  };

  const back = () => {
    navigate("/");
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {!somm.is_admin ? (
        <h6>403</h6>
      ) : (
        <div>
          <h1> All Users:</h1>
          {users.map((user) => {
            return (
              <ul id="userList">
                <>
                  <div id="userBox">
                    <li>{user.username}</li>
                    <li>{user.first_name}</li>
                    <li>{user.last_name}</li>
                    <li> {user.id}</li>
                    <li>{user.email}</li>
                    <button onClick={() => handleAuth(user.id)}>
                      Make Admin
                    </button>
                    <button onClick={() => banUser(user.id)}>Ban User</button>
                  </div>
                </>
              </ul>
            );
          })}
        </div>
      )}
      <button onClick={back}>Back.</button>
    </>
  );
}
