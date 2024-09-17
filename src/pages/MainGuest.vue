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
                ผลิตภัณฑ์ยอดนิยม
              </p>
            </div>
          </div>
        </div>

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
              <q-card-section class="description">
                รายละเอียด: {{ product.ProductDescription }}
              </q-card-section>
              <q-card-section class="description">
                ราคา {{ product.ProductPrice }} บาท
                <div>ยอดคงเหลือ {{ product.ProductQuantity }} ชิ้น</div>
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
              </q-card-section>

              <div class="column" style="height: 150px">
                <div class="col">
                  <div class="button-wrapper">
                    <router-link
                      :to="`/gproduct/${product.ProductID}`"
                      class="no-underline"
                    >
                      <q-btn class="btn outline">รายละเอียด</q-btn>
                    </router-link>
                    <q-btn class="btn fill" @click="press">ใส่ตระกร้า</q-btn>
                  </div>
                  <p style="margin-top: 10px">#{{ product.ProductCategory }}</p>
                </div>
                <div class="col">
                  <div class="icon-container">
                    <button class="icon-button" @click="press">
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
                    ยอดซื้อ {{ product.purchaseCount }} รายการ
                  </div>
                </div>
              </div>
            </q-card>
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
        <p
          style="text-align: center; padding: 25px 0px 5px 0px; font-size: 30px"
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
                </q-card-section>

                <div class="column" style="height: 150px">
                  <div class="col">
                    <div class="button-wrapper">
                      <router-link
                        :to="`/gproduct/${product.ProductID}`"
                        class="no-underline"
                      >
                        <q-btn class="btn outline">รายละเอียด</q-btn>
                      </router-link>
                      <q-btn class="btn fill" @click="press">ใส่ตระกร้า</q-btn>
                    </div>
                    <p style="margin-top: 10px">
                      #{{ product.ProductCategory }}
                    </p>
                  </div>
                  <div class="col">
                    <div class="icon-container">
                      <button class="icon-button" @click="press">
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
                      ยอดซื้อ {{ product.purchaseCount }} รายการ
                    </div>
                  </div>
                </div>
              </q-card>
            </div>
          </div>
        </div>
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
      </div>
      <div class="col-1"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

export default {
  setup() {
    const slide = ref(1);
    const products = ref([]);
    const randomProducts = ref([]);
    const router = useRouter();

    onMounted(async () => {
      try {
        const response = await axios.get("http://localhost:3000/products");
        products.value = response.data;
        randomizeProducts();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    });

    const randomizeProducts = () => {
      const randomIndexes = [];
      while (randomIndexes.length < 6) {
        const randomIndex = Math.floor(Math.random() * products.value.length);
        if (!randomIndexes.includes(randomIndex)) {
          randomIndexes.push(randomIndex);
        }
      }
      randomProducts.value = randomIndexes.map(
        (index) => products.value[index]
      );
    };

    const press = () => {
      Swal.fire({
        title: "กรุณาเข้าสู่ระบบ",
        icon: "error",
      });
    };

    const filteredProducts = computed(() =>
      products.value.filter((product) => product.ProductCategory === "โปรโมชัน")
    );

    const link = () => {
      console.log("passpaspaspapsaps");
      router.push("/gshop");
    };

    return {
      randomProducts,
      press,
      filteredProducts,
      link,
      slide,
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
  background-color: #fce7d1;
}

.my-card {
  height: 600px;
  max-width: 500px;
  margin-bottom: 20px;
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
  color: black;
  font-size: 16px;

  /* padding: 30px; */
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
  font-size: 14px; /* ขนาดตัวอักษร */
  color: #555; /* สีข้อความ */
}
</style>
