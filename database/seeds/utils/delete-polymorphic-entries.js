const _ = require("lodash");

module.exports = {
  deleteImagesAndImagings: async (knex, imageable_type) => {
    const imageIds = await knex
      .select("image_id")
      .table("imagings")
      .where({ imageable_type });
    imageIds.length &&
      (await knex("images")
        .whereIn("id", _.map(imageIds, "image_id"))
        .delete());
    await knex("imagings").where({ imageable_type }).delete();
  },
};
