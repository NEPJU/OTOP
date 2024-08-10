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
              @click="filterOrders('Waiting')"
              label="รอการตรวจสอบ"
            />
            <q-btn
              class="btn-box"
              color="brown-6"
              @click="filterOrders('Shipped')"
              label="การส่งสินค้า"
            />
          </div>
        </div>
        <div v-if="loading" class="loading-spinner">
          <q-spinner-dots color="brown-6" size="50px" />
        </div>
        <div v-if="!loading && filteredOrders.length === 0" class="no-orders">
          <p>ไม่มีรายการในสถานะนี้</p>
        </div>
        <div v-if="!loading && filteredOrders.length > 0">
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
                      <p>
                        สินค้า ID: {{ item.product_id }} | ผลิตภัณฑ์:
                        {{ item.product_name }} | ราคา: {{ item.price }} บาท |
                        จำนวน: {{ item.quantity }}
                      </p>
                    </li>
                  </ul>
                  <h5>รายละเอียดการชำระเงิน:</h5>
                  <img
                    :src="order.payment_image_base64"
                    class="payment-image"
                    alt="Payment Image"
                  />
                  <div class="center-btn" v-if="order.status === 'Waiting'">
                    <q-btn @click="confirmPayment(order)" color="green">
                      ยืนยันการชำระเงิน
                    </q-btn>
                  </div>

                  <!-- Timeline for Shipped Status -->
                  <div v-if="order.status === 'Shipped'">
                    <q-timeline color="secondary" layout="dense">
                      <q-timeline-entry
                        color="green"
                        icon="done"
                        title="ชำระเงินสำเร็จ"
                        subtitle="คำสั่งซื้อได้รับการชำระเงินแล้ว"
                      />
                      <q-timeline-entry color="blue" icon="local_shipping">
                        <div>
                          <h6>เลข Tracking</h6>
                          <q-input
                            v-model="order.trackingNumber"
                            placeholder="กรอกเลข Tracking"
                            outlined
                          />
                        </div>
                      </q-timeline-entry>
                      <q-timeline-entry
                        color="orange"
                        icon="check_circle"
                        title="ยืนยันการได้รับของ"
                        subtitle="ลูกค้าได้ยืนยันการได้รับสินค้าแล้ว"
                      />
                    </q-timeline>
                  </div>
                </q-card-section>
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
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import { format } from "date-fns";

export default {
  data() {
    return {
      orders: [],
      filteredOrders: [],
      loading: false,
      error: false,
      errorMessage: "",
    };
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      this.error = false;
      try {
        const response = await axios.get("http://localhost:3000/admin/orders");
        this.orders = response.data.map((order) => ({
          ...order,
          order_date: format(new Date(order.order_date), "dd MMMM yyyy"),
          showDetails: false,
          orderItems: [], // Initialize orderItems as an empty array
          trackingNumber: order.tracking_number || "", // Add tracking number as an empty field
        }));
        this.filterOrders("Waiting"); // Default to showing Waiting orders
      } catch (error) {
        console.error("Error fetching orders:", error);
        this.error = true;
        this.errorMessage = "There was an error fetching the orders.";
      } finally {
        this.loading = false;
      }
    },
    filterOrders(status) {
      this.filteredOrders = this.orders.filter(
        (order) => order.status === status
      );
    },
    async toggleOrderDetails(order) {
      order.showDetails = !order.showDetails;
      if (order.showDetails && order.orderItems.length === 0) {
        // Fetch order items if not already loaded
        try {
          const response = await axios.get(
            `http://localhost:3000/order-items/${order.order_id}`
          );
          order.orderItems = response.data;
        } catch (error) {
          console.error("Error fetching order items:", error);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถโหลดรายการสินค้าได้",
          });
        }
      }
    },
    async confirmPayment(order) {
      try {
        const payload = {
          status: "Shipped",
        };

        console.log("Sending payload:", payload);

        const response = await axios.put(
          `http://localhost:3000/orders/${order.order_id}/confirm-payment`,
          payload
        );

        console.log("Server response:", response);

        // Update order status locally
        order.status = "Shipped";
        this.filterOrders("Waiting"); // Refresh to show only waiting orders after update
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "สถานะได้ถูกเปลี่ยนเป็น Shipped และจำนวนสินค้าถูกปรับแล้ว",
        });
      } catch (error) {
        console.error("Error updating order status:", error.response || error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถเปลี่ยนสถานะได้",
        });
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
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
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
  width: 100%;
  box-sizing: border-box;
}
.card-header {
  padding: 15px;
}
.details-btn {
  margin-left: auto;
  margin-right: auto;
  margin-top: 28%;
}
.payment-image {
  width: 100%;
  max-width: 450px;
  display: block;
  margin: 20px auto;
}
.center-btn {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
.no-orders {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #888;
}
</style>
