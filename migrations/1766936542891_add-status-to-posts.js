exports.up = (pgm) => {
  pgm.addColumn("posts", {
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "active",
    },
  });

  pgm.addConstraint("posts", "posts_status_check", {
    check: `
      status IN (
        'draft',
        'pending',
        'active',
        'paused',
        'expired',
        'rejected',
        'deleted'
      )
    `,
  });

  // opcional: força o backend a sempre definir o status
  pgm.alterColumn("posts", "status", {
    default: null,
  });
};

exports.down = () => null;
