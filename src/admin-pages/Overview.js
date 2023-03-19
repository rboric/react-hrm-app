import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Overview() {
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [users, setUsers] = useState([]);
  const { currentFirm, admin } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userSalaryRef = useRef();
  const userHoursRef = useRef();
  let counter = 0;

  const handleShow = () => setShow(!show);

  const updateUser = async (id, salary, hours) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, "user", id), {
        salary: salary,
        hours: hours,
      });
      navigate(0);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function getUsers() {
      const docRef = collection(db, "/user");
      const currentFirmQuery = query(
        docRef,
        where("firm_id", "==", currentFirm)
      );
      const querySnapshot = await getDocs(currentFirmQuery);
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        setUsers((prevState) => [
          ...prevState,
          {
            id: doc.id,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            hours: data.hours,
            salary: data.salary,
          },
        ]);
      });
    }

    getUsers();
    // eslint-disable-next-line
  }, [currentFirm]);

  return (
    <Table striped bordered hover size="lg">
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>E-mail</th>
          <th>Salary/h</th>
          <th>Hours/day</th>
          <th>Total</th>
          {admin && <th>Edit</th>}
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => {
          return (
            <tr key={i}>
              <td>{(counter = counter + 1)}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.salary}$/h</td>
              <td>{user.hours}</td>
              <td>{user.salary * user.hours}$</td>
              {admin && (
                <td>
                  <Button
                    disabled={loading}
                    onClick={() => {
                      handleShow();
                      setModalData(user);
                    }}
                  >
                    Change
                  </Button>
                </td>
              )}
            </tr>
          );
        })}
        <Modal show={show} onHide={handleShow} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>{modalData.firstname}</Modal.Title>
          </Modal.Header>
          <Form className="p-2">
            <Form.Group
              className="mb-3 w-100 col-md-12"
              controlId="exampleForm.ControlInput1"
            >
              <Form.Label>First name</Form.Label>
              <Form.Control disabled defaultValue={modalData.firstname} />
              <Form.Label>Last name</Form.Label>
              <Form.Control disabled defaultValue={modalData.lastname} />
              <Form.Label>Salary</Form.Label>
              <Form.Control
                defaultValue={modalData.salary}
                autoFocus
                ref={userSalaryRef}
              />
              <Form.Label>Hours</Form.Label>
              <Form.Control defaultValue={modalData.hours} ref={userHoursRef} />
            </Form.Group>
          </Form>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleShow}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleShow();
                updateUser(
                  modalData.id,
                  userSalaryRef.current.value,
                  userHoursRef.current.value
                );
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </tbody>
    </Table>
  );
}
