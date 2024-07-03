import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

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

  const banUser = (id) => {
    console.log(`${id} is banned!`);
  };
  const editUser = (id) => {
    console.log(`${id} is edited!`);
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
        <div id="reviews">
          {users.map((user) => {
            return (
              <Card key={user.id}>
                <Card.Header>
                  Featuring<h5>{user.username}</h5>{" "}
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    {user.first_name} {user.last_name}
                  </Card.Title>
                  <Card.Text>{user.email}</Card.Text>
                  <Card.Text>{user.id}</Card.Text>
                  <Card.Text>Admin?{user.is_admin}</Card.Text>
                  <Button variant="primary" onClick={() => editUser(user.id)}>
                    Make Admin
                  </Button>{" "}
                  <Button variant="secondary" onClick={() => banUser(user.id)}>
                    Ban
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
