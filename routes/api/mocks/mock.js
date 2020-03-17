const Router = require("express").Router;
const passport = require("passport");
const Office = require("../../../models/office");

// @route GET api/offices/
// @desc all offices route
// @access public
module.exports = Router({ mergeParams: true }).get(
  "/global-statistics-mocked",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var globalSettings = JSON.parse(`{
        "most_active_projects": [
          {
            "percentage": 33,
            "title": "Stena"
          },
          {
            "percentage": 23,
            "title": "Quinyx"
          },
          {
            "percentage": 20,
            "title": "Jammcard"
          },
          {
            "percentage": 14,
            "title": "AloeCare"
          },
          {
            "percentage": 10,
            "title": "Hrm"
          }
        ],
        "most_user_reports": [
          {
            "failed": 68,
            "total": 123,
            "passed": 55,
            "title": "Jana Antic"
          },
          {
            "failed": 15,
            "total": 98,
            "passed": 83,
            "title": "Sandra Jeremenkovic"
          },
          {
            "failed": 67,
            "total": 87,
            "passed": 20,
            "title": "Uros Jeremic"
          },
          {
            "failed": 33,
            "total": 66,
            "passed": 33,
            "title": "Milos Decov"
          },
          {
            "failed": 5,
            "total": 52,
            "passed": 47,
            "title": "Aleksandar Pavlovic"
          }
        ],
        "annual_report": [
            {
                "total": 673,
                "passed": 321,
                "failed": 352,
                "month": "April"
              },
              {
                "total": 452,
                "passed": 221,
                "failed": 231,
                "month": "May"
              },
              {
                "total": 678,
                "passed": 322,
                "failed": 356,
                "month": "June"
              },
              {
                "total": 657,
                "passed": 456,
                "failed": 201,
                "month": "July"
              },
              {
                "total": 544,
                "passed": 421,
                "failed": 123,
                "month": "August"
              },
              {
                "total": 511,
                "passed": 210,
                "failed": 301,
                "month": "September"
              },
              {
                "total": 498,
                "passed": 267,
                "failed": 231,
                "month": "October"
              },
              {
                "total": 590,
                "passed": 345,
                "failed": 245,
                "month": "November"
              },
              {
                "total": 378,
                "passed": 115,
                "failed": 263,
                "month": "December"
              },
              {
                "total": 669,
                "passed": 331,
                "failed": 338,
                "month": "January"
              },
              {
                "total": 521,
                "passed": 251,
                "failed": 270,
                "month": "February"
              },
              {
                "total": 27,
                "passed": 15,
                "failed": 12,
                "month": "March"
              }
            ],
        "most_testcases_failed": [
          {
            "failed": 168,
            "total": 223,
            "passed": 55,
            "title": "Jammcard"
          },
          {
            "failed": 78,
            "total": 143,
            "passed": 65,
            "title": "Quinyx"
          },
          {
            "failed": 68,
            "total": 123,
            "passed": 55,
            "title": "HRM"
          },
          {
            "failed": 60,
            "total": 115,
            "passed": 47,
            "title": "AloeCare"
          },
          {
            "failed": 48,
            "total": 103,
            "passed": 35,
            "title": "Stena"
          }
        ],
        "total_data": {
          "total_passed_reports": {
            "percentage": -11.1,
            "value": 16533
          },
          "total_testcases": {
            "percentage": -22.4,
            "value": 12412
          },
          "total_failed_reports": {
            "percentage": 33.3,
            "value": 6807
          },
          "total_reports": {
            "percentage": -44.1,
            "value": 22341
          }
        },
        "most_version_failed": [
          {
            "failed": 3,
            "total": 7,
            "passed": 4,
            "title": 2.1
          },
          {
            "failed": 3,
            "total": 7,
            "passed": 4,
            "title": 3.4
          },
          {
            "failed": 3,
            "total": 7,
            "passed": 4,
            "title": 1.2
          },
          {
            "failed": 3,
            "total": 7,
            "passed": 4,
            "title": 4.1
          },
          {
            "failed": 3,
            "total": 7,
            "passed": 4,
            "title": 2.6
          }
        ],
        "most_user_testcases": [
          {
            "total": 5,
            "title": "Jana Antic"
          },
          {
            "total": 4,
            "title": "Sandra Jeremenkovic"
          },
          {
            "total": 3,
            "title": "Uros Jeremic"
          },
          {
            "total": 2,
            "title": "Milos Decov"
          },
          {
            "total": 1,
            "title": "Aleksandar Pavlovic"
          }
        ]
      }`);
    res.json(globalSettings);
  }
);
