import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import router from "next/router";

import React, { useState } from "react";
import VerticalDivider from "./VerticalDivider";

import Head from "next/head";
import ButtonTextLink from "./ui/ButtonTextLink";
import IconButton from "./IconButton";
import ButtonIconLink from "./ui/ButtonIconLink";
import OwnerGuard from "./guards/OwnerGuard";

interface HeaderProps {
  titulo?: string;
  className?: string;
  user_id?: string;
  onSubmit?: (event: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  onSubmit,
  className,
  titulo,
  user_id = null,
}) => {
  const [toggle, setToggle] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const itemsMenu = [
    { label: "produtos", link: "" },
    { label: "roupas", link: "" },
    { label: "Eletronicos", link: "" },
  ];

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const refSlideMenu = React.useRef<HTMLElement>(null);

  function closeSlideMenu() {
    refSlideMenu.current!.classList.add("!left-0");
    setTimeout(() => {
      refSlideMenu.current!.classList.remove("!left-0");
    }, 400);
  }

  return (
    <>
      <Head>
        <title>{titulo}</title>
      </Head>
      <header
        className={`
    bg-white text-primary-dark
      border-b border-gray-300
      flex flex-col gap-2 
      p-4 relative z-[10] 
      w-full 
      md:items-stretch 

      ${className}
      `}
      >
        <div className="flex justify-between gap-4 items-start w-full ">
          <Link href={"/"} className=" outline-0 ">
            <Image
              src="/img/logo.svg"
              width={240}
              height={27}
              alt={"Logo"}
              priority
            />
          </Link>

          <nav className="flex items-start gap-4  ">
            <OwnerGuard isOwner={user_id != null}>
              <ButtonIconLink href="/dashboard " icon={faUser} />
              <ButtonTextLink href="/api/v1/logout" label="sair" />
            </OwnerGuard>

            <OwnerGuard isOwner={user_id == null}>
              <ButtonTextLink href="/login" label="Entar" />
            </OwnerGuard>
          </nav>
        </div>

        <section className="flex justify-center items-center gap-4 flex-1 ">
          <div className="w-full flex flex-col justify-center gap-4 md:max-w-8/12">
            <h2 className="hidden text-center text-xl font-bold md:block">
              COMPRE E VENDA NO CLASSIFICADOS FRUTAL
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();

                onSubmit?.(searchTerm);

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

        <section
          ref={refSlideMenu}
          className={`
          absolute top-0 left-[-100%] z-[20]
          w-full h-dvh
          has-[input:checked]:block 
          has-[input:checked]:left-0
          md:static md:h-auto
          md:overflow-x-hidden
           
          `}
          onClick={closeSlideMenu}
        >
          <input
            type="checkbox"
            id="activeSubmenu"
            checked={!toggle}
            readOnly
            onClick={(e) => {
              e.stopPropagation();
              change();
            }}
            className="peer hidden"
          />
          <label
            id="fundopreto"
            htmlFor="activeSubmenu"
            className="
            w-full h-full
            absolute left-0 top-0 z-[10]
            transitions-all duration-[800ms]
            bg-gray-950/0

          peer-checked:bg-gray-950/60
            md:hidden
            "
          ></label>
          <nav
            id="slideMenuItems"
            className={`
          bg-white
            w-9/10 h-full
            relative z-[11] 
            overflow-hidden
            duration-[600ms]    
            md:static
            md:w-full
            flex flex-col
            md:flex-row
            
            
            
            `}
            style={{ left: isMobile && !toggle ? `0` : `-100%` }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex  min-h-40 p-2 md:hidden">
              <label
                htmlFor="activeSubmenu"
                className="absolute right-4 cursor-pointer md:hidden "
                onClick={closeSlideMenu}
              >
                <FontAwesomeIcon icon={faClose} />
              </label>
              <div className="relative h-7 w-10/12">
                <Image
                  src={"/img/logo.svg"}
                  height={30}
                  width={100}
                  sizes="50"
                  className="object-contain h-full w-fit cursor-pointer"
                  alt=""
                />
              </div>
            </div>
            <ul
              className="
              flex flex-col 
              overflow-y-scroll
              h-full
              md:m-auto
              md:items-center
              md:p-2
              md:justify-start
              md:overflow-y-hidden
              md:flex-row  gap-2
              md:static
              "
            >
              <VerticalDivider height={2} className="px-2" />
              <MapItemsMenu />
            </ul>
          </nav>
        </section>
      </header>
    </>
  );

  function MapItemsMenu() {
    return itemsMenu.map((key, value) => {
      return (
        <li key={value}>
          <label
            htmlFor="activeSubmenu"
            className="hover:text-primary-light p-2 cursor-pointer hover:border-l md:hover:border-b md:hover:border-l-0 md:px-0 md:py-2"
            onClick={closeSlideMenu}
          >
            <a href={key.link} target="">
              {key.label}
            </a>
          </label>
        </li>
      );
    });
  }

  function change() {
    setToggle(!toggle);
  }
};

export default Header;
