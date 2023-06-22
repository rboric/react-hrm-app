import { Card, Button, Modal, Form } from "react-bootstrap";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Rules() {
  const { admin, currentFirm } = useAuth();
  const [rules, setRules] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const ruleTextRef = useRef();
  const ruleTitleRef = useRef();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRule = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "rules"), {
        text: ruleTextRef.current.value,
        title: ruleTitleRef.current.value,
        firm_id: currentFirm,
      });
      toast.success("Rule successfully created!");

      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (e) {
      toast.error("Unknown error for action: Create rule.");
      console.error(e);
    }
  };

  const deleteRule = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "rules", id));
      toast.success("Rule successfully deleted!");
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (e) {
      toast.error("Unknown error for action: Delete rule.");
      console.log(e);
    }
    setLoading(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const getRules = async () => {
      const q = query(
        collection(db, "rules"),
        where("firm_id", "==", parseInt(currentFirm))
      );
      const querySnapshot = await getDocs(q);

      const fetchedRules = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRules(fetchedRules);
    };

    getRules();

    // eslint-disable-next-line
  }, [currentFirm]);

  return (
    <>
      <ToastContainer />
      <div className="card-deck d-flex flex-column justify-content-between">
        {admin && (
          <Card className="mb-3">
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title>Click to add rule</Card.Title>
              <div className="text-center">
                <Button variant="primary" onClick={openModal}>
                  Add Rule
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
        <div className="d-flex flex-row flex-wrap justify-content-center align-items-stretch">
          {rules.map((rule, i) => {
            return (
              <Card key={i} className="mx-3 my-3" style={{ width: "40%" }}>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{rule.title}</Card.Title>
                  <Card.Text>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{rule.text}</pre>
                  </Card.Text>
                  {admin && (
                    <Button
                      variant="danger"
                      disabled={loading}
                      onClick={() => {
                        deleteRule(rule.id);
                      }}
                    >
                      Delete rule
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Rule</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createRule}>
            <Form.Group controlId="ruleTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" ref={ruleTitleRef} required />
            </Form.Group>
            <Form.Group controlId="ruleText">
              <Form.Label>Text</Form.Label>
              <Form.Control as="textarea" ref={ruleTextRef} required />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              <Button disabled={loading} variant="primary" type="submit">
                Create Rule
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
