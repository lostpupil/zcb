require("cloud/app.js");
var unirest = require('unirest');
var crypto = require('crypto');
var avchat = require('lean-cloud-chat');
var userCon = require('cloud/user.js');
var zutil = require('cloud/zutil.js');

function forceLogin(res){
  if (!userCon.isLogin()){
    res.error('please login');
  }
}

function getCSnames () {
  var role = AV.Object.extend("_Role");
  var query = new AV.Query(role);
  query.equalTo('name', 'operator');
  return query.first().then(function (obj) {
    return obj.relation('users').query().find();
  }).then(function(list){
    var namelist =[];
    for (var i = list.length - 1; i >= 0; i--) {
      namelist.push(list[i].get("username"));
    }; 
    var p = new AV.Promise();
    p.resolve(namelist);
    return p;
  });
}


AV.Cloud.define('findUserById', function(req, res){
  // forceLogin(res);
  var id = req.params.uid || '';
  userCon.findUserById(id).then(function(user){
    res.success(user);
  }, function(){
    res.error('error');
  });
});

AV.Cloud.define('findUserByName', function(req, res){
  // forceLogin(res);
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

AV.Cloud.define("getOnlineCustomerService", function(req, res) {
  temp = req.params.temp;
  getCSnames().then(function(namelist){
   appId="eenezb2s4tnlbytmv8rt3ndrv4qiux13jg7s90n7ff72kvoa";
   chat = new avchat({
    appId: appId,
    peerId:'backend-chat-server'
  });

   chat.open().then(function(data){
    chat.getStatus(namelist.toString().split(',')).then(function(data) {
      name =data.onlineSessionPeerIds[Math.floor(Math.random()*data.onlineSessionPeerIds.length)]
      console.log(name);
      if(temp == "n") {
        result = {
          cspid: name
        }
        res.success(result);
      } else {
        n = (new Date()).getTime();
        str1 = n + "";
        str2 = Math.random().toString(36).substring(7);

        result = {
          operatorPeerId: name,
          tempPeerId: str1 + str2
        }
        res.success(result);
      }
    });
  },function(data){
    console.log('open rejected',data);
  });    
 });
});



AV.Cloud.define("getchathis", function(req,res) {
  console.log(req.params);
  fpid = req.params.frompid;
  tpid = req.params.topid;
  id_string = fpid+':'+tpid;
  convid = crypto.createHash('md5').update(id_string).digest('hex');
  console.log(convid);
  limit = 50;
  uri = 'https://cn.avoscloud.com/1.1/rtm/messages/logs'
  +'?convid='+convid;

  unirest.get(uri)
  .headers({ 
    "X-AVOSCloud-Application-Id":" eenezb2s4tnlbytmv8rt3ndrv4qiux13jg7s90n7ff72kvoa",
    "X-AVOSCloud-Application-Key": "flo4ra0v81t51v0ug33pzwvm4xsclmgqo23fqht4iendgoio"
   })
  .send(new Buffer([1,2,3]))
  .end(function (response) {
    console.log(response.body);
    res.success(response.body);
  });
});

AV.Cloud.define("alipayrsagenerator", function(req,res) {
// var hashes = crypto.getHashes();
// console.log(hashes);
  
});