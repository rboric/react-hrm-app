import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { setDoc,  doc} from "firebase/firestore"


export default function Signup() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const firmNameRef = useRef()
    const firmCodeRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const randomNumber = Math.floor(Math.random() * 1000001);

    async function handleSubmit(e) {
        e.preventDefault()
    
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError("Passwords do not match")
        }
        
        try {
          
          setError("")
          setLoading(true)
          await signup(emailRef.current.value, passwordRef.current.value).then((cred) => {
            return setDoc(doc(db, "firm/" + randomNumber + "/admin", cred.user.uid), {
              firstname: firstNameRef.current.value,
              lastname: lastNameRef.current.value,
              email: emailRef.current.value,
            });
          })
          alert("Your firm number is: " + randomNumber)      
        } catch(e) {
          setError(e)
         }
       
    
        setLoading(false)
      }
    async function setFirmName() {
      console.log(firmCodeRef.current.value)
      try {
        await setDoc(doc(db, "firm/", firmCodeRef.current.value), {
          name: firmNameRef.current.value
        })
        navigate("/login-admin")
      } catch {
        console.error(error)
       }
      
    }

  return (
    <>
        <Card>
            <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group id="firstname">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="firstname" ref={firstNameRef} required />
                </Form.Group>
                <Form.Group id="lastname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="lastname" ref={lastNameRef} required />
                </Form.Group>
                <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password">
                <Form.Label>Password</Form.Label> 
                <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required />
                </Form.Group>
                <Form.Group id="firmname">
                <Form.Label>Firm Name</Form.Label>
                <Form.Control type="text" ref={firmNameRef}  />
                </Form.Group>
                <Form.Group id="firmcode">
                <Form.Label>Firm Code</Form.Label>
                <Form.Control type="text" ref={firmCodeRef}  />
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-4" type="submit">
                Sign Up
                </Button>
                <Button className="w-100 mt-4" onClick={setFirmName}>
                SET FIRM NAME
                </Button>
            </Form>
        </Card.Body>
         </Card>
        <div className='w-100 text-center mt-2'>
            Already have an account? <Link to="/login-admin">Log In</Link>
        </div>
    </>
  )
}
