// Class untuk testimonial
class Testimonial {
  #image = "";
  #content = "";
  #author = "";
  #rating = 0;

  constructor(image, content, author, rating) {
    this.#image = image;
    this.#content = content;
    this.#author = author;
    this.#rating = rating;
  }

  get author() {
    return this.#author;
  }

  get content() {
    return this.#content;
  }

  get image() {
    return this.#image;
  }

  get rating() {
    return this.#rating;
  }

  get testimonialHTML() {
    return `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 testimonial-card shadow-sm">
          <img src="${this.#image}" class="testimonial-image" alt="Testimonial Image">
          <div class="card-body">
            <p class="card-text">"${this.#content}"</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">- ${this.#author}</small>
              <div class="text-warning">
                ${this.#getRatingStars()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  #getRatingStars() {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += `<i class="fas fa-star${i < this.#rating ? '' : ' text-muted'}"></i>`;
    }
    return stars;
  }
}

// Fungsi untuk mengambil semua testimonial
async function getAllTestimonials() {
  // Gunakan data dari testimonialData langsung
  return testimonialData.map(item => new Testimonial(
    item.image,
    item.content,
    item.author,
    item.rating
  ));
}

// Fungsi untuk mengambil testimonial berdasarkan rating
async function getTestimonialsByRating(rating) {
  // Filter data berdasarkan rating
  const filteredData = testimonialData.filter(item => item.rating === rating);
  return filteredData.map(item => new Testimonial(
    item.image,
    item.content,
    item.author,
    item.rating
  ));
}

// Fungsi untuk menampilkan testimonial
async function renderTestimonials(testimonials) {
  const testimonialContainer = document.getElementById('testimonials');
  testimonialContainer.innerHTML = testimonials.map(testimonial => 
    testimonial.testimonialHTML
  ).join('');
}

// Event handler untuk button All
async function getAllTesti(button) {
  const testimonials = await getAllTestimonials();
  renderTestimonials(testimonials);
  if (button) {
    setActiveButton(button);
  }
}

// Event handler untuk button rating
async function getTestiByStar(rating, button) {
  const testimonials = await getTestimonialsByRating(rating);
  renderTestimonials(testimonials);
  setActiveButton(button);
}

// Fungsi untuk mengatur active button
function setActiveButton(button) {
  // Hapus class active dari semua button
  document.querySelectorAll('.btn-outline-primary').forEach(btn => {
    btn.classList.remove('active');
  });
  // Tambah class active ke button yang diklik
  button.classList.add('active');
}

// Load testimonials saat halaman dibuka
document.addEventListener('DOMContentLoaded', async function() {
  // Aktifkan tombol All saat pertama load
  const allButton = document.querySelector('.btn-outline-primary');
  allButton.classList.add('active');
  
  // Load semua testimonial tanpa parameter button
  await getAllTesti();
});
