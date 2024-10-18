const blogs = [];

function addBlog(event) {
  event.preventDefault();

  const inputNamaProject = document.getElementById("input-project").value;
  const inputStartDate = document.getElementById("start-date").value;
  const inputEndDate = document.getElementById("end-date").value;
  const inputDesc = document.getElementById("input-desc").value;
  const uploadImg = document.getElementById("upload-img").files;

  // Ubah input date menjadi objek Date
  const startDate = new Date(inputStartDate);
  const endDate = new Date(inputEndDate);

  // Validasi: Pastikan endDate tidak lebih awal dari startDate
  if (endDate < startDate) {
    document.getElementById("error").innerText =
      "End date tidak boleh lebih awal dari start date.";
    return; // Hentikan eksekusi lebih lanjut
  }
  

  // Hitung perbedaan bulan dan hari
  let years = endDate.getFullYear() - startDate.getFullYear();
  let months = endDate.getMonth() - startDate.getMonth();
  let days = endDate.getDate() - startDate.getDate();

  // Jika hari negatif, kurangi satu bulan dan tambahkan jumlah hari dari bulan sebelumnya
  if (days < 0) {
    months -= 1;
    const previousMonthDays = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      0
    ).getDate();
    days += previousMonthDays;
  }

  // Gabungkan hasil menjadi durasi
  const durasi = `${years * 12 + months} bulan, ${days} hari`;

  // Pastikan ada gambar yang diunggah
  if (uploadImg.length === 0) {
    document.getElementById("error").innerText = "Silakan unggah gambar.";
    return;
  }

  const image = URL.createObjectURL(uploadImg[0]); // Membuat URL gambar

  // Menyimpan ikon teknologi berdasarkan checkbox yang dipilih
  const technologies = [];
  const techCheckboxes = document.querySelectorAll('input[type="checkbox"]');

  techCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      // Tentukan URL ikon gambar berdasarkan teknologi yang dipilih
      const techIcon = getTechIcon(checkbox.value);
      technologies.push(techIcon); // Simpan URL ikon teknologi
    }
  });

  // Buat objek blog
  const blog = {
    image: image,
    project: inputNamaProject,
    durasi: durasi,
    description: inputDesc,
    technologies: technologies, // Menyimpan ikon teknologi
    startDate: inputStartDate, // Menyimpan startDate
    endDate: inputEndDate, // Menyimpan endDate
  };

  blogs.unshift(blog);
  localStorage.setItem("blogs", JSON.stringify(blogs)); // Simpan data ke Local Storage
  renderBlog(); // Panggil renderBlog() untuk memperbarui tampilan
}

// Fungsi untuk mendapatkan URL ikon teknologi berdasarkan nama teknologi
function getTechIcon(tech) {
  const techIcons = {
    "node-js": { name: "Node JS", icon: "assets/icon/nodeJS.png" },
    "react-js": { name: "React JS", icon: "assets/icon/reactJS.png" },
    "next-js": { name: "Next JS", icon: "assets/icon/nextJS.png" },
    typescript: { name: "TypeScript", icon: "assets/icon/TS.png" },
  };

  return techIcons[tech];
}


function renderBlog() {
  let html = ``;

  for (let index = 0; index < blogs.length; index++) {
    html += 
    `<div class="blog">
    <h2 style="text-align: center;">MY PROJECT</h2>
        <div>
          <div class="blog-content">
            <div class="div-img-project">
              <img
                src="${blogs[index].image}"alt=""/>
            </div>

            <div>
              <h3><a href="blog-detail.html?index=${index}" target="_blank">
                ${blogs[index].project}
                </a></h3>
              <p>Durasi: ${blogs[index].durasi}</p>
            </div>

            <div>
              <p style="text-align: justify;">${blogs[index].description}</p>
            </div>

            <div class="tech-icon" style="display: flex; gap: 10px; flex-wrap: wrap;">
              ${blogs[index].technologies
                .map((tech) => `<img src="${tech.icon}" alt="${tech.name}" />`)
                .join("")}
            </div>

            <div class="btn-container" style="display: flex; justify-content: center">
              <div>
                <button class="btn-pink">Edit</button>
              </div>
            <div>
              <button class="btn-pink" onclick="deleteBlog(${index})">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  document.getElementById("contents").innerHTML = html; // Memperbarui tampilan blog
}

function deleteBlog(index) {
  blogs.splice(index, 1);
  renderBlog();
}

// Mengambil elemen input file dan dummy input
const fileInput = document.getElementById("upload-img");
const fileNameInput = document.querySelector(".file-name-input");

// Menambahkan event listener untuk mendeteksi perubahan pada input file
fileInput.addEventListener("change", function () {
  // Jika ada file yang dipilih, tampilkan nama file tersebut
  if (fileInput.files.length > 0) {
    fileNameInput.value = fileInput.files[0].name;
  } else {
    fileNameInput.value = "No file chosen";
  }
});
