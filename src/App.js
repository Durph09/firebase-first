import { Auth } from "./component/auth";
import Container from "react-bootstrap/Container";
import MovieList from "./component/MovieList";

function App() {
  return (
    <Container className="App">
      <Auth />
      <MovieList />
    </Container>
  );
}

export default App;
