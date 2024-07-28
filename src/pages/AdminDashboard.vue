<template>
  <div>
    <div class="row">
      <div class="col bg-side"></div>
      <div class="col-10 bg-center">
        <q-card
          bordered
          style="padding-bottom: 25px; padding-top: 15px; margin-bottom: 25px"
        >
          <div style="text-align: center; font-size: 35px">ยอดขาย</div>
          <div style="text-align: center; font-size: 20px; margin-top: 20px">
            เดือนนี้ขายได้ {{ totalSalesThisMonth }} ชิ้น
          </div>
          <div style="text-align: center; font-size: 20px; margin-top: 10px">
            วันนี้ขายได้ {{ totalSalesToday }} ชิ้น
          </div>
        </q-card>

        <div class="row">
          <div class="col-md">
            <div style="justify-content: center; display: flex">
              <q-date v-model="date" color="white-9" text-color="black" />
            </div>
          </div>
          <div class="col-md">
            <canvas
              ref="salesChartCanvas"
              width="450"
              height="400"
              style="background-color: aliceblue"
            ></canvas>
            <br />
            <canvas
              ref="dailySalesChartCanvas"
              width="450"
              height="400"
              style="background-color: aliceblue"
            ></canvas>
          </div>
          <div class="col-md"></div>
        </div>
      </div>
      <div class="col bg-side"></div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js/auto";

export default {
  mounted() {
    this.renderChart();
    this.renderDailySalesChart();
  },
  methods: {
    renderChart() {
      const ctx = this.$refs.salesChartCanvas.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: this.months,
          datasets: [
            {
              label: "ยอดขายรายเดือน",
              data: this.salesData,
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
    renderDailySalesChart() {
      const ctx = this.$refs.dailySalesChartCanvas.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: this.days,
          datasets: [
            {
              label: "ยอดขายรายวัน",
              data: this.dailySales,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
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
  computed: {
    months() {
      return [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤษจิกายน",
        "ธันวาคม",
      ];
    },
    salesData() {
      return [
        1000, 2000, 1500, 3000, 2500, 4000, 3500, 500, 1500, 3500, 1400, 4500,
        1500,
      ];
    },
    days() {
      return [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
      ];
    },
    dailySales() {
      return [
        100, 200, 150, 300, 250, 400, 350, 50, 150, 350, 140, 450, 150, 100,
        200, 150, 300, 250, 400, 350, 50, 150, 350, 140, 450, 150, 100, 200,
        150, 300, 250,
      ];
    },
    totalSalesThisMonth() {
      return this.salesData.reduce((a, b) => a + b, 0);
    },
    totalSalesToday() {
      const today = new Date().getDate();
      return this.dailySales[today - 1];
    },
  },
};
</script>

<style>
.bg-side {
  background-image: url("/src/assets/logo/bgside.png");
}

.bg-center {
  background-color: beige;
  min-height: 100vh;
}
</style>
