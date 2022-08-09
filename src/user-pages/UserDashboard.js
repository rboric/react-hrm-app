import React, { useState, useEffect } from 'react'
import UserTasks from "../components/UserTasks"
import { Card } from "react-bootstrap"
import { useAuth } from '../contexts/AuthContext'
import { db } from "../firebase"
import {  collection, getDocs, query, where} from "firebase/firestore"


export default function Dashboard() {
  
    const { currentUser } = useAuth()
    const [taskData, setTaskData] = useState([])
    const [users, setUsers] = useState([])
    const [assignedUsers, setAssignedUsers] = useState([])
    const [firmsPath, setFirmsPath] = useState([])
    const [currentFirm, setCurrentFirm] = useState()

    useEffect(() => {
        const getFirms = async () => {
          const querySnapshot = await getDocs(collection(db, "firm"));
          querySnapshot.forEach((doc) => {
            setFirmsPath(prevState => [...prevState, doc.ref.path])
        })
      }
  
        getFirms()
      }, [])
  
      useEffect(() => {
        const getCurrentFirm = async (array) => {
          array.forEach(async (el) => { 
            const docRef = collection(db, el + "/user")
            const currentFirmQuery = query(docRef, where("email", "==", currentUser.email))  
            await getDocs(currentFirmQuery).then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                setCurrentFirm(doc.ref._path.segments[6])
              });
            });
          }) 
        }
  
        getCurrentFirm(firmsPath) 
      }, [firmsPath, currentUser.email])
  
      useEffect(() => {
        const getData = async () => {
          const querySnapshot = await getDocs(collection(db, "firm/" + currentFirm + "/tasks/"))
          querySnapshot.forEach((doc) => {
            const data = doc.data()
            setTaskData(prevState => [...prevState, 
              {
              task_uid: doc.id,
              task_title: data.task_title,
              task_description: data.task_description, 
              task_requirements: data.task_requirements, 
              /* task_assignedUsers: data.task_assignedUsers */
            }]) 
          });
        };
  
        const getUsers = async () => {
          const querySnapshot = await getDocs(collection(db, "firm/" + currentFirm + "/admin"));
          querySnapshot.forEach((doc) => {
            const data = doc.data()
            setUsers(prevState => [...prevState, 
              {
              id: doc.id,
              firstname: data.firstname,
              lastname: data.lastname, 
              email: data.email,
            }])
          });
        };
  
        getData()
        getUsers()
      }, [currentFirm]) 
      

  return (
    <>  
        <Card> 
            <Card.Body>
            <h2 className="text-center mb-4">Profile</h2>
            <strong>Email: </strong> {currentUser.email}
            </Card.Body>
        </Card>
        <div className="flex w-75 text-center mx-auto">
                {taskData && <UserTasks taskData={taskData}></UserTasks>}
        </div>
    </>
  )
}
