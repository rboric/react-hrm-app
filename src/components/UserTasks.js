import React from "react";
import { Card } from "react-bootstrap";

export default function UserTasks({ taskData }) {
  const taskSorted = taskData.sort();

  return (
    <div className="d-flex flex-wrap">
      {taskSorted.map((el, i) => {
        return (
          <div key={i} className="col-md-6">
            <Card>
              <Card.Header className={el.task_importance}>
                <Card.Title className="mt-2">{el.task_title}</Card.Title>
              </Card.Header>
              <Card.Body className={el.task_importance}>
                <Card.Text>{el.task_description}</Card.Text>
                <Card.Text>
                  Requirements:
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
            </Card>
          </div>
        );
      })}
    </div>
  );
}
