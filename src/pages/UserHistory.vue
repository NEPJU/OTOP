<template>
  <div class="">
    <div class="row">
      <div class="col-1 bgside"></div>
      <div class="col-10 bgcenter">
        <h3 class="page-title">ประวัติการสั่งซื้อ (Delivered)</h3>

        <div v-if="loading" class="loading-spinner">
          <q-spinner-dots color="brown-6" size="50px" />
        </div>

        <div v-if="!loading && deliveredOrders.length === 0" class="no-orders">
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
                <div class="card-header">
                  <div>
                    <h5>ออเดอร์ที่ : {{ order.order_id }}</h5>
                    <p>วันที่ : {{ order.order_date }}</p>
                    <p>เงินรวมทั้งหมด : {{ order.total_amount }} บาท</p>
                  </div>
                  <q-btn
                    @click="toggleOrderDetails(order)"
                    color="primary"
                    :label="
                      order.showDetails ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'
                    "
                    class="details-btn"
                    unelevated
                  />
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
                    separator="horizontal"
                  >
                    <template v-slot:body-cell-image="props">
                      <q-td>
                        <div class="images-wrapper">
                          <img
                            :src="props.row.images[0]"
                            alt="Product Image"
                            class="product-image"
                          />
                        </div>
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

        <div v-if="error" class="error-banner">
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
            const orderItems = itemsResponse.data.map((item) => ({
              ...item,
              images: JSON.parse(item.image_base64), // Parse JSON string into array
            }));
            return {
              ...order,
              order_date: format(new Date(order.order_date), "dd MMMM yyyy"),
              showDetails: false,
              orderItems: orderItems, // Include parsed items in the order
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

<style scoped>
.container {
  margin-top: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.bgside {
  background-image: url("/src/assets/logo/bgside.png");
}

.bgcenter {
  min-height: 100vh;
  background-color: bisque;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  color: #5a350c;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.order-card {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
  transition: transform 0.3s ease;
}

.order-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.details-btn {
  background-color: #5a350c;
  color: white;
}

.details-btn:hover {
  background-color: #442609;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.total-amount {
  margin-top: 15px;
  font-weight: bold;
  font-size: 16px;
  text-align: right;
  color: #5a350c;
}

.no-orders {
  text-align: center;
  font-size: 18px;
  color: gray;
  margin-top: 20px;
}

.error-banner {
  margin-top: 20px;
}
</style>
