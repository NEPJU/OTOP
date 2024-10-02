<template>
  <div>
    <div class="row">
      <div class="col-1"></div>
      <div class="col-10">
        <q-toolbar class="toolbar">
          <q-toolbar-title>ดูรายละเอียด</q-toolbar-title>
          <!-- <q-btn
            color="primary"
            icon="arrow_back"
            label="Back to Admin Dashboard"
            @click="backToAdminDashboard"
            flat
          /> -->
        </q-toolbar>

        <!-- Product Details Section -->
        <div class="product-container">
          <q-card v-if="product" class="product-details">
            <q-card-section class="card-section">
              <!-- Image Gallery for Product -->
              <div class="image-gallery">
                <q-carousel
                  v-model="currentImageIndex"
                  navigation
                  arrows
                  animated
                  infinite
                  swipeable
                  class="carousel-container"
                >
                  <q-carousel-slide
                    v-for="(image, index) in product.images"
                    :key="index"
                    :name="index"
                    :img-src="image"
                    img-class="carousel-image"
                  />
                </q-carousel>
                <!-- Thumbnail images -->
                <div class="thumbnails">
                  <img
                    v-for="(image, index) in product.images"
                    :key="index"
                    :src="image"
                    :class="{
                      'thumbnail-active': index === currentImageIndex,
                    }"
                    @click="currentImageIndex = index"
                    class="thumbnail"
                  />
                </div>
              </div>

              <!-- Product Information -->
              <div class="product-info-section">
                <h3 class="section-title">รายละเอียดผลิตภัณฑ์</h3>
                <p class="product-info">
                  <strong>ชื่อผลิตภัณฑ์:</strong> {{ product?.product_name }}
                </p>
                <p class="product-info">
                  <strong>รายละเอียด:</strong> {{ product?.description }}
                </p>
                <p class="product-info">
                  <strong>ราคา:</strong> {{ product?.price }} บาท
                </p>
                <p class="product-info">
                  <strong>คงเหลือ:</strong>
                  {{ product?.quantity }} ชิ้น
                </p>
                <q-rating v-model="stars" readonly size="20px" />
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Reviews Section -->
        <q-card v-if="reviews.length > 0" class="reviews-section">
          <q-card-section>
            <h3 class="section-title">Reviews</h3>
            <q-list>
              <q-item
                v-for="review in reviews"
                :key="review.review_id"
                class="review-card"
              >
                <q-item-section avatar>
                  <img style="width: 50px" :src="review.profileimg" />
                </q-item-section>

                <q-item-section>
                  <q-item-label
                    ><strong>User:</strong> {{ review.username }}</q-item-label
                  >
                  <q-item-label>{{ review.review }}</q-item-label>
                  <q-item-label caption>
                    Reviewed on {{ formatDateToThai(review.review_date) }}
                  </q-item-label>
                  <q-rating :value="review.rating" readonly size="20px" />
                </q-item-section>

                <q-item-section side top>
                  <q-btn
                    color="negative"
                    @click="deleteReview(review.review_id)"
                    icon="delete"
                    label="Delete Review"
                    flat
                    class="delete-button"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- No Reviews Message -->
        <div v-else>
          <q-card class="no-reviews-card">
            <q-card-section>
              <p>No reviews for this product.</p>
            </q-card-section>
          </q-card>
        </div>

        <!-- Back Button -->
        <q-btn
          @click="backToAdminDashboard"
          color="primary"
          label="ย้อนกลับ"
          class="q-mt-md back-button"
        />
      </div>
      <div class="col-1"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

export default {
  setup() {
    const product = ref(null);
    const reviews = ref([]);
    const router = useRouter();
    const currentImageIndex = ref(0);

    const formatDateToThai = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    };

    const fetchProduct = async () => {
      try {
        const productId = parseInt(router.currentRoute.value.params.id);
        const response = await axios.get(
          `http://localhost:3000/products/${productId}`
        );

        product.value = response.data;

        // ตรวจสอบและแปลง images_base64 หากเป็น JSON String
        if (product.value.images_base64) {
          try {
            product.value.images = JSON.parse(product.value.images_base64);
          } catch (e) {
            console.error("Error parsing images_base64 JSON:", e);
            product.value.images = [];
          }
        } else {
          product.value.images = [];
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const productId = parseInt(router.currentRoute.value.params.id);
        const response = await axios.get(
          `http://localhost:3000/product-reviews/${productId}`
        );
        reviews.value = response.data;
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const deleteReview = async (reviewId) => {
      try {
        const confirmed = await Swal.fire({
          title: "Confirm Deletion",
          text: "Are you sure you want to delete this review?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
        });

        if (confirmed.isConfirmed) {
          await axios.delete(
            `http://localhost:3000/product-reviews/${reviewId}`
          );
          Swal.fire("Success", "Review deleted successfully", "success");
          await fetchReviews(); // Refresh the reviews list
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        Swal.fire("Error", "Unable to delete review", "error");
      }
    };

    const backToAdminDashboard = () => {
      router.push("/admin");
    };

    onMounted(async () => {
      await fetchProduct();
      await fetchReviews();
    });

    return {
      product,
      reviews,
      formatDateToThai,
      deleteReview,
      backToAdminDashboard,
      currentImageIndex,
    };
  },
};
</script>

<style>
.admin-container {
  background-color: #f5f5f5;
  padding: 20px;
}

.toolbar {
  background-color: #6d4c41;
  color: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.q-toolbar-title {
  font-weight: bold;
  color: #fff;
}

.product-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.product-details {
  width: 80%;
  max-width: 1200px;
  padding: 30px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease-in-out;
}

.card-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.image-gallery {
  width: 50%;

  align-items: center;
}

.carousel-container {
  max-width: 100%;
  margin-bottom: 15px;
}

.carousel-image {
  object-fit: cover;
  max-height: 450px;
}

.thumbnails {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.3s, transform 0.3s;
}

.thumbnail-active {
  border-color: #2196f3;
  transform: scale(1.1);
}

.thumbnail:hover {
  border-color: #2196f3;
}

.product-info-section {
  width: 45%;
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.product-info {
  margin-bottom: 12px;
  font-size: 18px;
  color: #444;
}

.reviews-section {
  padding: 30px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 30px;
}

.review-card {
  padding: 15px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.review-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.delete-button {
  transition: transform 0.3s ease;
}

.delete-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(255, 0, 0, 0.4);
}

.no-reviews-card {
  margin-top: 20px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 12px;
  text-align: center;
}

.back-button {
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  transition: background-color 0.3s, transform 0.3s;
}

.back-button:hover {
  background-color: #5d4037;
  transform: scale(1.05);
}

.col-10 {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.col-1 {
  background-image: url("/src/assets/logo/bgside.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
