
'use strict';
module.exports = function (app) {
  var expect = require('chai').expect;
  var MongoClient = require('mongodb');
  var ObjectId = require('mongodb').ObjectID;
  var Check = require('../controllers/check');
  Object.size = function(obj) {
    var len = 0, key;
    for (key in obj) {
      ++len;    
    }
    return len;
  }
  var check = new Check();
  const CONNECTION_STRING = process.env.DB;
  function promise(project, req, res) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(CONNECTION_STRING, function(err, db) {
        try {
        db.collection(project).findOne(
          {_id: ObjectId(req.body._id)}, function(err, issue) {
            if (err) {
              console.error('err finding' +err);
              // res.send('issue id not found');
            }
            if (issue) {
              resolve(issue);
              console.log("PROMISE ISTABLISHED")
            }
            else {
              reject(new Error("promise(data)>>no data"));
            }
        });
        } catch (e) {
          console.log('async function promise(project, req, res) {::INVALID ID');
          res.send('ID provided is invalid');
        }
      });
    });
  }
  
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
        console.log('Check.somethingMissing '+Check.somethingMissing);
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
      check.requiredFields(res,
                       {faultMessage: 'no updated field sent', task: 'update'},
                       req.body.issue_title,
                       req.body.issue_text,
                       req.body.created_by,
                       req.body.status_text,
                       req.body.open
                      );
    console.log("PASSED CHECK");
          var updateIssue = function(issue, original) {
          function checkStatus(option, orig) {
            if (option === undefined) return orig;
            else if (option.toString().toLowerCase() === 'open')
              return true;
            else return false;
          if (Object.size(req.body) <= 3) { console.log("if (Object.size(req.body) <= 3)", req.body)
              issue.open = false;
              issue.status_text = 'Closed';
            } else { console.log("ELSE")
              issue = { 
                issue_title: req.body.issue_title ? req.body.issue_title : original.issue_title,
                issue_text: req.body.issue_text ? req.body.issue_text : original.issue_text,
                created_by: req.body.created_by ? req.body.created_by : original.created_by,
                assigned_to: req.body.assigned_to ? req.body.assigned_to : original.assigned_to,
                status_text: sortStatis(req.body.status_text, original),
                open: checkStatus(req.body.status_text, original.open),
                updated_on: new Date(Date.now()),
                created_on: original.created_on
              };
              if (!issue.open) issue.status_text = 'Closed';
            }
          return issue;
        }
      }
      if (Check.somethingMissing) return;
    console.log("POST if (Check.somethingMissing) return;")
      var sortStatis = function(text, original) {
        if (!req.body.open) 
          return req.body.status_text ? req.body.status_text : original.status_text;
        else {
          return req.body.status_text.toLowerCase() == 'closed'  ? 'Closed' : 'Open';
        }
      }


      var project = req.params.project;

      promise(project, req, res)
        .then(function(fulfilled) {
        console.log(".then(function(fulfilled) {")
        var issue = JSON.parse(JSON.stringify(fulfilled));
        delete issue._id;
        console.log(updateIssue(issue, fulfilled));
        MongoClient.connect(CONNECTION_STRING, function(err, db) {
        db.collection(project)
          .findOneAndUpdate(
          {_id: ObjectId(req.body._id)}, updateIssue(issue, fulfilled), {new: true},
          function(err, data) {
            if (err) {
              console.error('update error: '+err);
              res.send('could not update '+req.body._id);
            }
            // res.send('succesfully updated');
            db.close();
            res.json(updateIssue(issue, fulfilled));
          })
        })
        }).catch(function(error) {
          console.error("promise err: "+error)
          // res.send('no updated field sent');
        });
    })
    .delete(function (req, res){
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
              res.send({success: 'deleted '+req.body._id});
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