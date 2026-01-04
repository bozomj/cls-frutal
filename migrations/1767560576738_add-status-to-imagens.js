exports.up = (pgm) => {
  pgm.addColumn("imagens", {
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "active",
    },
  });

  pgm.addConstraint("imagens", "imagens_status_check", {
    check: `
      status IN (
        'pending',
        'active',
        'rejected',
        'deleted'
      )
    `,
  });

  // opcional: força o backend a sempre definir o status
  pgm.alterColumn("imagens", "status", {
    default: null,
  });
};

exports.down = () => null;
