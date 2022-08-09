import React, { useEffect, useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import {  collection, getDocs} from "firebase/firestore"
import { db } from "../firebase"

export default function LoginUser() {

    const emailRef = useRef()
    const passwordRef = useRef() 
    const firmRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [firms, setFirms] = useState([])
    const [firmUsers, setFirmUsers] = useState([])

    useEffect(() => {
      getFirms()
      // eslint-disable-next-line
    }, [])

    const getFirms = async () => {
      const querySnapshot = await getDocs(collection(db, "firm"));
      querySnapshot.forEach((doc) => {
        setFirms(prevState => [...prevState, doc.id],
      );
    })
  };
 
    const getFirmUsers = async () => {
      if(firmRef.current.value.length === 6) {
        setFirmUsers([])
        setLoading(false)
        const querySnapshot = await getDocs(collection(db, "firm/" + firmRef.current.value + "/user"));
          querySnapshot.forEach((doc) => {
            const data = doc.data()
            setFirmUsers(prevState => ([...prevState, data.email])
          );
        })
      } else {
        setLoading(true)
      }
          
      };

    async function handleSubmit(e) {
        e.preventDefault()
        

        if (firms.includes(firmRef.current.value)) {
          if (firmUsers.includes(emailRef.current.value)){
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            alert("Successfully logged in")
            navigate("/user-dashboard")
          } 
          else {
            alert("User does not belong in this firm")
          }
          setLoading(false)
        }
        else {
          alert("Wrong firm code, please try another code")
        }
      }

  return (
    <>
        <Card>
            <Card.Body>
            <h2 className="text-center mb-4">Log In User</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Form.Group id="firmCode">
                <Form.Label>Firm Code</Form.Label>
                <Form.Control type="text" ref={firmRef} onChange={getFirmUsers} required />
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-4 btn-main" type="submit">
                Log In
                </Button>
            </Form>
            <div className='w-100 text-center mt-3'>
                <Link to="/forgot-password">Forgot Password?</Link>
            </div>
        </Card.Body>
         </Card>
        <div className='w-100 text-center mt-2'>
            Need an account? <Link to="/signup">Sign up</Link>
        </div>
    </>
  )
}