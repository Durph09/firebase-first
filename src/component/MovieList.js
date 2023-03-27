import { Auth } from "./auth";
import { db, auth, storage } from "../config/firebase";
import { useState, useEffect } from "react";
import { async } from "@firebase/util";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";

const MovieList = () => {
  const [movieList, setMovieList] = useState([]);
  const moviesCollectionRef = collection(db, "movies"); // movies is a name of collection or key

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setNIsNewMovieOscar] = useState(false);

  //file upload state
  const [fileUpload, setFileUpload] = useState(null);

  // update title state
  const [updateTitle, setUpdateTitle] = useState("");

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);

    await deleteDoc(movieDoc);
    getMovieList();
  };

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);

    await updateDoc(movieDoc, { title: updateTitle });
    getMovieList();
  };

  const getMovieList = async () => {
    // READ THE DATA
    // SET THE MOVIE LIST
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })); // filters data
      console.log(filteredData);
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userID: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <Form.Control
            placeholder="Movie title..."
            onChange={(e) => setNewMovieTitle(e.target.value)}
          />
        </Col>

        <Col>
          <Form.Control
            placeholder="Release date..."
            type="number"
            onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          />
        </Col>

        <Col>
          <Form.Check
            type="checkbox"
            onChange={(e) => setNIsNewMovieOscar(e.target.checked)}
            checked={isNewMovieOscar}
            label="Recieved an Oscar"
          />
        </Col>
        <Col>
          <Button onClick={onSubmitMovie}>Submit Movie</Button>
        </Col>
      </Row>

      <Container>
        {movieList.map((movie) => (
          <Container className="my-5">
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <Button onClick={() => deleteMovie(movie.id)}>Delete Movie</Button>

            <input
              placeholder="new title..."
              onChange={(e) => setUpdateTitle(e.target.value)}
            />
            <Button onClick={() => updateMovieTitle(movie.id)}>
              Update Title
            </Button>
          </Container>
        ))}
      </Container>
    </Container>
  );
};

export default MovieList;
