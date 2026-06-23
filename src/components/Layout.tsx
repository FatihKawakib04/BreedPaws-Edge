import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';

function Layout() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="layout-wrapper">
      {/* Navbar Starts */}
      <nav id="main-nav" className="navbar-expand-xl">
        {/* Start Top Bar */}
        <div className="container-fluid top-bar">
          <div className="container">
            <div className="row">
              {/* Optional top-bar content */}
            </div>
          </div>
        </div>
        {/* End Top bar */}

        {/* Navbar Inner */}
        <div className="navbar container-fluid">
          <div className="container">
            {/* logo */}
            <Link className="navbar-brand" to="/" onClick={closeNavbar}>
              <i className="flaticon-dog-training-3"></i><span>BreedPaws!</span>
            </Link>

            {/* Navbartoggler */}
            <button 
              className="navbar-toggler" 
              type="button" 
              onClick={toggleNavbar}
              aria-controls="navbarResponsive" 
              aria-expanded={isNavbarOpen} 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggle-icon">
                <i className="fas fa-bars"></i>
              </span>
            </button>

            <div className={`collapse navbar-collapse ${isNavbarOpen ? 'show' : ''}`} id="navbarResponsive">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                    to="/" 
                    onClick={closeNavbar}
                    end
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                    to="/services" 
                    onClick={closeNavbar}
                  >
                    Services
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                    to="/about" 
                    onClick={closeNavbar}
                  >
                    About
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                    to="/gallery" 
                    onClick={closeNavbar}
                  >
                    Gallery
                  </NavLink>
                </li>
                <li className={`nav-item dropdown ${isDropdownOpen ? 'show' : ''}`}>
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    id="others-dropdown" 
                    onClick={toggleDropdown}
                    aria-haspopup="true" 
                    aria-expanded={isDropdownOpen}
                  >
                    Other pages
                  </a>
                  <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="others-dropdown">
                    <NavLink className="dropdown-item" to="/team" onClick={closeNavbar}>
                      Our Team
                    </NavLink>
                    <NavLink className="dropdown-item" to="/contact" onClick={closeNavbar}>
                      Contact Us
                    </NavLink>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {/* Navbar Ends */}

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer Starts */}
      <footer className="text-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <Link className="navbar-brand" to="/" onClick={closeNavbar}>
                <i className="flaticon-dog-training-3"></i><span>BreedPaws!</span>
              </Link>
              <p className="mt-3">
                BreedPaws uses AI technology to help identify dog breeds from images, improving decision-making for adoption and care. 
                By focusing on local breeds, our system contributes to better animal welfare in Indonesia.
              </p>
            </div>
            
            <div className="col-lg-3">
              <h6><i className="fas fa-envelope margin-icon"></i>Contact Us</h6>
              <ul className="list-unstyled">
                <li>+62 821-1481-8279 | +62 812-6422-3195 | +62 851-5899-5655 |</li>
                <li><a href="mailto:breedpaws@apps.ipb.ac.id">breedpaws@apps.ipb.ac.id</a></li>
                <li>Jl. Kumbang No.14, RT.02/RW.06, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128</li>
              </ul>
            </div>
            
            <div className="col-lg-3">
              <h6><i className="far fa-clock margin-icon"></i>Working Hours</h6>
              <ul className="list-unstyled">
                <li>Open 7am - 7pm</li>
                <li>Holidays - Closed</li>
                <li>Weekends - Closed</li>
              </ul>
            </div>
          </div>
          
          <div className="row">
            <div className="credits col-sm-12">
              <p>Designed by <a href="/">Fatih | Yordi | Najla</a></p>
            </div>
          </div>
        </div>
      </footer>
      {/* Footer Ends */}
    </div>
  );
}

export default Layout;
