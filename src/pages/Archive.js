import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, ListGroup } from "react-bootstrap";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Comments from "../components/Comments";

export default function Archive() {
  const { currentFirm } = useAuth();
  const [taskData, setTaskData] = useState([]);

  useEffect(() => {
    const getTaskData = async () => {
      const q = query(
        collection(db, "tasks"),
        where("firm_id", "==", parseInt(currentFirm))
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setTaskData((prevState) => [
          ...prevState,
          {
            uid: doc.id,
            title: data.title,
            description: data.description,
            assignedUsers: data.assignedUsers,
            importance: data.importance,
            archive: data.archive,
            comments: data.comments,
          },
        ]);
      });
    };

    getTaskData();
  }, [currentFirm]);

  const getImportanceIndicator = (importance) => {
    switch (importance) {
      case "high":
        return <span className="importance-indicator high">High</span>;
      case "medium":
        return <span className="importance-indicator medium">Medium</span>;
      case "low":
        return <span className="importance-indicator low">Low</span>;
      default:
        return null;
    }
  };

  return (
    <div className="tasks-container-archive">
      {taskData.map((task, i) => {
        const { uid, title, description, assignedUsers, importance } = task;
        return (
          task.archive && (
            <div key={i} className="task-card-archive">
              <Card>
                <Card.Header>
                  <div className="task-header">
                    <h5>{title}</h5>
                    {getImportanceIndicator(importance)}
                  </div>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{description}</Card.Text>
                  {task.assignedUsers.length > 0 && (
                    <div className="assigned-users">
                      <strong>Assigned Users:</strong>
                      <ListGroup variant="flush">
                        {assignedUsers.map((assignedUser, id) => (
                          <ListGroup.Item key={id}>
                            {`${assignedUser.email} ${assignedUser.firstname} ${assignedUser.lastname}`}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                  <Comments el={task} showComments={false} />
                </Card.Body>
              </Card>
            </div>
          )
        );
      })}
    </div>
  );
}
