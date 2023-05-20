import React, { useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

import { db } from "../firebase";
import { getDoc, doc, addDoc, collection } from "firebase/firestore";

export default function TimeoffRequest() {
  const { currentUser, currentFirm } = useAuth();
  const [loading, setLoading] = useState(false);
  const typeRef = useRef();
  const fromRef = useRef();
  const untilRef = useRef();
  const notesRef = useRef();

  const timeoffSendRequest = async () => {
    try {
      setLoading(true);
      const userRef = doc(db, "user", currentUser.uid);
      const userDoc = await getDoc(userRef);
      await addDoc(collection(db, "requests"), {
        type: typeRef.current.value,
        from: fromRef.current.value,
        until: untilRef.current.value,
        user: userDoc.data().firstname + " " + userDoc.data().lastname,
        status: "Requested",
        notes: notesRef.current.value,
        firm_id: currentFirm,
      });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <Form>
        <b>Timeoff</b>
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select ref={typeRef} aria-label="Default select example">
            <option value="Annual leave">Annual leave</option>
            <option value="Sick leave">Sick leave</option>
            <option value="Personal leave">Personal leave</option>
            <option value="Materniy/Paternity leave">
              Maternity/Paternity leave
            </option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>From</Form.Label>
          <Form.Control ref={fromRef} type="date" />
          <Form.Label>Until</Form.Label>
          <Form.Control ref={untilRef} type="date" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Notes</Form.Label>
          <Form.Control as="textarea" ref={notesRef} />
        </Form.Group>
        <Button
          disabled={loading}
          onClick={async () => {
            await timeoffSendRequest();
            typeRef.current.value = "";
            fromRef.current.value = "";
            untilRef.current.value = "";
            notesRef.current.value = "";
          }}
        >
          Submit request
        </Button>
      </Form>
    </>
  );
}
