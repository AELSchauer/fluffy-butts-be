exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("images", function (table) {
      table.increments("id");
      table.string("name").notNullable();
      table.string("url").notNullable();

      table.index("name", "index_images_on_name");

      table.timestamps();
    }),

    knex.schema.createTable("imagings", function (table) {
      table.increments("id");
      table.integer("image_id").notNullable();
      table.string("imageable_type").notNullable();
      table.integer("imageable_id").notNullable();

      table.index("image_id", "index_imagings_on_image_id");
      table.index(
        ["imageable_id", "imageable_type"],
        "index_imagings_on_imageable_id_and_imageable_type"
      );

      table.timestamps();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("images"),
    knex.schema.dropTable("imagings"),
  ]);
};
