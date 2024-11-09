const testimonialData = [
  {
    author: "Blackpink",
    content: "MasyaAllah Tabarakallah",
    image: "https://i.pinimg.com/736x/06/93/22/06932282d555bff6c80e40dea2b74ac9.jpg",
    rating: 5,
  },
  {
    author: "Jisoo",
    content: "Keren bangeet, ampe keselek!!",
    image: "https://pbs.twimg.com/media/DSjMkl9U8AAp77O.jpg",
    rating: 4,
  },
  {
    author: "Rose",
    content: "Waaww amazing, mantap bangeet!!",
    image: "https://i.pinimg.com/736x/c0/8a/e6/c08ae6866e010451caccf0ae3d801ae1.jpg",
    rating: 3,
  },
  {
    author: "Lisa",
    content: "Gini amat",
    image: "https://i.pinimg.com/236x/28/d0/9c/28d09cf4e80f471fda6b4c7e45ba130b.jpg",
    rating: 2,
  },
  {
    author: "Jennie",
    content: "Ewwh",
    image: "https://stickerly.pstatic.net/sticker_pack/T0AdlPW2iS4ZPDncPPwYw/2RQL08/3/2c4e2a4e-a2bc-41a8-a9a7-cea2e44d3675.png",
    rating: 1,
  },
];

function generateTestimonialCard(testimonial) {
  const stars = Array(5).fill(0).map((_, i) => 
    `<i class="fas fa-star${i < testimonial.rating ? ' text-warning' : ' text-muted'}"></i>`
  ).join('');

  return `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100 testimonial-card shadow-sm">
        <img src="${testimonial.image}" class="testimonial-image" alt="Testimonial Image">
        <div class="card-body">
          <p class="card-text">"${testimonial.content}"</p>
          <div class="d-flex justify-content-between align-items-center">
            <small class="text-muted">- ${testimonial.author}</small>
            <div>
              ${stars}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getAllTesti(button) {
  const testimonialHTML = testimonialData
    .map(testimonial => generateTestimonialCard(testimonial))
    .join('');
  
  document.getElementById("testimonials").innerHTML = testimonialHTML;
  setActiveButton(button);
}

function getTestiByStar(rating, button) {
  const filteredData = testimonialData.filter(item => item.rating === rating);
  const testimonialHTML = filteredData
    .map(testimonial => generateTestimonialCard(testimonial))
    .join('');
  
  document.getElementById("testimonials").innerHTML = testimonialHTML;
  setActiveButton(button);
}

function setActiveButton(button) {
  document.querySelectorAll('.btn-outline-primary').forEach(btn => {
    btn.classList.remove('active');
  });
  if (button) {
    button.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const allButton = document.querySelector('.btn-outline-primary');
  allButton.classList.add('active');
  getAllTesti(allButton);
});
