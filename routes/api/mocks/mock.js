const Router = require("express").Router;
const passport = require("passport");
const Office = require("../../../models/office");

// @route GET api/offices/
// @desc all offices route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/global-statistics-mocked",

  (req, res) => {
    var globalSettings = JSON.parse(`{
      "QueryResponse": {
        "maxResults": "1",
        "startPosition": "1",
        "Employee": {
          "Organization": "false",
          "Title": "Mrs.",
          "GivenName": "Jane",
          "MiddleName": "Lane",
          "FamilyName": "Doe",
          "DisplayName": "Jane Lane Doe",
          "PrintOnCheckName": "Jane Lane Doe",
          "Active": "true",
          "PrimaryPhone": { "FreeFormNumber": "505.555.9999" },
          "PrimaryEmailAddr": { "Address": "janedoe@example.com" },
          "EmployeeType": "Regular",
          "status": "Synchronized",
          "Id": "ABC123",
          "SyncToken": "1",
          "MetaData": {
            "CreateTime": "2015-04-26T19:45:03Z",
            "LastUpdatedTime": "2015-04-27T21:48:23Z"
          },
          "PrimaryAddr": {
            "Line1": "123 Any Street",
            "City": "Any City",
            "CountrySubDivisionCode": "WA",
            "PostalCode": "01234"
          }
        }
      },
      "time": "2015-04-27T22:12:32.012Z"
    }`);
    res.json(globalSettings);
  }
);
