<template>
  <div class="row">
    <div class="col bg-side"></div>
    <div class="col-10 bg-center">
      <q-card
        class="my-card"
        bordered
        style="padding-bottom: 25px; padding-top: 15px"
      >
        <div style="text-align: center; font-size: 35px">ยินดีต้อนรับ</div>
        <div style="text-align: center; font-size: 25px">ADMIN</div>
        <div style="text-align: center; font-size: 30px">เพิ่มผลิตภัณฑ์</div>
      </q-card>
      <div class="container">
        <div>
          <h2>เพิ่มผลิตภัณฑ์</h2>
          <div class="input-group">
            <label for="productName">ชื่อผลิตภัณฑ์:</label>
            <input
              type="text"
              v-model="productName"
              id="productName"
              placeholder="กรอกชื่อสินค้า"
            />
          </div>
          <div class="input-group">
            <label for="description">คำอธิบาย:</label>
            <input
              type="text"
              v-model="description"
              id="description"
              placeholder="กรอกคำอธิบายสินค้า"
            />
          </div>
          <div class="input-group">
            <label for="price">ราคา:</label>
            <input
              type="number"
              v-model="price"
              id="price"
              placeholder="กรอกราคาสินค้า"
            />
          </div>
          <div class="input-group">
            <label for="quantity">จำนวน:</label>
            <input
              type="number"
              v-model="quantity"
              id="quantity"
              placeholder="กรอกจำนวนสินค้า"
            />
          </div>
          <div class="input-group">
            <label for="category">ประเภท:</label>
            <select v-model="category" id="category">
              <option value="">เลือกประเภทสินค้า</option>
              <option value="เสื้อผ้า">เสื้อผ้า</option>
              <option value="อาหาร">อาหาร</option>
              <option value="เครื่องดื่ม">เครื่องดื่ม</option>
              <option value="สมุนไพร">สมุนไพร</option>
              <option value="ของที่ระลึก">ของที่ระลึก</option>
              <option value="โปรโมชัน">โปรโมชัน</option>
            </select>
          </div>
          <div class="input-group">
            <label for="images">รูปภาพสินค้า:</label>
            <input
              type="file"
              ref="fileInput"
              multiple
              @change="handleFileChange"
              id="images"
              accept="image/*"
            />
          </div>
          <div v-if="imagesBase64.length" class="image-preview">
            <div
              v-for="(image, index) in imagesBase64"
              :key="index"
              class="image-container"
            >
              <img
                :src="image"
                alt="Product Image"
                style="
                  width: 200px;
                  height: 200px;
                  display: flex;
                  justify-content: center;
                "
              />
              <button @click="removeImage(index)" class="remove-btn">ลบ</button>
            </div>
          </div>

          <button
            class="upload-btn"
            style="margin-top: 15px"
            @click="uploadImage"
          >
            เพิ่มผลิตภัณฑ์
          </button>
          <div
            class="justify-center"
            style="display: flex; padding-bottom: 15px; margin-top: 15px"
          >
            <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
          </div>
        </div>
      </div>

      <!-- ส่วนแสดงรายการผลิตภัณฑ์ทั้งหมด -->
      <!-- <div class="products-list" style="margin-top: 30px">
        <h2>รายการผลิตภัณฑ์ทั้งหมด</h2>
        <div
          class="product-card"
          v-for="(product, index) in products"
          :key="index"
        >
          <div class="product-info">
            <h3>{{ product.product_name }}</h3>
            <p>{{ product.product_id }}</p>
            <p>{{ product.description }}</p>
            <p>ราคา: {{ product.price }} บาท</p>
            <p>จำนวน: {{ product.quantity }}</p>
            <p>ประเภท: {{ product.category }}</p>
          </div>
          <div v-if="product.images.length" class="product-images">
            <img
              v-for="(image, idx) in product.images"
              :src="image"
              :key="idx"
              alt="Product Image"
              style="width: 100px; height: 100px; margin: 5px"
            />
          </div>
        </div>
      </div> -->
    </div>
    <div class="col bg-side"></div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      productName: "",
      description: "",
      price: 0,
      quantity: 0,
      category: "",
      imagesBase64: [], // Store the base64 encoded images
      products: [], // Store the list of products
    };
  },
  created() {
    this.fetchProducts(); // Fetch the list of products on component creation
  },
  methods: {
    // Handle the image file input and convert to base64
    handleFileChange(event) {
      const files = event.target.files;

      // Append new files to the existing array of images
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagesBase64.push(reader.result); // Append each file's base64 result
        };
        reader.readAsDataURL(file);
      });
    },
    // Remove an image from the preview
    removeImage(index) {
      this.imagesBase64.splice(index, 1); // Remove the image at the given index
    },
    // Handle the image upload process
    async uploadImage() {
      if (
        !this.productName ||
        !this.imagesBase64.length ||
        !this.price ||
        !this.quantity ||
        !this.category
      ) {
        await Swal.fire({
          icon: "error",
          title: "Incomplete Information",
          text: "Please fill in all required fields.",
        });
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/upload-image",
          {
            product_name: this.productName,
            description: this.description,
            price: this.price,
            quantity: this.quantity,
            category: this.category,
            images_base64: this.imagesBase64,
          }
        );

        await Swal.fire({
          icon: "success",
          title: "Upload Successful",
          text: "Product images have been uploaded.",
        });

        console.log(response.data);

        // Refresh the product list
        this.fetchProducts();

        // Reset the form
        this.resetForm();
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "Error Uploading Images",
          text: "Please try again later.",
        });
        console.error("Error uploading images:", error);
      }
    },
    // Reset the form fields and file input
    resetForm() {
      this.productName = "";
      this.description = "";
      this.price = 0;
      this.quantity = 0;
      this.category = "";
      this.imagesBase64 = [];
      this.$refs.fileInput.value = null; // Reset file input
    },
    link() {
      this.$router.push("/admincart");
    },
    // Fetch all products (example)
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:3000/products");
        this.products = response.data; // Store the products retrieved from the server
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
  },
};
</script>

<style scoped>
.bg-side {
  background-image: url("/src/assets/logo/bgside.png");
  min-height: 100vh;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form h2 {
  margin-bottom: 20px;
  text-align: center;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input[type="text"],
.input-group input[type="number"],
.input-group input[type="file"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-group input[type="file"] {
  padding: 8px;
}

.upload-btn {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 18px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-btn:hover {
  background-color: #0056b3;
}

.products-list {
  margin-top: 20px;
}

.product-card {
  border: 1px solid #ccc;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.product-info {
  margin-bottom: 10px;
}

.product-images img {
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.image-container {
  position: relative;
  display: inline-block;
  margin-right: 10px;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: darkred;
}
</style>
