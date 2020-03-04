require('dotenv').config();

const models = require('../models');
const axios = require('axios');
const config = require('../config');
const https = require('https');

async function getAuthenticate(email, password, usertype){
  let auth_token;
  await axios({
    method: 'post',
    url: `https://${config.original_server}:${config.original_port}/authenticateV2`,
    headers: { 'Content-Type': 'application/json' },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: {
      Email: email,
      Password: password,
      UserType: usertype
    },
    responseType:'json'
  }).then(async(response) => {
    auth_token = response.data.auth_token;
  }).catch(error => {
  });

  return auth_token;
}

async function sendMessageToSalesTeam(msgbody, auth_token) {
  let checked_value;
  await axios({
    method: 'post',
    url: `https://${config.original_server}:${config.original_port}/sendMessageToSalesTeam`,
    headers: { 'Content-Type': 'application/json',
               'Authorization': `Bearer ${auth_token}`},
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: {
      MsgBody: msgbody
    },
    responseType:'json'
  }).then(async(response) => {
    console.log(`1111111111111111111 ${response}`);
    if (response.status === 200) 
      checked_value = 1;
    else                         
      checked_value = 0;
  });

  return checked_value;
}

async function setEmailLockStatus(accountindex, simcardid, iccid, endpointid, auth_token, activate_flag) {
  let checked_value;
  const flag = activate_flag ? 'true' : 'false';
  await axios({
    method: 'post',
    url: `https://${config.original_server}:${config.original_port}/imeiLockstatus/${flag}`,
    headers: { 'Content-Type': 'application/json',
               'Authorization': `Bearer ${auth_token}`},
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: {
      AccountIndex: accountindex,
      SIMCardID: simcardid,
      Iccid: iccid,
      EndpointID: endpointid
    },
    responseType:'json'
  }).then(async(response) => {
    if (response.status === 200)
      checked_value = 1;
    else
      checked_value = 0;
  });
  
  return checked_value;
}

async function setSimCardDetailsForWebService(accountindex, simcardid, iccid, endpointid, spid, auth_token) {
  let checked_value;
  await axios({
    method: 'post',
    url: `https://${config.original_server}:${config.original_port}/setserviceprofile/${spid}`,
    headers: { 'Content-Type': 'application/json',
               'Authorization': `Bearer ${auth_token}`},
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: {
      AccountIndex: accountindex,
      SIMCardID: simcardid,
      Iccid: iccid,
      EndpointID: endpointid
    },
    responseType:'json'
  }).then(async(response) => {
    if (response.status === 200)
      checked_value = 1;
    else
      checked_value = 0;
  });
  
  return checked_value;
}

async function setSimCardSuspend(accountindex, simcardid, iccid, endpointid, auth_token) {
  let checked_value;
  await axios({
    method: 'post',
    url: `https://${config.original_server}:${config.original_port}/setsimcardstatus/suspend`,
    headers: { 'Content-Type': 'application/json',
               'Authorization': `Bearer ${auth_token}`},
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: {
      AccountIndex: accountindex,
      SIMCardID: simcardid,
      Iccid: iccid,
      EndpointID: endpointid
    },
    responseType:'json'
  }).then(async(response) => {
    if (response.status === 200)
      checked_value = 1;
    else
      checked_value = 0;
  });
  
  return checked_value;
}

async function setSimCardActivate(accountindex, simcardid, iccid, endpointid, auth_token) {
  let checked_value;
  await axios({
    method: 'post',
    url: `https://${config.original_server}:${config.original_port}/setsimcardstatus/activate`,
    headers: { 'Content-Type': 'application/json',
               'Authorization': `Bearer ${auth_token}`},
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: {
      AccountIndex: accountindex,
      SIMCardID: simcardid,
      Iccid: iccid,
      EndpointID: endpointid
    },
    responseType:'json'
  }).then(async(response) => {
    if (response.status === 200)
      checked_value = 1;
    else
      checked_value = 0;
  });
  
  return checked_value;
}

async function resetSimConnection(simcardid, auth_token) {
  let checked_value;
  await axios({
    method: 'get',
    url: `https://${config.original_server}:${config.original_port}/resetsimconnection/${simcardid}`,
    headers: { 'Content-Type': 'application/json',
               'Authorization': `Bearer ${auth_token}`},
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    responseType:'json'
  }).then(async(response) => {
    if (response.status === 200)
      checked_value = 1;
    else
      checked_value = 0;
  });
  
  return checked_value;
}

async function blacklistedOperators(accountindex, simcardid, iccid, endpointid, blacklistedOperators, auth_token) {
  let checked_value;
  await axios({
    method: 'post',
    url: `https://${config.original_server}:${config.original_port}/blacklisted_operators`,
    headers: { 'Content-Type': 'application/json',
               'Authorization': `Bearer ${auth_token}`},
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    data: {
      simCardDetails: {
        AccountIndex: accountindex,
        SIMCardID: simcardid,
        Iccid: iccid,
        EndpointID: endpointid
      },
      blacklistedOperators
    },
    responseType:'json'
  }).then(async(response) => {
    if (response.status === 200)
      checked_value = 1;
    else
      checked_value = 0;
  });
  
  return checked_value;
}

exports.blacklistedOperators = blacklistedOperators;
exports.resetSimConnection = resetSimConnection;
exports.setSimCardActivate = setSimCardActivate;
exports.setSimCardSuspend = setSimCardSuspend;
exports.setSimCardDetailsForWebService = setSimCardDetailsForWebService;
exports.getAuthenticate = getAuthenticate;
exports.sendMessageToSalesTeam = sendMessageToSalesTeam;
exports.setEmailLockStatus = setEmailLockStatus;