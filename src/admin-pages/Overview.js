import React, { useState, useEffect } from 'react'
import { Table } from "react-bootstrap"
import { db } from "../firebase"
import { getDocs, collection } from "firebase/firestore"

export default function Overview() {
    const [users, setUsers] = useState([]) 
    let counter = 0;

    async function getUsers() {
        const querySnapshot = await getDocs(collection(db, "admin"));
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

    useEffect(() => {

    getUsers()
    // eslint-disable-next-line
    }, [])

  return (
    <Table striped bordered hover size="lg">
            <thead>
                <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>E-mail</th>
                </tr>
            </thead>
            <tbody>
             {users.map((user) => {
                return (
                <tr>
                <td>{ counter=counter+1}</td>
                <td>{ user.firstname }</td>
                <td>{ user.lastname }</td>
                <td>{ user.email }</td>
                </tr>
                )
             })}
                
            </tbody>
    </Table>
  )
}
