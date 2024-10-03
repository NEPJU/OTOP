<template>
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
          <q-btn
            class="btn-box"
            color="brown-6"
            @click="filterOrders('Delivered')"
            label="จัดส่งสำเร็จ"
          />
          <q-btn
            class="btn-box"
            color="brown-6"
            @click="filterOrders('Cancelled')"
            label="สินค้าที่ถูกยกเลิก"
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
                  <!-- เพิ่มส่วนแสดงข้อมูลผู้ใช้ -->
                  <div class="user-info">
                    <h5>ข้อมูลผู้สั่งซื้อ:</h5>
                    <!-- <img
                        :src="order.user_profileimg"
                        alt="User Profile Image"
                        class="user-profile-image"
                      /> -->
                    <p>ชื่อ: {{ order.user_name }}</p>
                    <p>อีเมล: {{ order.user_email }}</p>
                    <p>ที่อยู่ : {{ order.user_address }}</p>
                    <p>เบอร์ : {{ order.user_phone }}</p>
                  </div>
                  <p v-if="order.trackingNumber">
                    Tracking Number: {{ order.trackingNumber }}
                  </p>
                  <p v-if="order.trackingNumber">
                    บริษัทขนส่ง: {{ order.carrier_name }}
                  </p>
                </div>
                <div class="col-6">
                  <q-btn
                    v-if="order && order.showDetails !== undefined"
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
                  :columns="itemColumns"
                  row-key="order_item_id"
                  flat
                  bordered
                  separator="cell"
                />
                <h5>รายละเอียดการชำระเงิน:</h5>
                <div v-if="order.payment_image_base64">
                  <img
                    :src="order.payment_image_base64"
                    class="payment-image"
                    alt="Payment Image"
                  />
                </div>
                <div v-else>
                  <p>ยังไม่มีการชำระเงิน</p>
                </div>
                <div class="center-btn" v-if="order.status === 'Waiting'">
                  <q-btn @click="confirmPayment(order)" color="green">
                    ยืนยันการชำระเงิน
                  </q-btn>
                  <q-btn @click="cancelOrder(order)" color="red">
                    ยกเลิกการสั่งซื้อ
                  </q-btn>
                </div>

                <!-- Timeline for Shipped and Delivered Status -->
                <div
                  v-if="
                    order.status === 'Shipped' || order.status === 'Delivered'
                  "
                >
                  <q-timeline color="secondary" layout="dense">
                    <q-timeline-entry
                      color="green"
                      icon="done"
                      title="ชำระเงินสำเร็จ"
                      subtitle="คำสั่งซื้อได้รับการชำระเงินแล้ว"
                    />
                    <q-timeline-entry color="blue" icon="local_shipping">
                      <div>
                        <h6>เลข Tracking และบริษัทขนส่ง</h6>
                        <!-- ถ้ายังไม่ได้บันทึก Tracking จะแสดง dropdown ให้เลือกบริษัทได้ -->
                        <div
                          v-if="
                            order.status === 'Shipped' && !order.trackingSaved
                          "
                        >
                          <q-select
                            v-model="order.carrierName"
                            :options="couriers"
                            label="เลือกบริษัทขนส่ง"
                            outlined
                            dense
                            style="margin-bottom: 10px"
                          />
                        </div>

                        <q-input
                          v-model="order.trackingNumber"
                          placeholder="กรอกเลข Tracking"
                          outlined
                          :readonly="order.status === 'Delivered'"
                        />

                        <q-btn
                          v-if="
                            order.status === 'Shipped' &&
                            order.carrierName &&
                            order.trackingNumber &&
                            !order.trackingSaved
                          "
                          @click="confirmPayment(order)"
                          color="green"
                          label="บันทึก Tracking"
                        />
                      </div>
                    </q-timeline-entry>
                    <q-timeline-entry
                      v-if="order && order.status === 'Delivered'"
                      color="orange"
                      icon="check_circle"
                      title="จัดส่งสำเร็จ"
                      subtitle="ลูกค้าได้รับสินค้าแล้ว"
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
      itemColumns: [
        {
          name: "product_id",
          label: "ID สินค้า",
          field: "product_id",
          align: "left",
        },
        {
          name: "product_name",
          label: "ชื่อสินค้า",
          field: "product_name",
          align: "left",
        },
        { name: "price", label: "ราคา", field: "price", align: "right" },
        { name: "quantity", label: "จำนวน", field: "quantity", align: "right" },
      ],
      couriers: [
        { label: "ไปรษณีย์ไทย", value: "ไปรษณีย์ไทย" },
        { label: "Kerry Express", value: "Kerry Express" },
        { label: "J&T Express", value: "J&T Express" },
        { label: "Flash Express", value: "Flash Express" },
        { label: "Ninja Van", value: "Ninja Van" },
      ],
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
          orderItems: order.orderItems || [], // กำหนดค่าให้เป็น array ว่างถ้าไม่มีข้อมูล
          trackingNumber: order.tracking_number || "",
          carrierName: order.carrier_name
            ? { label: order.carrier_name, value: order.carrier_name }
            : null,
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
        let payload = {};

        if (order.status === "Waiting") {
          // เปลี่ยนสถานะเป็น Shipped
          payload = { status: "Shipped" };
          await axios.put(
            `http://localhost:3000/orders/${order.order_id}/confirm-payment`,
            payload
          );
          order.status = "Shipped";
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "สถานะได้ถูกเปลี่ยนเป็น Shipped และจำนวนสินค้าถูกปรับแล้ว",
          });
        } else if (
          order.status === "Shipped" &&
          order.trackingNumber &&
          order.carrierName &&
          order.carrierName.value // ตรวจสอบว่ามีค่า value อยู่หรือไม่
        ) {
          // เพิ่มข้อมูล tracking number และ carrier name
          payload = {
            tracking_number: order.trackingNumber,
            carrier_name: order.carrierName.value,
          };
          await axios.put(
            `http://localhost:3000/orders/${order.order_id}/add-tracking`,
            payload
          );
          order.trackingSaved = true; // กำหนดให้ทราบว่าบันทึก Tracking แล้ว
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "เลข Tracking และบริษัทจัดส่งได้ถูกเพิ่มเรียบร้อย",
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: "ข้อมูลไม่ครบถ้วน",
            text: "กรุณากรอกเลข Tracking และเลือกบริษัทจัดส่ง",
          });
        }

        this.filterOrders(order.status);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถเปลี่ยนสถานะหรือเพิ่มเลข Tracking ได้",
        });
      }
    },

    async cancelOrder(order) {
      try {
        const payload = { status: "Cancelled" };
        await axios.put(
          `http://localhost:3000/orders/${order.order_id}/cancel-order`,
          payload
        );
        order.status = "Cancelled";
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "ออเดอร์ได้ถูกยกเลิกเรียบร้อยแล้ว",
        });
        this.filterOrders(order.status);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถยกเลิกออเดอร์ได้",
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
