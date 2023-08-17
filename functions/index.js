const functions = require("firebase-functions");
const { db } = require("./helpers/firebase");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const dev = process.env.FUNCTIONS_EMULATOR;

let origin = dev
  ? "http://localhost:3000"
  : "https://farm-report-next.vercel.app";

// exports.copyToLocal = functions.https.onRequest(async (req, res) => {
//   res.set("Access-Control-Allow-Origin", origin);
//   const body = JSON.parse(req.body);
//   const LIMIT = 200;
//   await db
//     .collection(body.coll)
//     .limit(LIMIT)
//     .get()
//     .then((docSnap) => {
//       if (docSnap.empty) {
//         console.log("No matching documents.");
//         return res
//           .json(JSON.stringify({ message: "No matching documents." }))
//           .send();
//       } else if (docSnap.size === LIMIT) {
//         console.log("Query limit reached.");
//         return res
//           .json(JSON.stringify({ message: "Query limit reached." }))
//           .send();
//       } else {
//         docSnap.forEach((doc) => {
//           let data = doc.data();
//           fs.writeFile(
//             `C:\/Users\/georg\/Documents\/data\/${body.coll}/${doc.id}.json`,
//             JSON.stringify(data),
//             (err) => {
//               if (err) {
//                 console.log(err);
//               }
//             }
//           );
//         });
//         return res
//           .json(
//             JSON.stringify({
//               message: `"Success", ${docSnap.size} documents retrieved`,
//             })
//           )
//           .send();
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.json(JSON.stringify(error)).send();
//     });
// });

// exports.copyToFirebase = functions.https.onRequest(async (req, res) => {
//   res.set("Access-Control-Allow-Origin", origin);
//   const body = JSON.parse(req.body);
//   fs.readdir(
//     `C:\/Users\/georg\/Documents\/data\/${"expenses"}`,
//     (err, docs) => {
//       if (err) {
//         console.log(err);
//         return res
//           .json(JSON.stringify({ message: "Error reading local folder" }))
//           .send();
//       } else {
//         docs.forEach((doc) => {
//           fs.readFile(
//             `C:\/Users\/georg\/Documents\/data\/${"expenses"}/${doc}`,
//             async (err, data) => {
//               if (err) {
//                 console.log(err);
//                 return res
//                   .json(
//                     JSON.stringify({ message: "Error reading local documents" })
//                   )
//                   .send();
//               } else {
//                 let obj = JSON.parse(data);
//                 // let name = obj.landLord;
//                 // let commodity = obj.crop;
//                 // let year = obj.year;
//                 // let id = `${name}-${commodity}-${year}`;
//                 // obj.id = id;
//                 // obj.name = name;
//                 // obj.commodity = commodity;
//                 await db
//                   .collection(body.coll)
//                   .doc("profile")
//                   .collection("expenses")
//                   .doc(obj.id)
//                   .set(obj, { merge: true })
//                   .catch((error) => {
//                     console.log(error);
//                   });
//               }
//             }
//           );
//         });
//       }
//       return res.json(JSON.stringify({ message: "Success" })).send();
//     }
//   );
// });

// exports.convertData = functions.https.onRequest(async (req, res) => {
//   res.set("Access-Control-Allow-Origin", origin);
//   const body = JSON.parse(req.body);
//   const LIMIT = 200;
//   let deleted = 0;
//   await db
//     .collection(body.coll)
//     .doc("profile")
//     .collection("reports")
//     .limit(LIMIT)
//     .get()
//     .then((docSnap) => {
//       if (docSnap.empty) {
//         console.log("No matching documents.");
//         return res
//           .json(JSON.stringify({ message: "No matching documents." }))
//           .send();
//       } else if (docSnap.size === LIMIT) {
//         console.log("Query limit reached.");
//         return res
//           .json(JSON.stringify({ message: "Query limit reached." }))
//           .send();
//       } else {
//         docSnap.forEach(async (doc) => {
//           // replace landLord with name and crop with comodity
//           // new report id = `${name}-${comodity}-${year}`
//           let data = doc.data();
//           let name = data.landLord;
//           let comodity = data.crop;
//           let year = data.year;
//           let id = `${name}-${comodity}-${year}`;
//           let report = {
//             id: id,
//             name: name,
//             comodity: comodity,
//             year: year,
//             ...data,
//           };
//           await db
//             .collection(body.coll)
//             .doc("profile")
//             .collection("reports")
//             .doc(report.id)
//             .set(report, { merge: true })
//             .catch((error) => {
//               console.log(error);
//             });
//         });
//         return res
//           .json(
//             JSON.stringify({
//               message: `"Success", ${deleted} documents deleted`,
//             })
//           )
//           .send();
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       res.json(JSON.stringify(error)).send();
//     });
// });

exports.writeData = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", origin);
  const body = JSON.parse(req.body);
  db.collection(body.coll)
    .doc("profile")
    .set({ names: body.data }, { merge: true });

  res.json(JSON.stringify({ message: "Success" })).send();
});

exports.saveReport = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", origin);
  const body = JSON.parse(req.body);
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
      return res
        .json(JSON.stringify({ message: "Success", status: "success" }))
        .send();
    })
    .catch((error) => {
      console.log(error);
      return res.json(JSON.stringify(error)).send();
    });
});

exports.saveItem = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", origin);
  const body = JSON.parse(req.body);
  await db
    .collection(body.coll)
    .doc("profile")
    .collection("expenses")
    .doc(body.item.id)
    .set(body.item, { merge: true })
    .then(() => {
      return res.json(JSON.stringify({ message: "Success" })).send();
    })
    .catch((error) => {
      console.log(error);
      return res.json(JSON.stringify(error)).send();
    });
});
