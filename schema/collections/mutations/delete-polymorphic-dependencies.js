module.exports = (ids) => {
  const formattedIds = ids.map((id) => `'${id}'`).join(",");
  return client.query(
    `SELECT * FROM listings WHERE listable_type = 'Collection' AND listable_id in (${formattedIds});`
  );
};
