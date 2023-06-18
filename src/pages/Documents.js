import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Button } from "react-bootstrap";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import documentDownload from "../assets/document-download.png";

export default function Documents() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { currentFirm } = useAuth();
  const [documents, setDocuments] = useState([]);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
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
        name: file.name,
        url: downloadURL,
        createdAt: new Date(),
        fileType: "document",
        firm_id: currentFirm,
      };

      await addDoc(collection(db, "files"), fileData);

      toast.success("File uploaded and stored successfully.");
    } catch (error) {
      toast.error("Error uploading file: ", error);
    }
  };

  useEffect(() => {
    const getDocuments = async () => {
      const q = query(
        collection(db, "files"),
        where("firm_id", "==", parseInt(currentFirm)),
        where("fileType", "==", "document")
      );
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        setDocuments((prevState) => [
          ...prevState,
          {
            id: doc.id,
            createdAt: data.createdAt,
            fileType: data.fileType,
            name: data.name,
            url: data.url,
          },
        ]);
      });
    };

    getDocuments();

    // eslint-disable-next-line
  }, [currentFirm]);

  return (
    <>
      <div
        className={`image-uploader ${dragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ToastContainer />
        <Card className="image-card">
          <Card.Body className="image-card-body">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Preview"
                className="preview-image"
              />
            ) : (
              <div className="drag-drop-area">
                <p>Drag and drop an image here</p>
                <p>or</p>
              </div>
            )}
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </Card.Body>
        </Card>
      </div>
      <div className="documents-button">
        <Button
          onClick={() => {
            uploadFile(uploadedFile);
            setUploadedFile(null);
            setSelectedImage(null);
          }}
          disabled={!uploadedFile} // Disable the button when no file is selected
        >
          Upload
        </Button>
      </div>
      <div className="card-container">
        {documents.map((doc, i) => (
          <div key={i} className="card-wrapper">
            <Card className="card">
              <Card.Body className="documents-card-body">
                <Card.Title className="card-title">{doc.name}</Card.Title>
                <a href={doc.url} download className="card-link">
                  <img
                    src={documentDownload}
                    alt={doc.name}
                    className="card-image"
                  />
                </a>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
