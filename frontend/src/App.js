import './App.css';
import React, { useEffect, useState } from 'react';

// ✅ Usamos la variable de entorno
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const App = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modoDescripcion, setModoDescripcion] = useState(false);
  const [recomendacion, setRecomendacion] = useState('');

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/peliculas`)
      .then(res => res.json())
      .then(data => {
        setPeliculas(data);
        setPeliculasFiltradas(data);
      })
      .catch(err => console.error('Error al obtener las películas:', err));
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    const texto = busqueda.toLowerCase();

    const resultado = peliculas.filter(p =>
      p.titulo.toLowerCase().includes(texto) ||
      p.genero.toLowerCase().includes(texto) ||
      p.titulo.toLowerCase().startsWith(texto)
    );

    setPeliculasFiltradas(resultado);
    setRecomendacion('');
  };

  const handleBuscarPorDescripcion = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BACKEND_URL}/api/recomendaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Dame una recomendación basada en esta descripción: ${busqueda}. Usa solo películas de este catálogo: ${peliculas.map(p => p.titulo).join(', ')}.`
        })
      });

      const data = await res.json();
      setRecomendacion(data.recomendacion);

      const seleccionadas = peliculas.filter(p =>
        data.recomendacion.toLowerCase().includes(p.titulo.toLowerCase())
      );

      if (seleccionadas.length > 0) {
        setPeliculasFiltradas(seleccionadas);
      }

    } catch (error) {
      console.error('Error con IA:', error);
    }
  };

  return (
    <div className="App">
      <h1>Catálogo de Películas</h1>

      <form
        className="buscador"
        onSubmit={modoDescripcion ? handleBuscarPorDescripcion : handleBuscar}
      >
        <input
          type="text"
          placeholder={modoDescripcion ? 'Describe la peli que buscas...' : 'Busca por título o género'}
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          {modoDescripcion ? 'Buscar por IA' : 'Buscar'}
        </button>
      </form>

      <label>
        <input
          type="checkbox"
          checked={modoDescripcion}
          onChange={() => setModoDescripcion(!modoDescripcion)}
        />
        Buscar por descripción (IA)
      </label>

      {recomendacion && (
        <div className="bloque-recomendaciones">
          <h2>IA sugiere:</h2>
          <p>{recomendacion}</p>
        </div>
      )}

      <div className="grid">
        {peliculasFiltradas.map((p, i) => (
          <div className="tarjeta" key={i}>
            <img src={p.poster} alt={p.titulo} />
            <div className="info">
              <h3>{p.titulo}</h3>
              <p>{p.genero}</p>
              <span>{p.descripcion?.slice(0, 60)}...</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
