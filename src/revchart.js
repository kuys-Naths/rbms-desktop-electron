const ctx = document.getElementById("revChart");
new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Total Sales For a Month (₱)",
        data: [5000, 7450, 6534],
        borderWidth: 1,
        backgroundColor: "#23CB7Cc9",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
            callback: function(value) {
              return "₱" + value.toLocaleString(); // add peso sign and format with commas
            },
          },
      },
    },
    
  },
});