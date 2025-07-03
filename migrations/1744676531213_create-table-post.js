exports.up = (pgm) => {
  pgm.createTable("posts", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "uuid",
      notNull: true,
      references: "users(id)",
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: true,
    },
    valor: {
      type: "decimal(10, 2)",
      notNull: true,
    },
    createdAt: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = () => null;
