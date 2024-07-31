<template>
  <div style="margin-top: 45px">
    <div class="row">
      <div class="col-1 bgside"></div>
      <div class="col-10 bgcenter">
        <div class="row" style="margin-top: 20px">
          <div class="col-1"></div>
          <div class="col-10">
            <q-card
              v-for="order in orders"
              :key="order.order_id"
              style="margin-top: 10px"
            >
              <div class="row" style="padding: 15px">
                <div class="col-6">
                  <h5>ออเดอร์ที่ : {{ order.order_id }}</h5>
                  <p>วันที่ : {{ order.order_date }}</p>
                  <p>เงินรวมทั้งหมด : {{ order.total_amount }} บาท</p>
                </div>
                <div class="col-6">
                  <q-btn
                    @click="viewOrderDetails(order)"
                    color="red"
                    label="ดูรายละเอียด"
                    style="margin-left: 50%; margin-top: 20%"
                  />
                </div>
              </div>
              <div v-if="order.showDetails">
                <q-card-section>
                  <h5>รายการสินค้า:</h5>
                  <ul>
                    <li
                      v-for="item in order.orderItems"
                      :key="item.order_item_id"
                    >
                      <div class="row">
                        <div class="col">
                          <p>ผลิตภัณฑ์ : {{ item.product_name }}</p>
                          <p>คำอธิบาย : {{ item.description }}</p>
                          <p>ราคา : {{ item.product_price }} บาท</p>
                          <p>จำนวน: {{ item.quantity }}</p>
                        </div>
                        <div class="col" style="margin-left: 50px">
                          <img
                            :src="item.image_base64"
                            alt="Product Image"
                            width="150"
                            height="150"
                          />
                        </div>
                      </div>
                      <hr />
                      <br />
                    </li>
                    <p>เงินรวมทั้งหมด : {{ order.total_amount }} บาท</p>
                  </ul>
                </q-card-section>
              </div>
            </q-card>
          </div>
          <div class="col-1"></div>
        </div>
      </div>
      <div class="col-1 bgside"></div>
    </div>
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
    };
  },
  methods: {
    async fetchOrders() {
      const memberId = sessionStorage.getItem("userId");
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
      }
    },
    async viewOrderDetails(order) {
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
          order.orderItems = []; // Clear the order items if there's an error
        } finally {
          this.loading = false;
        }
      }
    },
  },
  created() {
    this.fetchOrders();
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
</style>
