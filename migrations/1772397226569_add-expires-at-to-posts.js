exports.up = (pgm) => {
  pgm.addColumn("posts", {
    expires_at: {
      type: "timestamp",
      notNull: false,
    },
  });

  pgm.sql(`
  UPDATE posts
  SET expires_at = created_at + INTERVAL '30 days'
`);

  pgm.alterColumn("posts", "expires_at", {
    notNull: true,
  });
};

exports.down = () => null;
