const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const port = 3000;
const cors = require('cors');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',        // Your MySQL server host
  user: 'siteUser',           // Your MySQL username
  password: 'adminpass',    // Your MySQL password
  database: 'mmorpg',       // Your database name
});


table = "playerrank"
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()); // Enable CORS for all routes
app.options('*', cors())
app.use(express.urlencoded({ extended: false, limit: '2gb' }));






function connectToServer() {
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the MySQL database');
  });
}

app.post('/api/data', (req, res) => {
  connectToServer();
  let receivedData = req.body;

// test if network online, and user exists

  connection.query(`SELECT * FROM ${table} WHERE \`playerUUID\` = ${receivedData.key2}`, (error, results, fields) => {
    if(error) {
      res.json({message : "000"});
      return;
    }



  if(receivedData.method != "get") {
    if(results.length < 1) {
      connection.query(`INSERT IGNORE INTO ${table} (\`playerUUID\`, \`rank\`) VALUES ('${receivedData.key1}', '${receivedData.key2}')`)
    }

    if(receivedData.pfp != null) {
      console.log(receivedData);
      connection.query("UPDATE " + table + " SET `picture` = '" + receivedData.pfp + "' WHERE playerUUID = '" + receivedData.key1 + "'")
    }
    res.json({ message: "002" , playerUUID: receivedData.key1, rank: receivedData.key2});
  } else {
    connection.query(`SELECT * FROM ${table} WHERE playerUUID = '${receivedData.key1}'`, (err, rizz, fs) => {
      if(err) {
        console.log(err);
        return;
      }
      console.log(rizz[0].playerUUID);
      console.log(rizz[0].rank);
      if(rizz[0].rank == receivedData.key2 && rizz[0].playerUUID == receivedData.key1) {
        res.json({pfp : rizz[0].picture});
      } else {
        res.json({message : "005"});
      }
    });
  }
});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
