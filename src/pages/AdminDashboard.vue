<template>
  <div class="dashboard-container q-pa-md">
    <q-page class="q-pa-md">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="summary-header">
            <h1>Sales Dashboard</h1>
            <q-icon name="trending_up" size="32px" color="brown-6" />
          </div>
        </q-card-section>
      </q-card>

      <div class="row">
        <q-col cols="12" md="6">
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="summary-section">
                <h2>Total Sales</h2>
                <p>{{ formatCurrency(totalSales) }}</p>
              </div>
            </q-card-section>
          </q-card>
        </q-col>

        <q-col cols="12" md="6">
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="summary-section">
                <h2>Top Selling Products</h2>
                <q-table
                  dense
                  :rows="topProducts"
                  :columns="topProductColumns"
                  row-key="product_name"
                ></q-table>
              </div>
            </q-card-section>
          </q-card>
        </q-col>
      </div>

      <div class="row">
        <q-col cols="12" md="6">
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="summary-section">
                <h2>Sales by Category</h2>
                <q-table
                  dense
                  :rows="salesByCategory"
                  :columns="categoryColumns"
                  row-key="product_category"
                ></q-table>
              </div>
            </q-card-section>
          </q-card>
        </q-col>

        <q-col cols="12" md="6">
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="summary-section">
                <h2>Sales Over Time</h2>
                <q-select
                  v-model="selectedPeriod"
                  :options="periodOptions"
                  label="Select Period"
                  @input="fetchData"
                />
                <canvas id="salesChart"></canvas>
              </div>
            </q-card-section>
          </q-card>
        </q-col>
      </div>
    </q-page>
  </div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";

// Register all components
Chart.register(...registerables);

export default {
  data() {
    return {
      loading: true,
      error: false,
      errorMessage: "",
      totalSales: 0,
      topProducts: [],
      salesByCategory: [],
      salesOverTime: [],
      salesChart: null,
      selectedPeriod: "today", // Default period
      periodOptions: [
        { label: "Today", value: "today" },
        { label: "This Month", value: "month" },
        { label: "This Year", value: "year" },
      ],
    };
  },
  computed: {
    topProductColumns() {
      return [
        { name: "product_name", label: "Product Name", field: "product_name" },
        {
          name: "total_quantity",
          label: "Quantity Sold",
          field: "total_quantity",
        },
        {
          name: "total_revenue",
          label: "Total Revenue",
          field: "total_revenue",
          format: this.formatCurrency,
        },
      ];
    },
    categoryColumns() {
      return [
        {
          name: "product_category",
          label: "Category",
          field: "product_category",
        },
        {
          name: "total_revenue",
          label: "Total Revenue",
          field: "total_revenue",
          format: this.formatCurrency,
        },
      ];
    },
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(
          `http://localhost:3000/dashboard/sales-summary?period=${this.selectedPeriod}`
        );

        console.log("Response Data:", response.data); // Log the data for debugging

        this.totalSales = response.data.total_sales;
        this.topProducts = response.data.top_products;
        this.salesByCategory = response.data.sales_by_category;
        this.salesOverTime = response.data.sales_over_time;

        console.log(this.salesOverTime); // Log the sales over time data
        this.renderSalesChart();
      } catch (error) {
        console.error("Error fetching sales summary:", error);
        this.error = true;
        this.errorMessage = "Unable to load sales summary data.";
      } finally {
        this.loading = false;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
      }).format(value);
    },
    renderSalesChart() {
      const ctx = document.getElementById("salesChart").getContext("2d");
      if (this.salesChart) {
        this.salesChart.destroy(); // Destroy the existing chart instance
      }

      this.salesChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.salesOverTime.map((sale) => sale.sale_date),
          datasets: [
            {
              label: "Sales Revenue",
              data: this.salesOverTime.map((sale) => sale.total_revenue),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
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

.summary-section h2 {
  margin-bottom: 10px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.q-card {
  width: 100%;
}

.q-card-section {
  padding: 16px;
}
</style>
