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
            <label for="image">รูปภาพสินค้า:</label>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              id="image"
              accept="image/*"
            />
          </div>
          <div v-if="imageBase64" class="image-preview">
            <img
              :src="imageBase64"
              alt="Product Image"
              style="
                width: 200px;
                height: 200px;
                justify-content: center;
                display: flex;
              "
            />
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
      imageBase64: null,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageBase64 = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async uploadImage() {
      if (
        !this.productName ||
        !this.imageBase64 ||
        !this.price ||
        !this.quantity ||
        !this.category
      ) {
        await Swal.fire({
          icon: "error",
          title: "ข้อมูลไม่ครบถ้วน",
          text: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ",
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
            image_base64: this.imageBase64,
          }
        );

        await Swal.fire({
          icon: "success",
          title: "อัปโหลดสำเร็จ",
          text: "รูปภาพได้ถูกอัปโหลดเรียบร้อยแล้ว",
        });

        console.log(response.data);

        // รีเซ็ตข้อมูลฟอร์ม
        this.resetForm();
      } catch (error) {
        await Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ",
          text: "กรุณาลองใหม่ภายหลัง",
        });
        console.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:", error);
      }
    },
    resetForm() {
      this.productName = "";
      this.description = "";
      this.price = 0;
      this.quantity = 0;
      this.category = "";
      this.imageBase64 = null;
      this.$refs.fileInput.value = null;
    },
    link() {
      this.$router.push("/admincart");
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
</style>
