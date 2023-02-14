import { Auth } from "./component/auth";
import {db, auth, storage} from './config/firebase'
import { useState, useEffect } from "react";
import { async } from "@firebase/util";
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);
  const moviesCollectionRef = collection(db,"movies")// movies is a name of collection or key
  
  const [newMovieTitle, setNewMovieTitle] = useState(""); 
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setNIsNewMovieOscar] = useState(false);

  //file upload state
  const [fileUpload, setFileUpload] = useState(null);
  
  // update title state
  const [updateTitle, setUpdateTitle]= useState("")
  
  

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id )
    
    await deleteDoc(movieDoc);
    getMovieList();
  }
  
  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id )
    
    await updateDoc(movieDoc, {title:updateTitle});
    getMovieList();
  }

const getMovieList = async () =>{
    // READ THE DATA
    // SET THE MOVIE LIST
    try{
    const data = await getDocs(moviesCollectionRef)
    const filteredData = data.docs.map((doc) => ({...doc.data(), id:doc.id,})) // filters data
    console.log(filteredData);
    setMovieList(filteredData);
    } catch(err) {
      console.error(err)
    }
  };
  useEffect(() =>{
  getMovieList(); 
  }, [])

  

  
  const onSubmitMovie = async ()=> {
    try {
    await addDoc(moviesCollectionRef, {title: newMovieTitle, 
      releaseDate: newReleaseDate, 
      receivedAnOscar: isNewMovieOscar,
      userID:auth?.currentUser?.uid,})
    getMovieList();
  } catch (err) {
        console.error(err)
      }
  }

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try{
    await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }


  }
  


  return (
    <div className="App" style={{display:'flex', justifyContent:'center'}}>
     <Auth />
     <div>
      <input placeholder="Movie title..." onChange={(e) => setNewMovieTitle(e.target.value)}/>
      <input placeholder="Release date..." type="number" onChange={(e)=> setNewReleaseDate(Number(e.target.value))} />
      <input type="checkbox" onChange={(e) =>setNIsNewMovieOscar(e.target.checked) } checked={isNewMovieOscar} />
      <label>Recieved an Oscar</label>
      <button onClick={onSubmitMovie}>Submit Movie</button>
     </div>
     <div>{movieList.map((movie) => (
      <div>
        <h1 style={{color: movie.receivedAnOscar ? "green" : 'red'}}>{movie.title}</h1>
        <p>Date: {movie.releaseDate}</p>
        <button onClick={()=> deleteMovie(movie.id)}>Delete Movie</button>

        <input placeholder="new title..." onChange={(e) => setUpdateTitle(e.target.value)}  />
        <button onClick={() => updateMovieTitle(movie.id)}>Update Title</button>
      </div>
     ))}
    </div>

    <div>
      <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
      <button onClick={uploadFile}>Upload File</button>
    </div>
    </div>
  );
}

export default App;
