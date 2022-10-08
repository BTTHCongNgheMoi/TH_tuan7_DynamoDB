const express = require('express');
const multer = require('multer');
require('dotenv').config();

const app = express();
const upload = multer();
const AWS = require('aws-sdk');
const { response } = require('express');

// 
app.use(express.static("./templates"));
app.set('view engine', 'ejs');
app.set('views', './templates');

// 

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
})

const docClient = new AWS.DynamoDB.DocumentClient();

const tblName = "dsSinhvien";
// 


app.get('/', (req, res) => {
    const params = {
        TableName: tblName,
    };

    docClient.scan(params, (err, data) => {
        if (err) {
            return res.send("Internal Server Error");
        } else {
            // console.log('data = ', JSON.stringify(data))
            return res.render('index', { dsSinhvien: data.Items });
        }
    });
})



app.post('/update', upload.fields([]), (req, res) => {
    const { masv } = req.body;
    console.log("🚀 ~ file: server.js ~ line 49 ~ app.get ~ req.body", req.body);

    const params = {
        TableName: tblName,
    };

    // return res.redirect("/");
    docClient.scan(params, (err, data) => {
        // return res.redirect("/");
        // return res.render('form', { sinhvien: data.Items.masv });
    })
})

app.post('/', upload.fields([]), (req, res) => {
    const { masv, ten, ngaySinh, lop } = req.body;

    const params = {
        TableName: tblName,
        Item: {
            "masv": parseInt(masv),
            "ten": ten,
            "ngaySinh": ngaySinh,
            "lop": lop,
        }
    }

    docClient.put(params, (err, data) => {
        if (err) {
            console.log("74 - - ", err);
            return res.send("Internal Server Error");
        } else {
            return res.redirect("/");
        }
    })
});

app.post("/delete", upload.fields([]), (req, res) => {

    const { masv } = req.body;
    const params = {
        TableName: tblName,
        Key: {
            masv: parseInt(masv),
        }
    }

    docClient.delete(params, (err, data) => {
        if (err) {
            console.log("94 ----- ", err);
            return res.send("err ---- /delete");
        } else {
            return res.redirect("/");
        }
    });

});

app.listen(8080, () => {
    console.log(`Example app listening on port 8080`)
})