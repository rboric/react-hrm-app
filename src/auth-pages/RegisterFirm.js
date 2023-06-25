import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function SignupAdmin() {
  const firmNameRef = useRef();
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const randomNumber = Math.floor(Math.random() * 1000001);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);
    await addDoc(collection(db, "firm"), {
      firmname: firmNameRef.current.value,
      id: randomNumber,
    });
    await addDoc(collection(db, "mail"), {
      to: emailRef.current.value,
      message: {
        subject: "Firm registering",
        text: `This is the firm number: ${randomNumber}`,
        html: `This is the firm number: ${randomNumber}`,
      },
    });
    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Register Firm</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="firmname">
              <Form.Label>Firm Name</Form.Label>
              <Form.Control type="firmname" ref={firmNameRef} required />
              <Form.Label>E-mail</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4" type="submit">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login-admin">Log In</Link>
      </div>
    </>
  );
}
