import React, { useState, useRef, useEffect } from "react";
import { Button, Alert, Form, DropdownButton, Dropdown } from "react-bootstrap";
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
} from "firebase/firestore";
import Tasks from "../components/Tasks";

export default function Dashboard() {
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

  return (
    <div className="w-75 mx-auto">
      <h2 className="text-center mb-4">Profile</h2>
      <h2 className="text-center mb-4">{firm.firmname}</h2>
      <strong>Email: </strong> {currentUser.email}
      {admin && (
        <div className="text-center mx-auto mt-5">
          <Form onSubmit={createTask}>
            <Form.Group id="firstname">
              <Form.Label>Task Title</Form.Label>
              <Form.Control type="firstname" ref={titleRef} required />
            </Form.Group>
            <Form.Group id="lastname">
              <Form.Label>Task Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                ref={descriptionRef}
                required
              />
            </Form.Group>
            <DropdownButton
              disabled={loading}
              title="Importance"
              onSelect={handleSelect}
            >
              <Dropdown.Item eventKey="high">High</Dropdown.Item>
              <Dropdown.Item eventKey="medium">Medium</Dropdown.Item>
              <Dropdown.Item eventKey="low">Low</Dropdown.Item>
            </DropdownButton>
            {importance}
            <DropdownButton disabled={loading} title="Assign">
              {firmUsers.map((user, i) => {
                return (
                  <Dropdown.Item
                    key={i}
                    onClick={() => {
                      assignUserForTask(
                        user.id,
                        user.firstname,
                        user.lastname,
                        user.email
                      );
                    }}
                  >
                    {user.firstname +
                      " " +
                      user.lastname +
                      ` ( ${user.email} )`}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
            <div>
              {assignedUsers.map((assignedUser, index) => {
                return (
                  <p key={index}>
                    {assignedUser.firstname +
                      " " +
                      assignedUser.lastname +
                      " " +
                      assignedUser.email}
                  </p>
                );
              })}
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button disabled={loading} type="submit">
              Create Task
            </Button>
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
        ></Tasks>
      )}
    </div>
  );
}
