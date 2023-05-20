import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { MDBContainer } from "mdb-react-ui-kit";
import moment from "moment";

export default function Timeline({ type }) {
  const [timeline, setTimeline] = useState([]);
  const { currentFirm } = useAuth();

  const sortedTimeline = [...timeline].sort((a, b) => {
    const timestampA = moment(a.timestamp, "DD. MM. YYYY. HH:mm:ss");
    const timestampB = moment(b.timestamp, "DD. MM. YYYY. HH:mm:ss");

    return timestampB - timestampA; // Reverse the order of comparison
  });

  useEffect(() => {
    const getTimelines = async () => {
      const docRef = collection(db, "timeline");
      const q = query(docRef, where("firm_id", "==", parseInt(currentFirm)));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setTimeline((prevState) => [
          ...prevState,
          {
            msg: doc.data().msg,
            type: doc.data().type,
            timestamp: doc.data().timestamp,
          },
        ]);
      });
    };

    getTimelines();
  }, [currentFirm]);
  return (
    <>
      <MDBContainer className="py-5">
        <ul className="timeline">
          {sortedTimeline.map((t, id) => {
            if (type === "Task" && t.type === "Task") {
              return (
                <li key={id} className="timeline-item mb-5">
                  <p className="text-muted mb-2 fw-bold">
                    {t.type + " change."}
                  </p>
                  <p className="text-muted">{t.msg}</p>
                </li>
              );
            } else if (type === "Overview" && t.type === "Overview") {
              return (
                <li key={id} className="timeline-item mb-5">
                  <p className="text-muted mb-2 fw-bold">
                    {t.type + " change."}
                  </p>
                  <p className="text-muted">{t.msg}</p>
                </li>
              );
            }
            return null; // Skip rendering if type !== "Task"
          })}
        </ul>
      </MDBContainer>
    </>
  );
}
