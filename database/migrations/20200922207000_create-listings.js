exports.up = function (knex) {
  return knex.schema
    .createTable("listings", function (table) {
      table. bigIncrements("id");
      table.jsonb("countries");
      table.string("currency").notNullable();
      table.string("url").notNullable();
      table.decimal("price", 10, 2).notNullable();
      table.jsonb("sizes");

      table.string("listable_type").notNullable();
      table.integer("listable_id").notNullable();
      table.index(
        ["listable_id", "listable_type"],
        "index_listings_on_listable_id_and_listable_type"
      );

      table.integer("retailer_id").unsigned().notNullable();
      table
        .foreign("retailer_id")
        .references("retailers.id")
        .onDelete("CASCADE");
      table.index("retailer_id", "index_listings_on_retailer_id");

      table.timestamps();

      table.unique(["listable_id", "listable_type", "retailer_id", "currency"]);
    })
    .then(() => knex.seed.run({ specific: "006-seed-product-listings.js" }));
};

exports.down = function (knex) {
  return knex.schema.dropTable("listings");
};
