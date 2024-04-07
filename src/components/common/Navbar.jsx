import React, { useEffect, useState } from "react";
// import logo from "../../assets/Logo/Logo-Full-Light.png";
import logo from "../../assets/Logo/CourseCraftLogo.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import ProfileDropdown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";

// For testing
// const subLinks = [
//   {
//     title: "python",
//     link: "/catalog/python",
//   },
//   {
//     title: "web dev",
//     link: "/catalog/web-development",
//   },
// ];

const Navbar = () => {
  //fetch token from auth reducer using useSelector hook;
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSublinks = async () => {
    setLoading(true);
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      console.log("Printing Sublinks result:", result);
      setSubLinks(result.data.data);
    } catch (error) {
      console.log("Could not fetch the Categories.", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSublinks();
  }, []);

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
          {/* <img src={logo} alt="Logo" width={160} height={32} loading="lazy" /> */}
          <img src={logo} alt="Logo" width={180} height={32} loading="lazy" />
        </Link>

        {/* Nav Links */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => {
              return (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <>
                      <div
                        className={`group relative flex cursor-pointer items-center gap-1 ${
                          matchRoute("/catalog/:catalogName")
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        <p> {link.title} </p> <BsChevronDown />
                        {/*   "Catalog \/"   */}
                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                          <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                          {/* {loading ? (
                            <p className="text-center"> Loading... </p>
                          ) : subLinks?.length ? ( */}
                          {subLinks?.length ? (
                            <>
                              {/* TODO: Add filter method here */}
                              {
                                subLinks.map((subLink, i) => (
                                /* <Link
                                  to={`${subLink.link}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.title}</p>
                                </Link> */
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))
                              }
                            </>
                          ) : (
                            <p className="text-center">No Courses Found</p>
                          )}
                        </div>
                      </div>
                    </>
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

        {/* Login / Signup / Dashboard */}

        <div className="hidden items-center gap-x-4 md:flex">
          {
            // if user is present(login) and user is not instructor then we show cart icon in place of login and signup
            user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link to="/dashboard/cart" className="relative">
                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />{" "}
                {/* icon of cart */}
                {totalItems > 0 && (
                  <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                    {totalItems}{" "}
                    {/* no of item(courses) present in cart , we take it absolute because we want to overlap it over cart icon */}
                  </span>
                )}
              </Link>
            )
          }

          {
            /* if token === null then user are not login so we show login icon and sign icon  */
            token === null && (
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
            )
          }

          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}

          {/* added profile dropdown if token is not equal to null means user is present*/}
          {token !== null && <ProfileDropdown />}
        </div>

        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  );
};
export default Navbar;
