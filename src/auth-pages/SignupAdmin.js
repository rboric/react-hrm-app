import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupAdmin() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const firmNumberRef = useRef();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [firms, setFirms] = useState([]);

  useEffect(() => {
    const getFirms = async () => {
      const querySnapshot = await getDocs(collection(db, "firm"));
      const firmIds = querySnapshot.docs.map((doc) => doc.data().id);
      setFirms(firmIds);
    };

    getFirms();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const firmId = parseInt(firmNumberRef.current.value);

    if (!firms.includes(firmId)) {
      return toast.error("Invalid firm ID");
    }
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value).then(
        (cred) => {
          return setDoc(doc(db, "user", cred.user.uid), {
            firstname: firstNameRef.current.value,
            lastname: lastNameRef.current.value,
            email: emailRef.current.value,
            firm_id: parseInt(firmNumberRef.current.value),
            admin: true,
            salary: 7,
            hours: 7,
            address: "",
            nationality: "",
            education: "",
            gender: "",
            payroll: "hourly",
          });
        }
      );
      toast.success("Signed up successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setLoading(false);
      if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters long");
      } else if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists");
      } else {
        toast.error("Failed to sign up. Please try again later.");
      }
    }

    setLoading(false);
  }

  return (
    <>
      <ToastContainer />
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="firstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" ref={firstNameRef} required />
            </Form.Group>
            <Form.Group id="lastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" ref={lastNameRef} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
            <Form.Group id="firmnumber">
              <Form.Label>Firm Number</Form.Label>
              <Form.Control type="number" ref={firmNumberRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-4" type="submit">
              Sign Up
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  );
}
