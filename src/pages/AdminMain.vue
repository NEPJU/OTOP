<template>
  <div>
    <div><AsyncComp /></div>
    <div class="row">
      <div class="col-1 bg-side"></div>
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
          <div class="column" style="height: 150px">
            <div
              class="col-8 d-flex justify-center align-center"
              style="
                background-color: white;
                text-align: center;
                font-size: 25px;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                  0 6px 20px 0 rgba(0, 0, 0, 0.19);
              "
            >
              <p style="margin-top: 30px; text-shadow: 1px 1px 50px #000000">
                โปรโมชัน {{ cart }}
              </p>
            </div>
          </div>
        </div>
        <div>
          <div class="row justify-center items-center">
            <!-- Product Cards -->
            <div
              class="col-12 col-md-6 col-lg-4"
              v-for="(product, index) in promotionProducts"
              :key="index"
              style="padding: 5px"
            >
              <q-card class="product-card">
                <div style="padding: 15px">
                  <q-img :src="product.ProductImage" class="product-image">
                    <div class="absolute-bottom text-h6">
                      <span style="font-size: 24px">{{
                        product.ProductName
                      }}</span>
                    </div>
                  </q-img>
                  <div style="padding: 30px 0px 0px 30px">
                    <div class="ellipsis" style="font-size: 20px">
                      <p style="font-size: 24px">{{ product.ProductName }}</p>
                      รายละเอียด: {{ product.ProductDescription }}
                    </div>
                    <div style="font-size: 18px">
                      ราคา {{ product.ProductPrice }} บาท
                      <div>ยอดคงเหลือ {{ product.ProductQuantity }} ชิ้น</div>
                    </div>
                  </div>
                </div>

                <div style="display: flex; justify-content: center">
                  <router-link
                    :to="`/aproduct/${product.ProductID}`"
                    class="no-underline"
                  >
                    <q-btn class="btn outline">รายละเอียด</q-btn>
                  </router-link>
                  <q-btn class="btn fill" @click="buy"> ใส่ตระกร้า </q-btn>
                </div>
                <div class="product-info">
                  <div class="icon-container">
                    <button class="icon-button" @click="buy">
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

                  <div class="viewer-count" style="margin-top: 15px">
                    #{{ product.ProductCategory }} ยอดการขาย
                    {{ product.ProductSaleCount }} รายการ
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: center">
          <q-btn
            unelevated
            color="brown-13"
            size="30px"
            label="เข้าสู่ร้านค้า"
            style="
              border-radius: 15px;
              width: 250px;
              height: 125px;
              margin-top: 25px;
              margin-bottom: 15px;
            "
            @click="link"
          />
        </div>

        <div style="background-color: aliceblue; margin-top: 15px">
          <p
            style="
              text-align: center;
              font-size: 30px;
              padding: 20px 0px 0px 0px;
            "
          >
            เกี่ยวกับฉัน
          </p>
          <div style="padding: 10px 50px 50px 50px">
            <div
              style="
                padding: 20px;
                text-align: justify;
                background-color: #d9d9d9;
                border-radius: 30px;
                font-size: 24px;
              "
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Consequatur at in dolorem incidunt illum sequi, doloribus atque
              sapiente iste consectetur rerum, dicta a odit, deleniti molestiae
              repellat quis ad tempora. Non, explicabo blanditiis totam libero
              expedita natus excepturi repellat obcaecati eaque provident
              eligendi, nostrum maiores doloremque velit quo numquam optio
              reiciendis porro voluptate earum exercitationem ex! Adipisci nam
              voluptatem quis, earum in nobis asperiores? Tempora minima, rem,
              explicabo a sit iusto vero voluptates unde odio error laboriosam
              veritatis ipsa sed repellat repudiandae quaerat deleniti totam
              maxime nostrum sequi tempore tenetur eius cupiditate quas. Minima
              deserunt, iste explicabo nemo laborum sequi voluptatem
              perspiciatis est reiciendis amet rem vero eaque quaerat maxime
              unde libero tempora atque architecto reprehenderit tenetur quos
              quas, minus quam at. Fugit omnis et nam voluptates quod officiis
              voluptatem obcaecati corrupti, dolorum unde laudantium illo
              fugiat. Provident autem suscipit vitae necessitatibus veniam, sit
              commodi dolor veritatis perspiciatis eos? Optio consectetur
              voluptatibus reiciendis amet a in nemo facere, magnam iure,
              corrupti ad necessitatibus dolorum facilis. Minus perferendis
            </div>
            <div class="row">
              <div class="col-md-6">
                <p style="font-size: 28px; padding: 16px 0px 0px 0px">
                  ที่ตั้งร้านค้า
                </p>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d333.11266926020534!2d99.90012479045728!3d19.1628709079874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d9d32b6858a6bb%3A0x92ff6f124b15f06e!2sBoat%20Pier%20to%20Wat%20Tilok%20Aram!5e0!3m2!1sen!2sth!4v1713344046066!5m2!1sen!2sth"
                  style="
                    border-radius: 20px;
                    border: #000000 2px;
                    width: 100%;
                    padding: 0px 15px 0px 0px;
                    aspect-ratio: 16/9;
                  "
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div class="col-md-6">
                <p style="font-size: 28px; padding: 16px 0px 0px 0px">
                  ที่อยู่ร้านค้า
                </p>
                <div
                  style="
                    padding: 20px;
                    text-align: justify;
                    background-color: #d9d9d9;
                    border-radius: 30px;
                    font-size: 24px;
                  "
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed
                  debitis minima expedita neque esse similique modi corrupti
                  delectus eveniet perferendis, perspiciatis, nulla rem odit.
                  Veniam qui quam sequi hic tempora facere enim ipsam aspernatur
                  at iure nam laboriosam odio quaerat eum magnam placeat,
                  sapiente, a amet mollitia consequuntur repellat aliquid
                  reiciendis temporibus vitae. Similique iure voluptates magni
                  quae eveniet laboriosam. Esse, dicta distinction.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p
            style="
              text-align: center;
              padding: 25px 0px 5px 0px;
              font-size: 30px;
            "
          >
            ผลิตภัณฑ์ยอดนิยม
          </p>
          <div>
            <div class="row justify-center items-center">
              <!-- Product Cards -->
              <div
                class="col-12 col-md-6 col-lg-4"
                v-for="product in randomProducts"
                :key="product.id"
                style="padding: 5px"
              >
                <q-card class="my-card">
                  <div style="padding: 15px">
                    <q-img :src="product.ProductImage" class="product-image">
                      <div class="absolute-bottom text-h6">
                        <span style="font-size: 24px">{{
                          product.ProductName
                        }}</span>
                      </div>
                    </q-img>
                    <div style="padding: 30px 0px 0px 30px">
                      <div class="ellipsis" style="font-size: 20px">
                        <p style="font-size: 24px">{{ product.ProductName }}</p>
                        รายละเอียด: {{ product.ProductDescription }}
                      </div>
                      <div style="font-size: 18px">
                        ราคา {{ product.ProductPrice }} บาท
                        <div>ยอดคงเหลือ {{ product.ProductQuantity }} ชิ้น</div>
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; justify-content: center">
                    <router-link
                      :to="`/aproduct/${product.ProductID}`"
                      class="no-underline"
                    >
                      <q-btn class="btn outline">รายละเอียด</q-btn>
                    </router-link>
                    <q-btn class="btn fill" @click="buy"> ใส่ตระกร้า </q-btn>
                  </div>
                  <div class="product-info">
                    <div class="icon-container">
                      <button class="icon-button" @click="buy">
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

                    <div class="viewer-count" style="margin-top: 15px">
                      #{{ product.ProductCategory }} ยอดการขาย
                      {{ product.ProductSaleCount }} รายการ
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </div>
        </div>
        <div class="buttons">
          <div style="background-color: aliceblue">
            <p
              style="
                text-align: center;
                padding: 15px 0px 5px 0px;
                font-size: 30px;
                color: #5a350c;
                margin-top: 50px;
              "
            >
              ติดต่อเรา
            </p>
            <div style="padding: 45px">
              <div class="row justify-center items-center">
                <div class="col-md-6">
                  <p
                    style="
                      font-size: 28px;
                      padding: 16px 0px 0px 0px;
                      color: #5a350c;
                      display: flex;
                      justify-content: center;
                    "
                  >
                    ที่ตั้งร้านค้า
                  </p>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d333.11266926020534!2d99.90012479045728!3d19.1628709079874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d9d32b6858a6bb%3A0x92ff6f124b15f06e!2sBoat%20Pier%20to%20Wat%20Tilok%20Aram!5e0!3m2!1sen!2sth!4v1713344046066!5m2!1sen!2sth"
                    style="
                      border-radius: 20px;
                      border: #000000 2px;
                      width: 100%;
                      padding: 0px 15px 0px 0px;
                      aspect-ratio: 16/9;
                    "
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div class="col-md-6">
                  <p
                    style="
                      font-size: 28px;
                      /* padding: 16px 0px 0px 0px; */
                      color: #5a350c;
                      display: flex;
                      justify-content: center;
                    "
                  >
                    ติดต่อร้านค้า
                  </p>
                  <div style="display: flex; justify-content: center">
                    <div
                      style="
                        padding: 20px;
                        text-align: justify;
                        background-color: #d9d9d9;
                        border-radius: 30px;
                        font-size: 24px;
                        width: 500px;
                      "
                    >
                      <div class="contact">
                        <a href="javascript:void(0)"
                          ><q-icon name="phone" class="contact-icon" />
                          090-555-5555</a
                        >
                      </div>
                      <div class="contact">
                        <a href="javascript:void(0)"
                          ><q-icon name="phone" class="contact-icon" />
                          090-xxx-xxxx</a
                        >
                      </div>
                      <div class="contact">
                        <a href="javascript:void(0)"
                          ><q-icon name="email" class="contact-icon" />
                          090-xxx-xxxx</a
                        >
                      </div>
                      <div class="contact">
                        <a href="javascript:void(0)"
                          ><q-icon name="location_on" class="contact-icon" />
                          090-xxx-xxxx</a
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footer-section">
            <p class="footer-title">Contact Us</p>
            <div class="footer-content">
              <p>Email: example@example.com</p>
              <p>Phone: 123-456-7890</p>
              <p>Address: 123 Main Street, City, Country</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-1 bg-side"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, defineAsyncComponent } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

export default {
  setup() {
    const slide = ref(1);
    const router = useRouter();
    const autoplay = ref(true);
    const products = ref([]); // เพิ่มตัวแปร products ในรูปแบบ ref เพื่อเก็บข้อมูลสินค้า
    const randomProducts = ref([]);
    const promotionProducts = ref([]); // เพิ่มตัวแปร promotionProducts ในรูปแบบ ref เพื่อเก็บข้อมูลสินค้าโปรโมชัน
    const currentIndex = ref(0);
    const cart = ref([]);

    // const AsyncComp = defineAsyncComponent(() => import("./TestPage.vue"));

    // เรียก API เมื่อ Component ถูก Mounted
    onMounted(async () => {
      try {
        const response = await axios.get("http://localhost:3000/products"); // เรียก API ด้วย Axios
        products.value = response.data; // เก็บข้อมูลสินค้าที่ได้รับมาลงในตัวแปร products
        randomizeProducts(); // เรียกใช้งานฟังก์ชันสุ่มสินค้าเมื่อโหลดเสร็จสิ้น
        filterPromotionProducts(); // เรียกใช้งานฟังก์ชันกรองสินค้าโปรโมชันเมื่อโหลดเสร็จสิ้น
        cart.value = [localStorage.getItem("cart")];
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    });

    // cart.value = localStorage.getItem("cart");

    const link = () => {
      router.push("/adminshop");
    };

    const doSomething = () => {
      Swal.fire({
        title: "คุณเป็นแอดมิน",
        icon: "error",
      });
    };

    const buy = () => {
      doSomething();
    };

    const randomizeProducts = () => {
      // สร้างการแสดงสินค้าที่สุ่มขึ้นมา 6 ชิ้น
      const randomIndexes = [];
      while (randomIndexes.length < 6) {
        const randomIndex = Math.floor(Math.random() * products.value.length);
        if (!randomIndexes.includes(randomIndex)) {
          randomIndexes.push(randomIndex);
        }
      }
      // อัปเดตตัวแปร randomProducts เพื่อเก็บสินค้าที่สุ่มได้
      randomProducts.value = randomIndexes.map(
        (index) => products.value[index]
      );
    };

    const filterPromotionProducts = () => {
      // กรองสินค้าที่มี ProductCategory เป็น โปรโมชัน
      promotionProducts.value = products.value.filter(
        (product) => product.ProductCategory === "โปรโมชัน"
      );
    };
    const prevSlide = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
      } else {
        // If currentIndex is 0, loop to the last promotion product
        currentIndex.value = promotionProducts.value.length - 1;
      }
    };

    const nextSlide = () => {
      if (currentIndex.value < promotionProducts.value.length - 1) {
        currentIndex.value++;
      } else {
        // If currentIndex reaches the last promotion product, loop to the first one
        currentIndex.value = 0;
      }
    };
    const addToCart = (product) => {
      console.log("product", product);
      cart.value.push(product.ProductID);
      localStorage.setItem("cart", cart.value);
    };

    const press = () => {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ",
        icon: "error",
      });
    };

    return {
      slide,
      autoplay,
      randomProducts,
      promotionProducts, // คืนค่า promotionProducts
      link,
      prevSlide,
      nextSlide,
      currentIndex,
      addToCart,
      cart,
      buy,
    };
  },
};
</script>

<style>
.bg-side {
  background-image: url("/src/assets/logo/bgside.png");
}

.col-10 {
  background-color: #fce7d1;
}

.my-card {
  height: 600px;
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

.description {
  max-height: 50px;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

/* .wrapper {
    width: 100%;
    height: 100%;
  } */

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

.viewer-count {
  padding: 0px 10px 0px 0px;
  position: absolute; /* ตำแหน่งเป็น absolute */
  bottom: 10px; /* จัดตำแหน่งด้านล่าง */
  left: 10px; /* จัดตำแหน่งด้านซ้าย */
  font-size: 18px; /* ขนาดตัวอักษร */
  color: #555; /* สีข้อความ */
}

.product-card {
  height: 600px;
  max-width: 550px;
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

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.views {
  width: 100%;
  overflow: hidden;
  height: 100%;
  position: relative;
}

.inner {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.card {
  height: 600px;
}

.my-card {
  height: 600px;
  max-width: 600px;
}

.footer-section {
  background: #333;
  color: #fff;
  padding: 20px;
  text-align: center;
  margin-top: 40px;
}

.footer-title {
  font-size: 20px;
  font-weight: bold;
}

.footer-content {
  font-size: 14px;
}
</style>
