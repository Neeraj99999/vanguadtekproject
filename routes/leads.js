var express = require('express');
const db = require('../dbConnection');
var router = express.Router();

/* GET users listing. */
router.post('/', async function(req, res, next) {
  const first_name = req.body?.first_name;
  const last_name = req.body?.last_name;
  let mobile = req.body?.mobile;
  const email = req.body?.email;
  const location_type = req.body?.location_type;
  const location_string = req.body?.location_string;
  const status = req.body?.status;

  let dbConnection;
  try {
    dbConnection = await db.initConnection();

    if (!first_name || !last_name || !mobile || mobile.toString().length != 9 || !email || !location_type || !location_string) {
      throw new Error("lead details are not valid");
    }

    mobile = mobile.toString()
    var query = `INSERT INTO \`lead\`( \`firstname\`, \`lastname\`, \`email\` , \`mobile\` , \`locationtype\`,\`locationstring\`, \`leadstatus\`) VALUES ('${first_name}','${last_name}','${email}','${mobile}','${location_type}','${location_string}','Created')`;
    var resultCon = await db.insertFunction(dbConnection,query,[]);
    await db.closeConnection(dbConnection);
    res.status(200).json({
      "id": resultCon.insertId,
      "first_name": first_name,
      "last_name": last_name,
      "mobile": parseInt(mobile),
      "email": email,
      "location_type": location_type,
      "location_string": location_string,
      "leadstatus": ["Created","Connected"].includes(status)?status:"Created"     
  } );

  } catch (error) {
    await db.closeConnection(dbConnection);
    res.status(400).json({
      "status": "failure",      
      "reason": error.message   
    });
  }
  
});

router.get('/', async function(req, res, next) {
  let lead_id = req.params.lead_id;

  let dbConnection;
  try {
    

    if (!lead_id) {
      throw new Error("lead_id is not valid");
    }
    lead_id = parseInt(lead_id) ;
    dbConnection = await db.initConnection();

    var query = `SELECT * FROM \`lead\` where \`id\` = ${lead_id}`;
    var resultCon = await db.selectFunction(dbConnection,query,[]);
    await db.closeConnection(dbConnection);
    if (resultCon && resultCon[0]) {
      res.json({
        "id": resultCon[0]["id"],
        "first_name": resultCon[0]["firstname"],
        "last_name": resultCon[0]["last_name"],
        "mobile": resultCon[0]["mobile"],
        "email": resultCon[0]["email"],
        "location_type": resultCon[0]["locationtype"],
        "location_string": resultCon[0]["locationstring"],
        "status": resultCon[0]["leadstatus"],
        "communication":""   
      } );
    } else {
      res.status(404).json({});
    }

  } catch (error) {
    await db.closeConnection(dbConnection);
    res.status(400).json({
      "status": "failure",      
      "reason": error.message   
    });
  }
  
});

module.exports = router;
