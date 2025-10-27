exports.up = (pgm) => {
  pgm.createTable("carrossel_images", {
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
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = () => null;
