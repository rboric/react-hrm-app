import React, {useState, useRef} from "react"
import { Card, Button, Modal, Form } from "react-bootstrap"

export default function Tasks({ loading, taskData, deleteTask, updateTask }) { 
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState([])
    const taskTitleRef = useRef()
    const taskDescriptionRef = useRef()
    const taskRequirementsRef = useRef()

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            {taskData.map((el, i) => {
                    return (
                        <Card key={i} className="mt-4 mb-4 w-100">
                        <Card.Header className="bg-main text-white"><Card.Title className="mt-2">{el.task_title}</Card.Title></Card.Header>
                            <Card.Body className="">
                              <Card.Text>{el.task_description}</Card.Text>
                              <Card.Text>Requirements:
                              {" " + el.task_requirements}
                              </Card.Text>
                              {/* Assigned Users: 
                              <ul>
                              {" " + el.task_assignedUsers.map((user) => {
                                return(
                                  " " + user.email
                                )
                              })}
                              </ul> */}
                            </Card.Body>
                            <Button disabled={loading} onClick={() => {
                              deleteTask(el.task_uid)
                            }} className="mx-auto w-25 mb-2 btn-main btn-rounded">Delete Task</Button>
                            <Button className="mx-auto w-25 mb-2 btn-main btn-rounded" onClick={() => {
                                handleShow();
                                setModalData(el);
                            }}>Update Task</Button>
                            <Modal show={show} onHide={handleClose} animation={false} key={i}>
                                <Modal.Header closeButton>
                                <Modal.Title>{modalData.task_title}</Modal.Title>
                                </Modal.Header>
                                <Form>
                                    <Form.Group className="mb-3 w-100" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Task Title</Form.Label>
                                    <Form.Control
                                        defaultValue={modalData.task_title}
                                        autoFocus
                                        ref={taskTitleRef}
                                    />
                                    </Form.Group>
                                    <Form.Group
                                    className="mb-3"
                                    >
                                    <Form.Label>Task Description</Form.Label>
                                    <Form.Control as="textarea" rows={3} defaultValue={modalData.task_description} ref={taskDescriptionRef}/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 w-100" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Task Requirements</Form.Label>
                                    <Form.Control
                                        ref={taskRequirementsRef}
                                        defaultValue={modalData.task_requirements}
                                        autoFocus
                                    />
                                    </Form.Group>
                                    {/* <Form.Group className="mb-3 w-100" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Assigned Users</Form.Label>
                                    <Form.Control
                                        ref={taskRequirementsRef}
                                        defaultValue={modalData.task_assignedUsers[0].email}
                                        autoFocus
                                    />
                                    </Form.Group> */}
                                </Form>
                                <Modal.Footer>
                                <Button variant="secondary" onClick={(handleClose)}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={() => {
                                    handleClose();
                                    updateTask(modalData.task_uid, taskTitleRef.current.value, taskDescriptionRef.current.value, taskRequirementsRef.current.value)
                                }}>
                                    Save Changes
                                </Button>
                                </Modal.Footer>
                            </Modal>
                        </Card>)   
                    })
                }           
        </div>
    )
}