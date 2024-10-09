<template>
  <div style="margin-top: 45px">
    <div class="row">
      <div class="col-1 bgside"></div>
      <div class="col-10 bgcenter">
        <div>
          <q-card
            class="my-card"
            bordered
            style="padding-bottom: 25px; padding-top: 15px"
          >
            <div style="text-align: center; font-size: 35px">ยินดีต้อนรับ</div>
            <div style="text-align: center; font-size: 16px">
              คุณ {{ userName }}
            </div>
            <div style="text-align: center; font-size: 16px">
              ชื่อ {{ Name }}
            </div>
            <div style="text-align: center; font-size: 16px">
              อีเมล {{ userEmail }}
            </div>
          </q-card>
        </div>
        <div class="row" style="margin-top: 20px">
          <div class="col-1"></div>
          <div class="col-10">
            <q-card>
              <div style="margin-bottom: 15px">
                <q-checkbox
                  v-model="selectAll"
                  color="red-12"
                  label="เลือกสินค้าทั้งหมด"
                  @change="toggleSelectAll"
                />
              </div>
            </q-card>

            <!-- ตรวจสอบถ้ามีสินค้าในตะกร้าหรือไม่ -->

            <div
              v-if="cartItems.length === 0"
              style="text-align: center; margin-top: 20px"
            >
              <q-card
                style="
                  padding: 20px;
                  font-size: 20px;
                  border-radius: 10px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                "
              >
                <p style="margin: 0">ยังไม่มีผลิตภัณฑ์ในตะกร้าของท่าน</p>
              </q-card>
            </div>

            <div v-else>
              <!-- รายการสินค้าในตะกร้า -->
              <q-card
                v-for="product in cartItems"
                :key="product.product_id"
                style="margin-top: 10px"
              >
                <div class="row" style="padding: 15px">
                  <div class="col-1">
                    <q-checkbox
                      v-model="product.isSelected"
                      color="red-12"
                      @change="updateSelectAllStatus"
                    />
                  </div>
                  <div class="col-3">
                    <q-btn
                      @click="decreaseAmount(product)"
                      color="red-12"
                      label="-"
                      class="amount"
                      :disable="product.quantityInCart <= 1"
                    />
                    <q-btn
                      color="red-12"
                      class="amount"
                      :label="product.quantityInCart"
                    />
                    <q-btn
                      @click="increaseAmount(product)"
                      color="red-12"
                      label="+"
                      class="amount"
                      :disable="product.quantityInCart >= product.productStock"
                    />
                    <p style="color: black; margin-top: 10px">
                      สินค้าทั้งหมด {{ product.quantityInCart }} /
                      {{ product.productStock }}
                    </p>
                    <q-btn
                      @click="confirmRemoveProduct(product)"
                      color="red"
                      icon="delete"
                    />
                    <router-link
                      :to="`/product/${product.product_id}`"
                      class="no-underline"
                    >
                      <q-btn color="red" icon="search" />
                    </router-link>
                  </div>
                  <div class="col-6">
                    <div class="row">
                      <div class="col-md-4">
                        <img
                          :src="
                            product.images_base64 &&
                            product.images_base64.length > 0
                              ? product.images_base64[0]
                              : ''
                          "
                          alt="Product Image"
                          class="productimage"
                        />
                      </div>
                      <div class="col-md">
                        {{ product.product_name }}
                        <br />
                        {{ product.price }} บาท
                      </div>
                    </div>
                  </div>
                  <div class="col-2">
                    {{ product.price * product.quantityInCart }} บาท
                  </div>
                </div>
              </q-card>

              <!-- การสรุปยอดรวมและการสั่งซื้อ -->
            </div>
            <q-card style="margin-top: 15px">
              <p
                style="
                  padding: 15px 15px 0px 15px;
                  display: flex;
                  justify-content: space-between;
                "
              >
                ราคารวม
                <span style="text-align: end"
                  >{{ totalSelectedAmount }} บาท</span
                >
              </p>
              <div
                style="
                  display: flex;
                  justify-content: flex-end;
                  padding: 0px 15px 15px 0px;
                "
              >
                <q-btn @click="placeOrder" color="red">สั่งซื้อสินค้า</q-btn>
              </div>
            </q-card>
          </div>
          <div class="col-1"></div>
        </div>

        <div
          class="justify-center"
          style="display: flex; padding-bottom: 15px; margin-top: 15px"
        >
          <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
        </div>
      </div>
      <div class="col-1 bgside"></div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      cartItems: [],
      userName: "",
      userEmail: "",
      Name: "",
      selectAll: false,
    };
  },
  methods: {
    async fetchCartItems() {
      try {
        const memberId = sessionStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:3000/cart/${memberId}`
        );

        const cartItems = response.data.map((item) => ({
          ...item,
          quantityInCart: item.quantityInCart,
          productStock: item.productStock,
          images_base64: Array.isArray(item.images_base64)
            ? item.images_base64
            : JSON.parse(item.images_base64),
          isSelected: false,
        }));

        this.cartItems = cartItems;
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    },
    async fetchUserData() {
      try {
        const memberId = sessionStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:3000/user/${memberId}`
        );
        this.userName = response.data.username;
        this.userEmail = response.data.email;
        this.Name = response.data.name;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
    link() {
      this.$router.push("/shop");
    },
    increaseAmount(product) {
      if (product.quantityInCart < product.productStock) {
        product.quantityInCart++;
        this.updateCartQuantity(product);
      }
    },
    decreaseAmount(product) {
      if (product.quantityInCart > 1) {
        product.quantityInCart--;
        this.updateCartQuantity(product);
      }
    },
    async removeProduct(product) {
      const memberId = sessionStorage.getItem("userId");
      try {
        await axios.delete(
          `http://localhost:3000/cart/${memberId}/${product.product_id}`
        );
        this.cartItems = this.cartItems.filter(
          (item) => item.product_id !== product.product_id
        );
        Swal.fire("สินค้าได้ถูกนำออกจากตะกร้า");
      } catch (error) {
        console.error("Error removing product:", error);
        Swal.fire(
          "Error!",
          "There was an issue removing the product. Please try again.",
          "error"
        );
      }
    },
    confirmRemoveProduct(product) {
      Swal.fire({
        title: "ต้องการที่จะเอาออกจากตะกร้าสินค้าใช่หรือไม่",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ลบสินค้าออกจากตะกร้า",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeProduct(product);
        }
      });
    },
    async placeOrder() {
      const selectedItems = this.cartItems.filter((item) => item.isSelected);
      if (selectedItems.length === 0) {
        Swal.fire("กรุณาเลือกสินค้าที่ต้องการสั่งซื้อ", "", "warning");
        return;
      }

      const memberId = sessionStorage.getItem("userId");
      try {
        const response = await axios.get(
          `http://localhost:3000/cart/${memberId}`
        );
        const latestCartItems = response.data;

        let allAvailable = true;

        latestCartItems.forEach((item) => {
          const cartItem = this.cartItems.find(
            (p) => p.product_id === item.product_id
          );
          if (cartItem && item.quantity < cartItem.quantityInCart) {
            allAvailable = false;
            cartItem.quantityInCart = item.quantity;
          }
        });

        if (!allAvailable) {
          Swal.fire(
            "ข้อผิดพลาด",
            "จำนวนสินค้าบางรายการมีไม่เพียงพอ กรุณาตรวจสอบใหม่อีกครั้ง",
            "error"
          );
          return;
        }

        const orderItems = selectedItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantityInCart,
          price: item.price,
        }));

        const totalAmount = this.totalSelectedAmount;

        await axios.post(`http://localhost:3000/order`, {
          memberId,
          cartItems: orderItems,
          totalAmount,
        });

        // ลบสินค้าที่ถูกเลือกออกจากตะกร้าหลังจากสั่งซื้อเสร็จเรียบร้อย
        for (const item of selectedItems) {
          await axios.delete(
            `http://localhost:3000/cart/${memberId}/${item.product_id}`
          );
        }

        Swal.fire({
          icon: "success",
          title: "สั่งซื้อสินค้าเรียบร้อยแล้ว",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Error placing order:", error);
        Swal.fire(
          "Error!",
          "There was an issue placing the order. Please try again.",
          "error"
        );
      }
    },
    toggleSelectAll() {
      // ใช้ค่า selectAll ในการอัปเดต isSelected ของสินค้าแต่ละตัว
      this.cartItems.forEach((item) => {
        item.isSelected = this.selectAll;
      });
    },
    updateSelectAllStatus() {
      // ตรวจสอบว่าทุกสินค้าถูกเลือกหรือไม่
      this.selectAll = this.cartItems.every((item) => item.isSelected);
    },
  },
  computed: {
    totalAmount() {
      return this.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantityInCart,
        0
      );
    },
    totalSelectedAmount() {
      return this.cartItems
        .filter((item) => item.isSelected)
        .reduce((sum, item) => sum + item.price * item.quantityInCart, 0);
    },
  },
  watch: {
    selectAll(newVal) {
      // เมื่อค่า selectAll เปลี่ยน ให้เปลี่ยน isSelected ของสินค้าทั้งหมดให้ตรงกับ selectAll
      this.cartItems.forEach((item) => {
        item.isSelected = newVal;
      });
    },
    cartItems: {
      handler() {
        // ตรวจสอบว่าทุกสินค้าถูกเลือกหรือไม่
        this.selectAll = this.cartItems.every((item) => item.isSelected);
      },
      deep: true,
    },
  },

  created() {
    this.fetchCartItems();
    this.fetchUserData();
  },
};
</script>

<style>
.bgside {
  background-image: url("/src/assets/logo/bgside.png");
}
.bgcenter {
  min-height: 100vh;
  background-color: bisque;
}
.productimage {
  max-width: 100px;
}
</style>
