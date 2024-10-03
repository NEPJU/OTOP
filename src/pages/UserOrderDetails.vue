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
              sm="12"
            >
              <q-card class="order-card">
                <div class="row card-header">
                  <div class="col-6">
                    <h5>ออเดอร์ที่ : {{ order.order_id }}</h5>
                    <p>วันที่ : {{ order.order_date }}</p>
                    <p>เงินรวมทั้งหมด : {{ order.total_amount }} บาท</p>
                    <p>
                      สถานะ :
                      <span
                        v-if="order.status === 'Cancelled'"
                        class="status-dot"
                        :style="{ backgroundColor: 'red' }"
                      ></span>
                      <span
                        v-if="order.status === 'Cancelled'"
                        class="status-text"
                        >ถูกยกเลิก</span
                      >
                    </p>
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
                          v-if="props.row.images && props.row.images.length > 0"
                          :src="props.row.images[0]"
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
        <!-- ส่วนของสินค้าที่ยกเลิกจบ -->

        <div v-if="ordersVisible && !loading">
          <q-row>
            <q-col
              v-for="order in filteredOrders"
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
                    <p>
                      สถานะ :
                      <span
                        v-if="order.status === 'Pending'"
                        class="status-dot"
                        :style="{ backgroundColor: 'yellow' }"
                      ></span>
                      <span
                        v-if="order.status === 'Pending'"
                        class="status-text"
                        >รอการชำระเงิน</span
                      >
                      <span
                        v-if="order.status === 'Waiting'"
                        class="status-dot"
                        :style="{ backgroundColor: 'orange' }"
                      ></span>
                      <span
                        v-if="order.status === 'Waiting'"
                        class="status-text"
                        >รอการตรวจสอบ</span
                      >
                    </p>
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
                          v-if="props.row.images && props.row.images.length > 0"
                          :src="props.row.images[0]"
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
              sm="12"
            >
              <q-card class="order-card">
                <div class="row card-header">
                  <div class="col-6">
                    <h5>ออเดอร์ที่ : {{ order.order_id }}</h5>
                    <p>วันที่ : {{ order.order_date }}</p>
                    <p>เงินรวมทั้งหมด : {{ order.total_amount }} บาท</p>
                    <p>
                      สถานะ :
                      <span
                        v-if="order.status === 'Shipped'"
                        class="status-dot"
                        :style="{ backgroundColor: 'blue' }"
                      ></span>
                      <span
                        v-if="order.status === 'Shipped'"
                        class="status-text"
                        >อยู่ระหว่างการจัดส่ง</span
                      >
                    </p>
                    <p style="margin-top: -5px">
                      เลข Tracking : {{ order.trackingNumber }}
                    </p>
                    <p v-if="order.carrier_name">
                      บริษัทขนส่ง:
                      <q-btn
                        color="blue"
                        :label="`${order.carrier_name}`"
                        @click="goToTracking(order)"
                      />
                    </p>
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
                          v-if="props.row.images && props.row.images.length > 0"
                          :src="props.row.images[0]"
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
                  <div class="payment-image-container">
                    <img
                      :src="order.payment_image_base64"
                      class="payment-image"
                      alt="Payment Image"
                    />
                  </div>
                  <div class="center-btn">
                    <q-btn
                      @click="markAsDelivered(order)"
                      color="green"
                      label="ยืนยันการได้รับสินค้า"
                    />
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
              sm="12"
            >
              <q-card class="order-card">
                <div class="row card-header">
                  <div class="col-6">
                    <h5>ออเดอร์ที่ : {{ order.order_id }}</h5>
                    <p>วันที่ : {{ order.order_date }}</p>
                    <p>เงินรวมทั้งหมด : {{ order.total_amount }} บาท</p>
                    <p>
                      สถานะ :
                      <span
                        v-if="order.status === 'Delivered'"
                        class="status-dot"
                        :style="{ backgroundColor: 'green' }"
                      ></span>
                      <span
                        v-if="order.status === 'Delivered'"
                        class="status-text"
                        >จัดส่งสำเร็จ</span
                      >
                    </p>
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
                          v-if="props.row.images && props.row.images.length > 0"
                          :src="props.row.images[0]"
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
      columns: [
        { name: "image", label: "ภาพสินค้า", align: "left" },
        { name: "product_name", label: "ชื่อสินค้า", align: "left" },
        { name: "description", label: "คำอธิบาย", align: "left" },
        { name: "product_price", label: "ราคา", align: "left" },
        { name: "quantity", label: "จำนวน", align: "left" },
      ],
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
          // แปลงข้อมูล image_base64 เป็น array ของ Base64
          order.orderItems = response.data.map((item) => ({
            ...item,
            images: JSON.parse(item.image_base64), // แปลงจาก JSON เป็น Array
          }));
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
    goToTracking(order) {
      let trackingLink = "";
      const trackingNumber = order.trackingNumber;

      switch (order.carrier_name) {
        case "ไปรษณีย์ไทย":
          trackingLink = `https://track.thailandpost.co.th/?trackNumber=${trackingNumber}`;
          break;
        case "Kerry Express":
          trackingLink = `https://th.kerryexpress.com/th/track/?track=${trackingNumber}`;
          break;
        case "J&T Express":
          trackingLink = `https://www.jtexpress.co.th/index/query/gzquery.html?waybillNo=${trackingNumber}`;
          break;
        case "Flash Express":
          trackingLink = `https://www.flashexpress.co.th/tracking/?se=${trackingNumber}`;
          break;
        case "Ninja Van":
          trackingLink = `https://www.ninjavan.co/th-th/tracking?id=${trackingNumber}`;
          break;
        default:
          trackingLink = `https://maayoung.com/tracking/?se=${trackingNumber}`;
          break;
      }

      const message = `ตรวจสอบสถานะพัสดุได้ที่: ${trackingLink}`;

      // คัดลอกข้อความไปยังคลิปบอร์ดและเปิดลิงก์
      navigator.clipboard
        .writeText(message)
        .then(() => {
          window.open(trackingLink, "_blank");
          this.$q.notify({
            type: "positive",
            message: "ลิงก์ได้ถูกคัดลอกแล้ว และเปิดหน้าเพื่อติดตามสถานะพัสดุ",
          });
        })
        .catch((err) => {
          this.$q.notify({
            type: "negative",
            message: "ไม่สามารถคัดลอกลิงก์ได้ กรุณาลองใหม่อีกครั้ง",
          });
        });
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
.total-amount {
  font-weight: bold;
  text-align: right;
  margin-top: 10px;
}

.status-dot {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  margin-right: 5px;
}

.status-text {
  vertical-align: middle;
  margin-right: 15px;
  font-weight: bold;
}
</style>
