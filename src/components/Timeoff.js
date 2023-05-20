import React, { useState, useEffect } from "react";
import { Button, Table, Tabs, Tab } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

import { db } from "../firebase";
import {
  getDocs,
  doc,
  setDoc,
  query,
  collection,
  where,
} from "firebase/firestore";

export default function Timeoff() {
  const [requests, setRequests] = useState([]);
  const { currentFirm } = useAuth();

  useEffect(() => {
    const getRequests = async () => {
      try {
        const q = query(
          collection(db, "requests"),
          where("firm_id", "==", currentFirm)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const data = doc.data();
          setRequests((prevState) => [
            ...prevState,
            {
              uid: doc.id,
              type: data.type,
              user: data.user,
              from: data.from,
              until: data.until,
              notes: data.notes,
              status: data.status,
            },
          ]);
        });
      } catch (error) {
        console.error(error);
      }
    };

    getRequests();
  }, [currentFirm]);

  const acceptRequest = async (id) => {
    try {
      await setDoc(
        doc(db, "requests", id),
        {
          status: "Accepted",
        },
        { merge: true }
      );
      const updatedRequests = requests.map((request) => {
        if (request.uid === id) {
          return { ...request, status: "Accepted" };
        } else {
          return request;
        }
      });
      setRequests(updatedRequests);
    } catch (error) {
      console.error(error);
    }
  };
  const declineRequest = async (id) => {
    try {
      await setDoc(
        doc(db, "requests", id),
        {
          status: "Declined",
        },
        { merge: true }
      );
      const updatedRequests = requests.map((request) => {
        if (request.uid === id) {
          return { ...request, status: "Declined" };
        } else {
          return request;
        }
      });
      setRequests(updatedRequests);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Tabs
        defaultActiveKey="pending"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="pending" title="Pending Requests">
          <Table striped bordered hover size="lg">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Notes</th>
                <th>Date</th>
                <th>Hours/h</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, i) => {
                return (
                  request.status === "Requested" && (
                    <tr key={i}>
                      <td>{request.user + " "}</td>
                      <td>{request.status}</td>
                      <td>{request.type}</td>
                      <td>{request.notes}</td>
                      <td>{request.from + " - " + request.until}</td>
                      <td></td>
                      <td>
                        <Button
                          variant="success"
                          onClick={() => {
                            acceptRequest(request.uid);
                          }}
                        >
                          Y
                        </Button>{" "}
                        <Button
                          variant="danger"
                          onClick={() => {
                            declineRequest(request.uid);
                          }}
                        >
                          X
                        </Button>
                      </td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="accepted" title="Accepted requests">
          <Table striped bordered hover size="lg">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Notes</th>
                <th>Date</th>
                <th>Hours/h</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, i) => {
                return (
                  request.status === "Accepted" && (
                    <tr key={i}>
                      <td>{request.user + " "}</td>
                      <td>{request.status}</td>
                      <td>{request.type}</td>
                      <td>{request.notes}</td>
                      <td>{request.from + " - " + request.until}</td>
                      <td></td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="terminated" title="Terminated requests">
          <Table striped bordered hover size="lg">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Notes</th>
                <th>Date</th>
                <th>Hours/h</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, i) => {
                return (
                  request.status === "Declined" && (
                    <tr key={i}>
                      <td>{request.user + " "}</td>
                      <td>{request.status}</td>
                      <td>{request.type}</td>
                      <td>{request.notes}</td>
                      <td>{request.from + " - " + request.until}</td>
                      <td></td>
                    </tr>
                  )
                );
              })}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </>
  );
}
