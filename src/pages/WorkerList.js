import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Table } from "react-bootstrap";

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
          },
        ]);
      });
    }

    getUsers();
    // eslint-disable-next-line
  }, [currentFirm]);
  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>E-mail</th>
            <th>Gender</th>
            <th>Nationality</th>
            <th>Education</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => {
            return (
              <tr key={i}>
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
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
