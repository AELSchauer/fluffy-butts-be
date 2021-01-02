exports.seed = async function (knex) {
  await knex("users").delete();
  await knex("users").insert([
    {
      username: "aelschauer",
      email: "tefega4963@girtipo.com",
      encrypted_password:
        "$2b$10$MyxIJ/FgB0B2CkEJU9387OvT4rM3e4gbf0.ggjjeWxn8e1LLNfeeG",
      created_at: new Date(),
    },
  ]);
  return;
};
