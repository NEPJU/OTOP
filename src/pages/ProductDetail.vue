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
          class="col-8 d-flex justify-center align-center header"
        >
          <p>{{ product.ProductName }}</p>
        </div>

        <div v-if="product">
          <div class="row">
            <div class="col-md-6 card-container">
              <q-card class="my-card">
                <div
                  style="display: flex; justify-content: center; padding: 10px"
                >
                  <img :src="product.ProductImage" alt="Product Image" />
                </div>

                <q-card-section>
                  <div class="row">
                    <div class="col text-h6 ellipsis">
                      {{ product.ProductName }}
                    </div>
                  </div>
                  <q-rating v-model="stars" :max="5" size="32px" />
                  <div class="view-count">
                    <p>ยอดผู้เข้าชม: {{ product.ViewCount }}</p>
                  </div>
                  <q-btn
                    @click="submitRating"
                    label="ส่งคะแนน"
                    color="primary"
                  />
                </q-card-section>
              </q-card>
            </div>
            <div class="col-md-6 details">
              <p class="title">{{ product.ProductName }}</p>
              <p class="description">
                รายละเอียด: {{ product.ProductDescription }}
              </p>
              <p class="price">ราคา {{ product.ProductPrice }} บาท</p>
              <p>จำนวนคงเหลือ {{ product.ProductQuantity }} ชิ้น</p>
              <div class="amount-controls">
                <q-btn
                  @click="decreaseAmount"
                  color="red-12"
                  label="ลดจำนวน"
                  class="amount"
                />
                <q-btn color="red-12" class="amount" :label="selectedAmount" />
                <q-btn
                  @click="increaseAmount"
                  color="red-12"
                  label="เพิ่มจำนวน"
                  class="amount"
                />
              </div>
              <q-btn color="red-12" class="total-price"
                >ราคา {{ selectedAmount * product.ProductPrice }} บาท</q-btn
              >
              <div class="order-buttons">
                <q-btn
                  color="red-12"
                  class="order"
                  @click="toggleFavorite(product)"
                  style="margin-top: 15px; margin-bottom: 15px"
                >
                  <q-icon name="favorite" style="font-size: 20px" />
                  {{
                    product.isFavorite
                      ? "ลบออกจากผลิตภัณฑ์ที่ชอบ"
                      : "เพิ่มเป็นผลิตภัณฑ์ที่ชอบ"
                  }}
                </q-btn>
                <q-btn color="red-10" class="order" @click="addToCart(product)">
                  <q-icon
                    name="shopping_cart"
                    style="font-size: 20px; margin-left: 10px"
                  />ซื้อสินค้า
                </q-btn>
              </div>
            </div>
          </div>

          <!-- Section for Writing Review -->
          <h2>แสดงความคิดเห็น</h2>
          <div class="comment-section">
            <q-input
              v-model="comment"
              placeholder="แสดงความคิดเห็น"
              color="white"
              autogrow
              stack-label
            />
          </div>
          <div class="comment-buttons">
            <q-btn color="grey" @click="submitReview">ส่งความคิดเห็น</q-btn>
            <span>&nbsp;&nbsp;</span>
            <a @click="cancelComment">ยกเลิก</a>
          </div>

          <!-- Section for Displaying Reviews -->
          <h2>รีวิวจากผู้ใช้</h2>
          <div v-if="reviews.length > 0">
            <div
              v-for="review in reviews"
              :key="review.review_id"
              class="review-card"
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
                  <q-rating :value="review.rating" readonly size="16px" />
                </div>
                <div v-if="review.username === currentUser?.username">
                  <q-btn
                    color="negative"
                    @click="deleteReview(review.review_id)"
                    icon="delete"
                    label="ลบรีวิว"
                    class="delete-button"
                    flat
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>ยังไม่มีรีวิวสำหรับสินค้านี้</p>
          </div>
        </div>
        <div v-else>
          <p>Loading...</p>
        </div>
        <div class="d-flex justify-center mt-4">
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
      try {
        const memberId = sessionStorage.getItem("userId");
        const isProductInCart = cart.value.some(
          (cartItem) => cartItem.ProductID === product.ProductID
        );
        if (isProductInCart) {
          Swal.fire({
            icon: "warning",
            title: "สินค้านี้ได้อยู่ในตะกร้าอยู่แล้ว",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        const response = await axios.post("http://localhost:3000/add-to-cart", {
          memberId: memberId,
          productId: product.ProductID,
          quantity: 1,
        });

        if (response.data.success) {
          cart.value.push({
            ProductID: product.ProductID,
            ProductName: product.ProductName,
            ProductImage: product.ProductImage,
            ProductPrice: product.ProductPrice,
            ProductQuantity: 1,
          });

          localStorage.setItem("cart", JSON.stringify(cart.value));

          Swal.fire({
            icon: "success",
            title: "เพิ่มสินค้าลงในตะกร้าสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          console.log("Failed to add product to cart");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
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

<style>
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

.my-card {
  width: 550px;
  height: 550px;
}

.my-card img {
  display: flex;
  justify-content: center;
  width: 350px;
  height: 350px;
}

.card-container {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.header {
  background-color: white;
  text-align: center;
  font-size: 35px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin-top: 30px;
  text-shadow: 1px 1px 50px #000000;
}

.details {
  padding: 15px;
}

.title {
  font-size: 45px;
}

.description,
.price {
  font-size: 24px;
}

.amount-controls {
  display: flex;
  align-items: center;
}

.amount {
  font-size: 20px;
}

.total-price {
  margin-top: 15px;
}

.order-buttons {
  margin-top: 15px;
  margin-bottom: 15px;
}

.order {
  font-size: 20px;
  width: 280px;
  margin-right: 10px;
}

.comment-section {
  background-color: aliceblue;
}

.comment-buttons {
  margin-top: 15px;
}

.view-count {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 16px;
}

.review-card {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.review-content {
  display: flex;
  width: 100%;
  align-items: center;
}

.profile-img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
}

.review-details {
  flex: 1;
}

.delete-button {
  margin-left: auto;
  color: red;
}

.d-flex.justify-center {
  display: flex;
  justify-content: center;
}

.mt-4 {
  margin-top: 4px;
}
</style>
