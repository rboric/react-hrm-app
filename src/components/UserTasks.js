import React, {useState, useRef} from "react"
import { Card, Button, Modal, Form } from "react-bootstrap"

export default function UserTasks({ loading, taskData, deleteTask, updateTask }) { 

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
                        </Card>)   
                    })
                }           
        </div>
    )
}