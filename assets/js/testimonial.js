async function getAllTesti() {
  try {
    setActiveButton(document.querySelector(".star-container button"));

    let testimonials = await fetch(
      "https://api.npoint.io/73d0527afd21a5ae3a28"
    );
    testimonials = await testimonials.json();

    const testimonialHTML = testimonials.map((testimonial) => {
      return `<div class="item-testi-container">
          <div class="div-testi-img">
            <img
              src="${testimonial.image}"
              alt=""
            />
          </div>
          <div>
            <p>"${testimonial.comment}"</p>
          </div>
          <div style="width: 90%; text-align: right;">
            <p>${testimonial.name}</p>
            <p><i class="fa fa-star" aria-hidden="true" style="color: gold;"></i> ${testimonial.star}</p>
          </div>
        </div>`;
    });

    document.getElementById("testimonials").innerHTML =
      testimonialHTML.join("");
  } catch (error) {
    console.error(error);
  }
}

async function getTestiByStar(star, button) {
  try {
    setActiveButton(button);
    let testimonials = await fetch(
      "https://api.npoint.io/73d0527afd21a5ae3a28"
    );
    testimonials = await testimonials.json();

    const filteredTestimonials = testimonials.filter((testimonial) => {
      return testimonial.star === star;
    });

    const testimonialHTML = filteredTestimonials.map((testimonial) => {
      return `<div class="item-testi-container">
          <div class="div-testi-img">
            <img
              src="${testimonial.image}"
              alt=""
            />
          </div>
          <div>
            <p>"${testimonial.comment}"</p>
          </div>
          <div style="width: 90%; text-align: right;">
            <p>${testimonial.name}</p>
            <p><i class="fa fa-star" aria-hidden="true" style="color: gold;"></i> ${testimonial.star}</p>
          </div>
        </div>`;
    });

    document.getElementById("testimonials").innerHTML =
      testimonialHTML.join("");
  } catch (error) {
    console.error(error);
  }
}

getAllTesti();

function setActiveButton(button) {
  // Menghapus class "active" dari semua tombol
  const buttons = document.querySelectorAll(".star-container button");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // Menambahkan class "active" ke tombol yang diklik
  button.classList.add("active");
}
