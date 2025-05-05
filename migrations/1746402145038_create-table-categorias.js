exports.up = (pgm) => {
  pgm.createTable("categorias", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    desccricao: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
  });
};

exports.down = () => null;
