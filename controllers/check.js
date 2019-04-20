
function Check() {
  function getBoolean(value) {
   switch(value){
        case false:
        case "false":
        case undefined: 
        case "":
            return false;
        default: 
            return true;
    }
  }
  this.requiredFields = function (...params) {
    var res;
    var faultMessage;
    var task;
    var fields = [];
    var justClosing = false;

    Check.somethingMissing = false;
    for (var param of params) {
      if (typeof param === 'object') {
        if (param.hasOwnProperty('req')) {
          if (param.req.body.hasOwnProperty('type')) {
            justClosing = true;
            return;
          }
        }
        if (param.hasOwnProperty('faultMessage')) {
          faultMessage = param.faultMessage;  
          task = param.task;
        }
        else {
          res = param;
        }
      }
      else {
        fields.push(param); 
      }
    }
    if (task === 'new') {
      var missingRequiredField = false;
      fields.forEach(function (field) {
        if (!field) {
          Check.somethingMissing = true;
          missingRequiredField = true;
        }
      });
      if (missingRequiredField) { 
        Check.somethingMissing = true;
        res.send(faultMessage);    
      }
      // return "Issue added succesfully";
    }
    else if (task === 'update') {
      if (justClosing) return;
      var emptyFields = 0;
      // console.log(fields)
      fields.forEach(function (field) {
        if (!getBoolean(field)) ++emptyFields;
      });
      if (emptyFields === fields.length) {
        Check.somethingMissing = true;
        console.log("if (emptyFields === fields.length) {")
        res.send(faultMessage);
      }
      // return "successfully updated";
    }
  }

}
Check.somethingMissing = false;
module.exports = Check;