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
          <div class="column promo-header">
            <div class="promo-banner">
              <p class="promo-text">โปรโมชัน</p>
            </div>
          </div>
        </div>

        <div class="q-pa-md example-row-mix-and-match">
          <div class="row justify-center items-center">
            <div
              class="col-12 col-md-6 col-lg-4 product-wrapper"
              v-for="(product, index) in filteredProducts"
              :key="index"
            >
              <q-card class="product-card">
                <q-img :src="product.ProductImage" class="product-image">
                  <div class="absolute-bottom text-h6 product-title">
                    <span>{{ product.ProductName }}</span>
                  </div>
                </q-img>
                <div class="ellipsis product-description">
                  <p>{{ product.ProductName }}</p>
                  รายละเอียด: {{ product.ProductDescription }}
                </div>
                <div class="product-details">
                  ราคา {{ product.ProductPrice }} บาท
                  <div>ยอดคงเหลือ {{ product.ProductQuantity }} ชิ้น</div>
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
                </div>

                <div class="action-buttons">
                  <router-link
                    :to="`/product/${product.ProductID}`"
                    class="no-underline"
                  >
                    <q-btn class="btn outline">รายละเอียด</q-btn>
                  </router-link>
                  <q-btn
                    class="btn fill"
                    :disable="product.ProductQuantity === 0"
                    @click="addToCart(product)"
                  >
                    {{
                      product.ProductQuantity === 0 ? "สินค้าหมด" : "ใส่ตะกร้า"
                    }}
                  </q-btn>
                </div>

                <div class="product-info">
                  <div class="icon-container">
                    <button
                      class="icon-button"
                      :style="{
                        color: product.isFavorite ? 'white' : 'gray',
                        backgroundColor: product.isFavorite
                          ? 'red'
                          : 'transparent',
                      }"
                      @click="toggleFavorite(product)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        display="block"
                        id="Heart"
                      >
                        <path
                          d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.985.985 0 0 0 1.024 0C21.125 15.395 22 10.157 22 7.95 22 5.216 19.761 3 17 3s-5 3-5 3-2.239-3-5-3z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div class="viewer-count">
                    #{{ product.ProductCategory }} ยอดการขาย
                    {{ product.ProductSaleCount }} รายการ
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>

        <div class="shop-button-container">
          <q-btn
            unelevated
            color="brown-13"
            size="30px"
            label="เข้าสู่ร้านค้า"
            class="shop-button"
            @click="link"
          />
        </div>

        <div class="about-section">
          <p class="section-title">เกี่ยวกับฉัน</p>
          <div class="about-content">
            <div class="about-text">
              OTOP (One Tambon One Product) จังหวัดพะเยา
              เป็นโครงการส่งเสริมสินค้าท้องถิ่นในระดับชุมชน
              ที่ได้รับการสนับสนุนจากรัฐบาลไทย
              โครงการนี้เน้นการพัฒนาศักยภาพของชุมชนในแต่ละตำบล
              เพื่อสร้างผลิตภัณฑ์ที่มีคุณภาพและเอกลักษณ์เฉพาะตัว
              เพื่อกระจายรายได้เข้าสู่ชุมชน
              และสร้างงานสร้างอาชีพให้กับคนในท้องถิ่น
            </div>
            <div class="row">
              <div class="col-md-6">
                <p class="subsection-title">ที่ตั้งร้านค้า</p>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d333.11266926020534!2d99.90012479045728!3d19.1628709079874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d9d32b6858a6bb%3A0x92ff6f124b15f06e!2sBoat%20Pier%20to%20Wat%20Tilok%20Aram!5e0!3m2!1sen!2sth!4v1713344046066!5m2!1sen!2sth"
                  class="store-map"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div class="col-md-6">
                <p class="subsection-title">ที่อยู่ร้านค้า</p>
                <div class="store-address">
                  ถนนเลียบชายกว๊าน ตำบลเวียง อำเภอเมืองพะเยา ประเทศไทย 56000
                </div>
              </div>
            </div>
          </div>
        </div>

        <p class="section-title">ผลิตภัณฑ์ยอดนิยม</p>

        <div class="q-pa-md example-row-mix-and-match">
          <div class="row justify-center items-center">
            <div
              class="col-12 col-md-6 col-lg-4 product-wrapper"
              v-for="(product, index) in randomProducts"
              :key="index"
            >
              <q-card class="product-card">
                <q-img :src="product.ProductImage" class="product-image">
                  <div class="absolute-bottom text-h6 product-title">
                    <span>{{ product.ProductName }}</span>
                  </div>
                </q-img>
                <div class="ellipsis product-description">
                  <p>{{ product.ProductName }}</p>
                  รายละเอียด: {{ product.ProductDescription }}
                </div>
                <div class="product-details">
                  ราคา {{ product.ProductPrice }} บาท
                  <div>ยอดคงเหลือ {{ product.ProductQuantity }} ชิ้น</div>
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
                </div>

                <div class="action-buttons">
                  <router-link
                    :to="`/product/${product.ProductID}`"
                    class="no-underline"
                  >
                    <q-btn class="btn outline">รายละเอียด</q-btn>
                  </router-link>
                  <q-btn
                    class="btn fill"
                    :disable="product.ProductQuantity === 0"
                    @click="addToCart(product)"
                  >
                    {{
                      product.ProductQuantity === 0 ? "สินค้าหมด" : "ใส่ตะกร้า"
                    }}
                  </q-btn>
                </div>
                <div class="product-info">
                  <div class="icon-container">
                    <button
                      class="icon-button"
                      :style="{
                        color: product.isFavorite ? 'white' : 'gray',
                        backgroundColor: product.isFavorite
                          ? 'red'
                          : 'transparent',
                      }"
                      @click="toggleFavorite(product)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        display="block"
                        id="Heart"
                      >
                        <path
                          d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.985.985 0 0 0 1.024 0C21.125 15.395 22 10.157 22 7.95 22 5.216 19.761 3 17 3s-5 3-5 3-2.239-3-5-3z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div class="viewer-count">
                    #{{ product.ProductCategory }} ยอดการขาย
                    {{ product.ProductSaleCount }} รายการ
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>

        <div class="contact-section">
          <p class="section-title">ติดต่อเรา</p>
          <div class="contact-content">
            <div class="row justify-center items-center">
              <div class="col-md-6">
                <p class="subsection-title">ที่ตั้งร้านค้า</p>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d333.11266926020534!2d99.90012479045728!3d19.1628709079874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d9d32b6858a6bb%3A0x92ff6f124b15f06e!2sBoat%20Pier%20to%20Wat%20Tilok%20Aram!5e0!3m2!1sen!2sth!4v1713344046066!5m2!1sen!2sth"
                  class="store-map"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div class="col-md-6">
                <p class="subsection-title">ติดต่อร้านค้า</p>
                <div class="store-contact">
                  <div class="contact">
                    <a href="javascript:void(0)">
                      <q-icon name="phone" class="contact-icon" />
                      090-555-5555
                    </a>
                  </div>
                  <div class="contact">
                    <a href="javascript:void(0)">
                      <q-icon name="phone" class="contact-icon" />
                      090-xxx-xxxx
                    </a>
                  </div>
                  <div class="contact">
                    <a href="javascript:void(0)">
                      <q-icon name="email" class="contact-icon" />
                      090-xxx-xxxx
                    </a>
                  </div>
                  <div class="contact">
                    <a href="https://www.youtube.com/">
                      <q-icon name="location_on" class="contact-icon" />
                      090-xxx-xxxx
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  setup() {
    const slide = ref(1);
    const products = ref([]);
    const favorites = ref([]);
    const router = useRouter();
    const cart = ref([]);
    const randomProducts = ref([]);

    // Load favorites from server
    const loadFavorites = async () => {
      try {
        const memberId = sessionStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:3000/favorites/${memberId}`
        );
        favorites.value = response.data;
        // Mark products as favorite
        products.value.forEach((product) => {
          product.isFavorite = favorites.value.some(
            (fav) => fav.ProductID === product.ProductID
          );
        });
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    // Fetch products from server
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        products.value = response.data;
        randomizeProducts(); // Randomize products after fetching
        loadFavorites(); // Load favorites after fetching products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const randomizeProducts = () => {
      const shuffledProducts = [...products.value];
      for (let i = shuffledProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledProducts[i], shuffledProducts[j]] = [
          shuffledProducts[j],
          shuffledProducts[i],
        ];
      }
      randomProducts.value = shuffledProducts.slice(0, 6);
    };

    // Add to cart
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

    // Toggle favorite
    const toggleFavorite = async (product) => {
      try {
        const memberId = sessionStorage.getItem("userId");
        if (product.isFavorite) {
          // Remove from favorites
          await axios.delete(
            `http://localhost:3000/favorites/${memberId}/${product.ProductID}`
          );
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
          console.log("remove from fav.");
        } else {
          // Add to favorites
          await axios.post("http://localhost:3000/add-to-favorites", {
            member_id: memberId,
            product_id: product.ProductID,
          });
          product.isFavorite = true;
          favorites.value.push(product);
          Swal.fire({
            icon: "success",
            title: "เพิ่มเป็นผลิตภัณฑ์ที่ถูกใจ",
            showConfirmButton: false,
            timer: 1500,
          });
          console.log("add to fav.");
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    };

    // Computed properties
    const filteredProducts = computed(() =>
      products.value.filter((product) => product.ProductCategory === "โปรโมชัน")
    );

    // Initial data fetch
    fetchProducts();

    const link = () => {
      router.push("/shop");
    };

    return {
      slide,
      products,
      favorites,
      randomProducts,
      cart,
      addToCart,
      toggleFavorite,
      filteredProducts,

      autoplay: ref(2000),
      link,
    };
  },
};
</script>

<style scoped>
/* General Styles */
.col-1 {
  background-image: url("/src/assets/logo/bgside.png");
}

.col-10 {
  min-height: 100vh;
  background-color: #fce7d1;
}

/* Promo Banner */
.promo-header {
  height: 150px;
}

.promo-banner {
  background-color: white;
  text-align: center;
  font-size: 25px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  display: flex;
  justify-content: center;
  align-items: center;
}

.promo-text {
  margin-top: 30px;
  text-shadow: 1px 1px 50px #000000;
}

/* Product Card */
.product-wrapper {
  padding: 5px;
}

.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.product-image {
  height: auto;
  max-height: 200px; /* Adjust max height as needed */
  object-fit: cover;
}

.product-title {
  font-size: 18px;
  font-weight: bold;
  padding: 10px 0;
  text-align: center;
  margin: 0; /* Remove margins to avoid extra space */
}

.product-description {
  font-size: 14px;
  margin: 0 0 10px 0;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-details {
  font-size: 16px;
  padding: 10px 0;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0;
}

/* Shop Button */
.shop-button-container {
  display: flex;
  justify-content: center;
  margin: 25px 0 15px;
}

.shop-button {
  border-radius: 20px;
  width: 100%;
  max-width: 300px;
  height: 60px;
  font-size: 1.5rem;
  background-color: #5a350c;
  color: white;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.shop-button:hover {
  background-color: #442609;
  transform: translateY(-5px);
}

/* About Section */
.about-section {
  background-color: aliceblue;
  margin-top: 15px;
  padding: 50px;
}

.about-content {
  padding: 20px 50px;
  text-align: center;
}

.about-text {
  padding: 20px;
  text-align: justify;
  background-color: #d9d9d9;
  border-radius: 30px;
  font-size: 24px;
  margin-bottom: 30px;
}

.subsection-title {
  font-size: 28px;
  padding: 16px 0;
  color: #5a350c;
}

.store-map {
  border-radius: 20px;
  border: 2px solid #000;
  width: 100%;
  aspect-ratio: 16/9;
}

.store-address {
  padding: 20px;
  text-align: justify;
  background-color: #d9d9d9;
  border-radius: 30px;
  font-size: 24px;
}

/* Contact Section */
.contact-section {
  background-color: aliceblue;
}

.contact-content {
  padding: 45px;
}

.contact {
  text-align: center;
  background-color: #b19470;
  padding: 5px;
  margin-bottom: 20px;
  border-radius: 15px;
}

.contact a {
  text-decoration: none;
  color: black;
}

.contact-icon {
  font-size: 30px;
}

.section-title {
  text-align: center;
  font-size: 30px;
  padding: 15px 0;
  color: #5a350c;
  margin-top: 50px;
}

/* Buttons */
.btn {
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 0.8rem;
  letter-spacing: 2px;
  cursor: pointer;
  margin-right: 10px;
  transition: all 0.3s ease;
}

.outline {
  background: #fce7d1;
  color: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.6);
}

.outline:hover {
  transform: scale(1.125);
  color: rgba(0, 0, 0, 0.9);
  border-color: rgba(0, 0, 0, 0.9);
}

.fill {
  background: rgba(227, 51, 28, 0.9);
  color: rgb(253, 253, 253);
  font-weight: bold;
}

.fill:hover {
  transform: scale(1.125);
}

.icon-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-button {
  border: 0;
  background-color: #fff;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-size: 1.25rem;
  transition: 0.25s ease;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05), 0 3px 8px 0 rgba(0, 0, 0, 0.15);
  z-index: 1;
  cursor: pointer;
  color: #565656;

  svg {
    width: 1em;
    height: 1em;
  }

  &:hover,
  &:focus {
    background-color: #ec4646;
    color: #fff;
  }
}

.icon-button {
  border: 2px solid gray;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s, border-color 0.3s;
}

.icon-button:hover {
  background-color: red;
  border-color: red;
  color: white;
}

.viewer-count {
  padding: 10px;
  bottom: 10px;
  left: 10px;
  font-size: 14px;
  color: #555;
}

/* Responsive Design */
@media (max-width: 768px) {
  .promo-banner {
    font-size: 20px;
  }

  .shop-button {
    font-size: 1.25rem;
    height: 50px;
  }

  .product-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
  }

  .product-image {
    height: auto;
    max-height: 200px; /* Adjust max height as needed */
    object-fit: cover;
  }

  .product-title {
    font-size: 20px;
  }

  .product-description {
    font-size: 14px;
  }

  .product-details {
    font-size: 16px;
  }

  .about-text,
  .store-address {
    font-size: 20px;
  }

  .subsection-title {
    font-size: 24px;
  }

  .contact-content {
    padding: 30px;
  }

  .section-title {
    font-size: 24px;
  }
}

@media (max-width: 576px) {
  .promo-banner {
    font-size: 18px;
  }

  .shop-button {
    font-size: 1rem;
    height: 45px;
  }

  .product-title {
    font-size: 18px;
  }

  .product-description {
    font-size: 12px;
  }

  .product-details {
    font-size: 14px;
  }

  .about-text,
  .store-address {
    font-size: 18px;
  }

  .subsection-title {
    font-size: 20px;
  }

  .contact-content {
    padding: 20px;
  }

  .section-title {
    font-size: 20px;
  }
}
</style>
