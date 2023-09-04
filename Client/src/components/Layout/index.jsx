import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { isAuth, getUser } from "../../helpers/auth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Menu } from "antd";

//import styles
import "./layout.css";

function Layout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState();
  const [user, setUser] = useState({});
  const Navigate = useNavigate();

  useEffect(() => {
    const check = isAuth();
    setIsLoggedIn(check);
  }, []);

  useEffect(() => {
    const user = getUser();
    setUser(user);
    console.log(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    toast.info("See You Again!");
    Navigate("/login");
  };
  const childs = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <li className="nav-item p-1">
              <Link to="/profile">
                <div className="nav-link text-dark text-center text-top">
                  {" "}
                  <span className="text-span4">Profile</span>
                </div>
              </Link>
            </li>
          ),
        },
        {
          key: "2",
          danger: true,
          label: (
            <li className="nav-item pointer p-1">
              <div
                onClick={handleLogout}
                className="nav-link text-dark  text-center text-top"
              >
                <span className="text-span4">Logout</span>
              </div>
            </li>
          ),
        },
      ]}
    />
  );
  return (
    <>
      <Navbar className="navbar-top">
        <Container>
          <Navbar.Brand href="/" className="logo-main">
            Quora
          </Navbar.Brand>

          {isLoggedIn ? (
            <div className="nav-item pointer p-1">
              <Dropdown overlay={childs} className="nav-component">
                <Nav className="image-container">
                  <img
                    src={user.profilePic}
                    alt="profile"
                    className="nav-image"
                  ></img>
                </Nav>
              </Dropdown>
            </div>
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
