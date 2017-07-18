

'use strict';

var ConfigWSParameters = {
  "userToken": "e402964e60b044b681115408c58b50b1"  
};
var deviceID=[];
var WebSocket = require("ws");

var ConfigWSConnection = {

    "scheme": "wss",
    "domain": "api.artik.cloud",
    "version": "v1.1",
    "path": "live"

};
  var Devices= function(index){
                var device= new WebSocket(
                getConnectionString(ConfigWSConnection, deviceID[index]));
                device.on("message", function (data) {


                   $.ajax({
                      url:'https://api.artik.cloud/v1.1/devices/'+deviceID[index]+'/status',
                      type:'GET',
                      headers : {
                              
                              'Authorization' :'Bearer e402964e60b044b681115408c58b50b1'
                              
                              },
                      contentType : 'application/json',
                      success : function(response) { 
                        console.log("availablility-=====>",response.data.availability);
                        if(response.data.availability === 'online'){
                           $('#img'+index).attr('src','./assets/img/connect.png');
                           $('#state'+index).html('Live');
                        }else {
                          $('#img'+index).attr('src','./assets/img/disconnect.png');
                          $('#state'+index).html('Missing');
                          
                        }
                      }});


                  var temp = JSON.parse(data);
                  console.log("temp========",temp,"------  ",index);
                  if("data" in temp){                   
                    
                    if("TBATT" in temp.data){
                      $('#tbatt'+index).html(temp.data.TBATT);
                    }
                    if("BATTSTAT" in temp.data){
                      $('#battstat'+index).html(temp.data.BATTSTAT);
                    }
                    if("UBATT" in temp.data){
                      $('#ubatt'+index).html(temp.data.UBATT);
                    }
                    if("BRGT" in temp.data){
                      $('#brgt'+index).val(temp.data.BRGT);
                    }
                  }
                
            });

            device.on("open", function () {
                console.log("Websocket connection is open ...");
            });

            device.on("close", function () {
                console.log("Websocket connection is closed ...");
            });
            return device;
}
  var device_count=0;
  var ws=[];
$.ajax({
  url:'https://api.artik.cloud/v1.1/users/282e794831bc4998a3480e4b05cb6b8e/devices',
  type:'GET',
  headers : {
					
					'Authorization' :'Bearer e402964e60b044b681115408c58b50b1'
					
					},
  contentType : 'application/json',
  success : function(response) {
    console.log(response.data.devices);
    var i=0;
    device_count = response.count;
    console.log("device_count====>",device_count);
    for(i=0;i<response.count;i++){
      console.log(response.data.devices[i].name);
      $('.device-list').append('<div class="list-all"><div class="div-item1"><span id="device-name">'+response.data.devices[i].name+'</span>&nbsp;&nbsp;<span id="state'+i+'">Missing</span><img id="img'+i+'" src="./assets/img/disconnect.png" width="25" height="25" style="float:right"/></div>'+
                                                    '<div class="div-item2"><div class="col-md-6"><span>Brightness</span>'+
                                                            '<input type="input" name="brightness" value="0" id="brgt'+i+'"/>'+
                                                        '</div><div class="col-md-6"><button type="button" class="btn btn-primary" style="float:right" onclick="action('+i+')">Action</button><p><span>UBATT&nbsp;</span><span id="ubatt'+i+'">0</span> mVolt</p>'+
                                                            '<p><span>TBATT&nbsp;</span><span id="tbatt'+i+'">0</span> Celsius</p>'+
                                                            '<p><span>BATTSTAT&nbsp;</span><span id="battstat'+i+'">0</span> %</p>'+
                                                        '</div></div></div>');
              deviceID[i]=response.data.devices[i].id;
              console.log("deviceID====>",deviceID[i]);
                 
        }
        
        for(i=0;i<response.count;i++){
              ws[i]=new Devices(i);
               
        }
      }
});
function action(val){
  console.log(new Date().getTime())
  $.ajax({
                      url:'https://api.artik.cloud/v1.1/actions',
                      type:'POST',
                      headers : {
                              
                              'Authorization' :'Bearer e402964e60b044b681115408c58b50b1'
                              
                              },
                      contentType : 'application/json',
                      data : JSON.stringify(
                                  {
                                          "data": {
                                              "actions": [
                                                  {
                                                      "name": "setBrightness",
                                                      "parameters": {
                                                          "brightness": parseInt($('#brgt'+val).val())
                                                      }
                                                  }
                                              ]
                                          },
                                          "ddid": deviceID[val],
                                          "ts": new Date().getTime(),
                                          "type": "action"
                                      }
                                  ),
                      success : function(response) { 
                        console.log(response);
                      }
  });
}


function getConnectionParameters(config) {

    return "authorization=bearer+" + ConfigWSParameters.userToken + "&" +
                "sdids=" + config;
}

/**
* build connection string (url) for websocket connection
* including any connection paramters
*/
function getConnectionString(config, parameters) {

    var connectionString =
            config.scheme + "://" +
            config.domain + "/" +
            config.version + "/" +
            config.path + "?" +
            getConnectionParameters(parameters);

    console.log("Connecting to: ", connectionString);

    return connectionString;

}







/**
* listen for messages
*/

