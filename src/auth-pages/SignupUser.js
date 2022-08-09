import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { db } from "../firebase"
import { setDoc,  doc, getDocs, collection} from "firebase/firestore"


export default function SignupUser() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const firstNameRef = useRef()
    const lastNameRef = useRef()
    const firmCodeRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [firms, setFirms] = useState([])
    
    const getFirms = async () => {
        if(firmCodeRef.current.value.length === 6) {
                setLoading(false)
                const querySnapshot = await getDocs(collection(db, "firm"));
                querySnapshot.forEach((doc) => {
                setFirms(prevState => [...prevState, doc.id],
                );
            })
        } else {
            setLoading(true)
        }
        
    };

    async function handleSubmit(e) {
        e.preventDefault()
    
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
          return setError("Passwords do not match")
        }     
        if(firms.includes(firmCodeRef.current.value)) {
            try {
                setError("")
                setLoading(true)
                await signup(emailRef.current.value, passwordRef.current.value).then((cred) => {
                  if(firmCodeRef.current.value)
                  setDoc(doc(db, "firm/" + firmCodeRef.current.value + "/user", cred.user.uid), {
                    firstname: firstNameRef.current.value,
                    lastname: lastNameRef.current.value,
                    email: emailRef.current.value,             
                  });
                  alert("Succesfully registered!")
                  navigate("/user-dashboard")
                })   
               } catch(e) {
                 setError(e)
               }
            } else {
                alert("Firm doesn't exist")
            }
        setLoading(false)
      }

  return (
    <>
        <Card>
            <Card.Body>
            <h2 className="text-center mb-4">Sign Up User</h2>
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
                <Form.Group id="firmcode">
                <Form.Label>Firm Code</Form.Label>
                <Form.Control type="text" ref={firmCodeRef}  onChange={getFirms}/>
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-4" type="submit">
                Sign Up
                </Button>
            </Form>
        </Card.Body>
         </Card>
        <div className='w-100 text-center mt-2'>
            Already have an account? <Link to="/login">Log In</Link>
        </div>
    </>
  )
}
