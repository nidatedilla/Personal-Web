const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
require("./libs/hbs-helper");

app.set("view engine", "hbs");

app.use("/assets", express.static(path.join(__dirname, "./assets")));
app.use("views", express.static("/views"));
app.use(express.urlencoded({ extended: true }));

let projects = [];
let nextId = 1;

function home(req, res) {
  res.render("index", { projects });
}

function testimonial(req, res) {
  res.render("testimonial");
}

function contact(req, res) {
  res.render("contact");
}

function project(req, res) {
  res.render("project", { projects });
}

function projectPost(req, res) {
  const { nameProject, description, startDate, endDate, technologies } = req.body;
  
  const newProject = {
    id: nextId++,
    nameProject,
    description,
    startDate,
    endDate,
    technologies: technologies ? [].concat(technologies) : [],
    image: "https://png.pngtree.com/thumb_back/fw800/background/20231019/pngtree-captivating-close-up-delicate-pink-flowers-as-a-stunning-natural-background-image_13682589.png",
    createdAt: new Date()
  };

  projects.unshift(newProject);
  res.redirect("/project");
}

function projectDelete(req, res) {
  const { id } = req.params;
  projects = projects.filter(project => project.id !== parseInt(id));
  res.redirect("/project");
}

function editProject(req, res) {
  const { id } = req.params;
  const project = projects.find(p => p.id === parseInt(id));
  
  if (!project) {
    return res.redirect('/project');
  }

  res.render("edit-project", { project });
}

function editProjectPost(req, res) {
  const { id } = req.params;
  const { nameProject, description, startDate, endDate, technologies } = req.body;

  const projectIndex = projects.findIndex(p => p.id === parseInt(id));
  if (projectIndex !== -1) {
    projects[projectIndex] = {
      ...projects[projectIndex],
      nameProject,
      description,
      startDate,
      endDate,
      technologies: technologies ? [].concat(technologies) : [],
      image: "https://png.pngtree.com/thumb_back/fw800/background/20231019/pngtree-captivating-close-up-delicate-pink-flowers-as-a-stunning-natural-background-image_13682589.png"
    };
  }

  res.redirect("/project");
}

function projectDetail(req, res) {
  const { id } = req.params;
  const project = projects.find(p => p.id === parseInt(id));
  
  if (!project) {
    return res.redirect('/project');
  }

  res.render("project-detail", { project });
}

app.get("/", home);
app.get("/testimonial", testimonial);
app.get("/contact", contact);

//PROJECT
app.get("/project", project);
app.post("/project", projectPost);
app.post("/delete-project/:id", projectDelete);
app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", editProjectPost);
app.get("/project-detail/:id", projectDetail);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});