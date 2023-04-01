import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, ListGroup } from "react-bootstrap";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

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
            requirements: data.requirements,
            assignedUsers: data.assignedUsers,
            importance: data.importance,
            archive: data.archive,
          },
        ]);
      });
    };

    getTaskData();
  }, [currentFirm]);

  return (
    <>
      <div className="d-flex flex-wrap">
        {taskData.map((el, i) => {
          return (
            el.archive && (
              <div key={i} className="col-md-6">
                <Card>
                  <Card.Header>
                    <Card.Title>{el.title}</Card.Title>
                  </Card.Header>
                  <Card.Body className="archive">
                    <Card.Text>{el.description}</Card.Text>
                    <Card.Text>
                      Requirements:
                      {" " + el.requirements}
                    </Card.Text>
                    Assigned Users:
                    <ListGroup>
                      {el.assignedUsers.map((assignedUser, id) => {
                        return (
                          <ListGroup.Item key={id}>
                            {assignedUser.email +
                              " " +
                              assignedUser.firstname +
                              " " +
                              assignedUser.lastname}
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
            )
          );
        })}
      </div>
    </>
  );
}
