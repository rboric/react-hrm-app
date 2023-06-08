import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Alert,
  Form,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  setDoc,
  getDoc,
} from "firebase/firestore";
import Tasks from "../components/Tasks";
import Timeline from "../components/Timeline";

export default function Dashboard() {
  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString();

  // Auth
  const { currentUser, currentFirm, admin } = useAuth();

  // Navigate
  const navigate = useNavigate();

  // State
  const [firm, setFirm] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Ref
  const titleRef = useRef();
  const descriptionRef = useRef();

  // Tasks
  const [importance, setImportance] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [firmUsers, setFirmUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const q = query(
        collection(db, "user"),
        where("firm_id", "==", parseInt(currentFirm))
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setFirmUsers((prevState) => [
          ...prevState,
          {
            id: doc.id,
            admin: data.admin,
            email: data.email,
            firm_id: data.firm_id,
            firstname: data.firstname,
            lastname: data.lastname,
            hours: data.hours,
            salary: data.salary,
          },
        ]);
      });
    };

    getUsers();
  }, [currentFirm]);

  useEffect(() => {
    const getCurrentFirm = async () => {
      const docRef = collection(db, "firm");
      const currentFirmQuery = query(
        docRef,
        where("id", "==", parseInt(currentFirm))
      );
      const querySnapshot = await getDocs(currentFirmQuery);
      querySnapshot.forEach((doc) => {
        setFirm(doc.data());
      });
    };

    getCurrentFirm();
  }, [currentFirm]);

  useEffect(() => {
    const getTaskData = async () => {
      const q = query(
        collection(db, "tasks"),
        where("firm_id", "==", parseInt(currentFirm))
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setTaskData((prevState) => [
          ...prevState,
          {
            uid: doc.id,
            title: data.title,
            description: data.description,
            assignedUsers: data.assignedUsers,
            importance: data.importance,
            archive: data.archive,
            comments: data.comments,
            isActive: data.isActive,
          },
        ]);
      });
    };

    getTaskData();
  }, [currentFirm]);

  const assignUserForTask = async (id, firstname, lastname, email) => {
    if (
      assignedUsers.find((assignedUser) => {
        return assignedUser.id === id;
      })
    ) {
      setError("This user is already added to assigned users list!");
    } else {
      setError("");
      setAssignedUsers((prevState) => [
        ...prevState,
        {
          id: id,
          firstname: firstname,
          lastname: lastname,
          email: email,
        },
      ]);
    }
  };

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "tasks", id));
      await createTimeline("delete");
      navigate(0);
    } catch (e) {
      console.log(e);
      setError(JSON.stringify(e));
    }
    setLoading(false);
  };

  const updateTask = async (id, title, description, importance) => {
    try {
      setLoading(true);
      await setDoc(
        doc(db, "tasks", id),
        {
          title: title,
          description: description,
          importance: importance,
        },
        { merge: true }
      );
      await createTimeline("update");
      navigate(0);
    } catch (error) {
      console.error(error);
      setError(JSON.stringify(error));
    }
    setLoading(false);
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await addDoc(collection(db, "tasks"), {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        assignedUsers: assignedUsers,
        importance: importance,
        firm_id: parseInt(currentFirm),
        creator: currentUser.uid,
        archive: false,
        comments: [],
        isActive: false,
      });
      await createTimeline("create");
      navigate(0);
    } catch (e) {
      console.error(e);
      setError(JSON.stringify(e));
    }

    setLoading(false);
  };

  const archiveTask = async (id) => {
    try {
      setLoading(true);
      await setDoc(
        doc(db, "tasks", id),
        {
          archive: true,
        },
        { merge: true }
      );
      await createTimeline("archive");
      navigate(0);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelect = (e) => {
    setImportance(e);
    console.log(e);
  };

  const createTimeline = async (action) => {
    const userRef = doc(db, "user", currentUser.uid);
    const userDoc = await getDoc(userRef);
    console.log(123);
    try {
      if (action === "create") {
        await addDoc(collection(db, "timeline"), {
          firm_id: currentFirm,
          msg: `${
            userDoc.data().firstname + " " + userDoc.data().lastname
          } has added a new ${importance} importance task.`,
          type: "Task",
          timestamp: formattedDateTime,
        });
      }
      if (action === "delete") {
        await addDoc(collection(db, "timeline"), {
          firm_id: currentFirm,
          msg: `${
            userDoc.data().firstname + " " + userDoc.data().lastname
          } has deleted a task.`,
          type: "Task",
          timestamp: formattedDateTime,
        });
      }
      if (action === "update") {
        await addDoc(collection(db, "timeline"), {
          firm_id: currentFirm,
          msg: `${
            userDoc.data().firstname + " " + userDoc.data().lastname
          } has updated a task.`,
          type: "Task",
          timestamp: formattedDateTime,
        });
      }
      if (action === "archive") {
        await addDoc(collection(db, "timeline"), {
          firm_id: currentFirm,
          msg: `${
            userDoc.data().firstname + " " + userDoc.data().lastname
          } has archived a task.`,
          type: "Task",
          timestamp: formattedDateTime,
        });
      }
      if (action === "comment") {
        await addDoc(collection(db, "timeline"), {
          firm_id: currentFirm,
          msg: `${
            userDoc.data().firstname + " " + userDoc.data().lastname
          } has commented on a task.`,
          type: "Task",
          timestamp: formattedDateTime,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="firm-details">
        <h2 className="firm-name">{firm.firmname}</h2>
        {admin && (
          <div className="create-task-form">
            <Form onSubmit={createTask}>
              <Form.Group controlId="taskTitle">
                <Form.Label>Task Title</Form.Label>
                <Form.Control type="text" ref={titleRef} required />
              </Form.Group>
              <Form.Group controlId="taskDescription">
                <Form.Label>Task Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  ref={descriptionRef}
                  required
                />
              </Form.Group>
              <ButtonGroup className="button-container">
                <DropdownButton
                  disabled={loading}
                  title="Importance"
                  onSelect={handleSelect}
                  id="dropdown-importance"
                  variant="primary"
                >
                  <Dropdown.Item eventKey="high">High</Dropdown.Item>
                  <Dropdown.Item eventKey="medium">Medium</Dropdown.Item>
                  <Dropdown.Item eventKey="low">Low</Dropdown.Item>
                </DropdownButton>

                <DropdownButton
                  disabled={loading}
                  title="Assign"
                  id="dropdown-assign"
                  variant="primary"
                >
                  {firmUsers.map((user, i) => (
                    <Dropdown.Item
                      key={i}
                      onClick={() =>
                        assignUserForTask(
                          user.id,
                          user.firstname,
                          user.lastname,
                          user.email
                        )
                      }
                    >
                      {user.firstname +
                        " " +
                        user.lastname +
                        ` ( ${user.email} )`}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>

                <Button
                  disabled={loading}
                  type="submit"
                  className="create-task-button"
                >
                  Create Task
                </Button>
              </ButtonGroup>
              <div className="assigned-users">
                {assignedUsers.map((assignedUser, index) => (
                  <p key={index}>
                    {assignedUser.firstname +
                      " " +
                      assignedUser.lastname +
                      " " +
                      assignedUser.email}
                  </p>
                ))}
                {error && <Alert variant="danger">{error}</Alert>}
              </div>
              <div>
                <p>{importance}</p>
              </div>
            </Form>
          </div>
        )}
        {taskData && (
          <Tasks
            taskData={taskData}
            loading={loading}
            assignedUsers={assignedUsers}
            deleteTask={deleteTask}
            updateTask={updateTask}
            archiveTask={archiveTask}
            createTimeline={createTimeline}
          ></Tasks>
        )}
      </div>
      <div className="timeline-container">
        <Timeline type={"Task"}></Timeline>
      </div>
    </div>
  );
}
