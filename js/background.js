var reader = new FileReader();
var ws = 0;
var auth = false;
var balanses = [];
var trdaccs = [];
var bids = [];
var deals = [];
var limits = [];
var login = "";
var passwd = "";
var nameServer = "";

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
function findById(_id, _arr)
{
  var id = -1;
  for(var i = 0; i < _arr.length; i++)
    if(_arr[i].id == _id) return (id = i);
  return id;
}
function OpenMessage(msg){
	// try
	// {
	// 	reader.readAsArrayBuffer(msg);
	// }
	// catch(e){}

	msg.then(function(defs){

    var message = JSON.parse(BinaryToText(new Uint8Array(defs)));
    //console.log(message["msgid"]);
    switch(message["msgid"])
    {
      case 20000:
              console.log(message.classList);
              if(!auth)
              {
                auth = true;
                port.postMessage({msgid: 10000});
                ws.send('{"msgid":10010,"params":[]}');
                ws.send('{"msgid":11013}');
              }

      			  classList = message.classList;

      			  var arList = [];
      			  for(var i = 0; i < classList.length; i++)
      			  {
      			  	var list = {};
      			  	list.name = classList[i].cname;
      			  	list.code = classList[i].ccode;
      			  	list.sections = [];

      			  	for(var j = 0; j < classList[i].secList.length; j++)
      			 	{
      			 		var section = {};
      			 		section.name = classList[i].secList[j].sname;
      			 		section.code = classList[i].secList[j].scode;
                section.lot = classList[i].secList[j].lot;
                section.scale = classList[i].secList[j].scale;
      			 		list.sections[j] = section;
      			 	}

      			  	arList[i] = list;
      			  }

      			  port.postMessage({msgid: 10006, message:arList});
              ws.send('{"msgid":10008}');
    	       break;
      case 20004: 
      			  if(message["message"].search("успешно") > 0)
      			  {
      			  	auth = true;
      			  	port.postMessage({msgid: 10002, message: "<success>"+message["message"]+"</success>", parrent:message["msgid"]});
      			  	port.postMessage({msgid: 10000});
                ws.send('{"msgid":10010,"params":[]}');
                ws.send('{"msgid":11013}');
      			  }
      			  else 
      			  {
      			  	port.postMessage({msgid: 10001, message: "<error>"+message["message"]+"</error>", parrent:message["msgid"]});
      			  }
              ws.send('{"msgid":10008}');
              break;
      case 20006: 
      			  port.postMessage({msgid: 10003, message: message["serverMessage"], parrent:message["msgid"]});
              ws.send('{"msgid":10008}');
              break;
      case 20014: 
      			  terminal = message["text"]+"<br><br>" + terminal;
      			  port.postMessage({msgid: 10003, message: message["text"], parrent:message["msgid"]});
              ws.send('{"msgid":10008}');
              break;
      case 21022:
      			  var trdacc = {
      			  	"trdacc" : message["trdacc"],
      			  	"firmid" : message["firmid"],
      			  	"classList" : message["classList"]
      			  }
      			  if(trdaccs.length == 0)
                      trdaccs.push(trdacc);
                  else
                  {
                  	var isFind = false;

                  	for(var i = 0; i < trdaccs.length; i++)
                    {
                    	if(trdaccs[i].trdacc == message["trdacc"])
                    	{
                    		isFind = true;
                    	}
                    }
                    if(!isFind)
                    	trdaccs.push(trdacc);
            	  }
                ws.send('{"msgid":10008}');
            	  break;
      case 21001: //Заявки
      			  var bid = {
      			  	"name" : FindSec(message["ccode"], message["scode"]),
      			  	"ccode" : message["ccode"],
      			  	"scode" : message["scode"],
      			  	"id" : message["number"],
      			  	"account" : message["account"],
      			  	"price" : message["price"],
      			  	"volume": message["volume"],
      			  	"sell" : message["sell"],
      			  	"balance" : message["balance"],
      			  	"status" : message["status"],
                "count" : message["qty"]
      			  }

              var id = findById(bid.id, bids);
              if(id != -1)
                bids[id].status = message["status"]; //1: ожидание, 2: исполнено, 3:отменено
      			  else
                bids.push(bid);

      			  port.postMessage({msgid: 10008, bids: bids, activeId: bid.id});
              //console.log(bid);
              ws.send('{"msgid":10008}');
      			  break;
      case 21003: //Сделки
      			  var deal = {
      			  	"name" : FindSec(message["ccode"], message["scode"]),
                "ccode" : message["ccode"],
                "scode" : message["scode"],
      			  	"id" : String(message["number"]),
      			  	"id_order" : String(message["n_order"]),
      			  	"account" : message["account"],
      			  	"price" : message["price"],
      			  	"volume": message["volume"],
      			  	"sell" : message["sell"],
      			  }

              var id = findById(deal.id, deals);
              if(id == -1)
                deals.push(deal);

      			  port.postMessage({msgid: 10009, deals: deals, activeId: deal.id});
              ws.send('{"msgid":10008}');
      			  break;
      case 21009:
      			  port.postMessage({msgid: 10003, message: message["text"], parrent:message["msgid"]});
              ws.send('{"msgid":10008}');
      			  break;
      case 21004:
              console.log(message);
      			  if(balanses.length == 0)
                      balanses.push({ "ucode": message["ucode"], "valutes": [{"valut": message["valut"],
                                    "cbal" : message["cbal"], "mid" : message["mid"], "firmid" : message["firmid"]}]});
                    else
                    {
                      var isFindU = false;
                      var isFindM = false;
                      for(var i = 0; i < balanses.length; i++)
                      {
                        if(balanses[i].ucode == message["ucode"])
                        {
                          isFindU = true;
                          for(var j = 0; j < balanses[i].valutes.length; j++)
                              if(balanses[i].valutes[j].mid ==message["mid"])
                              {
                                  balanses[i].valutes[j].cbal = message["cbal"];
                                  isFindM = true;
                                  break;
                              }

                          if(!isFindM)
                          {
                            balanses[i].valutes.push({"valut": message["valut"],
                                    "cbal" : message["cbal"],"mid" : message["mid"], "firmid" : message["firmid"]});
                            break;
                          }        
                        }
                      }
                      if(!isFindU)
                      {
                        balanses.pop({"ucode": message["ucode"], "valutes": [{"valut": message["valut"],
                                    "cbal" : message["cbal"],"mid" : message["mid"], "firmid" : message["firmid"]}]});
                        break;
                      }
                    }

      			  port.postMessage({msgid: 10007, balanses: balanses, trdaccs: trdaccs});
              ws.send('{"msgid":10008}');
      			  break;
      case 21005:

              var limit = {"trdacc":message["trdacc"],"scode":message["scode"],"cbal":message["cbal"]};
              var isFind = false;
              for(var i = 0; i < limits.length; i++)
                if(limits[i].trdacc == message["trdacc"] && limits[i].scode == message["scode"])
                {
                  limits[i].cbal = message["cbal"];
                  isFind = true;
                }

              if(!isFind)
                limits.push(limit);

              port.postMessage({msgid: 10010, limits: limits});
              ws.send('{"msgid":10008}');
              break;
      case 21014:
				  message["quotes"].getLines = function ()  {
															    for (var i in this) {
															        return this[i].lines;
															        break;
															    }
														 	}
				  message["quotes"].getName = function () {
															    for (var i in this) {
															        return i;
															        break;
															    }
															  }	
				  var name = message["quotes"].getName();
				  var arName = name.split('¦');
				  if(currentSec != arName[1]) break;

				  var lines = message["quotes"].getLines();	

      			  port.postMessage({msgid: 10005, message: lines, parrent:message["msgid"]});
              ws.send('{"msgid":10008}');
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
					  var arName = name.split('¦');

					  if(currentSec != arName[1]) break;

					  var item = FindSec(arName[0],arName[1]);

					  name = item.sname + " " + arName[2] + " мин.";

					  var graph = message["graph"].getGraph();

					  port.postMessage({msgid: 10004, name: name, graph: graph, parrent:message["msgid"]});
            ws.send('{"msgid":10008}');
	              break;
	    default:
	    	//console.log(message);
	    break;
    }
	});
}

function send(e){
  ws.send(e);// ws.send(new Blob([e]))
;}

var port = 0;
var connect = false;
var terminal = "";
var classList = [];
var currentClass = "TQBR";
var currentSec = "SBER";


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

function createWebSocket(_nameServer,_login,_psw)
{

  ws = new WebSocket("wss://"+_nameServer+":443/quik", ["dumb-increment-protocol"]);
	
	ws.binaryType="blob";

	ws.onopen = function(){
    	if(_login.length > 0)
    	{
    	  send('{"msgid":10000,"login":"'+_login+'","password":"'+_psw+'","width":"200","height":"200","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36","lang":"ru","sid":"144f9.2b851e74","version":"6.6.1"}')
    	}
    	else chrome.runtime.sendMessage({message: "<error>Введите логин и пароль!</error>"});
	};
	ws.onmessage = function(msg){
		OpenMessage(msg.data.arrayBuffer());
	};
	ws.onclose = function(){
		console.log("close");
    createWebSocket(nameServer,login,passwd);
    port.postMessage({msgid: 11111});
		send('{"msgid":11016,"c":"'+currentClass+'","s":"'+currentSec+'","p":1}');
		send('{"msgid":11014,"c":"'+currentClass+'","s":"'+currentSec+'","depth":30}');
	};
}

function Message(data)
{
	switch(data.msgid)
	{
		case 1: 	
					if(auth)
					{
						port = chrome.extension.connect({name: "background"});
						port.postMessage({msgid: 10000});
						port.postMessage({msgid: 10003, message: terminal, parrent:1});
						port.postMessage({msgid: 10007, balanses: balanses, trdaccs: trdaccs});
            port.postMessage({msgid: 10008, bids: bids, activeId:-1});
            port.postMessage({msgid: 10009, deals: deals, activeId:-1});
            port.postMessage({msgid: 10010, limits: limits});
					}
					break;

		case 2:     
					send('{"msgid":11016,"c":"'+currentClass+'","s":"'+currentSec+'","p":1}');
					send('{"msgid":11014,"c":"'+currentClass+'","s":"'+currentSec+'","depth":30}');
					break;

		case 10000: {
						nameServer = data.ns;
						login = data.login;
					    passwd = data.password;
						createWebSocket(nameServer,login,passwd);

					}
					break;

		case 10001: 
            send('{"msgid":10001,"pin":"'+data.pin+'"}');
					break;

		case 10002: 
						send('{"msgid":11016,"c":"'+data.class+'","s":"'+data.sec+'","p":1}');
						send('{"msgid":11014,"c":"'+data.class+'","s":"'+data.sec+'","depth":30}');
						send('{"msgid":11116,"c":"'+currentClass+'","s":"'+currentSec+'","p":1}');
						send('{"msgid":11114,"c":"'+currentClass+'","s":"'+currentSec+'","depth":30}');
					
					  currentClass = String(data.class);
					  currentSec = String(data.sec);
					break;

    case 10003:
              var arList = [];
              for(var i = 0; i < classList.length; i++)
              {
                var list = {};
                list.name = classList[i].cname;
                list.code = classList[i].ccode;
                list.sections = [];

                for(var j = 0; j < classList[i].secList.length; j++)
              {
                var section = {};
                section.name = classList[i].secList[j].sname;
                section.code = classList[i].secList[j].scode;
                section.lot = classList[i].secList[j].lot;
                section.scale = classList[i].secList[j].scale;
                list.sections[j] = section;
              }

                arList[i] = list;
              }

					  port.postMessage({msgid: 10006, message:arList});
		      break;

		case 10004: //Покупка/продажа
    console.log(data.firmid);
					  send('{"msgid":12000,"isMarket":0,"isMarketSpread":0,"spread":0,"price":'+data.price+',"takeProfit":0,"offset":0,"isStop":0,"ccode":"'+currentClass+'","scode":"'+currentSec+'","account":"'+data.trdacc+'","clientCode":"'+data.firmid+'","sell":'+data.sell+',"quantity":'+data.count+'}');
					break;

    case 10005: //Отмена
            send('{"msgid":12100,"ccode":"'+currentClass+'","number":'+data.id+'}');
          break;

    case 10006: //Отмена
            bids.splice(findById(data.id, bids), 1);
          break;
	}
}

function FindSec(_class, _sec)
{
	var item = 0;
	for(var i = 0; i < classList.length; i++)
	{
		if(classList[i].ccode == _class)
		{
			for(var j = 0; j < classList[i].secList.length; j++)
				if(classList[i].secList[j].scode == _sec)
				{
					item = classList[i].secList[j];
				}
		}
		
	}
	return item;
}

reader.addEventListener("loadend", function() {

});

 setInterval(function(){
  if(ws.readyState==1)
  {
  	ws.send('{"msgid":10008}');
  	ws.send('{"msgid":10008}');
  }
 }, 8000);