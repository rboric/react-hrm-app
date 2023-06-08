import React, { useState, useRef, useEffect } from "react";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Button, Form, Col, Row } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import TimeoffRequest from "../components/TimeoffRequest";
import PayrollCard from "../components/PayrollCard";

export default function Profile() {
  const { currentUser, currentFirm } = useAuth();

  const [userData, setUserData] = useState([]);
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const addressRef = useRef();
  const nationalityRef = useRef();
  const educationRef = useRef();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const docRef = doc(db, "user", currentUser.uid);
      const userDoc = await getDoc(docRef);
      setUserData(userDoc.data());
    };

    getUsers();
    // eslint-disable-next-line
  }, [currentFirm]);

  const changeCredentials = async (user_id) => {
    try {
      setLoading(true);
      await setDoc(
        doc(db, "user", user_id),
        {
          firstname: firstNameRef.current.value,
          lastname: lastNameRef.current.value,
          address: addressRef.current.value,
          nationality: nationalityRef.current.value,
          education: educationRef.current.value,
          gender: userData.gender,
        },
        { merge: true }
      );
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Row className="profile-container">
      <Col md={8}>
        <div className="profile-form-container">
          <h2 className="profile-heading">Profile</h2>
          <Form className="profile-form">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                disabled
                type="email"
                placeholder={currentUser.email}
              />
            </Form.Group>
            <Form.Group controlId="formFirstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                ref={firstNameRef}
                defaultValue={userData.firstname}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                ref={lastNameRef}
                defaultValue={userData.lastname}
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                ref={addressRef}
                defaultValue={userData.address}
                placeholder="Address.."
              />
            </Form.Group>
            <Form.Group controlId="formNationality">
              <Form.Label>Nationality</Form.Label>
              <Form.Control
                type="text"
                ref={nationalityRef}
                defaultValue={userData.nationality}
                placeholder="Nationality..."
              />
            </Form.Group>
            <Form.Group controlId="formEducation">
              <Form.Label>Education</Form.Label>
              <Form.Control
                type="text"
                ref={educationRef}
                defaultValue={userData.education}
                placeholder="Education..."
              />
            </Form.Group>
            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <div className="gender-radio-group">
                <Form.Check
                  label="Male"
                  name="group1"
                  type="radio"
                  value="Male"
                  onChange={(e) => (userData.gender = e.target.value)}
                />
                <Form.Check
                  label="Female"
                  name="group1"
                  type="radio"
                  value="Female"
                  onChange={(e) => (userData.gender = e.target.value)}
                />
              </div>
            </Form.Group>
            <Button
              onClick={() => {
                changeCredentials(currentUser.uid);
              }}
              disabled={loading}
              variant="primary"
              className="profile-submit-button"
            >
              Save
            </Button>
          </Form>
          <h2 className="profile-heading">Time Off Request</h2>
          <TimeoffRequest />
        </div>
      </Col>
      <Col md={4}>
        <div className="payroll-container">
          <h2 className="profile-heading">Payroll</h2>
          <PayrollCard />
        </div>
      </Col>
    </Row>
  );
}
