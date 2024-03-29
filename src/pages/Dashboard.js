import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Form,
  DropdownButton,
  Dropdown,
  Card,
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString();

  // Auth
  const { currentUser, currentFirm, admin } = useAuth();

  // Navigate
  const navigate = useNavigate();

  // State
  const [firm, setFirm] = useState([]);
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
      toast.error("This user is already added to assigned users list!");
    } else {
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
      toast.success("Task successfully deleted!");
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (e) {
      toast.error("Unknown error for action: Delete task.");
      console.log(e);
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
      toast.success("Task successfully updated!");
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (error) {
      toast.error("Unknown error for action: Update task.");
    }
    setLoading(false);
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
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
      toast.success("Task successfully created!");

      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (e) {
      toast.error("Unknown error for action: Create task.");
      console.error(e);
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
      toast.success("Task successfully archived!");
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (error) {
      toast.error("Unknown error for action: Archive task.");
      console.error(error);
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

  const getImportanceIndicator = (importance) => {
    switch (importance) {
      case "high":
        return <div className="dashboard-importance-indicator high">High</div>;
      case "medium":
        return (
          <div className="dashboard-importance-indicator medium">Medium</div>
        );
      case "low":
        return <div className="dashboard-importance-indicator low">Low</div>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <ToastContainer />
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

                <Button variant="primary" disabled={loading} type="submit">
                  Create Task
                </Button>
                <Button
                  variant="secondary"
                  disabled={loading}
                  onClick={() => {
                    titleRef.current.value = "";
                    descriptionRef.current.value = "";
                    setAssignedUsers([]);
                    setImportance("");
                  }}
                >
                  Cancel
                </Button>
              </ButtonGroup>
              <div className="importance">
                <h4 style={{ marginTop: "10px" }}>Importance</h4>

                {getImportanceIndicator(importance)}
              </div>
              <div className="assigned-users" style={{ marginTop: "10px" }}>
                {assignedUsers.length === 0 && <p>No assigned users.</p>}
                {assignedUsers.map((assignedUser, index) => (
                  <Card key={index} className="user-card">
                    <Card.Body>
                      <Card.Title>
                        {assignedUser.firstname} {assignedUser.lastname}
                      </Card.Title>
                      <Card.Text className="email">
                        {assignedUser.email}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
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
