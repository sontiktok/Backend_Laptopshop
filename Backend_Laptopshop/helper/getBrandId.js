const Brand = require("../models/Brand"); // Giả sử đường dẫn './models' là nơi bạn định nghĩa model Brand của mình.
async function getAllBrandIds() {
  try {
    const brands = await Brand.findAll({
      attributes: ["id"],
    });
    const brandIds = brands.map((brand) => brand.id);
    return brandIds;
  } catch (error) {
    console.error("Error fetching Brand ids:", error);
  }
}
module.exports = getAllBrandIds;
