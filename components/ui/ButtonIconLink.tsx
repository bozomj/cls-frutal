import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export interface ButtonIconLinkProps {
  icon: IconProp;
  href: string;
}

function ButtonIconLink({ icon, href }: ButtonIconLinkProps) {
  return (
    <Link
      href={href}
      className=" flex items-center gap-2 md:inline hover:text-primary-light text-2xl transition-colors"
    >
      <FontAwesomeIcon icon={icon} />
    </Link>
  );
}

export default ButtonIconLink;
