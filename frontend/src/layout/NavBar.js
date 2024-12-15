// import React from 'react';
// import { Search } from 'lucide-react';
// import './NavBar.css'; 

// const Navbar = () => {
//   return (
//     <nav className="navbar">
//       <div className="navbar-container">
//         <div className="navbar-content">
//           <div className="navbar-logo">
//             <Search className="navbar-icon" />
//             <span className="navbar-title">SEO Analyzer</span>
//           </div>
//           <div className="navbar-links">
//             <NavLink href="#" active={true}>Home</NavLink>
//             <NavLink href="#">Rankings</NavLink>
//             <NavLink href="#">SEO Audits</NavLink>
//             <NavLink href="#">Competitors Analysis</NavLink>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// const NavLink = ({ href, children, active }) => (
//   <a
//     href={href}
//     className={`nav-link ${active ? 'nav-link-active' : ''}`}
//   >
//     {children}
//   </a>
// );

// export default Navbar;
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


function CollapsibleExample() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav className="justify-content-end" activeKey="/home">
                <Nav.Item>
                    <Nav.Link href="/home">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="link-1">Link</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="link-2">Link</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="disabled" disabled>
                        Disabled
                    </Nav.Link>
                </Nav.Item>
            </Nav>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;