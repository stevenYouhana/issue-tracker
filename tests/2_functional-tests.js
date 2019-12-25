

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var Browser = require('zombie');
chai.use(chaiHttp);
var id;

suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {

      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/testapi')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res) {
         if (err) console.log(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          id = res.body._id;
          done();
        });
      });

      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          if (err) throw err;
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          done();
        });
      });

      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test/')
        .send({
          issue_title: undefined,
          issue_text: undefined,
          created_by: undefined,
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
      })
      .end(function(err, res) {
          if (err) console.error(err);
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Missing required fields');
          done();
        });
      });
    });

    suite('PUT /api/issues/{project} => text', function() {
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/apitest/')
          .send({
            _id: '5ca9089bbd32db0838444bd2'
          })
          .end(function(err, res) {
            if (err) console.error(err);
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no updated field sent');
            done();
          })
        })

      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/apitest/')
        .send({
          _id: '5ca3330cf858c70725597a14', issue_text: 'updated text'
        })
        .end(function(err,res) {
          if (err) console.error("One field to update ERROR"+err);
          console.log("TEST NO error")
          assert.equal(res.status, 200);
          assert.equal(res.body.value.issue_text, 'updated text');
          done();
        });
      });
      test('Multiple fields to update', function(done) {
        chai.request(server)
        .put('/api/issues/apitest/')
        .send({
          _id: '5ca5ab186a2f413546c6b853',
          issue_text: 'multiple field update',
          assigned_to: 'TESTING multiple fields'
        })
        .end(function(err, res) {
          if (err) console.error(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.value.assigned_to, 'TESTING multiple fields');
          done();
        });
      });
<<<<<<< HEAD
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
=======

    });

    suite('GET /api/issues/{project} => Array of objects with issue data', function() {

      test('No filter', function(done) {
         this.timeout(15000);
        chai.request(server)
        .get('/api/issues/testapi')
>>>>>>> div
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
<<<<<<< HEAD
    });
  
=======

      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/testapi')
        .query({open: true})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/testapi')
        .query({open: true, assigned_to: 'steve'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });

    });

    suite('DELETE /api/issues/{project} => text', function() {
      test('No _id', function(done) {
        chai.request(server)
        .get('/api/issues/testapi')
        .delete('/api/issues/testapi')
        .end(function(err, res) {
          if (err) console.error(err);
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'failed');
          assert.isString(res.body[0].failed);
          done();
        });
      });

      test('Valid _id', function(done) {
        chai.request(server)
        .get('/api/issues/testapi')
        .delete('/api/issues/testapi'+res.body[0]._id)
        .end(function(err, res) {
          if (err) console.error(err);
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'success');
          assert.isString(res.body[0].success);
          done();
        });
      });

>>>>>>> div
});
