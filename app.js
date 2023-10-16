const express = require ('express');
const app = express();
const session = require ('express-session');
const mysql = require ('mysql2');
require('dotenv').config();

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(session(
    {secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.set('view engine','ejs');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'service',
    password: process.env.MYSQL_PASSWORD
  }).promise()

app.get('/service', (req, res) => {
    res.render('home');
});

app.post('/service', async (req, res) => {
    const {client,product} = req.body.request //Destructure user input from field group 'request'
    req.session.productName = product //Store product-name for upcoming use in 'thanks' route
    let insert = 'INSERT INTO requests SET ?'
    let obj = {client:client, product:product}
    try {
        let result = await pool.query(insert, obj)
    }catch(e) {
        console.log(`Error #${e.errno} - ${e.sqlMessage}`)
        return res.redirect('/error');
    }
    res.redirect('/thanks');
});

app.get('/thanks', async (req, res) => {
    let productName = req.session.productName
    let q = `SELECT COUNT(*) AS count FROM requests WHERE product = "${productName}"`
    try {
        let [results] = await pool.query(q) //Destructure the first array
        let num = results[0].count //Destructure the count object from first array
        res.render('thanks',{num});
    }catch(e) {
        console.log(`Error #${e.errno} - ${e.sqlMessage}`)
        return res.redirect('/error');
    }
});

app.get('/error', (req,res) => {
    res.render('error')
});

app.listen(3000, () => {
    console.log(`listening on port 3000`);
});