<template lang="">
  <div>
    <!-- ส่วนที่จะแสดงข้อมูล -->
    <div v-if="product">
      <h2>{{ product.id }}</h2>
      <p>{{ product.name }}</p>
      <!-- เพิ่มส่วนอื่น ๆ ตามต้องการ -->
    </div>
    <!-- ส่วนสำหรับข้อผิดพลาด (ถ้ามี) -->
    <div v-else>
      <p>ไม่พบสินค้าที่ค้นหา</p>
    </div>
  </div>
</template>

<script>
const axios = require("axios");

// สร้างฟังก์ชันเพื่อดึงข้อมูลสินค้าตาม id
async function getProductById(productId) {
  try {
    // กำหนดค่า config สำหรับเรียก API
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:3000/products/${productId}`, // เพิ่ม id ของสินค้าเข้าไปใน URL
      headers: {},
    };

    // เรียกใช้ API ด้วย Axios
    const response = await axios.request(config);

    // แปลงข้อมูล JSON ที่ได้รับเป็นรูปแบบของตาราง Products
    const productData = response.data;
    const product = {
      product_id: productData.id,
      product_name: productData.name,
      description: productData.description,
      price: productData.price,
      quantity: productData.quantity,
      category: productData.category,
      created_at: productData.created_at,
      updated_at: productData.updated_at,
    };

    // แสดงข้อมูลสินค้า
    console.log(product);
  } catch (error) {
    console.error(error);
  }
}
</script>

<style lang="">
/* เพิ่มสไตล์ตามต้องการ */
</style>
