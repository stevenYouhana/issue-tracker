
var chai = require('chai');
var assert = chai.assert;
var Api = require('../routes/api');
var Check = require('../controllers/check');
var Update = require('../controllers/update');
var check = new Check();
const ObjectId = require('mongodb').ObjectID;

// suite('Unit Tests', function() {
  
//   suite('controllers/update', function() {
//     var testIssue = {
//       _id: new ObjectId('5ca908c3bd32db0838444bd3'),
//       issue_title: "test title",
//       issue_text: "test text",
//       created_by: "test creation",
//       status_text: "testing",
//       open: true,
//     };
//     var project = 'apitest';                
//     var update = new Update(testIssue, project);
    
//     test("for a full update - findIssue(update.getProject, update.getBody) PROMISE", function(done) {
//       update.findIssue(update.getProject, update.getBody)
//         .then((originalIssue) => {
//             var mockIssue = [
//               '_id',
//               'issue_title',
//               'issue_text',
//               'created_by',
//               'assigned_to',
//               'status_text',
//               'open',
//               'updated_on',
//               'created_on'
//             ];
//              assert.isTrue(mockIssue.every((item) => originalIssue.hasOwnProperty(item)));
//            done();
//         }).catch((e) => {
//         console.error("getIssue error: "+e)
//       });
//     });
//     test("for a full update entire update class", function(done) {
//       update.findIssue(update.getProject, update.getBody)
//         .then((originalIssue) => { //getUpdatedIssue(issue, original) {
//            assert.deepEqual(testIssue, update.getUpdatedIssue(testIssue, originalIssue));
//            done();
//         }).catch((e) => {
//         console.error("getIssue error: "+e)
//       });    
//     });
//   });
  
//   suite('Function api.requiredFields(...params)', function() {
//     test("missing a field for NEW TASK", function(done) {
//       assert.equal(check.requiredFields(
//         {faultMessage: 'Missing require fields', task: 'new'},
//       '', 'test issue jam', 'by me'), "Missing require fields");
//       done();
//     });
//     test('no update fields for UPDATE TASK', function(done) {
//       assert.equal(check.requiredFields(
//         {faultMessage: 'no updated field sent', task: 'update'},
//       '', undefined, ''), "no updated field sent");
//       done();
//     });
//     test("succesful NEW TASK", function(done) {
//       assert.equal(check.requiredFields(
//         {faultMessage: 'Issue added succesfully', task: 'new'},
//       '', 'test issue jam', 'by me'), "Issue added succesfully");
//       done();
//     });
//     test('succesful UPDATE TASK', function(done) {
//       assert.equal(check.requiredFields(
//         {faultMessage: 'successfully updated', task: 'update'},
//       '', 'updated note', ''), "successfully updated");
//       done();
//     });
//   });
// });
