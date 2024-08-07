import { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import SearchIcon from './search.svg';
import './App.css';

const API_URL = `https://www.omdbapi.com/?apikey=52495d01`;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const searchMovies = async (title, pageNumber) => {
    const response = await fetch(`${API_URL}&s=${title}&page=${pageNumber}`);
    const data = await response.json();

    if (data.Search) {
      setMovies(prevMovies => pageNumber === 1 ? data.Search : [...prevMovies, ...data.Search]);
      setTotalResults(parseInt(data.totalResults));
    }
  };

  useEffect(() => {
    searchMovies('Batman', 1);
  }, []);

  const handleSearch = () => {
    setPage(1);
    searchMovies(searchTerm, 1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchMovies(searchTerm || 'Batman', nextPage);
  };

  return (
    <div className='app'>
      <h1>StreamFlix</h1>

      <div className='search'>
        <input
          placeholder='Search for movies'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <img
          src={SearchIcon}
          alt='SearchIcon'
          onClick={handleSearch}
        />
      </div>

      {movies?.length > 0 ? (
        <div className='container'>
          {movies.map((movie, index) => (
            <MovieCard key={`${movie.imdbID}-${index}`} movie={movie} />
          ))}
        </div>
      ) : (
        <div className='empty'>
          <h2>No movies found</h2>
        </div>
      )}

      {movies.length > 0 && movies.length < totalResults && (
        <button className='load-more' onClick={loadMore}>Load More</button>
      )}
    </div>
  );
};

export default App;