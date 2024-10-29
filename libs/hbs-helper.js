const hbs = require("hbs");

hbs.registerHelper("get-durasi", (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return "End date tidak boleh lebih awal dari start date.";
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonthDays = new Date(
      end.getFullYear(),
      end.getMonth(),
      0
    ).getDate();
    days += previousMonthDays;
  }

  return `${years * 12 + months} bulan, ${days} hari`;
});

hbs.registerHelper("get-tech-icon", function (tech) {
  const icons = {
    "Node JS": "/assets/icon/nodeJS.png",
    "React JS": "/assets/icon/reactJS.png",
    Typescript: "/assets/icon/TS.png",
    "Next JS": "/assets/icon/nextJS.png",
  };
  return icons[tech] || "/assets/icon/default.png";
});

hbs.registerHelper("includes", function (array, value) {
    if (!array || !Array.isArray(array)) {
      return false;
    }
    return array.includes(value);
  });