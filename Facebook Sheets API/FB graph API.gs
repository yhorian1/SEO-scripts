
// Get token. Service gets App token, which is given user scope by run() function. 
// May need to update by re-running run() and logging in via resulting URL. Need sidebar, and error report that email link.
function getFB_App_User_Token() {
  var service = getService();
  return service.getAccessToken()  
};

// Get the ID of the Ad - needed to reference the ad URL
function get_ad_id_from_API(myAppTkn) {
  
  var id_string = get_account_id();
  var getURL = "https://graph.facebook.com/v2.8/" + id_string + "/ads?access_token=" + myAppTkn;
  var response = UrlFetchApp.fetch(getURL);
  var response_obj = JSON.parse(response);
  var id_string = response_obj.data[0].id;
  return id_string;
  
};

// May change with campaign - currently no need for an automated way to retreive it since it's a static ad I'm testing on
function get_ad_id() {
  
  return "6054271782238";
  
};

// ID for the ad account
function get_account_id {

  return "act_10150467159223448";

};

// Cycle through dates by using offset
function fill_sheet() {
  
  var myAppTkn = getFB_App_User_Token();
  var id_string = get_account_id();
  for (var i = 10; i > 0; i--) { 
    Logger.log('Looping to offset: ' + i);
    fill_date_conversions(i);
    Utilities.sleep(2000);
  };

};

function fill_date_conversions(offset) {
  if (typeof offset == 'undefined') {var offset = 1;}
  var myAppTkn = getFB_App_User_Token();
  var id_string = get_account_id();
  
  var current_sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var sheet_columns = current_sheet.getLastColumn();
  var column_headers = current_sheet.getRange(1, 1, 1, sheet_columns);
  var dict_keys = column_headers.getValues()[0];
  
  // Get yesterdays date.
  var d = new Date();
  Logger.log(d);
  d.setDate(d.getDate() - offset);
  Logger.log(d);
  var month = d.getUTCMonth() + 1; //months from 1-12
  var day = d.getUTCDate();
  var year = d.getUTCFullYear();
  var date = year + '-' + month  + '-' + day;
  Logger.log("Running query for: " + date);
  
  var getURL = "https://graph.facebook.com/v2.8/" + id_string + "/insights?fields=actions,action_values,spend&time_range[since]=" + date + "&time_range[until]="
  + date + "&limit=50&access_token=" + myAppTkn;
  
  var response = UrlFetchApp.fetch(getURL);
  var response_obj = JSON.parse(response);
  Logger.log(response_obj);
  if (typeof(response_obj.data[0]) == 'undefined') {current_sheet.appendRow([date, "No data."]);return};
  var actions_list = response_obj.data[0].actions;
  if (!(actions_list)) {actions_list = {}};
  // Add any column headers that might be missing
  check_column_headers(response_obj);
  
  // Get the column headers, then iterate through looking for matches.
  var new_row = [date];
  var spend = response_obj.data[0].spend;
  // Check column headers, fill in if there's info. Skip if it's date or empty.
  for (var key in dict_keys) {
    
    var value = 0;
    Logger.log(dict_keys[key]);
    if (dict_keys[key] == 'date') {continue};
    if (dict_keys[key] == '') {continue};
    if (dict_keys[key] == 'All Signups') {continue};
    if (dict_keys[key] == 'spend') {new_row.push(spend);continue};
    for (action in actions_list) {
      if (dict_keys[key] == actions_list[action].action_type) {
        value = actions_list[action].value;
      };
    };
    new_row.push(value);
  };
  Logger.log(new_row)
  current_sheet.appendRow(new_row);
  var lastrow = current_sheet.getLastRow();
  var p_range = current_sheet.getRange(lastrow - 1, 16);
  p_range.copyTo(current_sheet.getRange(lastrow, 16), {contentsOnly:false});
  
  return
  
};

// Get insights data for a fixed date and return list of conversions
function add_date_conversions() {
  var offset = 1;
  var myAppTkn = getFB_App_User_Token();
  var id_string = get_ad_id();
  
  var current_sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var sheet_columns = current_sheet.getLastColumn();
  var column_headers = current_sheet.getRange(1, 1, 1, sheet_columns);
  var dict_keys = column_headers.getValues()[0];
  
  // Get yesterdays date.
  var d = new Date();
  Logger.log(d);
  d.setDate(d.getDate() - offset);
  Logger.log(d);
  var month = d.getUTCMonth() + 1; //months from 1-12
  var day = d.getUTCDate();
  var year = d.getUTCFullYear();
  var date = year + '-' + month  + '-' + day;
  Logger.log("Running query for: " + date);
  
  var getURL = "https://graph.facebook.com/v2.8/" + id_string + "/insights?fields=actions,action_values,spend&time_range[since]=" + date + "&time_range[until]="
  + date + "&limit=50&access_token=" + myAppTkn;
  
  var response = UrlFetchApp.fetch(getURL);
  var response_obj = JSON.parse(response);
  Logger.log(response_obj);
  if (typeof(response_obj.data[0]) == 'undefined') {current_sheet.appendRow([date, "No data."]);return};
  var actions_list = response_obj.data[0].actions;
  if (!(actions_list)) {actions_list = {}};
  // Add any column headers that might be missing
  check_column_headers(response_obj);
  
  // Get the column headers, then iterate through looking for matches.
  var new_row = [date];
  var spend = response_obj.data[0].spend;
  // Check column headers, fill in if there's info. Skip if it's date or empty.
  for (var key in dict_keys) {
    
    var value = 0;
    Logger.log(dict_keys[key]);
    if (dict_keys[key] == 'date') {continue};
    if (dict_keys[key] == '') {continue};
    if (dict_keys[key] == 'All Signups') {continue};
    if (dict_keys[key] == 'spend') {new_row.push(spend);continue};
    for (action in actions_list) {
      if (dict_keys[key] == actions_list[action].action_type) {
        value = actions_list[action].value;
      };
    };
    new_row.push(value);
  };
  Logger.log(new_row)
  current_sheet.appendRow(new_row);
  var lastrow = current_sheet.getLastRow();
  var p_range = current_sheet.getRange(lastrow - 1, 16);
  p_range.copyTo(current_sheet.getRange(lastrow, 16), {contentsOnly:false});
  
  return
  
};

// Checks column titles in Row 7 and adds any missing so that data isn't lost.
// Columns form the array that will be used to sort data.
function check_column_headers(json1) {
  
  var current_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var sheet_columns = current_sheet.getLastColumn();
  var key_array = [];
  var dict_keys = current_sheet.getRange(1, 1, 1, sheet_columns);
  var dict_values = dict_keys.getValues()[0];
  
  // If there's something in the row's cell, add it to an array.
  for (var row in dict_values) {
    if (dict_values[row]) {key_array.push(dict_values[row])};
  };
  
  // Convert dict_values from object to an array.
  var new_keys = key_array;
  
  for (var key in json1.data[0].actions) {
    if (key_array.indexOf(json1.data[0].actions[key].action_type) < 0) {
      new_keys.push(json1.data[0].actions[key].action_type);
    };
  };
  dict_keys = current_sheet.getRange(1, 1, 1, new_keys.length);
  dict_keys.setValues([new_keys]);
  return
  
};

/*
 * Facebook oAuth 2.0 guide API requests
 * https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
 * https://developers.facebook.com/apps/
 * https://github.com/googlesamples/apps-script-oauth2
 * This script creates an Oauth2 object and makes sure it has access to the User scope using the App access.
*/

/* These are required to build the service.
* Created on Facebook app dashboard.
* var CLIENT_ID = '***';
*/ var CLIENT_SECRET = '***';

/*
 * Authorizes and makes a request to the Facebook API.
 * Returns request if it is already authorised.
 */

// Test the service with a prebuilt API for my campaign
function run(e) {
  var service = getService();
  var html = '';
  if (service.hasAccess()) {
    var url = 'https://graph.facebook.com/v2.8/act_10150467159223448/insights?fields=actions,action_values,spend';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + service.getAccessToken()
      }
    });
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
    Logger.log(service.getAccessToken())
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
      authorizationUrl);
  }
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  var service = getService();
  service.reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('Facebook')
    // Set the endpoint URLs.
    .setAuthorizationBaseUrl('https://www.facebook.com/dialog/oauth')
    .setTokenUrl('https://graph.facebook.com/v2.8/oauth/access_token')

  // Set the client ID and secret.
  .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)

  // Set the name of the callback function that should be invoked to complete
  // the OAuth flow.
  .setCallbackFunction('authCallback')

  // Set the property store where authorized tokens should be persisted.
  .setPropertyStore(PropertiesService.getUserProperties());
}

/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}
