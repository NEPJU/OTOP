<template>
  <div>
    <div class="row">
      <div class="col-1"></div>
      <div class="col-10">
        <q-carousel
          animated
          v-model="slide"
          arrows
          navigation
          infinite
          :autoplay="autoplay"
          class="carousel-container"
        >
          <q-carousel-slide
            :name="1"
            img-src="/src/assets/logo/bgcontent.png"
          />
          <q-carousel-slide
            :name="2"
            img-src="/src/assets/logo/bgcontent.png"
          />
        </q-carousel>

        <div
          v-if="product"
          class="header d-flex justify-center align-center q-mt-md q-pa-sm"
        >
          <p class="header-text">{{ product.ProductName }}</p>
        </div>

        <div v-if="product" class="q-mt-md">
          <div class="row">
            <div class="col-md-6 card-container">
              <q-card class="my-card">
                <div class="q-pa-sm q-mb-md">
                  <!-- Carousel สำหรับแสดงผลรูปภาพสินค้า พร้อม Thumbnails -->
                  <q-carousel
                    v-if="product.images && product.images.length > 0"
                    v-model="slideProductImages"
                    animated
                    arrows
                    infinite
                    navigation
                  >
                    <q-carousel-slide
                      v-for="(image, index) in product.images"
                      :key="index"
                      :name="index"
                      :img-src="image"
                    />
                  </q-carousel>
                  <div class="thumbnails-container q-mt-sm">
                    <q-btn
                      v-for="(thumb, index) in product.images"
                      :key="index"
                      flat
                      @click="slideProductImages = index"
                      class="thumbnail-btn"
                    >
                      <q-img
                        :src="thumb"
                        alt="Thumbnail Image"
                        class="thumbnail-img"
                      />
                    </q-btn>
                  </div>
                </div>
                <q-card-section>
                  <div class="row">
                    <div class="col text-h6 ellipsis product-name">
                      <!-- {{ product.ProductName }} -->
                    </div>
                  </div>
                  <!-- <q-rating
                    v-model="stars"
                    :max="5"
                    size="32px"
                    color="orange"
                  /> -->
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-6 details">
              <p class="title">{{ product.ProductName }}</p>
              <p class="description">
                {{ product.ProductDescription }}
              </p>
              <p class="price">฿{{ product.ProductPrice }}</p>
              <p class="quantity">คงเหลือ {{ product.ProductQuantity }} ชิ้น</p>

              <!-- เช็คว่ามีการให้คะแนนหรือไม่ -->
              <div
                v-if="
                  product.averageRating !== null &&
                  product.averageRating !== undefined &&
                  !isNaN(product.averageRating)
                "
              >
                <q-rating
                  v-model="product.averageRating"
                  max="5"
                  color="amber"
                  size="24px"
                  readonly
                />
                <p>
                  คะแนนเฉลี่ย:
                  {{ parseFloat(product.averageRating).toFixed(1) }}
                </p>
              </div>

              <!-- แสดงข้อความเมื่อไม่มีการรีวิว -->
              <div v-else>
                <p>ยังไม่มีการรีวิว</p>
              </div>

              <div class="amount-controls q-mt-md">
                <q-btn
                  @click="decreaseAmount"
                  color="primary"
                  outline
                  icon="remove"
                  class="amount-btn"
                />
                <q-input
                  v-model="selectedAmount"
                  readonly
                  class="amount-display"
                  align="center"
                  dense
                />
                <q-btn
                  @click="increaseAmount"
                  color="primary"
                  outline
                  icon="add"
                  class="amount-btn"
                />
              </div>

              <q-btn color="red-12" class="total-price q-mt-md"
                >รวมราคา: ฿{{ selectedAmount * product.ProductPrice }}</q-btn
              >

              <div class="order-buttons q-mt-md">
                <q-btn
                  color="red-12"
                  class="order"
                  @click="toggleFavorite(product)"
                  icon="favorite"
                >
                  {{
                    product.isFavorite
                      ? "นำออกจากสินค้าที่ชอบ"
                      : "เพิ่มในสินค้าที่ชอบ"
                  }}
                </q-btn>
                <q-btn
                  color="secondary"
                  class="order q-ml-sm"
                  :disable="product.ProductQuantity === 0"
                  @click="addToCart(product)"
                  icon="shopping_cart"
                >
                  ซื้อสินค้า
                </q-btn>
              </div>
            </div>
          </div>

          <!-- แสดงส่วนความคิดเห็นและรีวิว -->
          <h2 class="q-mt-lg comment-heading">แสดงความคิดเห็น</h2>
          <div class="comment-section q-pa-sm">
            <!-- ช่องให้คะแนนภายในความคิดเห็น -->

            <q-input
              v-model="comment"
              placeholder="เขียนความคิดเห็น"
              filled
              stack-label
            />
            <q-rating
              v-model="stars"
              :max="5"
              color="orange"
              size="24px"
              class="q-mb-sm"
            />
          </div>
          <div class="comment-buttons q-mt-sm">
            <q-btn color="positive" @click="submitReview">ส่งความคิดเห็น</q-btn>
            <q-btn flat color="negative" @click="cancelComment" class="q-ml-sm"
              >ยกเลิก</q-btn
            >
          </div>

          <h2 class="q-mt-lg review-heading">รีวิวจากผู้ใช้</h2>
          <div v-if="reviews.length > 0">
            <div
              v-for="review in reviews"
              :key="review.review_id"
              class="review-card q-mt-md"
            >
              <div class="review-content">
                <img
                  :src="review.profileimg"
                  alt="Profile Image"
                  class="profile-img"
                />
                <div class="review-details">
                  <p><strong>ผู้ใช้:</strong> {{ review.username }}</p>
                  <p>{{ review.review }}</p>
                  <small
                    >รีวิวเมื่อ
                    {{ formatDateToThai(review.review_date) }}</small
                  >
                  <q-rating
                    :value="review.rating"
                    readonly
                    size="16px"
                    color="orange"
                  />
                </div>
                <div v-if="review.username === currentUser?.username">
                  <q-btn
                    color="negative"
                    @click="deleteReview(review.review_id)"
                    icon="delete"
                    flat
                  >
                    ลบรีวิว
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>ยังไม่มีรีวิวสำหรับสินค้านี้</p>
          </div>
        </div>
        <div v-else>
          <p>กำลังโหลด...</p>
        </div>
        <div class="d-flex justify-center q-mt-lg">
          <q-btn @click="link" color="red" label="กลับหน้าร้านค้า" />
        </div>
      </div>
      <div class="col-1"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

export default {
  setup() {
    const products = ref([]);
    const router = useRouter();
    const slide = ref(1);
    const slideProductImages = ref(0);
    const autoplay = ref(true);
    const selectedAmount = ref(0);
    const stars = ref(0);
    const comment = ref("");
    const cart = ref([]);
    const favorites = ref([]);
    const reviews = ref([]);
    const currentUser = ref(null);

    const loadFavorites = async () => {
      try {
        const memberId = sessionStorage.getItem("userId");
        if (!memberId) return;

        const response = await axios.get(
          `http://localhost:3000/favorites/${memberId}`
        );
        favorites.value = response.data;
        updateFavoriteStatus();
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    const formatDateToThai = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    };

    const updateFavoriteStatus = () => {
      products.value.forEach((product) => {
        product.isFavorite = favorites.value.some(
          (fav) => fav.ProductID === product.ProductID
        );
      });
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        products.value = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const link = () => {
      router.push("/shop");
    };

    const increaseAmount = () => {
      if (selectedAmount.value < product.value.ProductQuantity) {
        selectedAmount.value++;
      }
    };

    const decreaseAmount = () => {
      if (selectedAmount.value > 0) {
        selectedAmount.value--;
      }
    };

    const product = computed(() => {
      const productId = parseInt(router.currentRoute.value.params.id);
      return products.value.find((prod) => prod.ProductID === productId);
    });

    const addToCart = async (product) => {
      if (selectedAmount.value < 1) {
        Swal.fire({
          icon: "error",
          title: "กรุณาเลือกจำนวนสินค้าอย่างน้อย 1 ชิ้น",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      try {
        const memberId = sessionStorage.getItem("userId");
        if (!memberId) {
          Swal.fire({
            icon: "error",
            title: "กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        // ตรวจสอบว่ามีสินค้าชิ้นนี้อยู่ในตะกร้าแล้วหรือไม่
        const existingCartItemIndex = cart.value.findIndex(
          (cartItem) => cartItem.ProductID === product.ProductID
        );

        if (existingCartItemIndex !== -1) {
          // หากมีสินค้าอยู่ในตะกร้าแล้ว เพิ่มจำนวนสินค้า
          cart.value[existingCartItemIndex].ProductQuantity +=
            selectedAmount.value;
        } else {
          // หากยังไม่มีสินค้าในตะกร้า ให้เพิ่มสินค้าใหม่
          cart.value.push({
            ProductID: product.ProductID,
            ProductName: product.ProductName,
            ProductImage: product.ProductImage,
            ProductPrice: product.ProductPrice,
            ProductQuantity: selectedAmount.value,
          });
        }

        // บันทึกตะกร้าลงใน localStorage
        localStorage.setItem("cart", JSON.stringify(cart.value));

        // บันทึกข้อมูลลงในฐานข้อมูล
        const response = await axios.post("http://localhost:3000/add-to-cart", {
          memberId: memberId,
          productId: product.ProductID,
          quantity: selectedAmount.value, // ส่งจำนวนสินค้าที่เลือก
        });

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "เพิ่มสินค้าลงในตะกร้าสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          console.error("Failed to add product to cart");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการเพิ่มสินค้าลงในตะกร้า",
          text: error.message,
          showConfirmButton: true,
        });
      }
    };

    const toggleFavorite = async (product) => {
      try {
        const memberId = sessionStorage.getItem("userId");

        if (!memberId) {
          Swal.fire({
            icon: "error",
            title: "กรุณาเข้าสู่ระบบ",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        if (product.isFavorite) {
          const response = await axios.delete(
            `http://localhost:3000/favorites/${memberId}/${product.ProductID}`
          );

          if (response.data.success) {
            product.isFavorite = false;
            favorites.value = favorites.value.filter(
              (fav) => fav.ProductID !== product.ProductID
            );
            Swal.fire({
              icon: "success",
              title: "ลบออกจากผลิตภัณฑ์ที่ถูกใจสำเร็จ",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            throw new Error("Failed to remove favorite");
          }
        } else {
          const payload = {
            member_id: memberId,
            product_id: product.ProductID,
          };

          const response = await axios.post(
            "http://localhost:3000/add-to-favorites",
            payload,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            product.isFavorite = true;
            favorites.value.push(product);
            Swal.fire({
              icon: "success",
              title: "เพิ่มเป็นผลิตภัณฑ์ที่ถูกใจ",
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            throw new Error("Failed to add favorite");
          }
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);

        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: error.response ? error.response.data.message : error.message,
          showConfirmButton: true,
        });
      }
    };

    const submitRating = async () => {
      if (stars.value > 0) {
        try {
          await axios.post("http://localhost:3000/product-ratings", {
            productId: product.value.ProductID,
            memberId: sessionStorage.getItem("userId"),
            rating: stars.value,
          });
          Swal.fire("สำเร็จ", "คะแนนถูกบันทึกแล้ว", "success");
          fetchReviews(); // อัพเดตรีวิวหลังจากให้คะแนน
        } catch (error) {
          Swal.fire("ข้อผิดพลาด", "ไม่สามารถบันทึกคะแนนได้", "error");
        }
      } else {
        Swal.fire("ข้อผิดพลาด", "กรุณาเลือกคะแนน", "error");
      }
    };

    const submitReview = async () => {
      if (comment.value.trim()) {
        try {
          await axios.post("http://localhost:3000/product-reviews", {
            productId: product.value.ProductID,
            memberId: sessionStorage.getItem("userId"),
            review: comment.value,
            rating: stars.value,
          });
          Swal.fire("สำเร็จ", "ความคิดเห็นถูกบันทึกแล้ว", "success");
          comment.value = ""; // ล้างฟิลด์รีวิวหลังจากส่งสำเร็จ
          fetchReviews(); // อัพเดตรีวิวหลังจากเพิ่มรีวิว
        } catch (error) {
          Swal.fire("ข้อผิดพลาด", "ไม่สามารถบันทึกความคิดเห็นได้", "error");
        }
      } else {
        Swal.fire("ข้อผิดพลาด", "กรุณาเขียนความคิดเห็น", "error");
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/product-reviews/${product.value.ProductID}`
        );
        reviews.value = response.data;
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const cancelComment = () => {
      comment.value = "";
    };

    const deleteReview = async (reviewId) => {
      try {
        const confirmed = await Swal.fire({
          title: "ยืนยันการลบ",
          text: "คุณต้องการลบรีวิวนี้หรือไม่?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "ลบ",
          cancelButtonText: "ยกเลิก",
        });

        if (confirmed.isConfirmed) {
          await axios.delete(
            `http://localhost:3000/product-reviews/${reviewId}`
          );
          Swal.fire("สำเร็จ", "รีวิวถูกลบแล้ว", "success");
          await fetchReviews(); // อัพเดตรีวิวหลังจากลบสำเร็จ
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบรีวิวได้", "error");
      }
    };

    const loadCurrentUser = async () => {
      const memberId = sessionStorage.getItem("userId");
      if (memberId) {
        const response = await axios.get(
          `http://localhost:3000/user/${memberId}`
        );
        currentUser.value = response.data;
      }
    };

    onMounted(async () => {
      await fetchProducts();
      await loadFavorites();
      updateFavoriteStatus();
      await loadCurrentUser(); // โหลดข้อมูลผู้ใช้ที่ล็อกอินอยู่
      if (product.value) {
        await fetchReviews(); // ดึงรีวิวหลังจากที่โหลดข้อมูลสินค้า
      }
    });

    return {
      products,
      slide,
      slideProductImages,
      autoplay,
      link,
      increaseAmount,
      decreaseAmount,
      product,
      stars,
      selectedAmount,
      addToCart,
      comment,
      submitRating,
      submitReview,
      cancelComment,
      cart,
      toggleFavorite,
      reviews,
      formatDateToThai,
      deleteReview,
      currentUser,
    };
  },
};
</script>

<style scoped>
/* General Container */
.col-10 {
  min-height: 100vh;
  background-color: #f9f6f2;
  padding-bottom: 40px;
}

.col-1 {
  background-image: url("/src/assets/logo/bgside.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

/* Carousel */
.carousel-container {
  margin-top: 20px;
}

/* Header */
.header {
  background-color: #ffffff;
  text-align: center;
  font-size: 35px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  text-shadow: 1px 1px 20px #888;
  border-radius: 12px;
  padding: 10px 0;
}

.header-text {
  font-weight: bold;
  color: #5a350c;
}

/* Product Card */
.card-container {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.my-card {
  width: 100%;
  max-width: 450px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.product-image {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
}

/* Product Details */
.details {
  padding: 15px;
}

.title {
  font-size: 26px;
  font-weight: bold;
  color: #333;
}

.description {
  font-size: 16px;
  color: #555;
  margin-top: 10px;
}

.price {
  font-size: 22px;
  color: #d9534f;
  margin-top: 15px;
}

.quantity {
  font-size: 16px;
  color: #555;
  margin-top: 5px;
}

.amount-controls {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.amount-btn {
  font-size: 18px;
  width: 50px;
  height: 50px;
}

.amount-display {
  width: 80px;
  text-align: center;
  font-size: 18px;
  border: 1px solid #ddd;
  margin: 0 10px;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
}

/* Order Buttons */
.order-buttons {
  margin-top: 20px;
}

.order {
  font-size: 16px;
  width: 240px;
  padding: 12px;
  text-transform: none;
}

/* Comment Section */
.comment-section {
  background-color: #ffffff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.comment-buttons {
  margin-top: 15px;
  display: flex;
  align-items: center;
}

/* Reviews */
.review-card {
  background-color: #ffffff;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
}

.review-content {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.review-details {
  flex: 1;
}

.delete-button {
  color: #d9534f;
}

/* Spacing and Margins */
.q-mt-md {
  margin-top: 20px;
}

.q-mt-lg {
  margin-top: 40px;
}

.q-mt-sm {
  margin-top: 10px;
}

.q-pa-sm {
  padding: 10px;
}

.q-pa-md {
  padding: 20px;
}

.q-ml-sm {
  margin-left: 10px;
}

.q-ml-md {
  margin-left: 20px;
}

.comment-heading,
.review-heading {
  color: #333;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.d-flex.justify-center {
  display: flex;
  justify-content: center;
}

.thumbnails-container {
  display: flex;
  justify-content: center;
  overflow-x: auto;
  margin-top: 10px;
}

.thumbnail-btn {
  margin: 0 5px;
  padding: 0;
}

.thumbnail-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
