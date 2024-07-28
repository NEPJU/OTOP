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
                  <h5>Order ID: {{ order.order_id }}</h5>
                  <p>Date: {{ order.order_date }}</p>
                  <p>Total Amount: {{ order.total_amount }} awwwบาท</p>
                </div>
                <div class="col-6">
                  <q-btn
                    @click="viewOrderDetails(order)"
                    color="red"
                    label="ดูรายละเอียด"
                  />
                </div>
              </div>
            </q-card>
          </div>
          <div class="col-1"></div>
        </div>
      </div>
      <div class="col-1 bgside"></div>
    </div>

    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Order Details</div>
        </q-card-section>
        <q-card-section>
          <p>Order ID: {{ selectedOrder.order_id }}</p>
          <p>Date: {{ selectedOrder.order_date }}</p>
          <p>Total Amount: {{ selectedOrder.total_amount }} บาท</p>
          <div v-if="orderItems.length">
            <h5>Items:</h5>
            <ul>
              <li v-for="item in orderItems" :key="item.order_item_id">
                <p>Product ID: {{ item.product_id }}</p>
                <p>Product Name: {{ item.product_name }}</p>
                <p>Description: {{ item.description }}</p>
                <p>Price: {{ item.product_price }} บาท</p>
                <p>Quantity: {{ item.quantity }}</p>
                <p>Category: {{ item.category }}</p>

                <img
                  :src="item.image_base64"
                  alt="Product Image"
                  width="100"
                  height="100"
                />
              </li>
            </ul>
          </div>
          <div v-else-if="!loading && !orderItems.length">
            <p>No items found for this order.</p>
          </div>
          <div v-else>
            <p>Loading...</p>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            color="primary"
            @click="isDialogOpen = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orders: [],
      isDialogOpen: false,
      selectedOrder: {},
      orderItems: [],
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
        this.orders = response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    },
    async viewOrderDetails(order) {
      this.selectedOrder = order;
      this.isDialogOpen = true;
      this.loading = true;
      try {
        const response = await axios.get(
          `http://localhost:3000/order-items/${order.order_id}`
        );
        this.orderItems = response.data;
      } catch (error) {
        console.error("Error fetching order items:", error);
        this.orderItems = []; // Clear the order items if there's an error
      } finally {
        this.loading = false;
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
