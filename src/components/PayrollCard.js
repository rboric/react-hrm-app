import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { collection, getDocs, query, where } from "firebase/firestore";

import { Card } from "react-bootstrap";

export default function PayrollCard() {
  const { currentUser, currentFirm } = useAuth();
  const [payroll, setPayroll] = useState([]);

  useEffect(() => {
    async function getPayrolls() {
      const docRef = collection(db, "payroll");
      const payrollQuery = query(
        docRef,
        where("user_id", "==", currentUser.uid),
        where("firm_id", "==", currentFirm),
        where("status", "==", false)
      );
      const querySnapshot = await getDocs(payrollQuery);
      const payrollData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const formattedDate = new Date(data.date).toLocaleDateString("en-GB");
        return {
          id: doc.id,
          firm_id: data.firm_id,
          date: formattedDate,
          hours: data.hours,
          salary: data.salary,
          overtime_hours: data.overtime_hours,
          overtime_salary: data.overtime_salary,
          total: data.total,
          user_id: data.user_id,
          status: data.status,
        };
      });
      console.log(payrollData);
      setPayroll(payrollData);
    }

    getPayrolls();
  }, [currentFirm, currentUser.uid]);
  return (
    <>
      {payroll.map((pay, i) => {
        return (
          <Card key={i} className="payroll-card">
            <Card.Header>Payroll information for {pay.date}</Card.Header>
            <Card.Body>
              <Card.Title>Total: {pay.total}$</Card.Title>
              <Card.Text>Hours: {pay.hours}</Card.Text>
              <Card.Text>Salary: {pay.salary}</Card.Text>
              <Card.Text>Overtime hours: {pay.overtime_hours}</Card.Text>
              <Card.Text>Overtime salary: {pay.overtime_salary}</Card.Text>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
}
