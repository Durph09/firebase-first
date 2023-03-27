import { auth, googleProvider } from "../config/firebase";
//auth also gets current user
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { Container } from "react-bootstrap";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  console.log(auth?.currentUser?.email);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setShow(false);
    } catch (err) {
      console.error(err);
      setShow(true);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    console.log("logged out" + auth.currentUser.email);
  };

  if (user) {
    return (
      <Container className="d-flex align-items-center">
        <p>Welcome, {user.email}!</p>
        <Button onClick={logout} className="m-2">
          Log Out
        </Button>
      </Container>
    );
  } else {
    return (
      <Form className="m-2 p-3 border">
        <Row>
          <Col>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              className="m-2"
            />
          </Col>
          <Col>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="m-2"
            />
          </Col>
        </Row>
        <Alert show={show} variant="danger">
          <p>username already in use</p>
        </Alert>
        <Row>
          <Col className="d-flex">
            <Button onClick={signIn} className="m-2">
              Sign In
            </Button>
            <Button onClick={signInWithGoogle} className="m-2">
              Sign In With Google
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
};
