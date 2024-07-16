import React, { useEffect, useState, useRef } from 'react';

function Home() {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const base = "https://playground.4geeks.com";

  useEffect(() => {
    fetch('https://playground.4geeks.com/sound/songs')
      .then((response) => response.json())
      .then((data) => {
        setSongs(data.songs);
      })
      .catch((error) => {
        console.error('Error fetching songs:', error);
      });
  }, []);

  const handleClick = (song, index) => {
    if (index !== currentSongIndex) {
      setCurrentSongIndex(index); // Set current song index
      audioRef.current.src = base + song.url; // Set audio source
      audioRef.current.play(); // Start playback
      setIsPlaying(true); // Update playing state
    } else {
      togglePlayPause(); // Toggle play/pause if clicking on the same song
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause(); // Pause playback
    } else {
      audioRef.current.play(); // Resume playback
    }
    setIsPlaying(!isPlaying); // Toggle playing state
  };

  const handleStop = () => {
    audioRef.current.pause(); // Pause playback
    audioRef.current.currentTime = 0; // Reset playback to start
    setIsPlaying(false); // Update playing state
  };

  const handleForward = () => {
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= songs.length) {
      nextIndex = 0; // Wrap around to the first song
    }
    setCurrentSongIndex(nextIndex);
    const nextSong = songs[nextIndex];
    audioRef.current.src = base + nextSong.url;
    audioRef.current.play(); // Play next song
    setIsPlaying(true);
  };

  const handleReverse = () => {
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) {
      prevIndex = songs.length - 1; // Wrap around to the last song
    }
    setCurrentSongIndex(prevIndex);
    const prevSong = songs[prevIndex];
    audioRef.current.src = base + prevSong.url;
    audioRef.current.play(); // Play previous song
    setIsPlaying(true);
  };

  return (
    <>
      <h1 className="audio-player text-light">Audio player</h1>
      <table className="table table-hover table-dark">
        <tbody>
          {songs.map((song, index) => (
            <tr key={song.id} className={index === currentSongIndex ? "table-primary" : ""}>
              <th className="text-light col-1 text-center" scope="row">{song.id}</th>
              <td className="text-light" onClick={() => handleClick(song, index)}>{song.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="buttons d-flex justify-content-center bg-secondary p-3 text-light">
        {currentSongIndex !== null && (
          <>
            <button className="playing mx-3" onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            <button onClick={handleStop}>Stop</button>
            <button className="Previous mx-3" onClick={handleReverse}>Previous</button>
            <button className="Next" onClick={handleForward}>Next</button>
          </>
        )}
      </div>
      <audio ref={audioRef} />
    </>
  );
}

export default Home;
