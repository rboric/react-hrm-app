import React, { useState, useRef, useEffect } from "react";
import { getDoc, doc, setDoc, addDoc, collection } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase";
import { Button, Form, Col, Row, Card } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import TimeoffRequest from "../components/TimeoffRequest";
import PayrollCard from "../components/PayrollCard";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const { currentUser, currentFirm } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [userData, setUserData] = useState([]);
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const addressRef = useRef();
  const nationalityRef = useRef();
  const educationRef = useRef();
  const employmentStartDateRef = useRef();
  const phoneNumberRef = useRef();
  const preferredLanguageRef = useRef();
  const communicationPreferenceRef = useRef();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      const docRef = doc(db, "user", currentUser.uid);
      const userDoc = await getDoc(docRef);
      setUserData(userDoc.data());
    };

    getUsers();
    // eslint-disable-next-line
  }, [currentFirm]);

  const changeCredentials = async (user_id) => {
    try {
      setLoading(true);
      await setDoc(
        doc(db, "user", user_id),
        {
          firstname: firstNameRef.current.value,
          lastname: lastNameRef.current.value,
          address: addressRef.current.value,
          nationality: nationalityRef.current.value,
          education: educationRef.current.value,
          gender: userData.gender,
          employment_start: employmentStartDateRef.current.value,
          phone_number: phoneNumberRef.current.value,
          preferred_language: preferredLanguageRef.current.value,
          communication_preference: communicationPreferenceRef.current.value,
        },
        { merge: true }
      );
      toast.success("Credentials changed successfully!");
    } catch (e) {
      toast.error("Unknown error.");
    }
    setLoading(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setUploadedFile(file); // Set the file object in state
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setUploadedFile(file); // Set the file object in state
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file) => {
    try {
      // Create a storage reference
      const storage = getStorage();
      const storageRef = ref(storage, "files/" + file.name);

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Get the download URL of the uploaded file
      const downloadURL = await getDownloadURL(storageRef);

      // Store the download URL in Firestore or perform any other necessary operations
      // For example, you can create a Firestore document and store the download URL:
      const fileData = {
        user_id: currentUser.uid,
        name: file.name,
        url: downloadURL,
        createdAt: new Date(),
        firm_id: currentFirm,
      };

      await setDoc(
        doc(db, "user", currentUser.uid),
        {
          profilePic: downloadURL,
        },
        { merge: true }
      );
      await addDoc(collection(db, "files"), fileData);

      toast.success("Profile picture changed successfully.");
    } catch (error) {
      toast.error("Error uploading file: Unknown error");
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`profile-image-uploader ${dragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Card className="profile-image-card">
          <Card.Body className="profile-image-card-body">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="preview-image"
              />
            ) : (
              <div className="profile-drag-drop-area">
                <p>Drag and drop an image here</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
      <div style={{ textAlign: "center" }}>
        {" "}
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleFileInputChange}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <Button
          onClick={() => {
            uploadFile(uploadedFile);
          }}
        >
          Upload
        </Button>
      </div>
      <Row className="profile-container">
        <Col md={8}>
          <div className="profile-form-container">
            <h2 className="profile-heading">Profile</h2>
            <Form className="profile-form">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  disabled
                  type="email"
                  placeholder={currentUser.email}
                />
              </Form.Group>
              <Form.Group controlId="formFirstName">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  ref={firstNameRef}
                  defaultValue={userData.firstname}
                />
              </Form.Group>
              <Form.Group controlId="formLastName">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  ref={lastNameRef}
                  defaultValue={userData.lastname}
                />
              </Form.Group>
              <Form.Group controlId="formGender">
                <Form.Label>Gender</Form.Label>
                <div className="gender-radio-group">
                  <Form.Check
                    label="Male"
                    name="group1"
                    type="radio"
                    value="Male"
                    onChange={(e) => (userData.gender = e.target.value)}
                  />
                  <Form.Check
                    label="Female"
                    name="group1"
                    type="radio"
                    value="Female"
                    onChange={(e) => (userData.gender = e.target.value)}
                  />
                </div>
              </Form.Group>
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  ref={addressRef}
                  defaultValue={userData.address}
                  placeholder="Address.."
                />
              </Form.Group>
              <Form.Group controlId="formNationality">
                <Form.Label>Nationality</Form.Label>
                <Form.Control
                  type="text"
                  ref={nationalityRef}
                  defaultValue={userData.nationality}
                  placeholder="Nationality..."
                />
              </Form.Group>
              <Form.Group controlId="formEducation">
                <Form.Label>Education</Form.Label>
                <Form.Control
                  type="text"
                  ref={educationRef}
                  defaultValue={userData.education}
                  placeholder="Education..."
                />
              </Form.Group>
              <Form.Group controlId="formEmploymentStartDate">
                <Form.Label>Employment start date</Form.Label>
                <Form.Control
                  type="date"
                  ref={employmentStartDateRef}
                  defaultValue={userData.employment_start}
                />
              </Form.Group>
              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone number</Form.Label>
                <Form.Control
                  type="text"
                  ref={phoneNumberRef}
                  defaultValue={userData.phone_number}
                />
              </Form.Group>
              <Form.Group controlId="formPreferredLanguage">
                <Form.Label>Preferred language</Form.Label>
                <Form.Control
                  type="text"
                  ref={preferredLanguageRef}
                  defaultValue={userData.preferred_language}
                />
              </Form.Group>
              <Form.Group controlId="formCommunicationPreference">
                <Form.Label>
                  Communication Preference
                  <small className="text-muted">
                    <i>
                      &nbsp;(E-mail, phone, sms or text messages, in-person
                      meetings, etc..)
                    </i>
                  </small>
                </Form.Label>
                <Form.Control
                  type="text"
                  ref={communicationPreferenceRef}
                  defaultValue={userData.communication_preference}
                />
              </Form.Group>
              <Button
                onClick={() => {
                  changeCredentials(currentUser.uid);
                }}
                disabled={loading}
                variant="primary"
                className="profile-submit-button"
              >
                Save
              </Button>
            </Form>
            <h2 className="profile-heading">Time Off Request</h2>
            <TimeoffRequest />
          </div>
        </Col>
        <Col md={4}>
          <div className="payroll-container">
            <h2 className="profile-heading">Payroll</h2>
            <PayrollCard />
          </div>
        </Col>
      </Row>
    </>
  );
}
