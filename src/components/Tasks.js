import React, { useState, useRef } from "react";
import { Card, Button, Modal, Form, ListGroup } from "react-bootstrap";

export default function Tasks({ loading, taskData, deleteTask, updateTask }) {
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState([]);
  const taskTitleRef = useRef();
  const taskDescriptionRef = useRef();
  const taskRequirementsRef = useRef();
  const taskSorted = taskData.sort();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="d-flex flex-wrap">
      {taskSorted.map((el, i) => {
        return (
          <div key={i} className="col-md-6">
            <Card>
              <Card.Header className={el.task_importance}>
                <Card.Title>{el.task_title}</Card.Title>
              </Card.Header>
              <Card.Body className={el.task_importance}>
                <Card.Text>{el.task_description}</Card.Text>
                <Card.Text>
                  Requirements:
                  {" " + el.task_requirements}
                </Card.Text>
                Assigned Users:
                <ListGroup>
                  {el.task_assignedUsers.map((assignedUser, id) => {
                    return (
                      <ListGroup.Item key={id}>
                        {assignedUser.email}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Card.Body>
              <Button
                disabled={loading}
                onClick={() => {
                  deleteTask(el.task_uid);
                }}
              >
                Delete Task
              </Button>
              <Button
                onClick={() => {
                  handleShow();
                  setModalData(el);
                }}
              >
                Update Task
              </Button>
            </Card>
          </div>
        );
      })}
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.task_title}</Modal.Title>
        </Modal.Header>
        <Form className="p-2">
          <Form.Group
            className="mb-3 w-100"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Task Title</Form.Label>
            <Form.Control
              defaultValue={modalData.task_title}
              autoFocus
              ref={taskTitleRef}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={modalData.task_description}
              ref={taskDescriptionRef}
            />
          </Form.Group>
          <Form.Group
            className="mb-3 w-100"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Task Requirements</Form.Label>
            <Form.Control
              ref={taskRequirementsRef}
              defaultValue={modalData.task_requirements}
              autoFocus
            />
          </Form.Group>
        </Form>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
              updateTask(
                modalData.task_uid,
                taskTitleRef.current.value,
                taskDescriptionRef.current.value,
                taskRequirementsRef.current.value
              );
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
