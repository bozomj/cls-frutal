import Card from "@/components/card";
import Header from "@/components/Header";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

import Link from "next/link";
import { useState } from "react";

export default function Produto() {
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [urls, setImg] = useState<string[]>([]);
  const [imagens, setImagens] = useState<File[]>([]);

  const categoriasValues = [
    { value: "", label: "Selecione a categoria" },
    { value: "veiculos", label: "Veículos" },
    { value: "imoveis", label: "Imóveis" },
    { value: "eletronicos", label: "Eletrônicos" },
    { value: "roupas", label: "Roupas e Acessórios" },
    { value: "moveis", label: "Móveis" },
    { value: "servicos", label: "Serviços" },
    { value: "animais", label: "Animais" },
    { value: "empregos", label: "Empregos" },
    { value: "outros", label: "Outros" },
  ];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    salvar();
  }

  const formatarMoeda = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const apenasNumeros = input.replace(/\D/g, "");

    const numero = parseInt(apenasNumeros || "0", 10) / 100;
    const formatado = numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    setValor(formatado);
  };

  const salvar = async () => {
    const newValor = valor
      .replace("R$", "")
      .trim()
      .replace(/\./g, "")
      .replace(",", ".");

    console.log("IMAGENS PARA UPLOAD", newValor);
    imagens.forEach((img) => {
      console.log("imagem::_", img);
    });

    const formdata = new FormData();
    for (const file of imagens) {
      console.log("IMAGENS: ", imagens);
      formdata.append("file", file);
    }

    const result = await fetch("/api/v1/uploadImages", {
      method: "POST",
      body: formdata,
    });

    const d = await result.json();
    setImagens([]);
    setImg([]);
    console.log("resultados:: ", d);
  };

  return (
    <>
      <Header />
      <main className="flex-auto overflow-y-scroll bg-gray-300 flex-col flex justify-between gap-2 items-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-cyan-950 rounded p-4 w-[480px] m-4"
        >
          <input
            type="text"
            placeholder="Titulo"
            className="p-3 bg-cyan-50 text-gray-900 outline-0"
          />
          <textarea
            placeholder="Descrição"
            className="p-3 bg-cyan-50 text-gray-900 outline-0"
          />
          <select
            name=""
            id=""
            className={`p-3 bg-cyan-50  outline-0 
              ${categoria === "" ? "text-gray-400" : "text-gray-800"}`}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categoriasValues.map((e) => (
              <option
                key={e.value}
                value={e.value}
                disabled={e.value === ""}
                className={`${
                  e.value === "" ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {e.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="R$: 0,00"
            value={valor}
            className="text-gray-900 outline-0 p-3 bg-cyan-50"
            onChange={formatarMoeda}
          />

          <label>
            <span className="bg-cyan-700 block w-fit p-2 rounded">
              <FontAwesomeIcon icon={faImage} className="text-3xl" />
            </span>
            <input
              type="file"
              multiple
              max={3}
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;

                // const preview = document.getElementById("preview");
                if (files) {
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    // Verifica se o arquivo é uma imagem
                    if (file.type.startsWith("image/")) {
                      // Cria uma URL temporária para o arquivo
                      const imgURL = URL.createObjectURL(file);

                      setImagens((e) => [...e, file]);
                      setImg((e) => [...e, imgURL]);
                    }
                  }
                }
              }}
            />
          </label>

          <div id="preview" className="flex gap-2 flex-col">
            {urls.map((e, index) => {
              return (
                <div key={index} className="relative w-fit">
                  <Card key={index}>
                    <div
                      className="absolute bg-amber-600 rounded-[50%] p-1 right-0 top-0"
                      onClick={() => {
                        setImg((prev) => prev.filter((_, i) => i !== index));
                        setImagens((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      X
                    </div>
                    <Image src={e} alt="" width={150} height={150} />
                  </Card>
                </div>
              );
            })}
          </div>

          <span className="flex gap-2 ite">
            <Link href={""} className="flex-1">
              Cancelar
            </Link>
            <button className="bg-cyan-600 p-2 flex-1 rounded">Salvar</button>
          </span>
        </form>
      </main>
    </>
  );
}
