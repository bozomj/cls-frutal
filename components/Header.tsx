import autenticator from "@/models/autenticator";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

import React, { useEffect } from "react";
import { useState } from "react";
import { usePagination } from "@/contexts/PaginactionContext";

interface HeaderProps {
  titulo?: string;
  onSubmit?: (event: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSubmit }) => {
  const { resetPagination } = usePagination();
  const [toggle, setToggle] = useState(true);
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
    <header
      className="
    bg-white
     text-primary-dark
      p-4 relative 
      w-full 
      z-[1] 
      flex flex-col gap-2 
      md:items-stretch 
      border-b border-gray-300
      
      "
    >
      <div className="flex justify-between gap-4 items-center">
        <Link
          href={"/"}
          className=""
          onClick={() => {
            resetPagination();
          }}
        >
          <Image
            src="/img/logo.svg"
            width="240"
            height={"120"}
            alt={""}
            className="w-auto"
            priority={true}
          />
        </Link>

        <section
          className={`
              
        absolute
        w-full
        h-dvh
        top-0
        left-[-100%]
        has-[input:checked]:block
        has-[input:checked]:left-0

        md:static
        md:h-auto
        md: flex-1
        
        `}
          onClick={(e) => {
            const self = e.currentTarget;
            self.classList.add("!left-0");
            setTimeout(() => {
              self.classList.remove("!left-0");
            }, 400);
          }}
        >
          <input
            type="checkbox"
            id="activeSubmenu"
            onClick={(e) => {
              e.stopPropagation();
              change();
            }}
            className="peer hidden "
          />
          <label
            id="fundopreto"
            htmlFor="activeSubmenu"
            className="
          w-full
          h-full
          absolute left-0 top-0 z-[10]
          transitions-all
          duration-[800ms]
          bg-gray-950/0

         peer-checked:bg-gray-950/60
         md:hidden
         "
          ></label>
          <nav
            id="submenu"
            className={`
          bg-white
          w-8/12
          h-full
          relative
          overflow-hidden
          
          z-[20]
          p-2
          duration-[600ms]    
                    
          md:static
          md:w-full
          md:p-0
          
          
          
          `}
            style={{ left: isMobile && !toggle ? `0` : `-100%` }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <label
              htmlFor="activeSubmenu"
              className="absolute
              right-4 md:hidden"
            >
              <FontAwesomeIcon icon={faClose} />
            </label>
            <ul
              className="
              flex
              flex-col
              justify-end
              w-full
              
              md:flex-row
              md:gap-2
              "
            >
              {mapItemsMenu()}
            </ul>
          </nav>
        </section>

        <div className="flex items-center gap-4 ">
          {isAuthenticated.status ? (
            <Link
              href={isAuthenticated.status ? "/dashboard" : "/login"}
              className="flex items-center gap-2 text-primary-dark hover:text-primary-light transition-colors"
              onClick={() => resetPagination()}
            >
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
            </Link>
          ) : (
            ""
          )}

          <Link href={isAuthenticated.status ? "/api/v1/logout" : "/login"}>
            <span className=" md:inline hover:text-primary-light transition-colors ">
              {isAuthenticated.status ? "Sair" : "Entrar"}
            </span>
          </Link>
        </div>
      </div>

      <section className="flex justify-center items-center gap-4 flex-[1]">
        <div
          className="
        w-full
        flex flex-col justify-center gap-4
        md:max-w-8/12
        "
        >
          <h2
            className="
          hidden
          text-center text-xl font-bold
          md:block
          "
          >
            COMPRE E VENDA NO CLASSIFICADOS FRUTAL
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              onSubmit?.(searchTerm);
              resetPagination();
              router.replace(`/?q=${encodeURIComponent(searchTerm)}`);
            }}
            className=" flex gap-2  flex-[1] justify-end  items-center "
          >
            <input
              type="text"
              className="rounded  flex-[1] px-2 p-1 text-gray-900 outline-0 border border-gray-300"
              placeholder="Pesquisar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-xl p-0 cursor-pointer hover:text-primary-light"
              />
            </button>
          </form>
        </div>

        <label
          htmlFor="activeSubmenu"
          className="md:hidden w-[32] h-[32] cursor-pointer hover:text-primary-light"
        >
          {toggle ? (
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          ) : (
            <FontAwesomeIcon icon={faXmark} className="text-3xl" />
          )}
        </label>
      </section>
    </header>
  );

  function mapItemsMenu() {
    return itemsMenu.map((key, value) => {
      return (
        <li key={value}>
          <label
            htmlFor="activeSubmenu"
            className="hover:text-primary-light cursor-pointer"
          >
            <a>{key.label} </a>
          </label>
        </li>
      );
    });
  }

  function change() {
    setToggle(!toggle);
  }

  function init() {
    autenticator.isAuthenticated().then(setIsAuthenticated);
  }
};

export default Header;
