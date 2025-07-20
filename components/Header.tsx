import autenticator from "@/models/autenticator";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

import React, { useEffect } from "react";
import { useState } from "react";
interface HeaderProps {
  titulo?: string;
  onSubmit?: (event: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSubmit }) => {
  const [toggle, setToggle] = useState(true);
  const [subH, alter] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState({
    status: false,
    user: null,
  });
  const itemsMenu = [
    { label: "produtos", link: "" },
    { label: "serviços", link: "" },
    { label: "vagas", link: "" },
  ];

  useEffect(init, []);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <header className="bg-cyan-900 p-4 relative w-full z-[1] flex flex-col gap-2  md:items-stretch ">
      <div className="flex justify-between  ">
        <Link href={"/"} className="">
          <Image src="/img/logo.svg" width="240" height={"120"} alt={""} />
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated.status ? (
            <Link
              href={isAuthenticated.status ? "/dashboard" : "/login"}
              className="flex items-center gap-2 text-white hover:text-cyan-300 transition-colors"
            >
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
            </Link>
          ) : (
            ""
          )}
          <Link href={isAuthenticated.status ? "/api/v1/logout" : "/login"}>
            <span className=" md:inline hover:text-cyan-300 transition-colors">
              {isAuthenticated.status ? "Sair" : "Entrar"}
            </span>
          </Link>
        </div>
      </div>
      <div className="flex justify-end items-center gap-4 flex-[1]">
        <input
          type="checkbox"
          id="activeSubmenu"
          onClick={change}
          className="peer hidden "
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();

            onSubmit?.(searchTerm);

            router.replace(`/?q=${encodeURIComponent(searchTerm)}`);
          }}
          className=" flex gap-2  flex-[1] justify-end  items-center"
        >
          <input
            type="text"
            className="bg-cyan-50 rounded  flex-[1] px-2 p-1 text-gray-900"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-2xl p-0 cursor-pointer hover:text-cyan-300 "
            />
          </button>
        </form>
        <nav
          id="submenu"
          className={`bg-cyan-900 md:h-auto md:w-fit w-full peer-checked:md:h-auto overflow-y-hidden duration-[400ms] px-4 h-0 peer-checked:h-[${subH}px]    text-right  absolute left-0 top-[100%] md:relative `}
          style={{ height: isMobile && !toggle ? `${subH}px` : undefined }}
        >
          <ul className="flex flex-col justify-end pb-4 md:pb-0  w-full  md:gap-4 md:flex-row ">
            {mapItemsMenu()}
          </ul>
        </nav>
        <label
          htmlFor="activeSubmenu"
          className="md:hidden w-[32] h-[32] cursor-pointer hover:text-cyan-300"
        >
          {toggle ? (
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          ) : (
            <FontAwesomeIcon icon={faXmark} className="text-3xl" />
          )}
        </label>

        <label
          htmlFor="activeSubmenu"
          id="fundopreto"
          className="w-full h-dvh  left-0 top-0 fixed z-[-1]   hidden peer-checked:block"
        ></label>
      </div>
    </header>
  );

  function mapItemsMenu() {
    return itemsMenu.map((key, value) => {
      return (
        <li key={value}>
          <label
            htmlFor="activeSubmenu"
            className="hover:text-cyan-300 font-bold cursor-pointer"
          >
            {key.label}
          </label>
        </li>
      );
    });
  }

  function change() {
    setToggle(!toggle);
  }

  function init() {
    const submenu = document.getElementById("submenu");
    const sub = {
      height: submenu?.scrollHeight ?? 0,
      width: submenu?.clientWidth ?? 0,
    };

    alter(sub.height);

    autenticator.isAuthenticated().then((result) => {
      setIsAuthenticated(result);
    });
  }
};

export default Header;
