<template>
  <div>
    <div class="row">
      <div class="col bgside"></div>
      <div class="col-10 bgcenter">
        <!-- ส่วนของยินดีต้อนรับและปุ่มการสั่งซื้อ -->
        <div style="margin-top: 45px">
          <q-card
            class="my-card"
            bordered
            style="padding-bottom: 25px; padding-top: 15px"
          >
            <div style="text-align: center; font-size: 35px">ยินดีต้อนรับ</div>
            <div style="text-align: center; font-size: 16px">คุณ SOMEONE</div>
            <div style="text-align: center; font-size: 16px">
              ชื่อ สมหมี อยากกินไข่เจียว
            </div>
            <div style="text-align: center; font-size: 16px">
              อีเมล awrgdrg@gmail.com
            </div>
          </q-card>
        </div>
        <p style="text-align: center; font-size: 25px; padding: 15px">
          การสั่งซื้อของฉัน
        </p>
        <hr />

        <div
          class="btn-container"
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-around;
          "
        >
          <!-- ปุ่มที่ต้องชำระ -->
          <q-btn class="btn-box" color="brown-6" @click="togglePaymentDetails">
            <span>ที่ต้องชำระ</span>
          </q-btn>
          <!-- ปุ่มที่ต้องจัดส่ง -->
          <q-btn class="btn-box" color="brown-6" @click="toggleDeliveryStatus">
            ที่ต้องจัดส่ง
          </q-btn>
          <!-- ปุ่มที่ต้องได้รับ -->
          <q-btn class="btn-box" color="brown-6" @click="toggleReceivedStatus">
            ที่ต้องได้รับ
          </q-btn>

          <!-- ปุ่มยกเลิกแล้ว -->
          <q-btn class="btn-box" color="brown-6" @click="cancelOrder">
            ยกเลิกแล้ว
          </q-btn>
        </div>
        <hr />

        <!-- ส่วนของรายละเอียดสินค้าที่ต้องชำระเงิน -->
        <div v-show="showPaymentDetails">
          <h2>รายละเอียดสินค้าที่ต้องชำระเงิน</h2>
          <q-card
            v-for="product in products"
            :key="product.id"
            style="margin-top: 10px"
          >
            <div class="row" style="padding: 15px">
              <div class="col-4">
                <p style="color: black">จำนวน {{ product.amount }}</p>
                <q-btn color="red" icon="delete" />
              </div>
              <div class="col-6">
                <div class="row">
                  <div class="col-md-4">
                    <img
                      :src="product.image"
                      alt="Product Image"
                      class="productimage"
                      style="width: 100px"
                    />
                  </div>
                  <div class="col-md">
                    {{ product.title }} {{ product.price }} บาท/ชิ้น
                  </div>
                </div>
              </div>
              <div class="col-2">
                ราคารวม 150 บาท
                <br />
                <q-btn style="width: 120px">ชำระเงินทันที</q-btn>
              </div>
            </div>
            <hr />
            <div>
              <p style="padding-bottom: 10px">
                สถานะ : <q-btn color="yellow-10">รอการชำระเงิน</q-btn>
                <q-btn color="green">ชำระเงินสำเร็จ</q-btn>
                <q-btn color="red">ยกเลิกสินค้า</q-btn>
              </p>
            </div>
          </q-card>

          <div class="menubtn" style="margin: 15px">
            <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
          </div>
        </div>

        <!-- ส่วนของสถานะการจัดส่ง -->
        <div v-show="showDeliveryStatus">
          <h2>สถานะการจัดส่ง</h2>
          <!-- วน loop เพื่อแสดงสินค้าแต่ละรายการ -->
          <q-card
            v-for="product in products"
            :key="product.id"
            style="margin-top: 10px"
          >
            <div class="row" style="padding: 15px">
              <div class="col-4">
                <p style="color: black">จำนวน {{ product.amount }}</p>
              </div>
              <div class="col-6">
                <div class="row">
                  <div class="col-md-4">
                    <img
                      :src="product.image"
                      alt="Product Image"
                      class="productimage"
                      style="width: 100px"
                    />
                  </div>
                  <div class="col-md">
                    {{ product.title }} {{ product.price }} บาท/ชิ้น
                  </div>
                </div>
              </div>

              <div class="col-2">
                ราคารวม 150 บาท
                <br />
                <!-- เพิ่มปุ่มรายละเอียดเพื่อแสดง q-stepper เมื่อคลิก -->
                <q-btn
                  style="width: 120px"
                  @click="toggleDeliveryStepper(product)"
                >
                  รายละเอียด <q-icon name="search" />
                </q-btn>
              </div>
            </div>
            <hr />
            <div>
              <p style="padding-bottom: 10px">
                สถานะ :
                <q-btn color="green">ชำระเงินสำเร็จ</q-btn>
              </p>
              <hr />
            </div>
            <!-- แสดง q-stepper ตามสถานะการจัดส่งของสินค้า -->
            <q-stepper
              v-show="product.showStepper"
              vertical
              color="primary"
              animated
            >
              <q-step :name="1" title="กำหนดการ" :done="product.step > 1">
                ระบุกำหนดการจัดส่งสินค้า

                <q-stepper-navigation>
                  <q-btn
                    @click="product.step = 2"
                    color="primary"
                    label="Continue"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="2" title="กำลังจัดส่ง" :done="product.step > 2">
                สินค้ากำลังอยู่ในระหว่างการจัดส่ง

                <q-stepper-navigation>
                  <q-btn
                    @click="product.step = 3"
                    color="primary"
                    label="Continue"
                  />
                  <q-btn
                    flat
                    @click="product.step = 1"
                    color="primary"
                    label="Back"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </q-step>

              <q-step :name="3" title="จัดส่งสำเร็จ" :done="product.step > 3">
                สินค้าได้ถูกจัดส่งเรียบร้อยแล้ว

                <q-stepper-navigation>
                  <q-btn
                    @click="product.step = 1"
                    color="primary"
                    label="Back"
                  />
                </q-stepper-navigation>
              </q-step>
              <!-- ส่วนของ q-stepper -->
            </q-stepper>
          </q-card>
          <div class="menubtn" style="margin: 15px">
            <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
          </div>
        </div>

        <!-- ส่วนของรายการที่ต้องได้รับ -->
        <div v-show="showReceivedStatus">
          <h2>ผลิตภัณฑ์ที่ต้องได้รับ</h2>
          <q-card
            v-for="product in products"
            :key="product.id"
            style="margin-top: 10px"
          >
            <div class="row" style="padding: 15px">
              <div class="col-4">
                <p style="color: black">จำนวน {{ product.amount }}</p>
              </div>
              <div class="col-6">
                <div class="row">
                  <div class="col-md-4">
                    <img
                      :src="product.image"
                      alt="Product Image"
                      class="productimage"
                      style="width: 100px"
                    />
                  </div>
                  <div class="col-md">
                    {{ product.title }} {{ product.price }} บาท/ชิ้น
                  </div>
                </div>
              </div>
              <div class="col-2">
                ราคารวม 150 บาท
                <br />
                <q-btn>ยืนยันการได้รับสินค้า</q-btn>
              </div>
            </div>
            <hr />
            <div>
              <p style="padding-bottom: 10px">
                สถานะ :
                <q-btn color="green">จัดส่งสำเร็จ</q-btn>
              </p>
            </div>
          </q-card>

          <div class="menubtn" style="margin: 15px">
            <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
          </div>
        </div>

        <div v-show="showCancelStatus">
          <h2>ผลิตภัณฑ์ที่ถูกยกเลิก</h2>
          <q-card
            v-for="product in products"
            :key="product.id"
            style="margin-top: 10px"
          >
            <div class="row" style="padding: 15px">
              <div class="col-4">
                <p style="color: black">จำนวน {{ product.amount }}</p>
              </div>
              <div class="col-6">
                <div class="row">
                  <div class="col-md-4">
                    <img
                      :src="product.image"
                      alt="Product Image"
                      class="productimage"
                      style="width: 100px"
                    />
                  </div>
                  <div class="col-md">
                    {{ product.title }} {{ product.price }} บาท/ชิ้น
                  </div>
                </div>
              </div>
              <div class="col-2">
                ราคารวม 150 บาท
                <br />
              </div>
            </div>
            <hr />
            <div>
              <p style="padding-bottom: 10px">
                สถานะ :
                <q-btn color="red">ยกเลิกแล้ว</q-btn>
              </p>
            </div>
          </q-card>

          <div class="menubtn" style="margin: 15px">
            <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
          </div>
        </div>
      </div>
      <div class="col bgside"></div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
  props: ["product"],
  data() {
    return {
      showPaymentDetails: false,
      showDeliveryStatus: false,
      showReceivedStatus: false,
      showCancelStatus: false,

      products: [
        {
          id: 1,
          title: "กระเป๋าผู้หญิงสไตล์วินเทจ",
          description:
            "กระเป๋าสวยงามและทันสมัยที่มาพร้อมกับดีไซน์สไตล์วินเทจ ช่วยให้คุณสร้างสไตล์ที่โดดเด่น ",
          image: "https://cdn.quasar.dev/img/parallax2.jpg",
          price: 350,
          amount: 20,
          purchaseCount: 10,
        },
        {
          id: 2,
          title: "นาฬิกาข้อมือสุภาพบุรุษ",
          description:
            "นาฬิกาข้อมือสำหรับผู้ชายที่มีสไตล์สุภาพบุรุษ ดีไซน์ทันสมัยและคุณภาพดี",
          image: "https://cdn.quasar.dev/img/parallax2.jpg",
          price: 350,
          amount: 20,
          purchaseCount: 10,
        },
      ],
    };
  },
  methods: {
    togglePaymentDetails() {
      this.showPaymentDetails = !this.showPaymentDetails;
      this.closeOtherSections("showPaymentDetails");
    },
    toggleDeliveryStatus() {
      this.showDeliveryStatus = !this.showDeliveryStatus;
      this.closeOtherSections("showDeliveryStatus");
    },
    toggleReceivedStatus() {
      this.showReceivedStatus = !this.showReceivedStatus;
      this.closeOtherSections("showReceivedStatus");
    },
    cancelOrder() {
      this.showCancelStatus = !this.showCancelStatus;
      this.closeOtherSections("showCancelStatus");
    },
    closeOtherSections(currentSection) {
      const sections = [
        "showPaymentDetails",
        "showDeliveryStatus",
        "showReceivedStatus",
        "showRating",
        "showCancelStatus",
      ];
      sections.forEach((section) => {
        if (section !== currentSection) {
          this[section] = false;
        }
      });
    },
    toggleDeliveryStepper(product) {
      product.showStepper = !product.showStepper;
    },
  },
  setup() {
    const router = useRouter();
    const step = ref(1);

    const link = () => {
      router.push("/main");
    };
    const linkToProductDetail = (productId) => {
      router.push(`/product/${productId}`);
    };
    return {
      link,
      step,
      linkToProductDetail,
    };
  },
};
</script>

<style>
.bgside {
  background-image: url("/src/assets/logo/bgside.png");
}

.bgcenter {
  min-height: 100vh;
  background-color: #fce7d1;
}

.btn-box {
  width: 150px;
  height: 50px;
  color: white;
}

.btn-box a {
  text-decoration: none;
  color: black;
  font-size: 20px;
}

.btn-container {
  margin-top: 20px;
  margin-bottom: 20px;
}

.menubtn {
  display: flex;
  justify-content: center;
}
</style>
