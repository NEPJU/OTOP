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
              <q-card class="container">
                <q-img
                  :src="product.ProductImage"
                  style="width: 300px; height: 300px"
                >
                  <div class="absolute-bottom text-h6">
                    {{ product.ProductName }}
                  </div>
                </q-img>
                <q-card-section class="description"
                  >รายละเอียด:{{ product.ProductDescription }}</q-card-section
                >
                <q-card-section class="description">
                  ราคา {{ product.ProductPrice }} บาท
                  <div>ยอดคงเหลือ {{ product.ProductQuantity }} ชิ้น</div>
                </q-card-section>

                <div class="column" style="height: 150px">
                  <div class="col">
                    <div class="button-wrapper">
                      <router-link
                        :to="`/aproduct/${product.ProductID}`"
                        class="no-underline"
                      >
                        <q-btn class="btn outline">รายละเอียด</q-btn>
                      </router-link>
                      <q-btn class="btn fill" @click="buy">ใส่ตระกร้า</q-btn>
                    </div>
                  </div>
                  <div class="col">
                    <div class="icon-container">
                      <button class="icon-button">
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
                    <div>
                      <p><br />#{{ product.ProductCategory }}</p>
                    </div>
                    <div class="viewer-count">
                      ยอดการขาย {{ product.ProductSaleCount }} รายการ
                    </div>
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
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  methods: {
    sortByAlphabetical() {
      this.filteredProducts.sort((a, b) =>
        a.ProductName.localeCompare(b.ProductName)
      );
    },
    sortByPriceDescending() {
      this.filteredProducts.sort((a, b) => b.ProductPrice - a.ProductPrice);
    },
    sortByPriceAscending() {
      this.filteredProducts.sort((a, b) => a.ProductPrice - b.ProductPrice);
    },
    sortByPurchaseCount() {
      this.filteredProducts.sort(
        (a, b) => b.ProductSaleCount - a.ProductSaleCount
      );
    },
    sortByProductId() {
      this.filteredProducts.sort((a, b) => a.ProductID - b.ProductID);
    },
  },
  props: ["product"],
  setup() {
    const slide = ref(1);
    const autoplay = ref(true);
    const router = useRouter();
    const products = ref([]);
    const selectedType = ref("");
    const searchTerm = ref("");

    const doSomething = () => {
      Swal.fire({
        title: "คุณเป็นแอดมิน",
        icon: "error",
      });
    };

    const buy = () => {
      doSomething();
    };

    const link = () => {
      router.push("/adminmain");
    };

    axios
      .get("http://localhost:3000/products")
      .then((response) => {
        // เก็บข้อมูลสินค้าที่ได้รับจาก API ในตัวแปร products
        products.value = response.data;
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });

    const goToPreviousPageAndScrollToTop = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        scrollToTop();
      }
    };

    const goToNextPageAndScrollToTop = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        scrollToTop();
      }
    };

    const goToPageAndScrollToTop = (page) => {
      currentPage.value = page;
      scrollToTop();
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/products",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
    // Pagination
    const itemsPerPage = 12;
    const currentPage = ref(1);
    const totalPages = computed(() =>
      Math.ceil(products.value.length / itemsPerPage)
    );

    const displayedProducts = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      const endIndex = Math.min(
        startIndex + itemsPerPage,
        products.value.length
      ); // ใช้ Math.min เพื่อป้องกันเกิดข้อผิดพลาดถ้าหากมีน้อยกว่า itemsPerPage ในหน้าสุดท้าย
      return products.value.slice(startIndex, endIndex);
    });

    const goToPreviousPage = () => {
      currentPage.value--;
    };

    const goToPage = (page) => {
      currentPage.value = page;
    };

    const goToNextPage = () => {
      currentPage.value++;
    };

    const linkToProductDetail = (productId) => {
      router.push(`/product/${productId}`);
    };

    const stringOptions = computed(() => {
      return searchResults.value.map((product) => product.ProductName);
    });

    // const filteredProducts = computed(() => {
    //   if (!searchTerm.value && !selectedType.value) {
    //     // Return all products if no search term and type are selected
    //     return products.value;
    //   } else {
    //     // Filter products by selected type and search term
    //     const searchTermLowerCase = searchTerm.value.toLowerCase();
    //     return products.value.filter((product) => {
    //       const productNameLowerCase = product.title.toLowerCase();
    //       return (
    //         productNameLowerCase.includes(searchTermLowerCase) &&
    //         (!selectedType.value || product.type === selectedType.value)
    //       );
    //     });
    //   }
    // });
    const searchResults = computed(() => {
      if (!searchTerm.value) {
        return [];
      } else {
        const searchTermLowerCase = searchTerm.value.toLowerCase();
        return products.value.filter((product) => {
          const productNameLowerCase = product.ProductName.toLowerCase();
          return productNameLowerCase.includes(searchTermLowerCase);
        });

        return searchResults;
      }
    });

    const filteredProducts = computed(() => {
      if (!searchTerm.value && !selectedType.value) {
        // Return all products if no search term and type are selected
        return products.value;
      } else {
        // Filter products by selected type and search term
        const searchTermLowerCase = searchTerm.value.toLowerCase();
        const filtered = products.value.filter((product) => {
          const productNameLowerCase = product.ProductName.toLowerCase();
          return (
            productNameLowerCase.includes(searchTermLowerCase) &&
            (!selectedType.value ||
              product.ProductCategory === selectedType.value)
          );
        });

        if (filtered.length === 0) {
          // If no products match the search term, display a message
          console.log("ไม่พบผลิตภัณฑ์ที่ค้นหา");
        }

        return filtered;
      }
    });

    return {
      slide,
      autoplay,
      products,
      displayedProducts,
      currentPage,
      totalPages,
      link,
      goToPreviousPageAndScrollToTop,
      goToNextPageAndScrollToTop,
      goToPageAndScrollToTop,
      linkToProductDetail,
      filteredProducts,
      selectedType,
      searchTerm,
      stringOptions,
      buy,
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

.my-card {
  height: 500px;
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
  /* max-width: 550px; */
  /* height: 500px; */
  /* max-width: 300px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.description {
  color: black;
  font-size: 16px;

  /* padding: 30px; */
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
</style>
