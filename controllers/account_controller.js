const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "dbproject",
  dateStrings: "date",
});

connection.connect();

const getAccountPage = (req, res, next) => {
  res.render("pages/main", {
    user: "testUser",
    photo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    page: "account",
  });
};

// CREATE(ADD) 요청이 발생할 때, 요청자의 id와 accountid를 같이 insert 해주자.
const addAccount = async (req, res) => {
  let { account_date, account_balance, account_type, customer_idx, card_requested } = req.body;
  await connection.query(
    `INSERT INTO account( account_date, account_balance, account_type, customer_idx, card_requested) 
    VALUES("${account_date}","${account_balance}","${account_type}","${customer_idx}", "${card_requested}")`
  );

  readAllAccount(req, res);
};

// READ ALL
const readAllAccount = (req, res) => {
  connection.query(
    "select * from account LEFT JOIN customer ON account.customer_idx = customer.customer_idx",
    (error, results, fields) => {
      if (error) res.send(error);
      else {
        console.log(`${JSON.stringify(results)} data received!`);
        res.send(JSON.stringify(results));
      }
    }
  );
};

// READ
const readAccount = (req, res) => {
  const { idx } = req.params;
  connection.query(`select * from account WHERE account_idx=${idx}`, (error, results, fields) => {
    if (error) res.send(error);
    else {
      console.log(`${JSON.stringify(results)} data received!`);
      res.send(JSON.stringify(results));
    }
  });
};

// UPDATE
const updateAccount = (req, res) => {
  const { idx } = req.params;
  let { account_date, account_balance, account_type, customer_idx, card_requested } = req.body;

  connection.query(
    `UPDATE account 
    SET account_date = "${account_date}", account_balance = "${account_balance}", account_type = "${account_type}",
      customer_idx = "${customer_idx}", card_requested = "${card_requested}"
    WHERE account_idx = "${idx}"`
  );
  readAllAccount(req, res);
};

// DELETE
const deleteAccount = (req, res) => {
  const { idx } = req.params;

  connection.query(`DELETE FROM account WHERE account_idx = "${idx}"`);
  readAllAccount(req, res);
};

module.exports = {
  getAccountPage,
  addAccount,
  readAllAccount,
  readAccount,
  updateAccount,
  deleteAccount,
};
