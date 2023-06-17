import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, Button } from "react-bootstrap";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function Documents() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

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
      (file.type.startsWith("image/") ||
        file.type === "application/pdf" ||
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
      };

      await addDoc(collection(db, "files"), fileData);

      toast.success("File uploaded and stored successfully.");
    } catch (error) {
      toast.error("Error uploading file: ", error);
    }
  };

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
        <div>
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
      </div>
    </>
  );
}
