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

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalMonths = years * 12 + months;

  if (totalMonths === 0) {
    return `${days} hari`;
  } else {
    return `${totalMonths} bulan, ${days} hari`;
  }
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

hbs.registerHelper("validateForm", function() {
  return `
    function validateForm() {
      // Get all input elements
      const nameProject = document.getElementById('input-project');
      const startDate = document.getElementById('start-date');
      const endDate = document.getElementById('end-date');
      const description = document.getElementById('input-desc');
      
      // Clear previous error messages
      clearErrors();
      
      let isValid = true;

      // Validate name
      if (!nameProject.value) {
        showError(nameProject, 'Project name is required');
        isValid = false;
      }

      // Validate description
      if (!description.value) {
        showError(description, 'Description is required');
        isValid = false;
      }

      // Validate start date
      if (!startDate.value) {
        showError(startDate, 'Start date is required');
        isValid = false;
      }

      // Validate end date
      if (!endDate.value) {
        showError(endDate, 'End date is required');
        isValid = false;
      }

      // Validate date range
      if (startDate.value && endDate.value) {
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        
        if (start > end) {
          showError(endDate, 'End date cannot be earlier than start date');
          isValid = false;
        }
      }

      return isValid;
    }

    function showError(input, message) {
      // Create error element
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.color = 'red';
      errorDiv.style.fontSize = '12px';
      errorDiv.style.marginTop = '5px';
      errorDiv.innerHTML = message;
      
      // Insert error after input
      input.parentNode.appendChild(errorDiv);
    }

    function clearErrors() {
      // Remove all error messages
      const errors = document.getElementsByClassName('error-message');
      while(errors.length > 0) {
        errors[0].parentNode.removeChild(errors[0]);
      }
    }
  `;
});

hbs.registerHelper("formatDate", function (date) {
  const options = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return new Date(date).toLocaleDateString('id-ID', options);
});

