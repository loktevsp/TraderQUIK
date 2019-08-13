var reader = new FileReader();
var ws = 0;
var auth = false;

function BinaryToText(binaryString) {
    var text = '';
    for (var i = 0; i<binaryString.length; i++) {
        var word = binaryString[i];
        text += String.fromCharCode(word);
    }
    return decodeURIComponent(escape(text));
}

// function sendMessage(e, terminal = false){
//   if(!terminal)
//   {
//     chrome.runtime.sendMessage({terminal: terminal, message: e});
//   }
//   else {
//   	chrome.runtime.sendMessage({terminal: terminal, message: "<label class='text text--noalign'>"+e+"</label><br>"});
//   }
// }

function OpenMessage(msg){
	try
	{
		reader.readAsArrayBuffer(msg);
	}
	catch(e){}
}

function send(e){
  ws.send(e);// ws.send(new Blob([e]))
  ws.send('{"msgid":10008}');
;}

var port = 0;
var connect = false;
var terminal = "";

chrome.extension.onConnect.addListener(function(p) {
	port = chrome.extension.connect({name: "background"});

	if(p.name == "popup")
	{
		connect = true;
		p.onMessage.addListener(function(msg) {
			Message(msg);
		});
	}
});

function Message(data)
{
	switch(data.msgid)
	{
		case 1: 	
					if(auth)
					{
						port.postMessage({msgid: 10000});
						port.postMessage({msgid: 10003, message: terminal, parrent:1});
					}
					break;

		case 10000: {
						ws = new WebSocket("wss://webquik.sberbank.ru/quik", ["dumb-increment-protocol"]);
						ws.binaryType="blob";

						ws.onopen = function(){
							var login = data.login;
					    	var passwd = data.password;
					    	if(login.length > 0 && passwd.length > 0)
					    	{
					    	  send('{"msgid":10000,"login":"'+login+'","password":"'+passwd+'","width":"1098","height":"650","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36","lang":"ru","sid":"144f9.2b851e74","version":"6.6.1"}')
					    	}
					    	else chrome.runtime.sendMessage({message: "<error>Введите логин и пароль!</error>"});
						};
						ws.onmessage = function(msg){
							OpenMessage(msg.data);
						};
					}
					break;

		case 10001: send('{"msgid":10001,"pin":"'+data.pin+'"}');
					break;
		case 10002: 
					send('{"msgid":11016,"c":"TQBR","s":"GAZP","p":1}');
					send('{"msgid":11014,"c":"TQBR","s":"GAZP","depth":30}');
					break;
	}
}

reader.addEventListener("loadend", function() {

    var message = JSON.parse(BinaryToText(new Uint8Array(reader.result)));

    switch(message["msgid"])
    {
      case 20000:
      			  console.log(message);
    	          break;
      case 20004: 
      			  if(message["message"].search("успешно") > 0)
      			  {
      			  	auth = true;
      			  	port.postMessage({msgid: 10002, message: "<success>"+message["message"]+"</success>", parrent:message["msgid"]});
      			  	port.postMessage({msgid: 10000});
      			  }
      			  else //if(message["message"].search("PIN") > 0)
      			  {
      			  	port.postMessage({msgid: 10001, message: "<error>"+message["message"]+"</error>", parrent:message["msgid"]});
      			  }
                  break;
      case 20006: 
      			  terminal = message["serverMessage"]+"<br><br>" + terminal;
      			  port.postMessage({msgid: 10003, message: message["serverMessage"], parrent:message["msgid"]});
                  break;
      case 20014: 
      			  terminal = message["text"]+"<br><br>" + terminal;
      			  port.postMessage({msgid: 10003, message: message["text"], parrent:message["msgid"]});
                  break;
      case 21014:
				  message["quotes"].getLines = function ()  {
															    for (var i in this) {
															        return this[i].lines;
															        break;
															    }
														 	}
				  var lines = message["quotes"].getLines();	
				  port.postMessage({msgid: 10005, message: lines, parrent:message["msgid"]});									 	
      			  break;
      case 21016: 
	      			  message["graph"].getGraph = function () {
															    for (var i in this) {
															        return this[i];
															        break;
															    }
															  }	
	      			  message["graph"].getName = function () {
															    for (var i in this) {
															        return i;
															        break;
															    }
															  }								  
					  var name = message["graph"].getName();
					  var graph = message["graph"].getGraph();
					  var size = graph.length;
					  var scale = graph[graph.length-1].c;

					   // for(var i = 0; i < size; i++)
					   // 	if(scale < graph[i].c) scale = graph[i].c;

					  //scale = parseInt(String(scale).slice(0, String(scale).length-2)+"00");
					  

					  for(var i = 0; i < size; i++)
					  {
						  var sate = "";
						  var price = parseFloat(String(graph[i].c).slice(0, String(graph[i].c).length-2)+"."+String(graph[i].c).slice(String(graph[i].c).length-2, String(graph[i].c).length));
						  var open = graph[i].o;
						  var close = graph[i].c;
						  var high = graph[i].h;
						  var low = graph[i].l;
						  var date = graph[i].d;
						  var s = parseInt(String(graph[i].c).slice(0, String(graph[i].c).length-2)+"00");

						  if(close > open) state = "bull";
						  else state = "bear";

		      			  port.postMessage({msgid: 10004, name:name, scale:scale, size:size, price:{id:i, scale:s,sate:sate, open:open, close:close, high:high, low:low, date:date}, state: state, message: price, parrent:message["msgid"]});
		              }
		            

	              break;
	    default:
	    	console.log(message);
	    break;
    }
});

setInterval(function(){if(connect) ws.send('{"msgid":10008}');}, 3000);