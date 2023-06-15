const express = require("express");
const USER_TABLE = process.env.USERS_TABLE;
const AWS = require("aws-sdk");

const routes = express.Router();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

routes.get("/test", (req, res) => {
  res.status(201).json({ ok: "ok" });
});

routes.post("/", async (req, res) => {
  const { userId, name } = req.body;
  const params = {
    TableName: USER_TABLE,
    Item: {
      userId,
      name,
    },
  };

  await dynamoDB
    .put(params, (error) => {
      if (error) res.status(400).json({ Err: error });
    })
    .promise()
    .then(() =>
      res.status(200).json({ success: true, msg: "User created successfully" })
    );
});

routes.get("/", async (req, res) => {
  const params = {
    TableName: USER_TABLE,
  };
  await dynamoDB
    .scan(params, (error) => {
      if (error)
        return res
          .status(400)
          .json({ Error: "An error ocurred while getting users" });
    })
    .promise()
    .then((results) =>
      res.status(200).json({
        success: true,
        users: results.Items,
      })
    );
});

routes.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log( 'userId -> ', userId );
  const params = {
    TableName: USER_TABLE,
    Key: {
      userId,
    },
  };
  await dynamoDB
    .get(params, (error, result) => {
      if (error)
        return res
          .status(400)
          .json({ Error: "An error ocurred while getting users" });
      if (!result.Item) return res.status(404).json({ msg: "User not found" });
    })
    .promise()
    .then((results) =>
      res.status(200).json({
        userId: results.Item.userId,
        name: results.Item.name,
      })
    );
});

module.exports = {
  routes,
};
