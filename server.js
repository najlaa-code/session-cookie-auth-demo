const express = require('express');
const cookieParser=require("cookie-parser");
const session=require("express-session");
const path = require('path');
const app = express();
const PORT = 4040;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: "secret-key"}));
app.use(express.json());
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'task2form.html'), err => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading file');
    }
  });
});
app.get("/setCookie", (req,res)=>{
    const username="exampleusername";
    res.cookie("username", username, {
        maxAge:60000
    });
    res.send("Cookie created after successful login");
});
app.get("/readCookie", (req,res)=>{
    const usernameCookie=req.cookies.username;
    if (usernameCookie) {
    res.send(`Username from cookie: ${usernameCookie}`);
    } else {
    res.send("No username cookie found");
}});
app.post("/setSession", (req,res)=>{
    const{username,password,email,phoneNumber}=req.body;
    req.session.username=username;
    req.session.password=password;
    req.session.email=email;
    req.session.phoneNumber=phoneNumber;
    res.send(`
  <h2>Session created successfully!</h2>
  <a href="/logout">Logout</a>
`);
});
app.get("/getSession", (req, res) => {
  if (req.session.username) {
    const { username, password, email, phoneNumber } = req.session;
    res.send(`
      <table>
        <tr><td>Username</td><td>${username}</td></tr>
        <tr><td>Password</td><td>${password}</td></tr>
        <tr><td>Email</td><td>${email}</td></tr>
        <tr><td>Phone Number</td><td>${phoneNumber}</td></tr>
      </table>
    `);
  } else {
    res.send("No session data found");
  }
});
app.get("/logout", (req, res) => {
  res.clearCookie("username");
  req.session.destroy((err) => {
    if (err) {return res.send("Error destroying session");
    }  });
  res.send(`
  <table border="1">
    <tr><th>Action</th><th>Status</th></tr>
    <tr><td>Cookie Cleared</td><td>Yes</td></tr>
    <tr><td>Session Destroyed</td><td>Yes</td></tr>
  </table>
`);
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
