<template>
  <div class="container">
    <div class="row">
      <div class="col-1 bgside"></div>
      <div class="col-10 bgcenter">
        <div class="row">
          <div class="col-12 btn-container">
            <q-btn
              class="btn-box"
              color="brown-6"
              @click="toggleOrdersVisibility"
              label="ที่ต้องชำระ"
            />
            <q-btn
              class="btn-box"
              color="brown-6"
              @click="toggleShippedOrdersVisibility"
              label="ที่ต้องจัดส่ง"
            />
          </div>
        </div>
        <div v-if="loading" class="loading-spinner">
          <q-spinner-dots color="brown-6" size="50px" />
        </div>
        <div v-if="ordersVisible && !loading">
          <q-row>
            <q-col
              v-for="order in filteredOrders"
              :key="order.order_id"
              cols="12"
              sm="6"
            >
              <q-card class="order-card">
                <div class="row card-header">
                  <div class="col-6">
                    <h5>ออเดอร์ที่ : {{ order.order_id }}</h5>
                    <p>วันที่ : {{ order.order_date }}</p>
                    <p>เงินรวมทั้งหมด : {{ order.total_amount }} บาท</p>
                    <p>สถานะ : {{ order.status }}</p>
                  </div>
                  <div class="col-6">
                    <q-btn
                      @click="toggleOrderDetails(order)"
                      color="red"
                      :label="
                        order.showDetails ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'
                      "
                      class="details-btn"
                    />
                  </div>
                </div>
                <q-card-section v-show="order.showDetails">
                  <h5>รายการสินค้า:</h5>
                  <ul>
                    <li
                      v-for="item in order.orderItems"
                      :key="item.order_item_id"
                      class="order-item"
                    >
                      <div class="row">
                        <div class="col">
                          <p>ผลิตภัณฑ์ : {{ item.product_name }}</p>
                          <p>คำอธิบาย : {{ item.description }}</p>
                          <p>ราคา : {{ item.product_price }} บาท</p>
                          <p>จำนวน: {{ item.quantity }}</p>
                        </div>
                        <div class="col">
                          <img
                            :src="item.image_base64"
                            alt="Product Image"
                            class="product-image"
                          />
                        </div>
                      </div>
                      <hr />
                      <br />
                    </li>
                  </ul>
                  <p>เงินรวมทั้งหมด : {{ order.total_amount }} บาท</p>
                  <label for="image-upload" class="upload-label">
                    Choose an image
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    @change="handleImageChange"
                    class="upload-input"
                  />

                  <img
                    :src="imageUrl"
                    v-if="imageUrl"
                    class="preview-image"
                    alt="Uploaded Image"
                  />
                  <div class="center-btn">
                    <q-btn @click="markAsShipped(order)" color="green">
                      ชำระเงิน
                    </q-btn>
                  </div>
                </q-card-section>
              </q-card>
            </q-col>
          </q-row>
        </div>
        <div v-if="shippedOrdersVisible && !loading">
          <q-row>
            <q-col
              v-for="order in shippedOrders"
              :key="order.order_id"
              cols="12"
              sm="6"
            >
              <q-card class="order-card">
                <div class="row card-header">
                  <div class="col-6">
                    <h5>ออเดอร์ที่ : {{ order.order_id }}</h5>
                    <p>วันที่ : {{ order.order_date }}</p>
                    <p>เงินรวมทั้งหมด : {{ order.total_amount }} บาท</p>
                    <p>สถานะ : {{ order.status }}</p>
                  </div>
                  <div class="col-6">
                    <q-btn
                      @click="openDialog(order)"
                      color="red"
                      label="ดูรายละเอียด"
                      class="details-btn"
                    />
                  </div>
                </div>
              </q-card>
            </q-col>
          </q-row>
        </div>
        <div v-if="error">
          <q-banner type="warning" class="q-mb-md">
            <template v-slot:avatar>
              <q-icon name="warning" />
            </template>
            <div class="text-h6">Error</div>
            <div>{{ errorMessage }}</div>
          </q-banner>
        </div>
      </div>
      <div class="col-1 bgside"></div>
    </div>
    <!-- Dialog for Order Details -->
    <q-dialog v-model="dialogVisible">
      <q-card>
        <q-card-section>
          <div class="row">
            <div class="col">
              <h5>ออเดอร์ที่ : {{ currentOrder.order_id }}</h5>
              <p>วันที่ : {{ currentOrder.order_date }}</p>
              <p>เงินรวมทั้งหมด : {{ currentOrder.total_amount }} บาท</p>
              <p>สถานะ : {{ currentOrder.status }}</p>
            </div>
          </div>
          <h5>รายการสินค้า:</h5>
          <ul>
            <li
              v-for="item in currentOrder.orderItems"
              :key="item.order_item_id"
              class="order-item"
            >
              <div class="row">
                <div class="col">
                  <p>ผลิตภัณฑ์ : {{ item.product_name }}</p>
                  <p>คำอธิบาย : {{ item.description }}</p>
                  <p>ราคา : {{ item.product_price }} บาท</p>
                  <p>จำนวน: {{ item.quantity }}</p>
                </div>
                <div class="col">
                  <img
                    :src="item.image_base64"
                    alt="Product Image"
                    class="product-image"
                  />
                </div>
              </div>
              <hr />
              <br />
            </li>
            <p>เงินรวมทั้งหมด : {{ currentOrder.total_amount }} บาท</p>
          </ul>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { format } from "date-fns";

export default {
  data() {
    return {
      orders: [],
      loading: false,
      ordersVisible: false,
      shippedOrdersVisible: false,
      error: false,
      errorMessage: "",
      dialogVisible: false,
      currentOrder: {},
      imageUrl: "",
      imageName: "",
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter((order) => order.status === "Pending");
    },
    shippedOrders() {
      return this.orders.filter((order) => order.status === "Shipped");
    },
  },
  methods: {
    async fetchOrders() {
      const memberId = sessionStorage.getItem("userId");
      this.loading = true;
      this.error = false;
      try {
        const response = await axios.get(
          `http://localhost:3000/orders/${memberId}`
        );
        this.orders = response.data.map((order) => ({
          ...order,
          order_date: format(new Date(order.order_date), "dd MMMM yyyy"),
          showDetails: false,
          orderItems: [],
        }));
      } catch (error) {
        console.error("Error fetching orders:", error);
        this.error = true;
        this.errorMessage = "There was an error fetching the orders.";
      } finally {
        this.loading = false;
      }
    },
    async toggleOrderDetails(order) {
      order.showDetails = !order.showDetails;
      if (order.showDetails && order.orderItems.length === 0) {
        this.loading = true;
        try {
          const response = await axios.get(
            `http://localhost:3000/order-items/${order.order_id}`
          );
          order.orderItems = response.data;
        } catch (error) {
          console.error("Error fetching order items:", error);
          order.orderItems = [];
          this.error = true;
          this.errorMessage = "There was an error fetching the order items.";
        } finally {
          this.loading = false;
        }
      }
    },
    toggleOrdersVisibility() {
      this.ordersVisible = !this.ordersVisible;
      this.shippedOrdersVisible = false;
      if (this.ordersVisible && this.orders.length === 0) {
        this.fetchOrders();
      }
    },
    toggleShippedOrdersVisibility() {
      this.shippedOrdersVisible = !this.shippedOrdersVisible;
      this.ordersVisible = false;
      if (this.shippedOrdersVisible && this.orders.length === 0) {
        this.fetchOrders();
      }
    },
    async openDialog(order) {
      if (order.orderItems.length === 0) {
        this.loading = true;
        try {
          const response = await axios.get(
            `http://localhost:3000/order-items/${order.order_id}`
          );
          order.orderItems = response.data;
        } catch (error) {
          console.error("Error fetching order items:", error);
          order.orderItems = [];
          // this.error = true;
          // this.errorMessage = "There was an error fetching the order items.";
        } finally {
          this.loading = false;
        }
      }
      this.currentOrder = order;
      this.dialogVisible = true;
    },
    async markAsShipped(order) {
      try {
        await axios.put(
          `http://localhost:3000/orders/${order.order_id}/status`,
          {
            status: "Shipped",
          }
        );
        order.status = "Shipped";
      } catch (error) {
        console.error("Error updating order status:", error);
        this.error = true;
        this.errorMessage = "There was an error updating the order status.";
      }
    },
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
  created() {
    this.fetchOrders();
  },
};
</script>

<style>
.container {
  margin-top: 45px;
}
.bgside {
  background-image: url("/src/assets/logo/bgside.png");
}
.bgcenter {
  min-height: 100vh;
  background-color: bisque;
}
.btn-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
}
.btn-box {
  margin: 0 10px;
}
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.order-card {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%; /* Ensure full width */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}
.card-header {
  padding: 15px;
}
.details-btn {
  margin-left: auto;
  margin-right: auto;
}
.upload-label {
  display: block;
  margin-top: 10px;
}
.upload-input {
  display: block;
  margin-top: 5px;
}
.image-name-input {
  display: block;
  margin-top: 10px;
}
.preview-image {
  display: block;
  margin-top: 10px;
}
.center-btn {
  display: flex;
  justify-content: center;
}
.product-image {
  width: 150px;
  height: 150px;
}
</style>
