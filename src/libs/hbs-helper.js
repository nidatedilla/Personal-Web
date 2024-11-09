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
    "JavaScript": "/assets/icon/javaScript.png",
    "Next JS": "/assets/icon/nextJS.png"
  };
  return icons[tech] || '';
});

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

// Helper untuk form validation
hbs.registerHelper("validateForm", function() {
  return `
    function validateForm() {
      const nameProject = document.getElementById('input-project');
      const startDate = document.getElementById('start-date');
      const endDate = document.getElementById('end-date');
      const description = document.getElementById('input-desc');
      const fileInput = document.getElementById('upload-img');
      const preview = document.getElementById('preview');
      
      clearErrors();
      let isValid = true;

      if (!nameProject.value) {
        showError(nameProject, 'Project name is required');
        isValid = false;
      }

      if (!description.value) {
        showError(description, 'Description is required');
        isValid = false;
      }

      if (!startDate.value) {
        showError(startDate, 'Start date is required');
        isValid = false;
      }

      if (!endDate.value) {
        showError(endDate, 'End date is required');
        isValid = false;
      }

      if (startDate.value && endDate.value) {
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        
        if (start > end) {
          showError(endDate, 'End date cannot be earlier than start date');
          isValid = false;
        }
      }

      // Cek apakah ini halaman edit dan ada gambar yang sudah ada
      const hasExistingImage = preview.src && !preview.src.endsWith('#');
      if (!fileInput.files[0] && !hasExistingImage) {
        showError(fileInput, 'Image is required');
        isValid = false;
      }

      return isValid;
    }

    function showError(input, message) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.color = 'red';
      errorDiv.style.fontSize = '12px';
      errorDiv.style.marginTop = '5px';
      errorDiv.innerHTML = message;

      // Cari input group dan tambahkan error setelahnya
      const inputGroup = input.closest('.input-group');
      if (inputGroup) {
        inputGroup.after(errorDiv);
      } else {
        input.parentNode.appendChild(errorDiv);
      }
    }

    function clearErrors() {
      const errors = document.getElementsByClassName('error-message');
      while(errors.length > 0) {
        errors[0].parentNode.removeChild(errors[0]);
      }
    }

    // Add event listeners for all inputs
    document.getElementById('input-project').addEventListener('input', clearErrors);
    document.getElementById('start-date').addEventListener('change', clearErrors);
    document.getElementById('end-date').addEventListener('change', clearErrors);
    document.getElementById('input-desc').addEventListener('input', clearErrors);
    document.getElementById('upload-img').addEventListener('change', function(event) {
      clearErrors();
      previewImage(event);
    });
  `;
});

// Helper untuk image preview
hbs.registerHelper("imagePreviewScript", function() {
  return `
    function previewImage(event) {
      const preview = document.getElementById('preview');
      const previewContainer = document.getElementById('preview-container');
      const file = event.target.files[0];
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
          preview.src = reader.result;
          previewContainer.style.display = 'block';
          previewContainer.classList.remove('d-none');
        }
        reader.readAsDataURL(file);
      } else {
        removeImage();
      }
    }

    function removeImage() {
      const preview = document.getElementById('preview');
      const previewContainer = document.getElementById('preview-container');
      const fileInput = document.getElementById('upload-img');
      
      preview.src = '#';
      previewContainer.style.display = 'none';
      previewContainer.classList.add('d-none');
      fileInput.value = '';
    }
  `;
});

