import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Table } from "react-bootstrap";
import defaultAvatar from "../assets/default-avatar.png";

export default function WorkerList() {
  const [users, setUsers] = useState([]);
  const { currentFirm } = useAuth();

  useEffect(() => {
    async function getUsers() {
      const docRef = collection(db, "user");
      const currentFirmQuery = query(
        docRef,
        where("firm_id", "==", parseInt(currentFirm))
      );
      const querySnapshot = await getDocs(currentFirmQuery);
      querySnapshot.forEach((doc) => {
        const data = doc.data();

        setUsers((prevState) => [
          ...prevState,
          {
            id: doc.id,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            hours: data.hours,
            salary: data.salary,
            education: data.education,
            gender: data.gender,
            nationality: data.nationality,
            payroll: data.payroll,
            payrollActive: data.payrollActive,
            address: data.address,
            profilePic: data.profilePic,
            phone_number: data.phone_number,
            preferred_language: data.preferred_language,
            employment_start: data.employment_start,
            communication_preference: data.communication_preference,
          },
        ]);
      });
    }

    getUsers();
    // eslint-disable-next-line
  }, [currentFirm]);
  return (
    <>
      <Table responsive className="hrm-table">
        <thead>
          <tr>
            <th className="header-cell">#</th>
            <th className="header-cell">Name</th>
            <th className="header-cell">E-mail</th>
            <th className="header-cell">Gender</th>
            <th className="header-cell">Nationality</th>
            <th className="header-cell">Education</th>
            <th className="header-cell">Address</th>
            <th className="header-cell">Phone number</th>
            <th className="header-cell">Employment start date</th>
            <th className="header-cell">Preferred language</th>
            <th className="header-cell">Communication preference</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => {
            const options = {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            };
            const employmentStartDate = new Date(user.employment_start);
            const formattedStartDate = employmentStartDate.toLocaleDateString(
              "en-GB",
              options
            );

            return (
              <tr key={i}>
                <td>
                  <img
                    className="profile-pic"
                    src={user.profilePic ? user.profilePic : defaultAvatar}
                    alt="pp"
                  />
                </td>
                <td>{user.firstname + " " + user.lastname}</td>
                <td>{user.email}</td>
                <td>
                  {user.gender === "Male"
                    ? "M"
                    : user.gender === "Female"
                    ? "F"
                    : "Other"}
                </td>
                <td>{user.nationality}</td>
                <td>{user.education}</td>
                <td>{user.address}</td>
                <td>{user.phone_number}</td>
                <td>{user.employment_start ? formattedStartDate : ""}</td>
                <td>{user.preferred_language}</td>
                <td>{user.communication_preference}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
