<template>
  <div class="row">
    <div class="col-1 bgside"></div>
    <div class="col-10 bgcenter">
      <q-card-section>
        <div>
          <h1>แดชบอร์ดการขาย</h1>
          <q-icon name="trending_up" size="32px" color="brown-6" />
        </div>
      </q-card-section>

      <!-- Date Range Picker -->
      <q-card>
        <q-card-section>
          <q-date
            v-model="selectedDate"
            mask="YYYY-MM-DD"
            @input="fetchData"
            label="เลือกวันที่"
            :options="dateOptions"
          />
          <q-btn @click="fetchData">แสดงข้อมูล</q-btn>
        </q-card-section>
      </q-card>

      <!-- ส่วนของข้อมูลยอดขาย -->
      <q-card>
        <div class="row">
          <div class="col cl">
            <div>
              <h4>ยอดขายวันนี้</h4>
              <p>{{ formatCurrency(totalSalesToday) }}</p>
              <q-table
                dense
                :rows="salesTodayProducts"
                :columns="salesProductColumns"
                row-key="product_name"
              ></q-table>
            </div>
          </div>
        </div>
      </q-card>

      <!-- กราฟเส้นแสดงยอดขาย -->
      <q-card>
        <div class="row">
          <div class="col cl">
            <h4>กราฟเส้นแสดงยอดขาย</h4>
            <canvas id="salesLineChart"></canvas>
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-1 bgside"></div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";

// ลงทะเบียน Chart.js components ทั้งหมด
Chart.register(...registerables);

export default {
  data() {
    return {
      selectedDate: "", // วันที่ที่เลือก
      totalSalesToday: 0,
      salesTodayProducts: [],
      salesLineChart: null, // กราฟเส้น
      salesOverTimeData: [], // ข้อมูลสำหรับกราฟเส้น
    };
  },
  methods: {
    async fetchData() {
      if (!this.selectedDate) {
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/dashboard/sales-summary?date=${this.selectedDate}`
        );
        this.totalSalesToday = response.data.total_sales || 0;
        this.salesTodayProducts = response.data.top_products || [];
        this.salesOverTimeData = response.data.sales_over_time || [];
        this.renderSalesLineChart(); // สร้างกราฟเส้นหลังจากดึงข้อมูลสำเร็จ
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลยอดขาย:", error);
      }
    },

    renderSalesLineChart() {
      const ctx = document.getElementById("salesLineChart").getContext("2d");
      if (this.salesLineChart) {
        this.salesLineChart.destroy(); // ทำลายกราฟก่อนหน้า (ถ้ามี)
      }

      this.salesLineChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.salesOverTimeData.map((sale) => sale.sale_date),
          datasets: [
            {
              label: "ยอดขาย",
              data: this.salesOverTimeData.map((sale) => sale.total_revenue),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
                tooltipFormat: "yyyy-MM-dd",
                displayFormats: {
                  day: "yyyy-MM-dd",
                },
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
      }).format(value);
    },
  },
  created() {
    this.fetchData(); // ดึงข้อมูลเริ่มต้นเมื่อโหลดหน้า
  },
};
</script>

<style scoped>
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

.dashboard-container {
  padding: 20px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-section {
  text-align: center;
}

.summary-section h4 {
  margin-bottom: 10px;
}

.q-card {
  width: 100%;
}

.q-card-section {
  padding: 16px;
}

.cl {
  padding: 10px;
}
</style>
