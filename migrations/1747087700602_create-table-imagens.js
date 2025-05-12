exports.up = (pgm) => {
  pgm.createTable("imagens", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    url: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    post_id: {
      type: "uuid",
      notNull: true,
      references: "posts(id)",
    },
  });
};

exports.down = () => null;
