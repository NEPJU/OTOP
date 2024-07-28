<template>
  <div>
    <div class="row">
      <div class="col-1"></div>
      <div class="col-10">
        <div>
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
        </div>
        <div
          v-if="product"
          class="col-8 d-flex justify-center align-center header"
        >
          <p>
            {{ product.ProductName }}
          </p>
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
                </q-card-section>
              </q-card>
            </div>
            <q-card> </q-card>
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
              <q-btn color="red-12" class="total-price">
                ราคา {{ selectedAmount * product.ProductPrice }} บาท
              </q-btn>
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
            <q-btn color="grey" @click="submitComment">ส่งความคิดเห็น</q-btn>
            <span>&nbsp;&nbsp;</span>
            <a @click="cancelComment">ยกเลิก</a>
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

    const loadFavorites = async () => {
      try {
        const memberId = sessionStorage.getItem("userId");
        if (!memberId) {
          return;
        }
        const response = await axios.get(
          `http://localhost:3000/favorites/${memberId}`
        );
        favorites.value = response.data;
        updateFavoriteStatus();
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
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
          // Remove from favorites
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
          // Add to favorites
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

    const submitComment = () => {
      Swal.fire({
        title: "ส่งความคิดเห็นเรียบร้อย",
        icon: "success",
      });
      comment.value = "";
    };

    const cancelComment = () => {
      comment.value = "";
    };

    onMounted(async () => {
      await fetchProducts();
      await loadFavorites();
      updateFavoriteStatus();
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
      submitComment,
      cancelComment,
      cart,
      toggleFavorite,
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

.d-flex.justify-center {
  display: flex;
  justify-content: center;
}

.mt-4 {
  margin-top: 4px;
}
</style>
