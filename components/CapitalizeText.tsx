import utils from "@/utils";

type CapitalizeTextProps = {
  txt: string;
  className?: string;
};

export default function CapitalizeText({
  txt,
  className = "",
}: CapitalizeTextProps) {
  return <span className={className}>{utils.string.capitalizar(txt)}</span>;
}
