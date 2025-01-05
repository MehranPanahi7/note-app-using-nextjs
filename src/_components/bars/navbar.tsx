"use client";
import {
  selectIsAuthenticated,
  logout,
} from "@/store/slices/authSlices/loginSlice";
import { AppDispatch } from "@/store/store";
import Link from "next/link";
import { useState } from "react";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosHome,
  IoIosSettings,
  IoIosLogOut,
} from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [navbarIsOpen, setNavbarIsOpen] = useState<boolean>(false);

  const changeNavbarStatus = () => setNavbarIsOpen(!navbarIsOpen);
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div
      className={`flex justify-start items-center flex-col p-4 bg-gray-400 min-h-screen transition-all
     delay-150 ${navbarIsOpen ? "w-52" : "w-20"}`}
    >
      <div>
        <button onClick={changeNavbarStatus}>
          {navbarIsOpen ? (
            <IoIosArrowBack size={30} />
          ) : (
            <IoIosArrowForward size={30} />
          )}
        </button>
      </div>
      <div className="flex justify-between items-center flex-col p-2 m-2 w-full h-full">
        {navbarIsOpen && (
          <div className="flex justify-start items-center flex-col p-2 w-full h-full">
            <ul className="flex justify-center items-center flex-col p-2">
              <Link href="/" className="w-full">
                <li className="w-full flex justify-between items-center my-3 hover:scale-110 hover:text-green-200 transition-all delay-100">
                  <IoIosHome size={30} className="" />
                </li>
              </Link>
              <Link href="/" className="w-full">
                <li className="w-full flex justify-between items-center my-3 hover:scale-110 hover:text-green-200 transition-all delay-100">
                  <IoIosSettings
                    size={30}
                    className="hover:scale-110 hover:border-b-2 hover:border-white"
                  />
                </li>
              </Link>
            </ul>
          </div>
        )}

        <div className="flex justify-end items-center flex-col p-2">
          {isAuthenticated ? (
            <button onClick={handleLogout}>
              <IoIosLogOut size={30} />
            </button>
          ) : (
            <Link href="/pages/auth/login">
              <FaUserAlt size={30} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
