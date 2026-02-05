const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/" , (req, res) => {
    res.send("Server Running");
});

//to protect admin routes
function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.send("No token");

    jwt.verify(token, "secretkey", (err, decoded) => {
        if (err) return res.send("Invalid token");
        req.user = decoded;
        next();
    });
}

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email=?" , [email] , async (err, result)=>{
        if(err) return res.send(err);
        if(result.length === 0) return res.status(404).send("User not found!");

        const user = result[0];

        const match = await bcrypt.compare(password, user.phoneNo);
        if (!match) return res.status(404).send("Wrong password");

        const token = jwt.sign(
            { id: user.id, role: user.role },
            "secretkey" ,
            { expiresIn: "1d" }
        );

        res.json({ token, role: user.role });
    });
});

//admin part

app.get("/admin/data" , verifyToken , (req, res) => {
    if (req.user.role !== "admin"){
        return res.send("Access denied. Admin only.");
    }

    res.send("welcome Admin!");
});

//to add new employee
app.post("/admin/add-employee", verifyToken, async (req, res) => {
    if (req.user.role !== "admin") return res.send("only admin allowed");

    const { name, email, password} = req.body;

    const hash = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO users(name,email,phoneNo,role) VALUES (?,?,?,?)",
        [name, email, hash, "employee"],
        (err) => {
            if (err) return res.send(err);
            res.send("Employee added successfully");
        }
    );
});
//to veiw employee
app.get("/admin/employees" , verifyToken, (req, res) =>{
    if(req.user.role != "admin") return res.send("Access denied");

    db.query("SELECT id,name,email,role FROM users WHERE role='employee'",
        (err, result) => {
            if (err) return res.send(err);
            res.json(result);
        });
});

//to edit employee
app.put("/admin/edit-employee/:id", verifyToken, (req, res) => {
    if (req.user.role !== "admin") return res.send("Access denied");

    const { name, email } = req.body;
    const id = req.params.id;

    db.query(
        "UPDATE users SET name=?, email=? WHERE id=?",
        [name, email, id],
        (err) => {
            if(err) return res.send(err);
            res.send("Employee updated");
        }
    );
});

//to delete employee

app.delete("/admin/delete-employee/:id", verifyToken, (req, res) => {
    if(req.user.role !== "admin") return res.send("Access denied");

    db.query("DELETE FROM users WHERE id=?",[req.params.id], (err) => {
        if (err) return res.send(err);
        res.send("Employee deleted");
    });
});

//admin view report

app.get("/admin/reports", verifyToken , (req,res)=>{
    if(req.user.role !== "admin") return res.send("Access denied");

    db.query(
        `SELECT users.name, 
        SUBSTRING_INDEX(reports.report,' ',5) As short_report,
        reports.date
        FROM reports
        JOIN users ON users.id = reports.user_id
        `,(err,result)=>{
            if(err) return res.send(err);
            res.json(result);
        });
});

//day work time report
app.get("/admin/today-work", verifyToken, (req,res)=>{
  if(req.user.role !== "admin") return res.send("Access denied");

  db.query(`
    SELECT users.name, SUM(attendance.session_minutes) AS total_minutes
    FROM attendance
    JOIN users ON users.id = attendance.user_id
    WHERE date = CURDATE()
    GROUP BY users.id
  `,(err,result)=>{
    if(err) return res.send(err);
    res.json(result);
  });
});

//approve leave
app.put("/admin/leave/:id", verifyToken, (req,res)=>{
  if(req.user.role !== "admin") return res.send("Access denied");

  db.query(
    "UPDATE leaves SET status=? WHERE id=?",
    [req.body.status, req.params.id],
    (err)=>{
      if(err) return res.send(err);
      res.send("Updated");
    }
  );
});

//report details compleate view
app.get("/admin/report-details/:userId/:date", verifyToken, (req,res)=>{
  if(req.user.role !== "admin") return res.send("Access denied");

  const { userId, date } = req.params;

  const query = `
    SELECT users.name, users.email, reports.report,
    attendance.check_in, attendance.check_out, attendance.session_minutes
    FROM users
    LEFT JOIN reports ON users.id = reports.user_id AND reports.date=?
    LEFT JOIN attendance ON users.id = attendance.user_id AND attendance.date=?
    WHERE users.id=?
  `;

  db.query(query, [date, date, userId], (err, result)=>{
    if(err) return res.send(err);
    res.json(result);
  });
});

//total time worked in view more page
app.get("/admin/total-time/:userId/:date", verifyToken, (req,res)=>{
  const { userId, date } = req.params;

  db.query(`
    SELECT SUM(session_minutes) AS total_minutes
    FROM attendance
    WHERE user_id=? AND date=?
  `,[userId, date],(err,result)=>{
    if(err) return res.send(err);
    res.json(result[0]);
  });
});



//employee part

//check in part
app.post("/employee/checkin", verifyToken, (req, res) => {
    if (req.user.role !== "employee") return res.send("Only employee allowed");

    const { lat, lng } = req.body;

    const officeLat = 11.8745;
    const officeLng = 75.3704;

    if (distance(lat, lng, officeLat, officeLng)>300)
        return res.send("you are ourside office radius");

    db.query(
        "INSERT INTO attendence(user_id,date,check_in) VALUES (?,CURDATE(),NOW())",
        [req.user.id],
        (err) => {
            if (err) return res.send(err);
            res.send("checked in");
        }
    );
});

//check out details

app.post("/employee/checkout", verifyToken, (req, res) => {
    if (req.user.role !== "employee") return res.send("Only employee allowed");

    db.query(
        "SELECT * FROM attendence WHERE user_id=? AND check_out IS NULL ORDER BY id DESC LIMIT 1",
        [req.user.id],
        (err, result) => {
            if(err) return res.send(err);
            if(result.length === 0) return res.send("No active session");

            const session = result[0];

            const diffQuery = `
            UPDATE attendence SET check_out=NOW(),
            session_minutes=TIMESTAMPDIFF(MINUTE, check_in, NOW())
            WHERE id=? 
            `;

            db.query(diffQuery, [session.id], (err2) => {
                if (err2) return res.send(err2);
                res.send("checked out");
            });
        }
    );
});

//to find the total work

app.get("/employee/today-work", verifyToken , (req, res) => {
    db.query(
        "SELECT SUM(session_minutes) AS total_minutes FROM attendence WHERE user_id=? AND date=CURDATE()",
        [req.user.id],
        (err, result) => {
            if (err) return res.send(err);
            res.json(result[0]);
        }
    );
});

//to check employee status
app.get("/employee/status", verifyToken, (req, res) => {
    db.query(
        "SELECT * FROM attendence WHERE user_id=? AND check_out IS NULL",
        [req.user.id],
        (err, result) => {
            if (err) return res.send(err);
            res.json({ checkedIn: result.length > 0 });
        }
    );
});

//submit report
app.post("/employee/report", verifyToken , (req, res) => {
    const { report } = req.body;

    db.query(
        "INSERT INTO reports(user_id, date , report) VALUES (?, CURDATE(),?)",
        [req.user.id, report],
        (err) => {
            if (err) return res.send(err);
            res.send("Report submitted");
        }
    );
});

//attendence chart
app.get("/employee/chart", verifyToken, (req,res)=>{
  db.query(`
    SELECT date, SUM(session_minutes) AS total_minutes
    FROM attendance
    WHERE user_id=?
    GROUP BY date
  `,[req.user.id],(err,result)=>{
    if(err) return res.send(err);
    res.json(result);
  });
});

//apply leave
app.post("/employee/leave", verifyToken, (req,res)=>{
  const {from, to, reason} = req.body;

  db.query(
    "INSERT INTO leaves(user_id,from_date,to_date,reason) VALUES (?,?,?,?)",
    [req.user.id, from, to, reason],
    (err)=>{
      if(err) return res.send(err);
      res.send("Leave applied");
    }
  );
});

//employee profile
app.get("/employee/profile", verifyToken, (req,res)=>{
  db.query(
    "SELECT id,name,email,role FROM users WHERE id=?",
    [req.user.id],
    (err,result)=>{
      if(err) return res.send(err);
      res.json(result[0]);
    }
  );
});



app.listen(5000, () => {
    console.log("Hey bro your Server started on port 5000");
});

db.connect((err)=>{
    if(err) console.log(err);
    else console.log("Hey BRO MySQL connected successfully!!");
});