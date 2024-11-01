const hbs = require("hbs");

// Format tanggal ke ISO
hbs.registerHelper("formatToISO", function(date) {
  if (!date) return null;
  return new Date(date).toISOString();
});

// Format technologies array
hbs.registerHelper("formatTechArray", function(technologies) {
  if (typeof technologies === "string") {
    return `'{${technologies}}'`;
  } else if (Array.isArray(technologies)) {
    return `'{${technologies.join(',')}}'`;
  }
  return `'{}'`;
});

// Format durasi
hbs.registerHelper("get-durasi", function(startDate, endDate) {
  if (!startDate || !endDate) return '';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const months = Math.floor(diffDays / 30);
  const days = diffDays % 30;
  
  if (months > 0 && days > 0) {
    return `${months} bulan ${days} hari`;
  } else if (months > 0) {
    return `${months} bulan`;
  }
  return `${days} hari`;
});

// Format tanggal biasa
hbs.registerHelper("formatDate", function(date) {
  return date || '';
});

// Icon teknologi
hbs.registerHelper("get-tech-icon", function(tech) {
  const icons = {
    "Node JS": "/assets/icon/nodeJS.png",
    "React JS": "/assets/icon/reactJS.png",
    "Typescript": "/assets/icon/TS.png",
    "Next JS": "/assets/icon/nextJS.png"
  };
  return icons[tech] || '';
});

// Cek includes untuk checkbox
hbs.registerHelper("includes", function(array, value) {
  if (!array || !Array.isArray(array)) return false;
  return array.includes(value);
});

// Transform project data
hbs.registerHelper("transformProject", function(project) {
  return {
    ...project,
    nameProject: project.name,
    startDate: project.start_date,
    endDate: project.end_date,
    technologies: Array.isArray(project.technologies) ? project.technologies : []
  };
});

hbs.registerHelper("get-rating-stars", function(rating) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += `<i class="fas fa-star${i < rating ? '' : ' text-muted'}"></i>`;
  }
  return new hbs.SafeString(stars);
});

hbs.registerHelper("testimonial-card", function(testimonial) {
  const stars = Array(5).fill(0).map((_, i) => 
    `<i class="fas fa-star${i < testimonial.rating ? '' : ' text-muted'}"></i>`
  ).join('');

  return new hbs.SafeString(`
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 testimonial-card shadow-sm">
        <img src="${testimonial.image}" class="testimonial-image" alt="Testimonial Image">
        <div class="card-body">
          <p class="card-text">"${testimonial.content}"</p>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">- ${testimonial.author}</small>
            <div class="text-warning">
              ${stars}
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
});

hbs.registerHelper("filter-testimonials", function(testimonials, rating) {
  if (!rating) return testimonials;
  return testimonials.filter(testi => testi.rating === rating);
});

hbs.registerHelper("is-active", function(currentRating, buttonRating) {
  return currentRating === buttonRating ? 'active' : '';
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

