<template>
  <div class="admin-container">
    <div class="row">
      <div class="col-1"></div>
      <div class="col-10">
        <q-toolbar class="c">
          <q-toolbar-title>Admin - Manage Product Reviews</q-toolbar-title>
          <q-btn
            color="primary"
            icon="arrow_back"
            label="Back to Admin Dashboard"
            @click="backToAdminDashboard"
            flat
          />
        </q-toolbar>

        <q-card v-if="product" class="product-details q-mb-md">
          <q-card-section>
            <div class="row q-gutter-md">
              <div class="col-md-4">
                <q-img
                  :src="product.image_base64"
                  alt="Product Image"
                  class="product-image"
                  :ratio="1"
                  spinner-color="primary"
                />
              </div>
              <div class="col-md-8">
                <h3>Product Details</h3>
                <p>
                  <strong>Product Name:</strong> {{ product?.product_name }}
                </p>
                <p><strong>Description:</strong> {{ product?.description }}</p>
                <p><strong>Price:</strong> {{ product?.price }} บาท</p>
                <p>
                  <strong>Quantity Available:</strong>
                  {{ product?.quantity }} ชิ้น
                </p>
                <q-rating v-model="stars" readonly size="20px" />
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card v-if="reviews.length > 0" class="q-mb-md">
          <q-card-section>
            <h3>Reviews</h3>
            <q-list>
              <q-item
                v-for="review in reviews"
                :key="review.review_id"
                class="review-card"
              >
                <q-item-section avatar>
                  <img size="50px" :src="review.profileimg" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <strong>User:</strong> {{ review.username }}
                  </q-item-label>
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
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <div v-else>
          <q-card>
            <q-card-section>
              <p>No reviews for this product.</p>
            </q-card-section>
          </q-card>
        </div>

        <q-btn
          @click="backToAdminDashboard"
          color="primary"
          label="Back to Admin Dashboard"
          class="q-mt-md"
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
      router.push("/admindash");
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
    };
  },
};
</script>

<style>
.admin-container {
  background-color: #fce7d1;

  border-radius: 8px;
}

.product-details {
  padding: 20px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.review-card {
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.q-btn {
  margin-top: 15px;
}

.c {
  background-color: brown;
  color: white;
}

.q-toolbar-title {
  font-weight: bold;
}

.col-10 {
  min-height: 100vh;
  background-color: #fce7d1;
}

.col-1 {
  background-image: url("/src/assets/logo/bgside.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
