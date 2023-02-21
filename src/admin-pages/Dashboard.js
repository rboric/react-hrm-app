import React, { useState, useRef, useEffect } from "react";
import { Button, Alert, Form, DropdownButton, Dropdown } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
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
  const { currentUser, currentFirm } = useAuth();

  // Navigate
  const navigate = useNavigate();

  // State
  const [firm, setFirm] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Ref
  const taskTitleRef = useRef();
  const taskDescriptionRef = useRef();
  const taskRequirementsRef = useRef();

  // Tasks
  const [importance, setImportance] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);

  useEffect(() => {
    const getCurrentFirm = async () => {
      const docRef = collection(db, "/firm");
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

  /* useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(
        collection(db, "firm/" + currentFirm + "/tasks/")
      );
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setTaskData((prevState) => [
          ...prevState,
          {
            task_uid: doc.id,
            task_title: data.task_title,
            task_description: data.task_description,
            task_requirements: data.task_requirements,
            task_assignedUsers: data.task_assignedUsers,
            task_importance: data.task_importance,
          },
        ]);
      });
    };

    const getUsers = async () => {
      const querySnapshot = await getDocs(
        collection(db, "firm/" + currentFirm + "/user")
      );
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setUsers((prevState) => [
          ...prevState,
          {
            id: doc.id,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
          },
        ]);
      });
    };

    getData();
    getUsers();
  }, [currentFirm]); */

  /* const assignUserForTask = async (id, firstname, lastname, email) => {
    if (
      assignedUsers.find((assignedUser) => {
        return assignedUser.id === id;
      })
    ) {
      setError("You already added that user!");
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
  }; */

  /* const deleteTask = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "firm/" + currentFirm + "/tasks", id));
      navigate(0);
    } catch (e) {
      console.log(e);
      setError(JSON.stringify(e));
    }
    setLoading(false);
  }; */

  /* const updateTask = async (id, title, description, requirements) => {
    try {
      setLoading(true);
      await setDoc(doc(db, "firm/" + currentFirm + "/tasks", id), {
        task_title: title,
        task_description: description,
        task_requirements: requirements,
      });
      navigate(0);
    } catch (error) {
      console.error(error);
      setError(JSON.stringify(error));
    }
    setLoading(false);
  }; */

  /* const createTask = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await addDoc(collection(db, "firm/" + currentFirm + "/tasks"), {
        task_title: taskTitleRef.current.value,
        task_description: taskDescriptionRef.current.value,
        task_requirements: taskRequirementsRef.current.value,
        task_assignedUsers: assignedUsers,
        task_importance: importance,
        creator: currentUser.uid,
      });
      navigate(0);
    } catch (e) {
      console.log(e);
      setError(JSON.stringify(e));
    }

    setLoading(false);
  }; */

  return (
    <div className="w-75 mx-auto">
      <h2 className="text-center mb-4">Profile</h2>
      <h2 className="text-center mb-4">{firm.firmname}</h2>
      <strong>Email: </strong> {currentUser.email}
      <div className="text-center mx-auto mt-5">
        <Form>
          {/* <Form.Group id="firstname">
            <Form.Label>Task Title</Form.Label>
            <Form.Control type="firstname" ref={taskTitleRef} required />
          </Form.Group> */}
          {/* <Form.Group id="lastname">
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              ref={taskDescriptionRef}
              required
            />
          </Form.Group>
          <Form.Group id="requirements">
            <Form.Label>Requirements</Form.Label>
            <Form.Control
              type="requirements"
              ref={taskRequirementsRef}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Task Importaance</Form.Label>
            <div>
              <Button
                className="VI"
                onClick={() => {
                  setImportance("A VI");
                }}
              >
                VERY IMPORTANT
              </Button>
              <Button
                className="M"
                onClick={() => {
                  setImportance("B M");
                }}
              >
                Medium
              </Button>
              <Button
                className="NcdI"
                onClick={() => {
                  setImportance("C NI");
                }}
              >
                Not so important
              </Button>
            </div>

            {importance}
            <Button value="m">MEDIUM</Button>
              <Button value="nsi">NOT SO IMPORTANT</Button>
          </Form.Group> */}
          {/* <DropdownButton disabled={loading} title="Assign">
            {users.map((user, i) => {
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
                  {user.firstname + " " + user.lastname + ` ( ${user.email} )`}
                </Dropdown.Item>
              );
            })}
          </DropdownButton> */}
          {/*  <div>
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
          </div> */}
          {/* {error && <Alert variant="danger">{error}</Alert>}
          <Button disabled={loading} type="submit">
            Create Task
          </Button> */}
        </Form>
      </div>
      {/* {taskData && (
        <Tasks
          taskData={taskData}
          loading={loading}
          deleteTask={deleteTask}
          updateTask={updateTask}
        ></Tasks>
      )} */}
    </div>
  );
}
