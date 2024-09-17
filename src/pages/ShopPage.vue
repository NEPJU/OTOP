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
          <div>
            <div
              style="
                background-color: white;
                text-align: center;
                font-size: 25px;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                  0 6px 20px 0 rgba(0, 0, 0, 0.19);
              "
            >
              <div style="text-shadow: 1px 1px 50px #000000; padding-top: 15px">
                ผลิตภัณฑ์
              </div>
              <div style="padding-bottom: 15px">
                <a
                  href="javascript:void(0)"
                  class="mr-2 type"
                  :class="{ active: selectedType === 'เสื้อผ้า' }"
                  @click="selectedType = 'เสื้อผ้า'"
                >
                  เสื้อผ้า
                </a>
                <span>&nbsp;&nbsp;</span>
                <a
                  href="javascript:void(0)"
                  class="mr-2 type"
                  :class="{ active: selectedType === 'อาหาร' }"
                  @click="selectedType = 'อาหาร'"
                  >อาหาร</a
                >
                <span>&nbsp;&nbsp;</span>
                <a
                  href="javascript:void(0)"
                  class="mr-2 type"
                  :class="{ active: selectedType === 'เครื่องดื่ม' }"
                  @click="selectedType = 'เครื่องดื่ม'"
                  >เครื่องดื่ม</a
                >
                <span>&nbsp;&nbsp;</span>
                <a
                  href="javascript:void(0)"
                  class="mr-2 type"
                  :class="{ active: selectedType === 'สมุนไพร' }"
                  @click="selectedType = 'สมุนไพร'"
                  >สมุนไพร</a
                >
                <span>&nbsp;&nbsp;</span>
                <a
                  href="javascript:void(0)"
                  class="mr-2 type"
                  :class="{ active: selectedType === 'ของที่ระลึก' }"
                  @click="selectedType = 'ของที่ระลึก'"
                  >ของที่ระลึก</a
                >
                <span>&nbsp;&nbsp;</span>
                <a
                  href="javascript:void(0)"
                  class="mr-2 type"
                  :class="{ active: selectedType === '' }"
                  @click="selectedType = ''"
                  >แสดงสินค้าทั้งหมด</a
                >

                <span>&nbsp;&nbsp;</span>
                <q-dropdown>
                  <q-btn-dropdown
                    flat
                    label="เรียงตาม"
                    color="black"
                    style="font-size: 16px"
                  >
                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        @click="sortByAlphabetical"
                        ><q-item-label>เรียงตามตัวอักษร</q-item-label></q-item
                      >
                      <q-item
                        clickable
                        v-close-popup
                        @click="sortByPriceDescending"
                        ><q-item-label
                          >เรียงตามราคา (มากไปน้อย)</q-item-label
                        ></q-item
                      >
                      <q-item
                        clickable
                        v-close-popup
                        @click="sortByPriceAscending"
                        ><q-item-label
                          >เรียงตามราคา (น้อยไปมาก)</q-item-label
                        ></q-item
                      >
                      <q-item
                        clickable
                        v-close-popup
                        @click="sortByPurchaseCount"
                        ><q-item-label>เรียงตามยอดซื้อ</q-item-label></q-item
                      >
                      <q-item clickable v-close-popup @click="sortByProductId"
                        ><q-item-label>สินค้าทั้งหมด</q-item-label></q-item
                      >
                    </q-list>
                  </q-btn-dropdown>
                </q-dropdown>
                <input
                  v-model="searchTerm"
                  :options="filteredOptions"
                  @filter="filter"
                  placeholder="ค้นหาผลิตภัณฑ์"
                  dense
                  class="search-input"
                  style="
                    border: 1px solid #ccc;
                    border-radius: 20px;
                    padding: 8px 16px;
                    font-size: 14px;
                  "
                  @input="filterProducts"
                />
                <div v-if="filteredProducts.length === 0" class="no-results">
                  ไม่พบผลิตภัณฑ์ที่ค้นหา

                  <div
                    v-for="(option, index) in stringOptions"
                    :key="index"
                    style="padding: 5px; border-bottom: 1px solid #ccc"
                  >
                    <!-- Display string options here -->
                    <p>{{ option }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="q-pa-md example-row-mix-and-match">
          <div class="row justify-center items-center">
            <!-- Product Cards -->

            <div
              class="col-12 col-md-6 col-lg-4"
              v-for="(product, index) in filteredProducts"
              :key="index"
              style="padding: 5px"
            >
              <q-card class="product-card">
                <q-img :src="product.ProductImage" class="product-image">
                  <div class="absolute-bottom text-h6">
                    <span style="font-size: 24px">{{
                      product.ProductName
                    }}</span>
                  </div>
                </q-img>
                <div class="ellipsis" style="font-size: 20px">
                  <p style="font-size: 24px">{{ product.ProductName }}</p>
                  รายละเอียด: {{ product.ProductDescription }}
                </div>
                <div>
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
                      {{ parseFloat(product.averageRating).toFixed(1) }}/5
                    </p>
                  </div>

                  <!-- แสดงข้อความเมื่อไม่มีการรีวิว -->
                  <div v-else>
                    <p>ยังไม่มีการรีวิว</p>
                  </div>
                </div>

                <div
                  style="
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: center;
                  "
                >
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

        <!-- Pagination -->
        <div class="d-flex justify-center">
          <q-pagination v-model="currentPage" :total-pages="totalPages" />
        </div>

        <div class="d-flex justify-center mt-4" style="margin: 15px">
          <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
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
    const selectedType = ref("");
    const searchTerm = ref("");
    const router = useRouter();
    const cart = ref([]);

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

    // Initial load of products and favorites
    axios
      .get("http://localhost:3000/products")
      .then((response) => {
        products.value = response.data;
        loadFavorites();
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    const filteredProducts = computed(() => {
      return products.value.filter((product) => {
        const matchesType =
          selectedType.value === "" ||
          product.ProductCategory === selectedType.value;
        const matchesSearch = product.ProductName.toLowerCase().includes(
          searchTerm.value.toLowerCase()
        );
        return matchesType && matchesSearch;
      });
    });

    const sortByAlphabetical = () => {
      products.value.sort((a, b) => a.ProductName.localeCompare(b.ProductName));
    };

    const sortByPriceDescending = () => {
      products.value.sort((a, b) => b.ProductPrice - a.ProductPrice);
    };

    const sortByPriceAscending = () => {
      products.value.sort((a, b) => a.ProductPrice - b.ProductPrice);
    };

    const sortByPurchaseCount = () => {
      products.value.sort((a, b) => b.ProductSaleCount - a.ProductSaleCount);
    };

    const sortByProductId = () => {
      products.value.sort((a, b) => a.ProductID - b.ProductID);
    };

    const filterProducts = () => {
      return products.value.filter((product) => {
        return (
          product.ProductName.toLowerCase().includes(
            searchTerm.value.toLowerCase()
          ) ||
          product.ProductCategory.toLowerCase().includes(
            searchTerm.value.toLowerCase()
          )
        );
      });
    };

    const link = () => {
      router.push("/main");
    };

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

    return {
      products,
      favorites,
      selectedType,
      searchTerm,
      filteredProducts,
      sortByAlphabetical,
      sortByPriceDescending,
      sortByPriceAscending,
      sortByPurchaseCount,
      sortByProductId,
      filterProducts,
      toggleFavorite,
      link,
      slide,
      addToCart,
    };
  },
};
</script>

<style>
.col-1 {
  background-image: url("/src/assets/logo/bgside.png");
}

.col-10 {
  min-height: 100vh;
  background-color: #fce7d1;
}

.my-card {
  height: 00px;
  max-width: 500px;
}

.contact {
  text-align: center;
  background-color: #b19470;
  padding: 5px 5px 5px 5px;
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

.d-flex.justify-center {
  display: flex;
  justify-content: center;
}

.no-underline {
  text-decoration: none;
  color: #000000;
  font-size: 18px;
}

.container {
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.125);

  filter: drop-shadow(0 30px 10px rgba(0, 0, 0, 0.125));
  max-height: 550px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.description {
  color: black;
  font-size: 16px;
}

.button-wrapper {
  margin-top: 18px;
}

.btn {
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 12px;
  font-size: 0.8rem;
  letter-spacing: 2px;
  cursor: pointer;
  margin-right: 10px;
}

.btn + .btn {
  margin-left: 10px;
}

.outline {
  background: #fce7d1;
  color: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease;
}

.outline:hover {
  transform: scale(1.125);
  color: rgba(0, 0, 0, 0.9);
  border-color: rgba(0, 0, 0, 0.9);
  transition: all 0.3s ease;
}

.fill {
  background: rgba(227, 51, 28, 0.9);
  color: rgb(253, 253, 253);
  filter: drop-shadow(0);
  font-weight: bold;
  transition: all 0.3s ease;
}

.fill:hover {
  transform: scale(1.125);
  border-color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 10px 5px rgba(0, 0, 0, 0.125));
  transition: all 0.3s ease;
}

.icon-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
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

.viewer-count {
  padding: 0px 10px 0px 0px;
  position: absolute; /* ตำแหน่งเป็น absolute */
  bottom: 10px; /* จัดตำแหน่งด้านล่าง */
  left: 10px; /* จัดตำแหน่งด้านซ้าย */
  font-size: 14px; /* ขนาดตัวอักษร */
  color: #555; /* สีข้อความ */
}

.type {
  text-decoration: none;
  font-size: 18px;
}

/* เพิ่มเงื่อนไขสำหรับประเภทที่เลือก */
.type.active {
  color: black; /* สีของประเภทที่เลือก */
  font-weight: bold; /* เพิ่มหน้าตัวหนา */
}

/* เพิ่มเงื่อนไขสำหรับประเภทที่ไม่ได้เลือก */
.type:not(.active) {
  color: gray; /* สีของประเภทที่ไม่ได้เลือก */
}

.search-input {
  max-width: calc(
    100% - 120px
  ); /* ปรับความกว้างให้พอดีกับขนาดของปุ่มเรียงลำดับ */
}

.product-card {
  height: 600px;
}
.product-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.product-title {
  flex-grow: 1;
  font-size: 24px;
  font-weight: bold;
}
.product-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.product-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-image {
  height: 300px;
  object-fit: cover;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.icon-container {
  display: flex;
  align-items: center;
}
.icon-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.no-results {
  font-size: 16px;
  color: red;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
