import React from 'react';
import FilmEffectsTranslator from './components/FilmEffectsTranslator';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <FilmEffectsTranslator />
      </ErrorBoundary>
    </div>
  );
}

export default App;