import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Payroll({ uid, user, createTimeline }) {
  const [payroll, setPayroll] = useState([]);
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState({});
  const { currentFirm } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const currentDate = new Date();
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("en-GB", options);

  const handleShow = () => setShow(!show);
  const submitPayroll = async (id, user) => {
    try {
      setLoading(true);
      await setDoc(
        doc(db, "payroll", id),
        {
          status: false,
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "user", uid),
        {
          payrollActive: false,
        },
        { merge: true }
      );
      await createTimeline("submittedPayroll", user);
      navigate(0);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const deletePayroll = async (id, user) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "payroll", id));
      await setDoc(
        doc(db, "user", uid),
        {
          payrollActive: false,
        },
        { merge: true }
      );
      await createTimeline("deletePayroll", user);
      navigate(0);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function getPayrolls() {
      const docRef = collection(db, "payroll");
      const payrollQuery = query(
        docRef,
        where("user_id", "==", uid),
        where("firm_id", "==", currentFirm)
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
          bonus: data.bonus,
        };
      });
      setPayroll(payrollData);
    }

    getPayrolls();
  }, [currentFirm, uid]);

  return (
    <>
      {payroll.map(
        (pay, i) =>
          pay.status === "active" && (
            <b
              className="payroll-date"
              key={i}
              onClick={() => {
                handleShow();
                setModalData(pay);
              }}
            >
              {pay.date}
            </b>
          )
      )}
      <Modal show={show} onHide={handleShow} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            {"Payroll information for " + user.firstname + " " + user.lastname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="date">
              <Form.Label>Date:</Form.Label>
              <Form.Control type="text" readOnly value={modalData.date} />
            </Form.Group>
            <Form.Group controlId="hours">
              <Form.Label>Hours:</Form.Label>
              <Form.Control type="text" readOnly value={modalData.hours} />
            </Form.Group>
            <Form.Group controlId="salary">
              <Form.Label>Salary:</Form.Label>
              <Form.Control type="text" readOnly value={modalData.salary} />
            </Form.Group>
            <Form.Group controlId="overtime_hours">
              <Form.Label>Overtime Hours:</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={modalData.overtime_hours}
              />
            </Form.Group>
            <Form.Group controlId="overtime_salary">
              <Form.Label>Overtime Salary:</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={modalData.overtime_salary}
              />
            </Form.Group>
            <Form.Group controlId="overtime_salary">
              <Form.Label>Bonus:</Form.Label>
              <Form.Control type="text" readOnly value={modalData.bonus} />
            </Form.Group>
            <Form.Group controlId="total">
              <Form.Label>Total:</Form.Label>
              <Form.Control type="text" readOnly value={modalData.total} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button
            disabled={loading}
            variant="danger"
            onClick={() => {
              deletePayroll(modalData.id, user.firstname + " " + user.lastname);
            }}
          >
            Delete payroll
          </Button>

          <Button variant="secondary" onClick={handleShow}>
            Close window
          </Button>

          <Button
            variant="primary"
            className="ml-2"
            disabled={loading || formattedDate !== modalData.date}
            onClick={() => {
              submitPayroll(modalData.id, user.firstname + " " + user.lastname);
            }}
          >
            Submit Payroll
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
