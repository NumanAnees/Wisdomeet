import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { isAuth } from "../helpers/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const Navigate = useNavigate();

  useEffect(() => {
    const check = isAuth();
    setIsLoggedIn(check);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.info("See You Again!");
    Navigate("/login");
  };
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">App</Navbar.Brand>
          {isLoggedIn ? (
            <Nav>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          ) : (
            <Nav className="">
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Signup</Nav.Link>
            </Nav>
          )}
        </Container>
      </Navbar>
      <div className="bg-col">{children}</div>
    </>
  );
}

export default Layout;
