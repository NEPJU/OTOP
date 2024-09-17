<template>
  <div class="row justify-center q-gutter-md">
    <div class="col-1 bg-side"></div>
    <div class="col-10 bgcenter q-pa-md">
      <q-card class="q-mb-md">
        <q-card-section class="text-h5 q-py-md text-primary">
          <div class="header flex flex-center">
            <q-icon
              name="trending_up"
              size="32px"
              color="primary"
              class="q-mr-sm"
            />
            แดชบอร์ดการขาย
          </div>
        </q-card-section>
      </q-card>

      <!-- Date Selection -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md q-pb-md">
            <div class="col-12">
              <label class="form-label">เลือกประเภทการแสดงผล</label>
              <select
                v-model="selectedOption"
                class="form-select styled-select"
              >
                <option value="specific-day">เลือกวันเฉพาะเจาะจง</option>
                <option value="date-range">เลือกช่วงเวลา</option>
              </select>
            </div>
          </div>

          <!-- Display specific day -->
          <div
            v-if="selectedOption === 'specific-day'"
            class="row q-col-gutter-md q-pb-md"
          >
            <div class="col-4">
              <label class="form-label">วัน</label>
              <select
                v-model="specificDayDay"
                :disabled="!specificDayMonth || !specificDayYear"
                class="form-select styled-select"
              >
                <option
                  v-for="day in getDays(specificDayMonth, specificDayYear)"
                  :key="day"
                  :value="day"
                >
                  {{ day }}
                </option>
              </select>
              <small
                v-if="!specificDayMonth || !specificDayYear"
                class="text-muted"
              >
                กรุณาเลือกเดือนและปีก่อนเพื่อเลือกวัน
              </small>
            </div>
            <div class="col-4">
              <label class="form-label">เดือน</label>
              <select
                v-model="specificDayMonth"
                class="form-select styled-select"
              >
                <option v-for="month in months" :key="month" :value="month">
                  {{ month }}
                </option>
              </select>
            </div>
            <div class="col-4">
              <label class="form-label">ปี</label>
              <select
                v-model="specificDayYear"
                class="form-select styled-select"
              >
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>

          <!-- Display date range -->
          <div
            v-if="selectedOption === 'date-range'"
            class="row q-col-gutter-md q-pb-md"
          >
            <div class="col-4">
              <label class="form-label">วันเริ่มต้น</label>
              <select
                v-model="startDay"
                class="form-select styled-select"
                :disabled="!startMonth || !startYear"
              >
                <option
                  v-for="day in getDays(startMonth, startYear)"
                  :key="day"
                  :value="day"
                >
                  {{ day }}
                </option>
              </select>
              <small v-if="!startMonth || !startYear" class="text-muted">
                กรุณาเลือกเดือนและปีก่อนเพื่อเลือกวัน
              </small>
            </div>
            <div class="col-4">
              <label class="form-label">เดือนเริ่มต้น</label>
              <select v-model="startMonth" class="form-select styled-select">
                <option v-for="month in months" :key="month" :value="month">
                  {{ month }}
                </option>
              </select>
            </div>
            <div class="col-4">
              <label class="form-label">ปีเริ่มต้น</label>
              <select v-model="startYear" class="form-select styled-select">
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
            <div class="col-4 q-mt-md">
              <label class="form-label">วันสิ้นสุด</label>
              <select
                v-model="endDay"
                class="form-select styled-select"
                :disabled="!endMonth || !endYear"
              >
                <option
                  v-for="day in getDays(endMonth, endYear)"
                  :key="day"
                  :value="day"
                >
                  {{ day }}
                </option>
              </select>
              <small v-if="!endMonth || !endYear" class="text-muted">
                กรุณาเลือกเดือนและปีก่อนเพื่อเลือกวัน
              </small>
            </div>
            <div class="col-4 q-mt-md">
              <label class="form-label">เดือนสิ้นสุด</label>
              <select v-model="endMonth" class="form-select styled-select">
                <option v-for="month in months" :key="month" :value="month">
                  {{ month }}
                </option>
              </select>
            </div>
            <div class="col-4 q-mt-md">
              <label class="form-label">ปีสิ้นสุด</label>
              <select v-model="endYear" class="form-select styled-select">
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>

          <div class="row justify-center q-mt-md">
            <button @click="fetchData" class="btn btn-primary">
              แสดงข้อมูล
            </button>
          </div>
        </q-card-section>
      </q-card>

      <!-- Sales Data Section -->
      <q-card>
        <q-card-section>
          <div>
            <h4 class="text-h6 q-mb-md">ยอดขายในช่วงวันที่ที่เลือก</h4>
            <p class="text-subtitle1 q-mb-md">
              {{ formatCurrency(totalSales) }}
            </p>
            <q-table
              dense
              flat
              :rows="salesProducts"
              :columns="salesProductColumns"
              row-key="product_name"
              separator="horizontal"
            >
              <template v-slot:body-cell-sale_date="props">
                <q-td :props="props">
                  {{ formatDate(props.row.sale_date) }}
                </q-td>
              </template>
            </q-table>
            <p
              v-if="salesProducts.length === 0"
              class="text-center q-pa-md text-caption"
            >
              No data available
            </p>
          </div>
        </q-card-section>
      </q-card>

      <!-- Sales Line Chart -->
      <q-card v-if="selectedOption === 'date-range'" class="q-mt-md">
        <q-card-section>
          <canvas id="salesLineChart"></canvas>
        </q-card-section>
      </q-card>
    </div>
    <div class="col bg-side"></div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(...registerables);

export default {
  data() {
    return {
      selectedOption: "specific-day",
      specificDayDay: null,
      specificDayMonth: null,
      specificDayYear: null,
      startDay: null,
      startMonth: null,
      startYear: null,
      endDay: null,
      endMonth: null,
      endYear: null,
      dateOptions: [
        { label: "เลือกวันเฉพาะเจาะจง", value: "specific-day" },
        { label: "เลือกช่วงเวลา", value: "date-range" },
      ],
      months: Array.from({ length: 12 }, (_, i) =>
        (i + 1).toString().padStart(2, "0")
      ),
      years: Array.from({ length: 20 }, (_, i) =>
        (new Date().getFullYear() - i).toString()
      ),
      totalSales: 0,
      salesProducts: [],
      salesOverTime: [],
      salesLineChart: null,
      salesProductColumns: [
        {
          name: "product_name",
          label: "Product Name",
          align: "left",
          field: "product_name",
        },
        {
          name: "total_quantity",
          label: "Total Quantity",
          align: "left",
          field: "total_quantity",
        },
        {
          name: "total_revenue",
          label: "Total Revenue",
          align: "left",
          field: "total_revenue",
          format: (val) => this.formatCurrency(val),
        },
        {
          name: "sale_date",
          label: "Sale Date",
          align: "left",
          field: "sale_date",
          format: (val) => this.formatDate(val),
          sortMethod: (a, b) => new Date(a) - new Date(b), // การเรียงลำดับตามวันที่
        },
      ],
    };
  },
  methods: {
    // ฟังก์ชันเพื่อคำนวณจำนวนวันในแต่ละเดือน
    getDays(month, year) {
      const monthInt = parseInt(month, 10);
      const yearInt = parseInt(year, 10);
      if (!monthInt || !yearInt) return [];
      const daysInMonth = new Date(yearInt, monthInt, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) =>
        (i + 1).toString().padStart(2, "0")
      );
    },

    async fetchData() {
      let apiUrl = "";

      if (this.selectedOption === "specific-day") {
        if (
          !this.specificDayDay ||
          !this.specificDayMonth ||
          !this.specificDayYear
        ) {
          return;
        }
        const specificDay = `${this.specificDayYear}-${this.specificDayMonth}-${this.specificDayDay}`;
        apiUrl = `http://localhost:3000/dashboard/sales-summary?date=${specificDay}`;
      } else if (this.selectedOption === "date-range") {
        if (
          !this.startDay ||
          !this.startMonth ||
          !this.startYear ||
          !this.endDay ||
          !this.endMonth ||
          !this.endYear
        ) {
          return;
        }
        const startDate = `${this.startYear}-${this.startMonth}-${this.startDay}`;
        const endDate = `${this.endYear}-${this.endMonth}-${this.endDay}`;
        apiUrl = `http://localhost:3000/dashboard/sales-summary?start_date=${startDate}&end_date=${endDate}`;
      }

      if (!apiUrl) {
        return;
      }

      try {
        const response = await axios.get(apiUrl);
        console.log("API Response:", response.data);

        this.totalSales = response.data.total_sales || 0;
        this.salesProducts = response.data.top_products || [];

        // ทำการเรียงลำดับข้อมูลตามวันที่ก่อน
        this.salesProducts.sort(
          (a, b) => new Date(a.sale_date) - new Date(b.sale_date)
        );

        this.salesOverTime = response.data.sales_over_time || [];

        if (this.selectedOption === "date-range") {
          this.renderSalesLineChart();
        }
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    },

    renderSalesLineChart() {
      const ctx = document.getElementById("salesLineChart").getContext("2d");
      if (this.salesLineChart) {
        this.salesLineChart.destroy();
      }

      this.salesLineChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: this.salesOverTime.map((sale) => sale.sale_date),
          datasets: [
            {
              label: "ยอดขาย",
              data: this.salesOverTime.map((sale) => sale.total_revenue),
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

    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("th-TH", options);
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
      }).format(value);
    },
  },
};
</script>

<style scoped>
.container {
  margin-top: 45px;
}
.bg-side {
  background-image: url("/src/assets/logo/bgside.png");
}
.bgcenter {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #3f51b5;
}

.q-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.q-card-section {
  padding: 24px;
}

.styled-select {
  appearance: none;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  width: 100%;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: border-color 0.3s;
}

.styled-select:hover {
  border-color: #3f51b5;
}

.styled-select:focus {
  border-color: #3f51b5;
  box-shadow: 0 0 4px rgba(63, 81, 181, 0.3);
}

button {
  background-color: #3f51b5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #303f9f;
}

.text-primary {
  color: #3f51b5;
}
</style>
