const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "hbs");

app.use("/assets/js", express.static("assets/js"));
app.use("/assets/css", express.static("assets/css"));
app.use("/assets/img", express.static("assets/img"));
app.use("/assets/icon", express.static("assets/icon"));
app.use("views", express.static("/views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", home);
app.get("/project", project);
app.get("/testimonial", testimonial);
app.get("/contact", contact);
app.get("/project-detail/:id", projectDetail);

app.post("/project", projectPost)

// routing
function home(req, res) {
  res.render("index");
}
function project(req, res) {
  res.render("project");
}
function testimonial(req, res) {
  res.render("testimonial");
}
function contact(req, res) {
  res.render("contact");
}
function projectDetail(req, res) {
  const { id } = req.params;
  res.render("project-detail", { id });
}

function projectPost(req, res) {
  const { nameProject, description } = req.body;
  console.log("Name: ", nameProject);
  console.log("Description: ", description);

  res.json(req.body);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
``