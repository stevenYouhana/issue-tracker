const MongoClient = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const check = require('./check');

class Update {
  constructor(body, project) {
    this.body = body;
    this.project = project;
    this.returnIssue = "this.returnIssue = this.returnIssue; ";
    this.givenIssueParams = {
                       issue_title: body.issue_title,
                       issue_text: body.issue_text,
                       created_by: body.created_by,
                       status_text: body.status_text,
                       open: body.open
    }
  }
  get getBody() {
    return this.body;
  }
  get getProject() {
    return this.project;
  }
  findIssue(project, body) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect(process.env.DB, function(err, db) {
        try {
          db.collection(project).findOne(
            {_id: ObjectId(body._id)}, function(err, issue) {
              if (err) {
                console.error('err finding' +err);
                // res.send('issue id not found');
              }
              if (issue) {
                resolve(issue);
              }
              else {
                console.log("reject(new Error(promise(data)>>no data));")
                reject(new Error("promise(data)>>no data"));
              }
          });
        } catch (e) {
          console.log('async function promise(project, body, res) {::INVALID ID');
          // res.send('ID provided is invalid');
        }
      });
    });
  }

  sortStatis(text, original) {
    if (!this.body.open)
      return this.body.status_text ? this.body.status_text : original.status_text;
    else {
      return this.body.status_text.toLowerCase() == 'closed'  ? 'Closed' : 'Open';
    }
  }

  getUpdatedIssue(issue, original) {
    // console.log('original: ',original)
    // console.log('new: ',issue)
    function checkStatus(option, orig) {
      console.log('option: '+option+' orig: '+orig);
      if (!option) return orig;
      else if (option.toString().toLowerCase() === 'open')
        return true;
      else return false;
    }
      issue = {
        issue_title: this.body.issue_title ?
         this.body.issue_title : original.issue_title,
        issue_text: this.body.issue_text ?
         this.body.issue_text : original.issue_text,
        created_by: this.body.created_by ?
         this.body.created_by : original.created_by,
        assigned_to: this.body.assigned_to ?
         this.body.assigned_to : original.assigned_to,
        status_text: this.sortStatis(this.body.status_text, original),
        open: checkStatus(this.body.status_text, original.open),
        updated_on: new Date(Date.now()),
        created_on: original.created_on
      };
      console.log('updated issue: ',issue);
      if (!issue.open) issue.status_text = 'Closed';

    return issue;
  }
  issueWork() {
    this.findIssue(this.project, this.body)
    .then((fulfilled) => {
      this.returnIssue = fulfilled;
      //Test here!
    }).catch((e) => {
      console.error("getIssue error: "+e)
    });
  }
}
module.exports = Update;
