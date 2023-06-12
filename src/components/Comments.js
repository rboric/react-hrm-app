import React, { useState, useRef } from "react";
import { Button, ListGroup, Form, InputGroup, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";

export default function Comments({ el, createTimeline, showComments }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState(el.comments);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const commentRef = useRef();

  const addCommentInput = async () => {
    setShow(!show);
  };

  const createComment = async (id, commentRef) => {
    try {
      setLoading(true);
      const taskRef = doc(db, "tasks", id);
      const taskDoc = await getDoc(taskRef);
      const userRef = doc(db, "user", currentUser.uid);
      const userDoc = await getDoc(userRef);
      const comments = taskDoc.data().comments || [];
      const newComments2 = {
        comment: commentRef,
        user: userDoc.data().firstname + " " + userDoc.data().lastname,
      };
      const newComments = [...comments, newComments2];
      await setDoc(
        taskRef,
        {
          comments: newComments,
        },
        {
          merge: true,
        }
      );
      setComments(newComments);
      await createTimeline("comment");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      {showComments && (
        <>
          <Button disabled={loading} onClick={addCommentInput}>
            Comment
          </Button>
          <ListGroup>
            {show && (
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                <Form.Control
                  required
                  ref={commentRef}
                  as="textarea"
                  rows={1}
                  placeholder="Comment.."
                />
                {show && (
                  <Button
                    disabled={loading}
                    onClick={() => {
                      createComment(el.uid, commentRef.current.value);
                      commentRef.current.value = "";
                    }}
                  >
                    &#8594;
                  </Button>
                )}
              </InputGroup>
            )}
          </ListGroup>
        </>
      )}
      {!showComments && <>Comments: </>}
      <ListGroup variant="flush">
        {comments.map((comment, id) => {
          return (
            <ListGroup.Item key={id}>
              <div className="ms-2 me-auto">
                <div>{comment.comment}</div>
              </div>
              <Badge bg="primary" pill>
                {comment.user}
              </Badge>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
}
