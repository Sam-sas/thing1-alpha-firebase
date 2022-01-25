import React, { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import { RiCloseFill, RiLogoutBoxLine } from "react-icons/ri";
import { Button } from "react-bootstrap";

import { Link, useHistory } from "react-router-dom";
import { NavbarData } from "./navbarData";
import "./Navbar.css";
import { IconContext } from "react-icons";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Navigation() {
  const [error, setError] = useState("");
  const [profileUser, setProfileUser] = useState([]);
  const [url, setUrl] = useState("../../img/blank-profile-picture-973460.png");
  const expertsCollectionRef = collection(db, "experts");

  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  const checkUserAuth = (user) => {
    if (user) {
      return (
        <>
          <div className="navsandwich-container">
            <Link to="#" className="menu-bars">
              <FaIcons.FaBars
                stroke="white"
                onClick={showSidebar}
                className="navsandwich"
              />
            </Link>
          </div>
        </>
      );
    }
  };

  const checkLogoutAuth = (user) => {
    if (user) {
      return (
        <>
          <div className="btn-container-logout">
            <Button className="nav-logout nav-btn" onClick={handleLogout}>
              <RiLogoutBoxLine />
              Log out
            </Button>
          </div>
        </>
      );
    }
  };

  const checkAccountAuth = (user) => {
    if (user) {
      return (
        <>
          <div className="account-icon" onClick={showSidebar}>
            <Link to="/account-page">
              <img
                className="img-thumbnail nav-img"
                src={url}
                alt="profile picture of you"
              />
            </Link>
          </div>
        </>
      );
    }
  };

  useEffect(() => {
    if (currentUser) {
      const getUser = async () => {
        const q = query(
          collection(db, "experts"),
          where("uid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setProfileUser(doc.data());
        });
      };
      getUser();
      checkImg(expertsCollectionRef, profileUser);
    }
  }, []);

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      history.push("/sign-in");
    } catch {
      setError("Failed to log out");
    }
  };

  const checkImg = (ref, user) => {
    if (ref) {
      if (user.expertImg === undefined || user.expertImg === "") {
        return url;
      } else {
        setUrl(user.expertImg);
      }
    }
    return url;
  };

  //Navbar behavior
  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">
          {checkUserAuth(currentUser)}
          {/* CSS className determined by navbar being active or not */}
          <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
            <div className="closeContainer">
              <Button className="closeSidebar" onClick={showSidebar}>
                <RiCloseFill className="close-btn" />
              </Button>
            </div>
            {checkAccountAuth(currentUser)}
            <ul className="nav-menu-items" onClick={showSidebar}>
              {/* Map with items defined in navbardata.js , includes elements such as icon, title */}
              {NavbarData.map((item, index) => {
                if (currentUser) {
                  return (
                    <li key={index} className={item.cName}>
                      <Link to={item.path}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </li>
                  );
                }
              })}
              <li className={sidebar ? "button-container-logout active" : "button-container-logout"}>
                <div>
                    {checkLogoutAuth(currentUser)}
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </IconContext.Provider>
    </>
  );
}
