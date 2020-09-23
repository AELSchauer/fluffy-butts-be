exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("tags", function (table) {
      table.increments("id");
      table.string("name").notNullable();
      table.integer("category").notNullable().defaultTo(0);

      table.index("name", "index_tags_on_name");
      table.index("category", "index_tags_on_category");

      table.timestamps();
    }),

    knex.schema.createTable("taggings", function (table) {
      table.increments("id");
      table.integer("tag_id").notNullable();
      table.string("taggable_type").notNullable();
      table.integer("taggable_id").notNullable();

      table.index("tag_id", "index_taggings_on_tag_id");
      table.index(
        ["taggable_id", "taggable_type"],
        "index_taggings_on_taggable_id_and_taggable_type"
      );

      table.timestamps();
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable("tags"),
    knex.schema.dropTable("taggings"),
  ]);
};
