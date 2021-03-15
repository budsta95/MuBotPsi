let PRIVATE_KEY = process.env.PRIVATE_KEY;
let CLIENT_EMAIL = process.env.CLIENT_EMAIL;
let spreadsheet_id = process.env.SPREADSHEET_ID;
const {google} = require('googleapis');
const fetch = require('node-fetch');
const googclient = connect();
const tools = { 
  "example_range":"EXMPLRNGE!A2:B3"
};
var sheet_range = tools.range_settings;

module.exports = (client) => {
  client.getData = getData;
  client.updateData = updateData;
  client.addData = addData;
  client.clearData = clearData;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function numToLetter(num) {
  return String.fromCharCode(64 + num);
}
function connect() {
  //https://www.googleapis.com/auth/spreadsheets.readonly
	console.log('Connected to Google API');
 	const client = new google.auth.JWT(CLIENT_EMAIL, null, PRIVATE_KEY, ['https://www.googleapis.com/auth/spreadsheets']);
 	client.authorize(function(err, tokens) {
    		if(err) {
       			console.log(err);
       			return;
    		}
 	});
 	return client;
}

async function getData(type, client = googclient) {
  const gsapi = google.sheets({version: 'v4', auth: client});
  if(type === "test") sheet_range = tools.example_range;
  else sheet_range = tools.range_settings;
  //const gsapi = google.sheets({version: 'v4', auth: client});
  const opt = {
    spreadsheetId: spreadsheet_id,
    range: sheet_range, 
  }
  let data = await gsapi.spreadsheets.values.get(opt);
  return data.data.values;
}

async function updateData(arg, row, type, client = googclient) {
  if(type === "test") sheet_range = tools.example_range;
  else sheet_range = tools.range_settings;
  const opt = {
    spreadsheetId: spreadsheet_id,
    range: sheet_range, 
    valueInputOption: 'USER_ENTERED', 
    includeValuesInResponse: true, 
    resource: { values: arg }
  }
  let response = await gsapi.spreadsheets.values.update(opt, (err) => {
    if(err) {
      console.log(err);
      return;
    }
  });
  return response;
}

async function addData(arg, type, client = googclient) {
    if(type === "test") sheet_range = tools.example_range;
    else sheet_range = tools.range_settings;
  const gsapi = google.sheets({version: 'v4', auth: client});
  const opt = {
    spreadsheetId: spreadsheet_id,
    range: sheet_range, 
    valueInputOption: 'USER_ENTERED', 
    insertDataOption: 'INSERT_ROWS',
    includeValuesInResponse: true, 
    resource: { values: arg }
  }
  let response = await gsapi.spreadsheets.values.append(opt);
  return response.data;
}

async function clearData(row, type, client = googclient) {
  if(type === "test") sheet_range = tools.example_range;
  else sheet_range = tools.range_settings;
  const gsapi = google.sheets({version: 'v4', auth: client});
  const opt = {
    spreadsheetId: spreadsheet_id,
    range: sheet_range, 
  }
  let response = await gsapi.spreadsheets.values.clear(opt, (err) => {
    if(err) {
      console.log(err);
      return;
    }
  });
  return response;
}
