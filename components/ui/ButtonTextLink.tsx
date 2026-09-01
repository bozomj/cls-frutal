import Link from "next/link";

interface ButtonTextLinkProps {
  label: string;
  href: string;
}

export default function ButtonTextLink({ label, href }: ButtonTextLinkProps) {
  return (
    <Link
      href={href}
      className=" md:inline hover:text-primary-light transition-colors"
    >
      {label}
    </Link>
  );
}
