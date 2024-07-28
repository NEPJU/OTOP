<template>
  <div class="upload-image-container">
    <div class="input-group">
      <label for="image-upload" class="upload-label">Choose an image</label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        @change="handleImageChange"
        class="upload-input"
      />
    </div>
    <input
      type="text"
      placeholder="Enter image name"
      v-model="imageName"
      class="image-name-input"
    />
    <img
      :src="imageUrl"
      v-if="imageUrl"
      class="preview-image"
      alt="Uploaded Image"
    />
    <button @click="submitImage" class="submit-button">Upload Image</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      imageUrl: "",
      imageName: "",
    };
  },
  methods: {
    async uploadImage(base64Data, imageName) {
      try {
        const response = await axios.post("http://localhost:3000/upload", {
          imageName: imageName,
          imageData: base64Data,
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    async submitImage() {
      if (this.imageUrl && this.imageName) {
        this.uploadImage(this.imageUrl, this.imageName);
      }
    },
    async handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = await this.readFile(file);
        this.imageUrl = imageUrl;
      }
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    },
  },
};
</script>

<style scoped>
.upload-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 350px; /* กำหนดขนาดการ์ด */
  max-width: 100%;
  margin: 20px auto; /* ทำให้การ์ดอยู่ตรงกลาง */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.upload-label {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
}

.upload-label:hover {
  background-color: #45a049;
}

.upload-input {
  display: none;
}

.image-name-input {
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 15px;
}

.preview-image {
  max-width: 100%;
  height: auto;
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
}

.submit-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
