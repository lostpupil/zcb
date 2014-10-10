require("cloud/app.js");
var userCon = require('cloud/user.js');
var zutil = require('cloud/zutil.js');

function forceLogin(res){
  if (!userCon.isLogin()){
    res.error('please login');
  }
}

AV.Cloud.define('findUserById', function(req, res){
  forceLogin(res);
  var id = req.params.uid || '';
  userCon.findUserById(id).then(function(user){
    res.success(user);
  }, function(){
    res.error('error');
  });
});

AV.Cloud.define('findUserByName', function(req, res){
  forceLogin(res);
  var name = req.params.username || '';
  userCon.findUserByName(name).then(function(user){
    res.success(user);
  }, function(){
    res.error('error');
  });
});

AV.Cloud.define("getOrderList", function(req, res) {
  var Order = AV.Object.extend("Order");
  var User = AV.Object.extend("_User");
  var user = new User();
  user.id = req.params.uid

  var query = new AV.Query(Order);
  query.include("user");
  query.include("package");
  query.include("car");
  query.include("store");
  query.include("salesman");
  query.include("address");
  query.include("operator");

  query.equalTo("user",user);
  query.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length + " scores.");
      res.success(results);
    },
    error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
    }
  });
});

AV.Cloud.define("getCustomerService", function(req, res) {
  console.log(req.params.temp);
  temp = req.params.temp
  console.log(typeof(temp));
  // cspid = 
  if(temp == "n") {
  //return customer servece peerid only 
    result = {
      cspid: "lala"
    }
    res.success(result);
  } else {
  //return customer servece peerid and customer peerid
    n = (new Date()).getTime();
    str1 = n + "";
    str2 = Math.random().toString(36).substring(7);

    result = {
      cspid: "lala",
      cpid: str1 + str2
    }
    res.success(result);
  }

});