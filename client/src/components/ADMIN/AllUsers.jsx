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

  const back = () => {
    navigate("/AdminHome");
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
          <p> All Users:</p>
          <ul id="userList">
            {users.map((user) => {
              return (
                <>
                  <div id="userBox">
                    <li>{user.username}</li>
                    <li>{user.first_name}</li>
                    <li>{user.last_name}</li>
                    <li> {user.id}</li>
                    <li>{user.email}</li>
                  </div>
                </>
              );
            })}
          </ul>
        </div>
      )}
      <button onClick={back}>Back.</button>
    </>
  );
}
