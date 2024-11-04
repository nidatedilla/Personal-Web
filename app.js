const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const hbs = require("hbs");
require("./src/libs/hbs-helper");
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./src/views"));

app.use("/assets", express.static(path.join(__dirname, "./src/assets")));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name: "my-session",
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));
app.use(flash());

app.get("/", home);
app.get("/testimonial", testimonial);
app.get("/contact", contact);
app.get("/login", login);
app.post("/login", loginPost);
app.get("/register", register);
app.post("/register", registerPost);

//PROJECT
app.get("/project", project);
app.post("/project", projectPost);
app.post("/delete-project/:id", projectDelete);
app.get("/edit-project/:id", editProject);
app.post("/edit-project/:id", editProjectPost);
app.get("/project-detail/:id", projectDetail);
app.post("/logout", logoutPost);

function home(req, res) {
  const user = req.session.user;
  res.render("index", { user });
}

function login(req, res) {
  res.render("login");
}

async function loginPost(req, res){
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = '${email}'`;
  const user = await sequelize.query(query, { type: QueryTypes.SELECT });

  if (!user.length) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/login");
  }

  const isVerifiedPassword = await bcrypt.compare(password, user[0].password);

  if (!isVerifiedPassword) {
    req.flash("error", "Invalid email or password");
    return res.redirect("/login");
  }

  req.flash("success", "Login success");
  req.session.user = user[0];
  res.redirect("/");
}

function register(req, res) {
  res.render("register");
}

async function registerPost(req, res) {
  try {
    const { name, email, password } = req.body;

    const checkEmail = await sequelize.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      { type: QueryTypes.SELECT }
    );

    if (checkEmail.length > 0) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = `INSERT INTO users(name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`;
    await sequelize.query(query, { type: QueryTypes.INSERT });

    req.flash('success', 'Registration successful! Please login.');
    res.redirect('/login');

  } catch (error) {
    console.error(error);
    req.flash('error', 'Registration failed');
    res.redirect('/register');
  }
}

function logoutPost(req, res) {
  req.session.destroy((err) => {
    if (err) return console.error("Logout gagal!");

    console.log("Logout berhasil!");

    res.redirect("/");
  });
}

async function project(req, res) {
  const query = `
    SELECT 
      id,
      name,
      TO_CHAR(start_date, 'DD Mon YYYY') as start_date,
      TO_CHAR(end_date, 'DD Mon YYYY') as end_date,
      description,
      technologies,
      image
    FROM projects
  `;
  
  let projects = await sequelize.query(query, { type: QueryTypes.SELECT });

  projects = projects.map((project) => ({
    ...project,
    nameProject: project.name,
    startDate: project.start_date,
    endDate: project.end_date
  }));

  res.render("project", { projects });
}

function testimonial(req, res) {
  res.render("testimonial");
}

function contact(req, res) {
  res.render("contact");
}

async function projectPost(req, res) {
  const { nameProject, description, startDate, endDate, technologies } = req.body;

  // Escape karakter khusus di description
  const escapedDescription = description.replace(/'/g, "''");

  const query = `
    INSERT INTO projects (
      name, 
      start_date, 
      end_date, 
      description, 
      technologies, 
      image
    ) 
    VALUES (
      '${nameProject}', 
      '${hbs.handlebars.helpers.formatToISO(startDate)}',
      ${endDate ? `'${hbs.handlebars.helpers.formatToISO(endDate)}'` : 'NULL'}, 
      '${escapedDescription}', 
      ${hbs.handlebars.helpers.formatTechArray(technologies)}, 
      'https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg'
    )`;

  await sequelize.query(query, { type: QueryTypes.INSERT });
  res.redirect("/project");
}

async function projectDelete(req, res) {
  const { id } = req.params;

  const query = `DELETE FROM projects WHERE id = ${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });

  res.redirect("/project");
}

async function editProject(req, res) {
  const { id } = req.params;
  
  const query = `
    SELECT 
      id,
      name,
      TO_CHAR(start_date, 'YYYY-MM-DD') as start_date,
      TO_CHAR(end_date, 'YYYY-MM-DD') as end_date,
      description,
      technologies,
      image
    FROM projects 
    WHERE id = ${id}
  `;
  
  const [project] = await sequelize.query(query, { type: QueryTypes.SELECT });
  res.render("edit-project", { project: hbs.handlebars.helpers.transformProject(project) });
}

async function editProjectPost(req, res) {
  const { id } = req.params;
  const { nameProject, description, startDate, endDate, technologies } = req.body;

  const query = `
    UPDATE projects 
    SET 
      name = '${nameProject}', 
      start_date = '${hbs.handlebars.helpers.formatToISO(startDate)}', 
      end_date = ${endDate ? `'${hbs.handlebars.helpers.formatToISO(endDate)}'` : 'NULL'}, 
      description = '${description}',  
      technologies = ${hbs.handlebars.helpers.formatTechArray(technologies)}
    WHERE id = ${id}
  `;

  await sequelize.query(query, { type: QueryTypes.UPDATE });
  res.redirect("/project");
}

async function projectDetail(req, res) {
  const { id } = req.params;
  
  const query = `
    SELECT 
      id,
      name as "nameProject",
      TO_CHAR(start_date, 'DD Mon YYYY') as "startDate",
      TO_CHAR(end_date, 'DD Mon YYYY') as "endDate",
      description,
      technologies,
      image
    FROM projects 
    WHERE id = ${id}
  `;
  
  const [project] = await sequelize.query(query, { type: QueryTypes.SELECT });
  
  project.technologies = Array.isArray(project.technologies) ? project.technologies : [];
  
  res.render("project-detail", { project });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
