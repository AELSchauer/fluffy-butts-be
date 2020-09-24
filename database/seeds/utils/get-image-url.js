module.exports = {
  getProductImageUrl: (brand_name, product_line_name, product_name) =>
    `https://fluffy-butts-product-images.s3.us-east-2.amazonaws.com/${brand_name.replace(
      / /g,
      "+"
    )}/${product_line_name.replace(/ /g, "+")}/Products/${product_name
      .replace(/ /g, "+")
      .replace(/'/g, "")}.jpg`,
  getBrandImageUrl: (name) =>
    `https://fluffy-butts-product-images.s3.us-east-2.amazonaws.com/${name.replace(
      / /g,
      "+"
    )}/Logo.png`,
};
