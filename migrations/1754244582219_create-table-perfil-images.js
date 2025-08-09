exports.up = (pgm) => {
  pgm.createTable("perfil_images", {
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
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
    },
    selected: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });
};

exports.down = () => null;
