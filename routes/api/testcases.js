const express = require('express');
const router = express.Router();
const keys = require('../../config/keys');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const pgURI = require('../../config/keys').postgresURI;
const sequelize = new Sequelize(pgURI, {
  operatorsAliases: false
});

const TestCase = require('../../models/testcase');
const Link = require('../../models/link');
const UploadedFile = require('../../models/uploadedfile');
const TestStep = require('../../models/teststep');
const Group = require('../../models/group');

// @route GET api/testcases/test
// @desc test testcases route
// @access public
router.get('/test', (req, res) => {
  res.json({ message: 'testcases are working' });
});

// @route GET api/testcases/:id
// @desc Get one test case by id
// @access private
router.get('/testcase/:id', (req, res) => {
  if (isNaN(req.params.id)) {
    res.status(400).json({ error: 'Test case id is not valid number' });
  } else {
    const errors = {};
    TestCase.findOne({
      where: {
        id: req.params.id,
        depricated: false
      },
      attributes: [
        'id',
        'title',
        'description',
        'expected_result',
        'preconditions',
        ['created_at', 'date']
      ],
      include: [
        {
          model: Link,
          attributes: ['id', 'value'],
          required: false
        },
        {
          model: UploadedFile,
          attributes: ['id', ['title', 'value'], 'path'],
          required: false,
          as: 'uploaded_files'
        },
        {
          model: TestStep,
          attributes: ['id', ['title', 'value'], 'expected_result'],
          required: false,
          as: 'test_steps'
        },
        {
          model: Group,
          attributes: ['id', ['title', 'value'], 'color'],
          through: {
            attributes: []
          },
          as: 'groups',
          required: false
        }
      ],
      plain: true
    })
      .then(testcase => {
        if (!testcase) {
          errors.notestcase = "Test case doesn't exist";
          res.status(404).json(errors);
        } else {
          res.json(testcase);
        }
      })
      .catch(err => res.status(404).json(err));
  }
});

module.exports = router;
