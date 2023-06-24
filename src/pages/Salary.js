import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Timeline from "../components/Timeline";
import Payroll from "../components/Payroll";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Salary() {
  const currentDate = new Date();
  const formattedDateTime = currentDate.toLocaleString();

  const [show, setShow] = useState(false);
  const [showPayroll, setShowPayroll] = useState(false);
  const [showOvertimeInfo, setShowOvertimeInfo] = useState(false);
  const [showBonusInfo, setShowBonusInfo] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [users, setUsers] = useState([]);
  const { currentUser, currentFirm, admin } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userSalaryRef = useRef();
  const userHoursRef = useRef();
  const payrollTypeRef = useRef();
  const [totalValue, setTotalValue] = useState(0); // Add state for the total value

  const payrollUserSalaryRef = useRef(null);
  const payrollUserHoursRef = useRef(null);
  const payrollUserOvertimeSalaryRef = useRef(null);
  const payrollUserOveritimeHoursRef = useRef(null);
  const payrollUserBonusRef = useRef(null);
  const payrollNextDateRef = useRef(null);

  const [showSalaryInput, setShowSalaryInput] = useState();
  let counter = 0;

  const handleShow = () => setShow(!show);
  const handleShowPayroll = () => setShowPayroll(!showPayroll);

  const createTimeline = async (action, user) => {
    const userRef = doc(db, "user", currentUser.uid);
    const userDoc = await getDoc(userRef);
    try {
      if (action === "change") {
        await addDoc(collection(db, "timeline"), {
          firm_id: currentFirm,
          msg: `${
            userDoc.data().firstname + " " + userDoc.data().lastname
          } has changed pay details for ${user}.`,
          type: "Overview",
          timestamp: formattedDateTime,
        });
      }
      if (action === "createPayroll") {
        await addDoc(collection(db, "timeline"), {
          firm_id: currentFirm,
          msg: `${
            userDoc.data().firstname + " " + userDoc.data().lastname
          } has created payroll for ${user}.`,
          type: "Overview",
          timestamp: formattedDateTime,
        });
      }
      if (action === "deletePayroll") {
        await addDoc(collection(db, "timeline"), {
          firm_id: currentFirm,
          msg: `${
            userDoc.data().firstname + " " + userDoc.data().lastname
          } has deleted payroll for ${user}.`,
          type: "Overview",
          timestamp: formattedDateTime,
        });
      }
      if (action === "submittedPayroll") {
        await addDoc(collection(db, "timeline"), {
          firm_id: currentFirm,
          msg: `${
            userDoc.data().firstname + " " + userDoc.data().lastname
          } has submitted payroll for ${user}.`,
          type: "Overview",
          timestamp: formattedDateTime,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUser = async (id, salary, hours, payrollType, user) => {
    try {
      setLoading(true);
      if (payrollType === "Hourly") {
        await updateDoc(doc(db, "user", id), {
          salary: salary,
          hours: hours,
          payroll: payrollType,
        });
      }

      if (payrollType === "Fixed") {
        await updateDoc(doc(db, "user", id), {
          salary: salary,
          hours: hours,
          payroll: payrollType,
        });
      }
      toast.success("Successfully changed salary!");
      await createTimeline("change", user);
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (error) {
      toast.error("Unknown error: Change salary action.");
      console.error(error);
    }
    setLoading(false);
  };

  const createPayroll = async (uid, user) => {
    try {
      setLoading(true);
      const overtimeHours =
        showOvertimeInfo && payrollUserOveritimeHoursRef.current
          ? payrollUserOveritimeHoursRef.current.value
          : 0;
      const overtimeSalary =
        showOvertimeInfo && payrollUserOvertimeSalaryRef.current
          ? payrollUserOvertimeSalaryRef.current.value
          : 0;

      const bonusSalary =
        showBonusInfo && payrollUserBonusRef.current
          ? payrollUserBonusRef.current.value
          : 0;

      await addDoc(collection(db, "payroll"), {
        firm_id: currentFirm,
        user_id: uid,
        date: payrollNextDateRef.current.value,
        salary: payrollUserSalaryRef.current.value,
        hours: payrollUserHoursRef.current.value,
        overtime_salary: overtimeSalary,
        overtime_hours: overtimeHours,
        total:
          payrollUserSalaryRef.current.value *
            payrollUserHoursRef.current.value +
          overtimeSalary * overtimeHours +
          parseInt(bonusSalary),
        status: "active",
        bonus: bonusSalary,
      });
      await setDoc(
        doc(db, "user", uid),
        {
          payrollActive: true,
        },
        { merge: true }
      );
      await createTimeline("createPayroll", user);
      navigate(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getUsers() {
      const docRef = collection(db, "user");
      const currentFirmQuery = query(
        docRef,
        where("firm_id", "==", currentFirm)
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
          },
        ]);
      });
    }

    getUsers();
    // eslint-disable-next-line
  }, [currentFirm]);

  const calculateTotal = () => {
    const hours = payrollUserHoursRef.current.value || 0;
    const salary = payrollUserSalaryRef.current.value || 0;
    const overtimeHours =
      showOvertimeInfo && payrollUserOveritimeHoursRef.current
        ? payrollUserOveritimeHoursRef.current.value || 0
        : 0;
    const overtimeSalary =
      showOvertimeInfo && payrollUserOvertimeSalaryRef.current
        ? payrollUserOvertimeSalaryRef.current.value || 0
        : 0;
    const bonusSalary =
      showBonusInfo && payrollUserBonusRef.current
        ? payrollUserBonusRef.current.value || 0
        : 0;

    const total =
      salary * hours + overtimeSalary * overtimeHours + parseInt(bonusSalary);
    setTotalValue(total);
  };

  return (
    <div className="overview-container">
      <ToastContainer />
      <Table size="lg" responsive className="hrm-table">
        <thead>
          <tr>
            <th className="header-cell">#</th>
            <th className="header-cell">First Name</th>
            <th className="header-cell">Last Name</th>
            <th className="header-cell">E-mail</th>
            <th className="header-cell">Payroll type</th>
            <th className="header-cell">
              <span className="fixed-salary-text">Fixed salary</span> / Salary/h
            </th>
            <th className="header-cell">Hours/day</th>
            <th className="header-cell">Total per day</th>
            <th className="header-cell">Estimated Total Monthly</th>
            <th className="header-cell">Next payroll</th>
            {admin && <th>Edit</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => {
            return (
              <tr key={i}>
                <td>{(counter = counter + 1)}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.payroll}</td>
                <td style={{ textAlign: "center" }}>
                  {user.payroll === "Fixed" ? (
                    <span style={{ color: "rgb(70, 144, 255)" }}>
                      {user.salary + "$"}
                    </span>
                  ) : (
                    user.salary + "$/h"
                  )}
                </td>
                <td style={{ textAlign: "center" }}>{user.hours}</td>
                <td style={{ textAlign: "center" }}>
                  {user.payroll === "Fixed" ? (
                    <span style={{ color: "rgb(70, 144, 255)" }}>
                      {"~" + parseInt(user.salary / 23) + "$"}
                    </span>
                  ) : (
                    user.salary * user.hours + "$"
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  {" "}
                  {user.payroll === "Fixed"
                    ? "~" + user.salary
                    : "~" + 23 * (user.salary * user.hours)}
                  $
                </td>
                <td>
                  <Payroll
                    uid={user.id}
                    user={user}
                    createTimeline={createTimeline}
                  ></Payroll>
                </td>
                {admin && (
                  <td>
                    <div style={{ marginBottom: "10px" }}>
                      <Button
                        disabled={loading}
                        onClick={() => {
                          handleShow();
                          setModalData(user);
                        }}
                        style={{ width: "100%" }} // Set a fixed width for the button
                      >
                        Change Salary
                      </Button>
                    </div>
                    <div>
                      <Button
                        disabled={loading || user.payrollActive}
                        variant={user.payrollActive ? "secondary" : "primary"}
                        onClick={() => {
                          handleShowPayroll();
                          setModalData(user);
                        }}
                        style={{ width: "100%" }} // Set a fixed width for the button
                      >
                        Create Payroll
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
          <Modal show={show} onHide={handleShow} animation={false}>
            <Modal.Header closeButton onHide={() => setShowSalaryInput("")}>
              <Modal.Title>{modalData.firstname}</Modal.Title>
            </Modal.Header>
            <Form className="p-2">
              <Form.Group
                className="mb-3 w-100 col-md-12"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>First name</Form.Label>
                <Form.Control disabled defaultValue={modalData.firstname} />
                <Form.Label>Last name</Form.Label>
                <Form.Control disabled defaultValue={modalData.lastname} />
                <Form.Select
                  style={{ marginTop: "20px", marginBottom: "10px" }}
                  ref={payrollTypeRef}
                  onChange={() => {
                    setShowSalaryInput(payrollTypeRef.current.value);
                  }}
                >
                  <option hidden>Select the type of payroll</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Fixed">Fixed</option>
                </Form.Select>

                {showSalaryInput === "Hourly" && (
                  <>
                    <Form.Label>Salary /h</Form.Label>
                    <Form.Control
                      defaultValue={modalData.salary}
                      autoFocus
                      ref={userSalaryRef}
                    />
                    <Form.Label>Hours per day</Form.Label>
                    <Form.Control
                      defaultValue={modalData.hours}
                      ref={userHoursRef}
                    />
                  </>
                )}
                {showSalaryInput === "Fixed" && (
                  <>
                    <Form.Label>Set the fixed salary</Form.Label>
                    <Form.Control
                      defaultValue={modalData.salary}
                      autoFocus
                      ref={userSalaryRef}
                    />
                  </>
                )}
              </Form.Group>
            </Form>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  handleShow();
                  setShowSalaryInput("");
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={async () => {
                  handleShow();
                  const id = modalData.id;
                  const salary = userSalaryRef.current.value;
                  const hours =
                    showSalaryInput === "Hourly"
                      ? userHoursRef.current.value
                      : "";
                  const payrollType = payrollTypeRef.current.value;
                  await updateUser(
                    id,
                    salary,
                    hours,
                    payrollType,
                    modalData.firstname + " " + modalData.lastname
                  );
                }}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showPayroll}
            onHide={handleShowPayroll}
            animation={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Editing next payroll for {modalData.firstname}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Date of the next payroll</Form.Label>
                <Form.Control type="date" ref={payrollNextDateRef} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hours</Form.Label>
                <Form.Control
                  type="text"
                  ref={payrollUserHoursRef}
                  onChange={() => {
                    calculateTotal();
                  }}
                />
                <Form.Label>Salary</Form.Label>
                <Form.Control
                  type="text"
                  ref={payrollUserSalaryRef}
                  onChange={() => {
                    calculateTotal();
                  }}
                />
              </Form.Group>
              <Button
                onClick={() => {
                  setShowOvertimeInfo(!showOvertimeInfo);
                }}
              >
                Add overtime
              </Button>
              <div>
                {showOvertimeInfo && (
                  <Form.Group className="mb-3">
                    <Form.Label>Overtime hours</Form.Label>
                    <Form.Control
                      type="text"
                      ref={payrollUserOveritimeHoursRef}
                      onChange={() => {
                        calculateTotal();
                      }}
                    />
                    <Form.Label>Overtime salary</Form.Label>
                    <Form.Control
                      type="text"
                      ref={payrollUserOvertimeSalaryRef}
                      onChange={() => {
                        calculateTotal();
                      }}
                    />
                  </Form.Group>
                )}
              </div>
              <Form.Group>
                <Button
                  onClick={() => {
                    setShowBonusInfo(!showBonusInfo);
                  }}
                >
                  Add bonus
                </Button>
                <div>
                  {showBonusInfo && (
                    <Form.Group className="mb-3">
                      <Form.Label>Bonus</Form.Label>
                      <Form.Control
                        type="text"
                        ref={payrollUserBonusRef}
                        onChange={() => {
                          calculateTotal();
                        }}
                      />
                    </Form.Group>
                  )}
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  <b>Total: {totalValue}</b>
                </Form.Label>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleShowPayroll}>
                Close
              </Button>
              <Button
                disabled={loading}
                variant="primary"
                onClick={() =>
                  createPayroll(
                    modalData.id,
                    modalData.firstname + " " + modalData.lastname
                  )
                }
              >
                Submit Payroll
              </Button>
            </Modal.Footer>
          </Modal>
        </tbody>
      </Table>
      <Timeline type={"Overview"}></Timeline>
    </div>
  );
}
