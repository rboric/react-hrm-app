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
  createTimeline,
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

  const handleDeleteTask = (uid) => {
    deleteTask(uid);
  };

  const handleUpdateTask = (task) => {
    handleShow();
    setmodalTaskData(task);
  };

  const handleArchiveTask = (uid) => {
    archiveTask(uid);
  };

  const handleSaveChanges = () => {
    const uid = modalTaskData.uid;
    const title = taskTitleRef.current.value;
    const description = taskDescriptionRef.current.value;
    updateTask(uid, title, description, importance);
    handleClose();
  };

  return (
    <div className="d-flex flex-wrap">
      {taskSorted.map((task, i) => {
        const { uid, title, description, assignedUsers, importance } = task;
        return (
          !task.archive && (
            <div key={i} className="col-md-6">
              <Card>
                <Card.Header>
                  <Card.Title>{title}</Card.Title>
                </Card.Header>
                <Card.Body className={`task-importance-${importance}`}>
                  <Card.Text>{description}</Card.Text>
                  Assigned Users:
                  <ListGroup variant="flush">
                    {assignedUsers.map((assignedUser, id) => (
                      <ListGroup.Item key={id}>
                        {`${assignedUser.email} ${assignedUser.firstname} ${assignedUser.lastname}`}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Comments el={task} createTimeline={createTimeline} />
                  <ListGroup horizontal>
                    {admin && (
                      <Button
                        disabled={loading}
                        onClick={() => handleDeleteTask(uid)}
                      >
                        Delete Task
                      </Button>
                    )}

                    {admin && (
                      <Button
                        disabled={loading}
                        onClick={() => handleUpdateTask(task)}
                      >
                        Update Task
                      </Button>
                    )}
                    {admin && (
                      <Button
                        disabled={loading}
                        onClick={() => handleArchiveTask(uid)}
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
          <Form.Group className="mb-3 w-100" controlId="taskTitle">
            <Form.Label>Task Title</Form.Label>
            <Form.Control
              defaultValue={modalTaskData.title}
              autoFocus
              ref={taskTitleRef}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="taskDescription">
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              defaultValue={modalTaskData.description}
              ref={taskDescriptionRef}
            />
          </Form.Group>
          <Form.Group className="mb-3 w-100" controlId="importanceDropdown">
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
            disabled={loading}
            variant="primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
