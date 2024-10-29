const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
require("./libs/hbs-helper");

app.set("view engine", "hbs");

app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("views", express.static("/views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", home);
app.get("/testimonial", testimonial);
app.get("/contact", contact);

//PROJECT
app.get("/project", project);
app.post("/project", projectPost);
app.post("/delete-project/:index", projectDelete);
app.get("/edit-project/:index", editProject);
app.post("/edit-project/:index", editProjectPost);

app.get("/project-detail/:id", projectDetail);

const projects = [];

// routing
function home(req, res) {
  res.render("index");
}
function project(req, res) {
  res.render("project", {projects});
}
function testimonial(req, res) {
  res.render("testimonial");
}
function contact(req, res) {
  res.render("contact");
}
function projectDetail(req, res) {
  const { index } = req.params;
  res.render("project-detail", { id: index });
}

function projectPost(req, res) {
  const { nameProject, description, startDate, endDate, technologies } =
    req.body;

  projects.unshift({
    image:
      "https://cdn.pixabay.com/photo/2021/08/07/19/49/cosmea-6529220_640.jpg",
    nameProject,
    description,
    startDate,
    endDate,
    technologies: technologies ? [].concat(technologies) : [],
  });

  res.redirect("/project");
}

function projectDelete(req, res) {
  const { index } = req.params;

  projects.splice(index, 1);

  res.redirect("/project");
}

function editProject(req, res) {
  const { index } = req.params;

  const project = projects.find((_, idx) => idx == index);

  res.render("edit-project", { project, index });
}

function editProjectPost(req, res) {
  const { index } = req.params;

  const { nameProject, description, startDate, endDate, technologies } =
    req.body;

  projects[index] = {
    image:
      "https://cdn.pixabay.com/photo/2021/08/07/19/49/cosmea-6529220_640.jpg",
    nameProject,
    description,
    startDate,
    endDate,
    technologies: technologies ? [].concat(technologies) : [],
  };

  res.redirect("/project");
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
``;
