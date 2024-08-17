<template>
  <div class="container">
    <div class="row">
      <div class="col-1 bgside"></div>
      <div class="col-10 bgcenter">
        <h3 class="page-title">ประวัติการสั่งซื้อ (Delivered)</h3>

        <div v-if="loading" class="loading-spinner">
          <q-spinner-dots color="brown-6" size="50px" />
        </div>

        <div v-if="!loading && deliveredOrders.length === 0">
          <p>ไม่มีประวัติการสั่งซื้อที่ส่งสินค้าแล้ว</p>
        </div>

        <div v-if="!loading && deliveredOrders.length > 0">
          <q-row>
            <q-col
              v-for="order in deliveredOrders"
              :key="order.order_id"
              cols="12"
              sm="12"
            >
              <q-card class="order-card">
                <div class="row card-header">
                  <div class="col-6">
                    <h5>ออเดอร์ที่ : {{ order.order_id }}</h5>
                    <p>วันที่ : {{ order.order_date }}</p>
                    <p>เงินรวมทั้งหมด : {{ order.total_amount }} บาท</p>
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

                <!-- ตารางแสดงรายการสินค้า -->
                <q-card-section v-show="order.showDetails">
                  <h5>รายการสินค้า:</h5>
                  <q-table
                    :rows="order.orderItems"
                    :columns="columns"
                    row-key="order_item_id"
                    flat
                    bordered
                    separator="cell"
                  >
                    <template v-slot:body-cell-image="props">
                      <q-td>
                        <img
                          :src="props.row.image_base64"
                          alt="Product Image"
                          class="product-image"
                        />
                      </q-td>
                    </template>
                    <template v-slot:body-cell-product_name="props">
                      <q-td>{{ props.row.product_name }}</q-td>
                    </template>
                    <template v-slot:body-cell-description="props">
                      <q-td>{{ props.row.description }}</q-td>
                    </template>
                    <template v-slot:body-cell-product_price="props">
                      <q-td>{{ props.row.product_price }} บาท</q-td>
                    </template>
                    <template v-slot:body-cell-quantity="props">
                      <q-td>{{ props.row.quantity }}</q-td>
                    </template>
                  </q-table>
                  <p class="total-amount">
                    เงินรวมทั้งหมด : {{ order.total_amount }} บาท
                  </p>
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
import { format } from "date-fns";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      deliveredOrders: [],
      loading: false,
      error: false,
      errorMessage: "",
      columns: [
        { name: "image", label: "ภาพสินค้า", align: "left" },
        { name: "product_name", label: "ชื่อสินค้า", align: "left" },
        { name: "description", label: "คำอธิบาย", align: "left" },
        { name: "product_price", label: "ราคา", align: "left" },
        { name: "quantity", label: "จำนวน", align: "left" },
      ],
    };
  },
  methods: {
    async fetchDeliveredOrders() {
      const memberId = sessionStorage.getItem("userId");
      this.loading = true;
      this.error = false;
      try {
        const response = await axios.get(
          `http://localhost:3000/orders/${memberId}`
        );
        const orders = response.data.filter(
          (order) => order.status === "Delivered"
        );

        // Fetch order items for each order
        const ordersWithItems = await Promise.all(
          orders.map(async (order) => {
            const itemsResponse = await axios.get(
              `http://localhost:3000/order-items/${order.order_id}`
            );
            return {
              ...order,
              order_date: format(new Date(order.order_date), "dd MMMM yyyy"),
              showDetails: false,
              orderItems: itemsResponse.data, // Include items in the order
            };
          })
        );

        this.deliveredOrders = ordersWithItems;
      } catch (error) {
        console.error("Error fetching orders:", error);
        this.error = true;
        this.errorMessage = "เกิดข้อผิดพลาดในการดึงข้อมูล";
      } finally {
        this.loading = false;
      }
    },
    toggleOrderDetails(order) {
      order.showDetails = !order.showDetails;
    },
  },
  created() {
    this.fetchDeliveredOrders();
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
.page-title {
  margin-bottom: 20px;
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
.product-image {
  width: 100px;
  height: 100px;
}
.total-amount {
  margin-top: 15px;
  font-weight: bold;
  font-size: 16px;
  text-align: right;
}
</style>
