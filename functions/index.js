const functions = require("firebase-functions");
const { db } = require("./helpers/firebase");
require("dotenv").config();


// exports.writeData = functions.https.onRequest(async (req, res) => {
//   res.set("Access-Control-Allow-Origin", origin);
//   const body = JSON.parse(req.body);
//   db.collection(body.coll)
//     .doc("profile")
//     .set({ names: body.data }, { merge: true });

//   res.json(JSON.stringify({ message: "Success" })).send();
// });

// exports.saveReport = functions.https.onRequest(async (req, res) => {
//   res.set("Access-Control-Allow-Origin", origin);
//   const body = JSON.parse(req.body);
//   console.log(body);
//   await db
//     .collection(body.coll)
//     .doc("profile")
//     .collection("reports")
//     .doc(body.report.id)
//     .set(body.report, { merge: true })
//     .then(async () => {
//       if (body.profile) {
//         await db
//           .collection(body.coll)
//           .doc("profile")
//           .set(body.profile, { merge: true });
//       }
//       return res
//         .json(JSON.stringify({ message: "Success", status: "success" }))
//         .send();
//     })
//     .catch((error) => {
//       console.log(error);
//       return res.json(JSON.stringify(error)).send();
//     });
// });

// exports.saveItem = functions.https.onRequest(async (req, res) => {
//   res.set("Access-Control-Allow-Origin", origin);
//   const body = JSON.parse(req.body);
//   await db
//     .collection(body.coll)
//     .doc("profile")
//     .collection("expenses")
//     .doc(body.item.id)
//     .set(body.item, { merge: true })
//     .then(() => {
//       return res.json(JSON.stringify({ message: "Success" })).send();
//     })
//     .catch((error) => {
//       console.log(error);
//       return res.json(JSON.stringify(error)).send();
//     });
// });

// rewrite the above as an express app with CORS enabled
const express = require("express");
const cors = require("cors");
const moment = require('moment');
const app = express();

const handleResponse = (res, statusObj, load) => {
  const { code, status, message } = statusObj;
  let resObj = {
    status: status,
    message: message,
    data: load,
  };
  if (!status) console.error(load)
  return res.status(code).json(resObj).send();
}

app.post("/addLog", async (req, res) => {
  try {
    let file = new Date().toDateString();
    let logEntry = moment().format('HH:mm:ss');
    console.log("addLog", file);
    console.log(req.body);
    const body = req.body;
    let log = body.data;
    await db
      .collection("LOGS")
      .doc(file)
      .set({[logEntry]: log}, { merge: true })
      .then(async () => {
        let statusObj = {code:200, status: true, message: "Success" };
        let payload = log;
        handleResponse(res, statusObj, payload);
      })
  } catch (error) {
    let statusObj = {code: error.code? error.code : 500, status: false, message: "ERROR" };
    console.log(statusObj);
    handleResponse(res, statusObj, error);
  }
});

app.post("/getReport", async (req, res) => {
  console.log("getReport");
  try {
    const body = req.body;
    let report = body.data;
    await db
      .collection(body.coll)
      .doc("profile")
      .collection("reports")
      .doc(report)
      .get()
      .then(async (doc) => {
        let statusObj = {code:200, status: true, message: "Success" };
        let payload = doc.data();
        handleResponse(res, statusObj, payload);
      })
  } catch (error) {
    let statusObj = {code: error.code? error.code : 500, status: false, message: "ERROR" };
    console.log(statusObj);
    handleResponse(res, statusObj, error);
  }
});

app.post("/createReport", async (req, res) => {
  console.log("createReport");
  try {
    const body = req.body;
    let report = body.data;
    await db
      .collection(body.coll)
      .doc("profile")
      .collection("reports")
      .doc(report.id)
      .set(report, { merge: true })
      .then(async () => {
        // if (body.profile) {
        //   await db
        //     .collection(body.coll)
        //     .doc("profile")
        //     .set(body.profile, { merge: true });
        // }
        let statusObj = {code:200, status: true, message: "Success" };
        let payload = report;
        handleResponse(res, statusObj, payload);
      })
  } catch (error) {
    let statusObj = {code: error.code? error.code : 500, status: false, message: "ERROR" };
    console.log(statusObj);
    handleResponse(res, statusObj, error);
  }
});

app.post("/writeData", async (req, res) => {
  console.log("writeData", req.body);
  try {
    const body = req.body;
    let user = body.user;
    let doc = body.coll;
    let data = body.data;
    await db
      .collection(user)
      .doc(doc)
      .set({ "values": data }, { merge: true })
      .then(async () => {
        let statusObj = {code:200, status: true, message: "Success" };
        let payload = data;
        handleResponse(res, statusObj, payload);
      })
  } catch (error) {
    let statusObj = {code: error.code? error.code : 500, status: false, message: "ERROR" };
    console.log(statusObj);
    handleResponse(res, statusObj, error);
  }
});

app.post("/createCategory", async (req, res) => {
  console.log("createCategory", req.body);
  try {
    const body = req.body;
    let user = body.user;
    let category = body.data;
    await db
      .collection(user)
      .doc("profile")
      .collection("expenses")
      .doc(category.id)
      .set(category)
      .then(async () => {
        let statusObj = {code:200, status: true, message: "Success" };
        let payload = category;
        handleResponse(res, statusObj, payload);
      })
  } catch (error) {
    let statusObj = {code: error.code? error.code : 500, status: false, message: "ERROR" };
    console.log(statusObj);
    handleResponse(res, statusObj, error);
  }
});

app.post("/saveReport", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    await db
      .collection(body.coll)
      .doc("profile")
      .collection("reports")
      .doc(body.report.id)
      .set(body.report, { merge: true })
      .then(async () => {
        if (body.profile) {
          await db
            .collection(body.coll)
            .doc("profile")
            .set(body.profile, { merge: true });
        }
        let statusObj = {code:200, status: true, message: "Report Saved" };
        let payload = {};
        handleResponse(res, statusObj, payload);
      })
  } catch (error) {
    let statusObj = {code: error.code? error.code : 500, status: false, message: "ERROR" };
    console.log(statusObj);
    handleResponse(res, statusObj, error);
  }
});

app.post("/saveItem", async (req, res) => {
  console.log("saveItem", req.body);
  try {
    const body = req.body;
    await db
      .collection(body.user)
      .doc("profile")
      .collection("expenses")
      .doc(body.data.id)
      .set(body.data, { merge: true })
      .then(() => {
        let statusObj = {code:200, status: true, message: "Item Saved" };
        let payload = {};
        handleResponse(res, statusObj, payload);
      })
  } catch (error) {
    let statusObj = {code: error.code? error.code : 500, status: false, message: "ERROR" };
    console.log(statusObj);
    handleResponse(res, statusObj, error);
  }
});

// apply CORS to all routes
const corsHandler = cors({ origin: true });
const applyCORS = (handler) => (req, res) => {
  return corsHandler(req, res, (_) => {
      return handler(req, res);
  });
};

exports.app = functions.https.onRequest(applyCORS(app));
