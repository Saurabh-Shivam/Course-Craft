import React from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  // if route is matched with (current route) then return true and color of text turn yellow otherwise white;
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          {/* TODO: Need to change the logo of project */}
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>

        {/* Nav Links */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => {
              return (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div></div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={`group relative flex cursor-pointer items-center gap-1 ${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

      {/* Login/SignUp/Dashboard Buttons */}
      <div className="flex gap-x-4 items-center">

      </div>

      </div>
    </div>
  );
};

export default Navbar;
