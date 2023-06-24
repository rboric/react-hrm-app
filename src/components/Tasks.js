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
    const editedImportance = importance ? importance : modalTaskData.importance;
    updateTask(uid, title, description, editedImportance);
    handleClose();
  };

  const getImportanceIndicator = (importance) => {
    switch (importance) {
      case "high":
        return <span className="importance-indicator high">High</span>;
      case "medium":
        return <span className="importance-indicator medium">Medium</span>;
      case "low":
        return <span className="importance-indicator low">Low</span>;
      default:
        return null;
    }
  };

  const getImportanceIndicatorModal = (importance) => {
    switch (importance) {
      case "high":
        return <div className="task-modal-importance-indicator high">High</div>;
      case "medium":
        return (
          <div className="task-modal-importance-indicator medium">Medium</div>
        );
      case "low":
        return <div className="task-modal-importance-indicator low">Low</div>;
      default:
        return null;
    }
  };

  return (
    <div className="tasks-container">
      {taskSorted.map((task, i) => {
        const { uid, title, description, assignedUsers, importance } = task;
        return (
          !task.archive && (
            <div key={i} className="task-card">
              <Card>
                <Card.Header>
                  <div className="task-header">
                    <h5>{title}</h5>
                    {getImportanceIndicator(importance)}
                  </div>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{description}</Card.Text>
                  {task.assignedUsers.length > 0 && (
                    <div className="task-assigned-users">
                      <strong>Assigned Users:</strong>
                      <ListGroup variant="flush">
                        {assignedUsers.map((assignedUser, id) => (
                          <ListGroup.Item key={id}>
                            {`${assignedUser.email} ${assignedUser.firstname} ${assignedUser.lastname}`}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                  <Comments
                    el={task}
                    createTimeline={createTimeline}
                    showComments={true}
                  />
                  <div className="task-buttons">
                    {admin && (
                      <Button
                        disabled={loading}
                        variant="primary"
                        onClick={() => handleDeleteTask(uid)}
                      >
                        Delete Task
                      </Button>
                    )}

                    {admin && (
                      <Button
                        disabled={loading}
                        variant="primary"
                        onClick={() => handleUpdateTask(task)}
                      >
                        Update Task
                      </Button>
                    )}
                    {admin && (
                      <Button
                        disabled={loading}
                        variant="secondary"
                        onClick={() => handleArchiveTask(uid)}
                      >
                        Archive Task
                      </Button>
                    )}
                  </div>
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
          <Form.Group className="mb-2 w-100" controlId="importanceDropdown">
            <DropdownButton
              style={{ display: "inline", width: "100%" }}
              disabled={loading}
              title={"Importance"}
              onSelect={handleSelect}
              className="importance-button-modal"
            >
              <Dropdown.Item eventKey="high">High</Dropdown.Item>
              <Dropdown.Item eventKey="medium">Medium</Dropdown.Item>
              <Dropdown.Item eventKey="low">Low</Dropdown.Item>
            </DropdownButton>
            <div
              className="dashboard-importance-indicator"
              style={{
                display: "inline",
                marginLeft: "10px",
              }}
            >
              {getImportanceIndicatorModal(
                importance ? importance : modalTaskData.importance
              )}
            </div>
          </Form.Group>
        </Form>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              handleClose();
              setImportance(null);
            }}
          >
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
