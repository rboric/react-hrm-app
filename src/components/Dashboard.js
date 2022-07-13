import React, { useState, useRef, useEffect } from 'react'
import { Card, Button, Alert, Form, DropdownButton, Dropdown } from "react-bootstrap"
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { db } from "../firebase"
import {  addDoc, collection, getDocs, doc, deleteDoc} from "firebase/firestore"


export default function Dashboard() {
  
    const [error, setError] = useState('')
    const { currentUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const taskTitleRef = useRef()
    const taskDescriptionRef = useRef()
    const taskRequirementsRef = useRef()
    const navigate = useNavigate()
    const [taskData, setTaskData] = useState([])
    const [users, setUsers] = useState([])

    async function getData() {
      const querySnapshot = await getDocs(collection(db, "user/" + currentUser.uid + "/tasks"));
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        setTaskData(prevState => [...prevState, 
          {
          task_uid: doc.id,
          task_title: data.task_title, 
          task_description: data.task_description, 
          task_requirements: data.task_requirements
        }])
      });
    };

    async function getUsers() {
      const querySnapshot = await getDocs(collection(db, "user"));
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        setUsers(prevState => [...prevState, 
          {
          user_uid: doc.id,
          user_firstname: data.firstname, 
          user_lastname: data.lastname, 
          user_email: data.email,
        }])
      });
    };

    useEffect(() => {

      getData()
      getUsers()
      // eslint-disable-next-line
    }, [])

    async function deleteTask(id) {
      try {
        setLoading(true)
        await deleteDoc(doc(db, "user/" + currentUser.uid + "/tasks/", id))
        navigate(0)
      } catch(e){
        console.log(e)
        setError(JSON.stringify(e))
      }
      setLoading(false)

    }

    async function createTask(e) {
      e.preventDefault()

      try {
        setError("")
        setLoading(true)
        await addDoc(collection(db, "user/" + currentUser.uid + "/tasks"), {
            task_title: taskTitleRef.current.value,
            task_description: taskDescriptionRef.current.value,
            task_requirements: taskRequirementsRef.current.value,
            creator: currentUser.uid
        })
        navigate(0)
      } catch(e) {
        console.log(e)
        setError(JSON.stringify(e))
       }

      setLoading(false)
    }

  return (
    <>
        <Card>
            <Card.Body>
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <strong>Email: </strong> {currentUser.email}
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">Update Profile</Link>
            </Card.Body>
        </Card>
        <div className='w-50 text-center mx-auto mt-5'>
            <Form onSubmit={createTask}>
                <Form.Group id="firstname">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control type="firstname" ref={taskTitleRef} required />
                </Form.Group>
                <Form.Group id="lastname">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control as="textarea" rows={5}  ref={taskDescriptionRef} required />
                </Form.Group>
                <Form.Group id="requirements">
                  <Form.Label>Requirements</Form.Label>
                  <Form.Control type="requirements" ref={taskRequirementsRef} required />
                </Form.Group>
                <DropdownButton className="mt-4" id="dropdown-basic-button" title="Assign">
                {users.map((el) => {
                  return (
                  <Dropdown.Item>{el.user_firstname + " " + el.user_lastname + ` ( ${el.user_email} )`}</Dropdown.Item>)
                })}
                </DropdownButton>
                {/* <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password"  required />
                </Form.Group>
                <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password"  required />
                </Form.Group> */}
                <Button disabled={loading} className="w-100 mt-4" type="submit">
                Create Task
                </Button>
            </Form>
        </div>
        <div className="flex w-75 text-center mx-auto">
        {taskData.map((el) => {
                  return (
                    <Card className="mt-4 mb-4 w-100">
                      <Card.Header><Card.Title className="mt-2">{el.task_title}</Card.Title></Card.Header>
                        <Card.Body>
                          <Card.Text>{el.task_description}</Card.Text>
                          <Card.Text>Requirements:
                          {" " + el.task_requirements}
                          </Card.Text>
                        </Card.Body>
                        <Button disabled={loading} onClick={() => {
                          deleteTask(el.task_uid)
                        }} className="mx-auto w-25 mb-2">Delete Task</Button>
                    </Card>)
                })
                }
        </div>
    </>
  )
}
