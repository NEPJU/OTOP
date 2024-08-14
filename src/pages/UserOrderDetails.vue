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
            <q-btn
              class="btn-box"
              color="brown-6"
              @click="toggleDeliveredOrdersVisibility"
              label="ได้รับของแล้ว"
            />
            <q-btn
              class="btn-box"
              color="brown-6"
              @click="toggleCancelledOrdersVisibility"
              label="สินค้าที่ยกเลิก"
            />
          </div>
        </div>
        <div v-if="loading" class="loading-spinner">
          <q-spinner-dots color="brown-6" size="50px" />
        </div>

        <!-- ส่วนของสินค้าที่ยกเลิก -->
        <div v-if="cancelledOrdersVisible && !loading">
          <q-row>
            <q-col
              v-for="order in cancelledOrders"
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
                </q-card-section>
              </q-card>
            </q-col>
          </q-row>
        </div>
        <!-- ส่วนของสินค้าที่ยกเลิกจบ -->

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

                  <!-- Payment Image or Upload Section -->
                  <div v-if="order.status === 'Pending'">
                    <label for="image-upload" class="upload-label">
                      อัพโหลดใบเสร็จการชำระเงิน
                    </label>
                    <div class="qrcode-container">
                      <img
                        src="/src/assets/qrcodepromtpay.jpg"
                        alt="QR Code"
                        style="width: 450px"
                      />
                    </div>

                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      @change="handleImageChange"
                      class="upload-input"
                    />

                    <!-- แสดงภาพตัวอย่างก่อนอัพโหลด -->
                    <div v-if="imagePreview" class="preview-container">
                      <h5>รูปภาพที่จะอัพโหลด:</h5>
                      <img
                        :src="imagePreview"
                        alt="Preview Image"
                        class="preview-image"
                      />
                    </div>
                  </div>

                  <div v-else>
                    <h5>รูปภาพการชำระเงิน:</h5>
                    <img
                      :src="order.payment_image_base64"
                      class="payment-image"
                      alt="Payment Image"
                    />
                  </div>

                  <img
                    :src="order.imageUrl"
                    v-if="order.imageUrl"
                    class="preview-image"
                    alt="Uploaded Image"
                  />
                  <div
                    class="center-btn"
                    v-if="
                      order.status === 'Pending' || order.status === 'Waiting'
                    "
                  >
                    <q-btn
                      @click="markAsShipped(order)"
                      color="green"
                      v-if="order.status === 'Pending'"
                    >
                      ชำระเงิน
                    </q-btn>
                    <q-btn @click="cancelOrder(order)" color="red">
                      ยกเลิกการสั่งสินค้า
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
                      <q-timeline-entry
                        color="blue"
                        icon="local_shipping"
                        subtitle="กำลังจัดส่งผลิตภัณฑ์"
                      >
                        <h6 style="margin-top: -5px">เลข Tracking</h6>
                        <p style="margin-top: -15px">
                          {{ order.trackingNumber }}
                        </p>
                      </q-timeline-entry>
                      <q-timeline-entry
                        color="orange"
                        icon="check_circle"
                        title="ยืนยันการได้รับของ"
                        subtitle="ลูกค้าได้ยืนยันการได้รับสินค้าแล้ว"
                      />
                    </q-timeline>
                    <div class="center-btn">
                      <q-btn
                        @click="markAsDelivered(order)"
                        color="green"
                        label="ยืนยันการได้รับสินค้า"
                      />
                    </div>
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
                  <div class="payment-image-container">
                    <img
                      :src="order.payment_image_base64"
                      class="payment-image"
                      alt="Payment Image"
                    />
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
                      <q-timeline-entry
                        color="blue"
                        icon="local_shipping"
                        subtitle="กำลังจัดส่งผลิตภัณฑ์"
                      >
                        <h6 style="margin-top: -5px">เลข Tracking</h6>
                        <p style="margin-top: -15px">
                          {{ order.trackingNumber }}
                        </p>
                      </q-timeline-entry>
                      <q-timeline-entry
                        color="orange"
                        icon="check_circle"
                        title="ยืนยันการได้รับของ"
                        subtitle="ลูกค้าได้ยืนยันการได้รับสินค้าแล้ว"
                      />
                    </q-timeline>
                    <div class="center-btn">
                      <q-btn
                        @click="markAsDelivered(order)"
                        color="green"
                        label="ยืนยันการได้รับสินค้า"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-col>
          </q-row>
        </div>
        <div v-if="deliveredOrdersVisible && !loading">
          <q-row>
            <q-col
              v-for="order in deliveredOrders"
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

                  <!-- Timeline for Delivered Status -->
                  <div v-if="order.status === 'Delivered'">
                    <div class="payment-image-container">
                      <img
                        :src="order.payment_image_base64"
                        class="payment-image"
                        alt="Payment Image"
                      />
                    </div>
                    <q-timeline color="secondary" layout="dense">
                      <q-timeline-entry
                        color="green"
                        icon="done"
                        title="ชำระเงินสำเร็จ"
                        subtitle="คำสั่งซื้อได้รับการชำระเงินแล้ว"
                      />
                      <q-timeline-entry
                        color="blue"
                        icon="local_shipping"
                        subtitle="กำลังจัดส่งผลิตภัณฑ์"
                      >
                        <h6 style="margin-top: -5px">เลข Tracking</h6>
                        <p style="margin-top: -15px">
                          {{ order.trackingNumber }}
                        </p>
                      </q-timeline-entry>
                      <q-timeline-entry
                        color="orange"
                        icon="check_circle"
                        title="ได้รับของเรียบร้อยแล้ว"
                        subtitle="ลูกค้าได้รับสินค้าของท่านแล้ว"
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
import { format } from "date-fns";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      orders: [],
      loading: false,
      ordersVisible: false,
      shippedOrdersVisible: false,
      deliveredOrdersVisible: false,
      cancelledOrdersVisible: false,
      error: false,
      errorMessage: "",
      imageFile: null, // เก็บไฟล์ภาพ
      imagePreview: "", // เก็บ Base64 ของภาพสำหรับแสดงในหน้าเว็บ
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(
        (order) => order.status === "Pending" || order.status === "Waiting"
      );
    },
    shippedOrders() {
      return this.orders.filter((order) => order.status === "Shipped");
    },
    deliveredOrders() {
      return this.orders.filter((order) => order.status === "Delivered");
    },
    cancelledOrders() {
      return this.orders.filter((order) => order.status === "Cancelled");
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
          trackingNumber: order.tracking_number || "",
          imageUrl: "", // To store uploaded image URL
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
      this.deliveredOrdersVisible = false;
      this.cancelledOrdersVisible = false;
      if (this.ordersVisible && this.orders.length === 0) {
        this.fetchOrders();
      }
    },
    toggleShippedOrdersVisibility() {
      this.shippedOrdersVisible = !this.shippedOrdersVisible;
      this.ordersVisible = false;
      this.deliveredOrdersVisible = false;
      this.cancelledOrdersVisible = false;
      if (this.shippedOrdersVisible && this.orders.length === 0) {
        this.fetchOrders();
      }
    },
    toggleDeliveredOrdersVisibility() {
      this.deliveredOrdersVisible = !this.deliveredOrdersVisible;
      this.ordersVisible = false;
      this.shippedOrdersVisible = false;
      this.cancelledOrdersVisible = false;
      if (this.deliveredOrdersVisible && this.orders.length === 0) {
        this.fetchOrders();
      }
    },
    toggleCancelledOrdersVisibility() {
      this.cancelledOrdersVisible = !this.cancelledOrdersVisible;
      this.ordersVisible = false;
      this.shippedOrdersVisible = false;
      this.deliveredOrdersVisible = false;
      if (this.cancelledOrdersVisible && this.orders.length === 0) {
        this.fetchOrders();
      }
    },

    async markAsShipped(order) {
      if (!this.imagePreview) {
        Swal.fire({
          icon: "warning",
          title: "กรุณาอัพโหลดรูปภาพ",
          text: "คุณต้องอัพโหลดรูปภาพก่อนชำระเงิน",
        });
        return;
      }

      try {
        console.log("Sending image data:", this.imagePreview); // Debugging line

        await axios.put(
          `http://localhost:3000/orders/${order.order_id}/status`,
          {
            status: "Waiting",
            payment_image_base64: this.imagePreview, // Send the preview image as base64 string
          }
        );
        order.status = "Waiting";
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "สถานะได้ถูกเปลี่ยนเป็น Waiting และรูปภาพถูกบันทึกเรียบร้อย",
        });
      } catch (error) {
        console.error("Error updating order status and saving image:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถเปลี่ยนสถานะได้",
        });
      }
    },
    async cancelOrder(order) {
      try {
        // สร้าง payload ที่มีเฉพาะสถานะเท่านั้น
        const payload = {
          status: "Cancelled",
        };

        // เรียก API เพื่ออัปเดตสถานะของออเดอร์
        await axios.put(
          `http://localhost:3000/orders/${order.order_id}/status`,
          payload
        );

        // อัปเดตสถานะของออเดอร์ในฝั่งของ client
        order.status = "Cancelled"; // Update the local status only

        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "สถานะได้ถูกเปลี่ยนเป็น Cancelled",
        });
      } catch (error) {
        console.error("Error cancelling the order:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถยกเลิกการสั่งซื้อได้",
        });
      }
    },

    async markAsDelivered(order) {
      try {
        // สร้าง payload ที่มีเฉพาะสถานะเท่านั้น
        const payload = {
          status: "Delivered",
        };

        // เรียก API เพื่ออัปเดตสถานะของออเดอร์
        await axios.put(
          `http://localhost:3000/orders/${order.order_id}/status`,
          payload
        );

        // อัปเดตสถานะของออเดอร์ในฝั่งของ client
        order.status = "Delivered"; // Update the local status only

        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "สถานะได้ถูกเปลี่ยนเป็น Delivered",
        });
      } catch (error) {
        console.error("Error marking order as delivered:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถเปลี่ยนสถานะได้",
        });
      }
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file; // Store the file object for later use

        // สร้างภาพตัวอย่าง
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
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
.upload-label {
  display: block;
  margin-top: 10px;
}
.qrcode-container {
  display: flex;
  justify-content: center;
  margin: 10px 0;
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
  width: 100%;
  max-width: 450px;
}
.center-btn {
  display: flex;
  justify-content: center;
}
.product-image {
  width: 150px;
  height: 150px;
}
.payment-image {
  width: 100%;
  max-width: 450px;
  display: block;
  margin: 20px auto;
}
.preview-container {
  margin-top: 10px;
  text-align: center;
}
</style>
