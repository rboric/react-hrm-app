import React, { useState, useRef } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  ListGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Comments from "../components/Comments";

export default function Tasks({
  loading,
  taskData,
  deleteTask,
  updateTask,
  archiveTask,
}) {
  const { admin } = useAuth();

  const [show, setShow] = useState(false);
  const [modalTaskData, setmodalTaskData] = useState([]);
  const taskTitleRef = useRef();
  const taskDescriptionRef = useRef();
  const taskSorted = taskData.sort();
  const [importance, setImportance] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelect = (e) => {
    setImportance(e);
    console.log(e);
  };

  return (
    <div className="d-flex flex-wrap">
      {taskSorted.map((el, i) => {
        return (
          !el.archive && (
            <div key={i} className="col-md-6">
              <Card>
                <Card.Header>
                  <Card.Title>{el.title}</Card.Title>
                </Card.Header>
                <Card.Body className={el.importance}>
                  <Card.Text>{el.description}</Card.Text>
                  Assigned Users:
                  <ListGroup variant="flush">
                    {el.assignedUsers.map((assignedUser, id) => {
                      return (
                        <ListGroup.Item key={id}>
                          {assignedUser.email +
                            " " +
                            assignedUser.firstname +
                            " " +
                            assignedUser.lastname}
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                  <Comments el={el}></Comments>
                  <ListGroup horizontal>
                    {admin && (
                      <Button
                        disabled={loading}
                        onClick={() => {
                          deleteTask(el.uid);
                        }}
                      >
                        Delete Task
                      </Button>
                    )}

                    {admin && (
                      <Button
                        onClick={() => {
                          handleShow();
                          setmodalTaskData(el);
                        }}
                      >
                        Update Task
                      </Button>
                    )}
                    {admin && (
                      <Button
                        disabled={loading}
                        onClick={() => {
                          archiveTask(el.uid);
                        }}
                      >
                        Archive Task
                      </Button>
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </div>
          )
        );
      })}
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTaskData.title}</Modal.Title>
        </Modal.Header>
        <Form className="p-2">
          <Form.Group
            className="mb-3 w-100"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Task Title</Form.Label>
            <Form.Control
              defaultValue={modalTaskData.title}
              autoFocus
              ref={taskTitleRef}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={modalTaskData.description}
              ref={taskDescriptionRef}
            />
          </Form.Group>
          <Form.Group
            className="mb-3 w-100"
            controlId="exampleForm.ControlInput1"
          ></Form.Group>
          <Form.Group
            className="mb-3 w-100"
            controlId="exampleForm.ControlInput1"
          >
            <Form.Label>Importance</Form.Label>
            <DropdownButton
              disabled={loading}
              title={importance}
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="high">High</Dropdown.Item>
              <Dropdown.Item eventKey="medium">Medium</Dropdown.Item>
              <Dropdown.Item eventKey="low">Low</Dropdown.Item>
            </DropdownButton>
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
                modalTaskData.uid,
                taskTitleRef.current.value,
                taskDescriptionRef.current.value,
                importance
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
