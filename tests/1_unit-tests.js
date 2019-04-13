
// var chai = require('chai');
// var assert = chai.assert;
// var Api = require('../routes/api');
// var Check = require('../controllers/check');

// var check = new Check();

// suite('Unit Tests', function() {
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
