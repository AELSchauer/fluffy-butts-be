exports.seed = async function (knex) {
  await knex("users").delete();
  await knex("users").insert([
    {
      username: "banana-split",
      email: "banana_split@gmail.com",
      encrypted_password:
        "$2b$10$MyxIJ/FgB0B2CkEJU9387OvT4rM3e4gbf0.ggjjeWxn8e1LLNfeeG",
      role: require('../../schema/user/roles-enum').ADMIN.value,
      created_at: new Date(),
    },
    {
      username: "rocky-road",
      email: "rocky_road@gmail.com",
      encrypted_password:
        "$2b$10$MyxIJ/FgB0B2CkEJU9387OvT4rM3e4gbf0.ggjjeWxn8e1LLNfeeG",
      role: require('../../schema/user/roles-enum').VIEWER.value,
      created_at: new Date(),
    },
  ]);
  return;
};
