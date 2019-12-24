
'use strict';
module.exports = function (app) {
  var expect = require('chai').expect;
  var MongoClient = require('mongodb');
  var ObjectId = require('mongodb').ObjectID;
  var Check = require('../controllers/check');
  var Update = require('../controllers/update');
  Object.size = function(obj) {
    var len = 0, key;
    for (key in obj) {
      ++len;
    }
    return len;
  }
  var check = new Check();
  const CONNECTION_STRING = process.env.DB;

  app.route('/api/issues/:project')
    .get(function (req, res){
      var project = req.params.project;
      var data = [];
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        var cursor = db.collection(project).find(req.query);
        cursor.forEach(function(doc, err) {
          data.push(doc)
        }, function() {
          db.close();
          res.json(data);
        })
      })
    })
    .post(function (req, res) {
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) console.error(err)
        var issue = {
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
          open: req.body.status_text.toString().toLowerCase() !== 'closed'? true : false,
          updated_on: new Date(Date.now()),
          created_on: new Date(Date.now())
        }
        check.requiredFields(res,
                       {faultMessage: 'Missing required fields', task: 'new'},
                       issue.issue_title,
                       issue.issue_text,
                       issue.created_by
                      );
        // console.log('Check.somethingMissing '+Check.somethingMissing);
        if (Check.somethingMissing) return;
        db.collection(project).insert(issue, function(err, r) {
          if (err) {
            console.error('error inserting to db');
            res.send('could not add new issue')
          }
          db.close();
          // res.send('new issue added succesfully');
          res.json(issue);
        })
      });
    })
    .put(function (req, res) {
      var project = req.params.project;
      function sortStatus(status_text) {
        if (status_text === undefined) return undefined;
        switch (status_text.toLowerCase()) {
          case 'open': return true;
          case 'closed': return false;
          default: return undefined;
        }
      }

      try {
        var issue = {
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to,
          status_text: req.body.status_text,
          open: sortStatus(req.body.status_text),
          updated_on: new Date(Date.now()),
          created_on: new Date(Date.now())
        }
        check.requiredFields(res,
                       {faultMessage: 'no updated field sent', task: 'update'},
                       issue.issue_title,
                       issue.issue_text,
                       issue.created_by
                      );
        if (Check.somethingMissing) res.json({error: 'missong fields'});
        var update = new Update(req.body, project);
        update.findIssue(update.getProject, update.getBody)
        .then(originalIssue => {
          console.log(".then(originalIssue => {");
          MongoClient.connect(CONNECTION_STRING, function(err, db) {
        try {
          console.log('req.body: ',req.body);
          if (req.body.hasOwnProperty('open')) {
            // console.log("if (req.body.status_text) { ", req.body.status_text)
            db.collection(project).findOneAndUpdate({_id: ObjectId(req.body._id)},
                                {$set: {open: false, status_text: 'Closed'}},
                                {new: true}, function(err, data) {
              if (err) console.error("function(err, issue) {"+err);
              else {
                if (data) {
                   console.info("issue closed", data);
                   res.json(data.value);
                } else ("not data to send;")
              }
            });
          }
          else {
            console.log("ELSE closed")
            db.collection(project).findOneAndUpdate({_id: ObjectId(req.body._id)},
                                  {$set: update.getUpdatedIssue(issue, originalIssue)},
                                  {new: true}, function(err, data) {
                if (err) console.error("function(err, issue) {"+err);
                if (data) {
                   // console.info("update successful FULL UPDATE", data);
                   res.json(data);
                }
              });
          }
        }
        finally {
          db.close();
        }
    });
        })
        .catch((e) => {
          console.error(e);
          return;
        });
      }
      catch(e) {console.error(e) }
  })
    .delete(function (req, res) {
      console.log(".delete(function (req, res) {")
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        if (err) {
          console.error('error db '+err);
          res.send({failed: 'could not delete '+req.body._id});
        }
        try {
          db.collection(project).findOne({_id: ObjectId(req.body._id)}, (err, data) => {
            if (err) console.error('delete()::find()')
            if (data) {
              db.collection(project).remove({_id: ObjectId(req.body._id)})
              db.close();
              res.json(data);
            }
            else {
              res.send({failed: 'id '+req.body._id+' does not exist'});
            }
          });
        }
        catch (e) {
          res.send({failed: 'invalid id'});
        }
      })
    });
  }
