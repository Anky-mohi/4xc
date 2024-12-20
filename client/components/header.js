// components/Header.js

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const Header = () => {
  const [theme, setTheme] = useState("light");
  const IframUrl = useRef(null);
  const router = useRouter();
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.setAttribute("data-theme", savedTheme);
  }, []);
  useEffect(() => {
    if (IframUrl.current) {
      const iframeSrc = IframUrl.current.src;
      console.log("Iframe URL:", iframeSrc); // You can store or use this URL as needed
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="bg-transparent fixed w-full text-white p-4">
      <nav className="bg-color flex justify-between">
        <div className="text-xl font-bold">
          <Link href="/">
            <Image
              src="/logo.jpg"
              alt="MySite Logo"
              width={80}
              height={80}
              className="mr-2"
            />
          </Link>
        </div>
        <div className="flex items-center">
          {/* {router.pathname === "/login" && (
            <Link href="/signup">
              <span className="px-4 mr-2.5	 py-2 cursor-pointer font-semibold text-sm rounded-lg bg-orange-500 hover:bg-orange-600">
                Sign Up
              </span>
            </Link>
          )}
          */}
          {router.pathname === "/signup" && (
            <Link
              href={`https://oauth.deriv.com/oauth2/authorize?app_id=${process.env.NEXT_PUBLIC_APP_ID}`}
            >
              <span className="px-4 py-2 mr-2.5	 cursor-pointer font-semibold text-sm rounded-lg bg-orange-500 hover:bg-orange-600">
                Login
              </span>
            </Link>
          )}
          {router.pathname === "/thankyou" && (
            <Link href="/dashboard">
              <span className="px-4 py-2 mr-2.5	 cursor-pointer font-semibold text-sm rounded-lg bg-orange-500 hover:bg-orange-600">
                dashboard
              </span>
            </Link>
          )}
          {router.pathname === "/" && (
            <div className="d-flex">
              <Link href="/signup">
                <span className="px-4 py-2 mr-2.5	 cursor-pointer font-semibold text-sm rounded-lg bg-orange-500 hover:bg-orange-600">
                  signup
                </span>
              </Link>
              <Link
                href={`https://oauth.deriv.com/oauth2/authorize?app_id=${process.env.NEXT_PUBLIC_APP_ID}`}
              >
                <span className="px-4 py-2 mr-2.5	 cursor-pointer font-semibold text-sm rounded-lg bg-orange-500 hover:bg-orange-600">
                  Login
                </span>
              </Link>
            </div>
          )}
          <button onClick={toggleTheme} className="mr-4">
            {theme === "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25px"
                height="25px"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12Z"
                  fill="#ff5722"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3C12.75 3.41421 12.4142 3.75 12 3.75C11.5858 3.75 11.25 3.41421 11.25 3V2C11.25 1.58579 11.5858 1.25 12 1.25ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H3C3.41421 11.25 3.75 11.5858 3.75 12C3.75 12.4142 3.41421 12.75 3 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM20.25 12C20.25 11.5858 20.5858 11.25 21 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H21C20.5858 12.75 20.25 12.4142 20.25 12ZM12 20.25C12.4142 20.25 12.75 20.5858 12.75 21V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V21C11.25 20.5858 11.5858 20.25 12 20.25Z"
                  fill="#ff5722"
                />
                <g opacity="0.5">
                  <path
                    d="M4.39838 4.39838C4.69127 4.10549 5.16615 4.10549 5.45904 4.39838L5.85188 4.79122C6.14477 5.08411 6.14477 5.55898 5.85188 5.85188C5.55898 6.14477 5.08411 6.14477 4.79122 5.85188L4.39838 5.45904C4.10549 5.16615 4.10549 4.69127 4.39838 4.39838Z"
                    fill="#ff5722"
                  />
                  <path
                    d="M19.6009 4.39864C19.8938 4.69153 19.8938 5.16641 19.6009 5.4593L19.2081 5.85214C18.9152 6.14503 18.4403 6.14503 18.1474 5.85214C17.8545 5.55924 17.8545 5.08437 18.1474 4.79148L18.5402 4.39864C18.8331 4.10575 19.308 4.10575 19.6009 4.39864Z"
                    fill="#ff5722"
                  />
                  <path
                    d="M18.1474 18.1474C18.4403 17.8545 18.9152 17.8545 19.2081 18.1474L19.6009 18.5402C19.8938 18.8331 19.8938 19.308 19.6009 19.6009C19.308 19.8938 18.8331 19.8938 18.5402 19.6009L18.1474 19.2081C17.8545 18.9152 17.8545 18.4403 18.1474 18.1474Z"
                    fill="#ff5722"
                  />
                  <path
                    d="M5.85188 18.1477C6.14477 18.4406 6.14477 18.9154 5.85188 19.2083L5.45904 19.6012C5.16615 19.8941 4.69127 19.8941 4.39838 19.6012C4.10549 19.3083 4.10549 18.8334 4.39838 18.5405L4.79122 18.1477C5.08411 17.8548 5.55898 17.8548 5.85188 18.1477Z"
                    fill="#ff5722"
                  />
                </g>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25px"
                height="20px"
                viewBox="0 0 24 24"
                fill="#fff"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 2.75C17.5858 2.75 17.25 2.41421 17.25 2C17.25 1.58579 17.5858 1.25 18 1.25H22C22.3034 1.25 22.5768 1.43273 22.6929 1.71299C22.809 1.99324 22.7449 2.31583 22.5304 2.53033L19.8107 5.25H22C22.4142 5.25 22.75 5.58579 22.75 6C22.75 6.41421 22.4142 6.75 22 6.75H18C17.6967 6.75 17.4232 6.56727 17.3071 6.28701C17.191 6.00676 17.2552 5.68417 17.4697 5.46967L20.1894 2.75H18ZM13.5 8.75C13.0858 8.75 12.75 8.41421 12.75 8C12.75 7.58579 13.0858 7.25 13.5 7.25H16.5C16.8034 7.25 17.0768 7.43273 17.1929 7.71299C17.309 7.99324 17.2449 8.31583 17.0304 8.53033L15.3107 10.25H16.5C16.9142 10.25 17.25 10.5858 17.25 11C17.25 11.4142 16.9142 11.75 16.5 11.75H13.5C13.1967 11.75 12.9232 11.5673 12.8071 11.287C12.691 11.0068 12.7552 10.6842 12.9697 10.4697L14.6894 8.75H13.5Z"
                  fill="##fff"
                />
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  fill="##fff"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
