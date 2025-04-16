interface ProdutosProps {
  titulo?: string;
}

const Produtos: React.FC<ProdutosProps> = () => {
  return (
    <>
      <div className="h-[300] bg-cyan-50 flex items-center  overflow-x-scroll max-w-full ">
        <section className="flex items-center gap-4 p-4">
          <div className="h-[200px] w-[80vw] md:w-[400px] bg-cyan-800"></div>
          <div className="h-[200px] w-[80vw] md:w-[400px] bg-cyan-900"></div>
          <div className="h-[200px] w-[80vw] md:w-[400px] bg-cyan-700"></div>
          <div className="h-[200px] w-[80vw] md:w-[400px] bg-cyan-500"></div>
        </section>
      </div>
    </>
  );
};

export default Produtos;
