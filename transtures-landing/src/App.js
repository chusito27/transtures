import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Transtures S.A.</h1>
        <p>
          Transtures S.A. is a company dedicated to providing reliable and comfortable transportation services for organized groups, including educational tours, family trips, and luxury bus tours.
        </p>
      </header>
      <div className="App-body">
        <section id="services">
          <h2>Our Services</h2>
          <ul>
            <li>Educational Tours</li>
            <li>Family Trips</li>
            <li>Luxury Bus Tours</li>
          </ul>
        </section>
        <section id="contact">
          <h2>Contact Us</h2>
          <div>
            <p><strong>Address:</strong> Cl. 145 #94-45, Bogotá, Cundinamarca, Colombia</p>
            <p><strong>Phone:</strong> +57 311 4900367</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
