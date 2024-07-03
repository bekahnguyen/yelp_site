import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "reactjs-popup/dist/index.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

export default function AdminWineries({ somm, setWineries, wineries }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [name, setWineryName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [hours, setHours] = useState("");
  const [ava_district_id, setAVADistrictId] = useState("");
  const [img, setImg] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [reservations_required, setReservations] = useState("");

  const navigate = useNavigate();

  const handleEdit = (id) => {
    handleShow(id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`/api/wineries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        address,
        phone,
        description,
        hours,
        ava_district_id,
        img,
        website,
        reservations_required,
      }),
    });
    console.log(response);
    const result = await response.json();

    await setWineries([...wineries, result]);

    alert("successfully created!");
    navigate("/Account");
  };

  const deleteWinery = async (id) => {
    const response = await fetch(`/api/winery/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setWineries((currentWineries) => {
        return currentWineries.filter((winery) => {
          return winery.id != id;
        });
      });

      //COPY WINERIES() MAKE COPY OF ARRAY) REMOVE WINERY BY ID. SET WINERIES(COPY OF ARRAY)
    }
  };

  return (
    <div>
      {!somm.is_admin ? (
        404
      ) : (
        <>
          <div id="adminPage">
            <h3> hello, {somm.username}</h3>

            <Button variant="primary" onClick={handleShow}>
              Add New Winery
            </Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Create new winery!</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form id="container">
                  <Row className="mb-3">
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                      <Form.Control
                        type="text"
                        placeholder="name"
                        onChange={(e) => setWineryName(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                      <Form.Control
                        type="text"
                        placeholder="Address"
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </Form.Group>
                  </Row>

                  <Form.Group className="mb-3" controlId="formGridAddress1">
                    <Form.Control
                      placeholder="Description"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Control
                      placeholder="Phone"
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Control
                      placeholder="Hours"
                      onChange={(e) => setHours(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Control
                      placeholder="Ava District Id"
                      onChange={(e) => setAVADistrictId(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Control
                      placeholder="Image"
                      onChange={(e) => setImg(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Control
                      placeholder="Website"
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Control
                      placeholder="Reservations T/F"
                      onChange={(e) => setReservations(e.target.value)}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            <br />
            <h3 id="adminPage"> Current Wineries Displayed:</h3>
            {wineries.map((winery) => {
              return (
                <>
                  <div id="container">
                    <Card style={{ width: "18rem" }} key={winery.id}>
                      <Card.Header>{winery.name}</Card.Header>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          Address: {winery.address}
                        </ListGroup.Item>
                        <ListGroup.Item>Hours: {winery.hours}</ListGroup.Item>
                        <ListGroup.Item>Img: {winery.img}</ListGroup.Item>
                        <ListGroup.Item>
                          Website: {winery.website}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          AVA District Id: {winery.ava_district_id}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          Description: {winery.description}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          {winery.reservations_required
                            ? winery.reservations_required
                            : null}
                        </ListGroup.Item>
                        <button onClick={() => handleEdit(winery.id)}>
                          Edit Winery
                        </button>
                        <button onClick={() => deleteWinery(winery.id)}>
                          Delete
                        </button>
                      </ListGroup>
                    </Card>
                  </div>
                </>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
