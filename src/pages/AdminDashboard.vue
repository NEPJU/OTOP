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
          <div class="col cl">
            <div>
              <h4>ยอดขายอาทิตย์นี้</h4>
              <p>{{ formatCurrency(totalSalesWeek) }}</p>
              <q-table
                dense
                :rows="salesWeekProducts"
                :columns="salesProductColumns"
                row-key="product_name"
              ></q-table>
            </div>
          </div>
          <div class="col cl">
            <div>
              <h4>ยอดขายเดือนนี้</h4>
              <p>{{ formatCurrency(totalSalesMonth) }}</p>
              <q-table
                dense
                :rows="salesWeekProducts"
                :columns="salesProductColumns"
                row-key="product_name"
              ></q-table>
            </div>
          </div>
          <div class="col cl">
            <div>
              <h4>ยอดขายปีนี้</h4>
              <p>{{ formatCurrency(totalSalesYear) }}</p>
              <q-table
                dense
                :rows="salesYearProducts"
                :columns="salesProductColumns"
                row-key="product_name"
              ></q-table>
            </div>
          </div>
        </div>
      </q-card>
      <h2>แผนภูมิแท่งแสดงยอดการขาย</h2>

      <q-card>
        <div class="row">
          <div class="col">
            <div>
              <h4>ยอดขายวันนี้</h4>
              <p>{{ formatCurrency(totalSalesToday) }}</p>
              <canvas id="salesTodayChart"></canvas>
            </div>
          </div>
          <div class="col">
            <div>
              <h4>ยอดขายอาทิตย์นี้</h4>
              <p>{{ formatCurrency(totalSalesWeek) }}</p>
              <canvas id="salesWeekChart"></canvas>
            </div>
          </div>
          <div class="col">
            <div>
              <h4>ยอดขายเดือนนี้</h4>
              <p>{{ formatCurrency(totalSalesMonth) }}</p>
              <canvas id="salesMonthChart"></canvas>
            </div>
          </div>
          <div class="col">
            <div>
              <h4>ยอดขายปีนี้</h4>
              <p>{{ formatCurrency(totalSalesYear) }}</p>
              <canvas id="salesYearChart"></canvas>
            </div>
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
      totalSalesToday: 0,
      totalSalesWeek: 0, // ยอดขายของอาทิตย์นี้
      totalSalesMonth: 0,
      totalSalesYear: 0,
      salesTodayData: [],
      salesWeekData: [], // ข้อมูลยอดขายของอาทิตย์นี้
      salesTodayProducts: [],
      salesWeekProducts: [], // รายการสินค้าที่ขายได้ในอาทิตย์นี้
      salesMonthData: [],
      salesMonthProducts: [],
      salesYearData: [],
      salesYearProducts: [],
      salesTodayChart: null,
      salesWeekChart: null, // Chart สำหรับยอดขายของอาทิตย์นี้
      salesMonthChart: null,
      salesYearChart: null,
    };
  },
  computed: {
    salesProductColumns() {
      return [
        { name: "product_name", label: "ชื่อสินค้า", field: "product_name" },
        {
          name: "total_quantity",
          label: "จำนวนที่ขายได้",
          field: "total_quantity",
        },
        {
          name: "total_revenue",
          label: "รายได้รวม",
          field: "total_revenue",
          format: this.formatCurrency,
        },
      ];
    },
  },
  methods: {
    async fetchData() {
      try {
        // ดึงข้อมูลยอดขายวันนี้
        let response = await axios.get(
          "http://localhost:3000/dashboard/sales-summary?period=today"
        );
        this.totalSalesToday = response.data.total_sales || 0;
        this.salesTodayData = response.data.sales_over_time || [];
        this.salesTodayProducts = response.data.top_products || [];
        this.renderSalesTodayChart();

        // ดึงข้อมูลยอดขายของอาทิตย์นี้
        response = await axios.get(
          "http://localhost:3000/dashboard/sales-summary?period=week"
        );
        this.totalSalesWeek = response.data.total_sales || 0;
        this.salesWeekData = response.data.sales_over_time || [];
        this.salesWeekProducts = response.data.top_products || [];
        this.renderSalesWeekChart();

        // ดึงข้อมูลยอดขายเดือนนี้
        response = await axios.get(
          "http://localhost:3000/dashboard/sales-summary?period=month"
        );
        this.totalSalesMonth = response.data.total_sales || 0;
        this.salesMonthData = response.data.sales_over_time || [];
        this.salesMonthProducts = response.data.top_products || [];
        this.renderSalesMonthChart();

        // ดึงข้อมูลยอดขายปีนี้
        response = await axios.get(
          "http://localhost:3000/dashboard/sales-summary?period=year"
        );
        this.totalSalesYear = response.data.total_sales || 0;
        this.salesYearData = response.data.sales_over_time || [];
        this.salesYearProducts = response.data.top_products || [];
        this.renderSalesYearChart();
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลยอดขาย:", error);
      }
    },

    renderSalesTodayChart() {
      const ctx = document.getElementById("salesTodayChart").getContext("2d");
      if (this.salesTodayChart) {
        this.salesTodayChart.destroy();
      }

      this.salesTodayChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.salesTodayData.map((sale) => sale.sale_date),
          datasets: [
            {
              label: "รายได้จากการขายวันนี้",
              data: this.salesTodayData.map((sale) => sale.total_revenue),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
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

    renderSalesWeekChart() {
      const ctx = document.getElementById("salesWeekChart").getContext("2d");
      if (this.salesWeekChart) {
        this.salesWeekChart.destroy();
      }

      this.salesWeekChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.salesWeekData.map((sale) => sale.sale_date),
          datasets: [
            {
              label: "รายได้จากการขายอาทิตย์นี้",
              data: this.salesWeekData.map((sale) => sale.total_revenue),
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
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

    renderSalesMonthChart() {
      const ctx = document.getElementById("salesMonthChart").getContext("2d");
      if (this.salesMonthChart) {
        this.salesMonthChart.destroy();
      }

      this.salesMonthChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.salesMonthData.map((sale) => sale.sale_date),
          datasets: [
            {
              label: "รายได้จากการขายเดือนนี้",
              data: this.salesMonthData.map((sale) => sale.total_revenue),
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
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

    renderSalesYearChart() {
      const ctx = document.getElementById("salesYearChart").getContext("2d");
      if (this.salesYearChart) {
        this.salesYearChart.destroy();
      }

      this.salesYearChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.salesYearData.map((sale) => sale.sale_date),
          datasets: [
            {
              label: "รายได้จากการขายปีนี้",
              data: this.salesYearData.map((sale) => sale.total_revenue),
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "time",
              time: {
                unit: "month",
                tooltipFormat: "yyyy-MM",
                displayFormats: {
                  month: "yyyy-MM",
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
    this.fetchData();
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
