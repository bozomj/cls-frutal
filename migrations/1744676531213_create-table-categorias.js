exports.up = (pgm) => {
  pgm.createTable("categorias", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    descricao: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
  });
};

exports.down = () => null;
