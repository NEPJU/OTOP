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
                <!-- ประเภทสินค้า -->
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

                <!-- กล่องค้นหา -->
                <input
                  v-model="searchTerm"
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- การแสดงข้อมูลผลิตภัณฑ์ -->
        <div class="q-pa-md example-row-mix-and-match">
          <div class="row justify-center items-center">
            <!-- Product Cards -->
            <div
              class="col-12 col-md-6 col-lg-4"
              v-for="(product, index) in displayedProducts"
              :key="index"
              style="padding: 5px"
            >
              <q-card class="container">
                <q-img
                  :src="product.images[0]"
                  alt="Product Image"
                  class="product-image"
                  style="width: 300px; height: 300px; margin-bottom: 5px"
                />
                <q-card-section class="description">
                  {{ product.ProductName }}
                </q-card-section>
                <q-card-section class="description">
                  รายละเอียด: {{ product.ProductDescription }}
                </q-card-section>
                <q-card-section class="description">
                  ราคา {{ product.ProductPrice }} บาท
                  <div>ยอดคงเหลือ {{ product.ProductQuantity }} ชิ้น</div>
                </q-card-section>
                <div class="button-wrapper">
                  <router-link
                    :to="`/aproduct/${product.ProductID}`"
                    class="no-underline"
                  >
                    <q-btn class="btn outline">รายละเอียด</q-btn>
                  </router-link>
                  <q-btn class="btn fill" @click="buy">ใส่ตระกร้า</q-btn>
                </div>
                <div>
                  <p><br />#{{ product.ProductCategory }}</p>
                </div>
                <div class="viewer-count">
                  ยอดการขาย {{ product.ProductSaleCount }} รายการ
                </div>
              </q-card>
            </div>
          </div>
        </div>

        <!-- การแบ่งหน้า -->
        <div class="d-flex justify-center">
          <q-pagination v-model="currentPage" :total-pages="totalPages" />
        </div>
        <!-- <div class="d-flex justify-center mt-4" style="margin: 15px">
          <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
        </div> -->
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
    const autoplay = ref(true);
    const router = useRouter();
    const products = ref([]);
    const selectedType = ref("");
    const searchTerm = ref("");

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        products.value = response.data.map((product) => {
          if (typeof product.ProductImage === "string") {
            try {
              product.images = JSON.parse(product.ProductImage);
            } catch (e) {
              console.error("Error parsing ProductImage JSON:", e);
              product.images = [];
            }
          } else {
            product.images = [];
          }
          return product;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();

    const filteredProducts = computed(() => {
      return products.value.filter((product) => {
        const matchesType =
          !selectedType.value || product.ProductCategory === selectedType.value;
        const matchesSearch =
          !searchTerm.value ||
          product.ProductName.toLowerCase().includes(
            searchTerm.value.toLowerCase()
          );
        return matchesType && matchesSearch;
      });
    });

    const buy = () => {
      Swal.fire({
        title: "คุณเป็นแอดมิน",
        icon: "error",
      });
    };

    const link = () => {
      router.push("/adminmain");
    };

    // ฟังก์ชันการเรียงลำดับ
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
      products.value.sort((a, b) => b.SalesCount - a.SalesCount);
    };
    const sortByProductId = () => {
      products.value.sort((a, b) => a.ProductID - b.ProductID);
    };

    // Pagination
    const itemsPerPage = 12;
    const currentPage = ref(1);
    const totalPages = computed(() =>
      Math.ceil(filteredProducts.value.length / itemsPerPage)
    );

    const displayedProducts = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      return filteredProducts.value.slice(
        startIndex,
        startIndex + itemsPerPage
      );
    });

    return {
      slide,
      autoplay,
      products,
      displayedProducts,
      currentPage,
      totalPages,
      link,
      filteredProducts,
      selectedType,
      searchTerm,
      buy,
      sortByAlphabetical,
      sortByPriceDescending,
      sortByPriceAscending,
      sortByPurchaseCount,
      sortByProductId,
    };
  },
};
</script>

<style>
.col-1 {
  background-image: url("/src/assets/logo/bgside.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.col-10 {
  min-height: 100vh;
  background-color: #fce7d1;
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

.search-input {
  max-width: calc(100% - 120px);
}

.type {
  text-decoration: none;
  font-size: 18px;
}

.type.active {
  color: black;
  font-weight: bold;
}

.type:not(.active) {
  color: gray;
}
</style>
