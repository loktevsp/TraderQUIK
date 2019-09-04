$(".itemP").on("mousedown", function(e){
  $(this).addClass("itemP--click");
});
$(".itemP").on("mouseup", function(e){
  $(this).removeClass("itemP--click");
});
$("#isTrader").on("click", function(e){
  $(".itemP").removeClass("active");
  $(this).addClass("active");
  $("#trader").removeClass("hidden");
  $("#terminal").addClass("hidden");
  $("#briefcase").addClass("hidden");
  $("#hammer").addClass("hidden");
});
$("#isTerminal").on("click", function(e){
  $(".itemP").removeClass("active");
  $(this).addClass("active");
  $("#trader").addClass("hidden");
  $("#hammer").addClass("hidden");
  $("#briefcase").addClass("hidden");
  $("#terminal").removeClass("hidden");
});
$("#isHammer").on("click", function(e){
  $(".itemP").removeClass("active");
  $(this).addClass("active");
  $("#trader").addClass("hidden");
  $("#hammer").removeClass("hidden");
  $("#briefcase").addClass("hidden");
  $("#terminal").addClass("hidden");
});
$("#isBriefcase").on("click", function(e){
  $(".itemP").removeClass("active");
  $(this).addClass("active");
  $("#trader").addClass("hidden");
  $("#hammer").addClass("hidden");
  $("#briefcase").removeClass("hidden");
  $("#terminal").addClass("hidden");
});
$(".chart").mousemove(function(e){
    var pos = $(this).offset();
    mouse.x = e.pageX - pos.left; // положения по оси X
    mouse.y = e.pageY - pos.top; // положения по оси Y
    //console.log("X: " + mouse.x + " Y: " + mouse.y); // вывод результата в консоль
    if(!noloadgraph)
    {
      $("#cursor-info").css("display", "block");
      $("#cursor-info").offset({left:e.pageX+5, top:e.pageY-28});
      if(currentCountOrder)
      {
        var orderPrice = (currentLot*currentPriceOrder*currentCountOrder).toFixed(2);
        var curPrice = (currentLot*calcPos(mouse.y).toFixed(2)*currentCountOrder).toFixed(2);
        curPrice = (curPrice - procent(curPrice)) - procent(orderPrice);
        var text = "";
        if(orderPrice < curPrice)
          text = "+ "+(curPrice-orderPrice).toFixed(2);
        else
          text = "- "+(orderPrice-curPrice).toFixed(2);
        $("#cursor-info").html(String(calcPos(mouse.y).toFixed(2))+" "+text);
      }
      else $("#cursor-info").html(String(calcPos(mouse.y).toFixed(2)));
    }
});
$(".chart").mouseout(function(e){
  $("#cursor-info").css("display", "none");
});
$("#buy").on("click", function(e){
  if(!eventBuy)
  {
    eventBuy = true;
    $(this).addClass("btn--active");
  }
  else { eventBuy = false; $(this).removeClass("btn--active"); }
  eventSell = false;

});
$("#sell").on("click", function(e){
  eventBuy = false;
  if(!eventSell)
  {
    eventSell = true;
    $(this).addClass("btn--active");
  }
  else { eventSell = false; $(this).removeClass("btn--active"); }
});

$("#class_inp").on("click", function(e){
  if($("#select_class_inp").css("display") == "none")
      $("#select_class_inp").css("display", "flex");
  else $("#select_class_inp").css("display", "none");
});

$("#graph_inp").on("click", function(e){
  if($("#select_graph_inp").css("display") == "none")
      $("#select_graph_inp").css("display", "flex");
  else $("#select_graph_inp").css("display", "none");
});
$("#inGraph").on("click", function(e){
  noloadgraph = true;
 
  deleteItems(candles);
  deleteItems(lines);
  deleteItems(graph);
  currentClass = String($("#class_inp").attr("data-code"));
  currentSec = String($("#graph_inp").attr("data-code"));
  size = 0;
  port.postMessage({msgid: 10002, class:currentClass, sec:currentSec});
  $("#isTrader").click();
});

function procent(_price)
{
  return ((_price/10000).toFixed(2)*18).toFixed(2);
}
function deleteItems(_items){
  var size = _items.length;
  for(var i = 0; i < size; i++)
  {
    delete  _items[i];
    _items.pop();
  }
}

var tmp = 0;

Position = function(_x, _y)
{
    return {
      x:_x,
      y:_y,
      Set:function(_x, _y)
      {
        this.x = _x;
        this.y = _y;
      }
    }
}
Line = function(_pos = Position(0, 0),_to = Position(0, 0),_size = 1,_color = "#fff", _label = "",_id=0)
{
    this.id = _id || tmp++;
    this.pos = _pos;
    this.to = _to;
    this.size = _size;
    this.color = _color;
    this.label = _label;
    this.exlabel = "";
    this.collision = false;
}
Line.prototype =
{
    constructor: Line,
    Set: function(_pos,_to,_size,_color,_label)
    {
        this.label = _label || this.label;
        this.color = _color || this.color;
        this.size = _size || this.size;
        this.pos = _pos || this.pos;
        this.to = _to || this.to;
    },
    SetColor: function(_c)
    {
      this.color = _c || this.color;
    },
    SetExLabel: function(_l)
    {
      this.exlabel = _l;
    },
    isCollision: function()
    {
      return this.collision;
    },
}
Candle = function(_oc, _hl, _v)
{
    this.open_close = _oc;
    this.high_low = _hl;
    this.volume = _v;
}
Candle.prototype =
{
    constructor: Candle
}

function findById(_id, _arr)
{
  for(var i = 0; i < _arr.length; i++)
    if(_arr[i].id == _id) return i;
}

Order = function(_id, _type, _price = 0, _count = 1)
{
    this.id = _id;
    this.price = _price;
    this.count = _count;
    this.sell = _type=="S"?1:0;
    this.active = false;
    this.color = this.sell>0?"#F00":"#0F0";
    this.Line = new Line(Position(0, _price), Position(widthCnavas, _price), 1, "#777", String(_price.toFixed(fixed)+", "+_count+(_type=="S"?" Sell":" Buy")), _id);
    lines.push(this.Line);
}
Order.prototype =
{
    constructor: Order,
    setActive: function(_f)
    {
        this.active = _f;
        this.Line.Set(Position(0, this.price),Position(widthCnavas, this.price), 1, this.color, String(this.price.toFixed(fixed)+", "+this.count+(this.sell?" Sell":" Buy")));
    },
    setPrice: function(_p)
    { 
      this.price = IntToFloat(_p, mscale);
      this.Line.Set(Position(0, this.price),Position(widthCnavas, this.price), 1, this.color, String(this.price.toFixed(fixed)+", "+this.count+(this.sell?" Sell":" Buy")));
    },
    isActive: function()
    {
      return this.active;
    },
    delete: function()
    {
      lines.splice(findById(this.id, lines), 1);
      var id = findById(this.id, orders);
      orders.splice(id, 1);
      return id;
    }
}

var mouse = Position(0 , 0);
var candles = [];
var lines = [];
var camera = Position(0, 0);
var balanses = [];
var trdaccs = [];
var bids = [];
var deals = [];
var widthCnavas = 200;
var heightCanvas = 210;
var eventBuy = false;
var eventSell = false;

$("#cursor-info").css("display", "none");

var canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
// ctx.fillStyle = "#FFF";
// ctx.textBaseline = 'top';
// ctx.font = "12px Arial";
// ctx.lineWidth = 1;    
// ctx.fillText("Загрузка...",widthCnavas/2, heightCanvas/2);

var canvas1 = document.getElementById("canvas1");
ctx1 = canvas1.getContext('2d');
// ctx1.fillStyle = "#FFF";
// ctx1.textBaseline = 'top';
// ctx1.font = "12px Arial";
// ctx1.lineWidth = 1;      

function drawLine(_ctx, _data, _camera, _offest = Position(0 ,0), _scale = 1, _fscale = 10, _dash = 0, _flip = 1)
{
  var _p = _data.pos;
  var _t = _data.to;
  var _s = _data.size;
  var _c = _data.color;
  var _type = _data.type;
  var _label = _data.label;
  var _exlabel = _data.exlabel;
  var _z = _scale;
  _z = !_z?1:_z;

  var x1,x2,y1,y2,scale;

  scale = _z*_fscale;
  x1 = _p.x-_camera.x-_offest.x;
  x2 = _t.x-_camera.x-_offest.x;
  y1 = _p.y-_camera.y-_offest.y;
  y2 = _t.y-_camera.y-_offest.y;

  mouse_pos = calcPos(mouse.y).toFixed(2);
  pos = _t.y.toFixed(2);
  _data.collision = pos+0.02>mouse_pos&&pos-0.02<mouse_pos?true:false;

  _ctx.setTransform(1,0,0,1,0,0);

  if(_label != "")
  {
    _ctx.beginPath();
    _ctx.setTransform(1,0,0,1,0,_offest.y-10);
    _ctx.fillStyle = "#FFF";
    _ctx.textBaseline = 'top';
    _ctx.font = "8px Arial";
    _ctx.lineWidth = 1;      
    _ctx.fillText(_label+" "+_exlabel, x1+5, (y1*-scale)); 
    _ctx.closePath();
  }
  if(_dash)
  {
    _ctx.beginPath();
    _ctx.setTransform(1,0,0,1,0,_offest.y);
    _ctx.setLineDash([5, _dash]);
    _ctx.moveTo(x1, (y1*-scale));
    _ctx.lineTo(x2, (y2*-scale));
    _ctx.lineWidth = _s;
    _ctx.strokeStyle = _c;
    _ctx.stroke();
    _ctx.closePath();
  }
  else
  {
    _ctx.beginPath();
    _ctx.setTransform(1,0,0,-scale*_flip,0,_offest.y);
    _ctx.setLineDash([0, 0]);
    _ctx.moveTo(x1, y1);
    _ctx.lineTo(x2, y2+(y1==y2?1/scale:0));
    _ctx.lineWidth = _s;
    _ctx.strokeStyle = _c;
    _ctx.stroke();
    _ctx.closePath();
  }
}

function render(_data, _camera, _data1 = 0)
{
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0, 0, widthCnavas, heightCanvas);

  for(var i = 0; i < _data.length; i++)
  {
    drawLine(ctx, _data[i].high_low, _camera, Position(0, (heightCanvas)/2), zoom);
    drawLine(ctx, _data[i].open_close, _camera, Position(0, (heightCanvas)/2), zoom);
  }

  if(_data1)
    for(var i = 0; i < _data1.length; i++)
      drawLine(ctx, _data1[i], Position(0, _camera.y), Position(0, (heightCanvas)/2), zoom, 10, 5);
}

function render1(_data, _camera, _data1 = 0)
{
  ctx1.setTransform(1,0,0,1,0,0);
  ctx1.clearRect(0, 0, widthCnavas, 10);

  for(var i = 0; i < _data.length; i++)
  {
    drawLine(ctx1, _data[i].volume, Position(_camera.x, 10-3), Position(0, 0), 1, 1, 0, 1);
  }
}

var ColorSale = "#fa1039";
var ColorBuy = "#00b48e";

var limits = [];
var orders = [];
var graph = [];
var graphName = "";
var classList = [];
var oldDate = "";
var currentPrice = 0;
var currentClass = "TQBR";
var currentSec= "SBER";
var currentTrdacc = "";
var currentClient = "";
var currentLot = 10;
var currentPriceOrder = 0;
var currentCountOrder = 0;
var currentBalance = 0;
var zoom = 12;

var between = 12;
var fixed = 2;
var fscale = 2;
var mscale = 2;
var noloadgraph = true;
var step = 0;
var size = 0;
var size_bids = 0;
var size_deals = 0;
var activeIdBid = -1;
var activeIdDeal = -1;
var cameraX = 0;
var cameraY = 0;
var port = chrome.extension.connect({name: "popup"});

chrome.extension.onConnect.addListener(function(port) {
  console.assert(port.name == "background");
  port.onMessage.addListener(function(msg) {
    Message(msg);
  });
});

function IntToFloat(_i, _n) {
  return parseFloat(String(_i).slice(0, String(_i).length-_n)+"."+String(_i).slice(String(_i).length-_n, String(_i).length));
}

var updatePrices = function(){
  for(var i = 0; i < $(".prices span").length; i++)
  {
    var pos = $(".prices span").eq(i).position().top;         
    $(".prices span").eq(i).html(String(calcPos(pos).toFixed(2)));
  }
  $("#price").html(String(currentPrice));
}

$('.prices').bind('mousewheel', function(e){
  e.preventDefault();
    if(e.originalEvent.wheelDelta /120 > 0) {
      if(between > 1)
      {
        zoom+=12;
        between-=1;
        if(between < 6)
          fixed = 3;
        updatePrices();
      }
    }
    else{
      if(between < 1000 && zoom > 12)
      {
        zoom-=12;
        between+=1;
        if(between > 6)
          fixed = 2;
        updatePrices();
      }
    }
});

var eventScaleX = true;
var eventScaleY = false;

$( document ).keypress(function(e) {
  if(e.keyCode == 121){
    eventScaleY = true;
    eventScaleX = false;

  }else if(e.keyCode == 120)
  {
    eventScaleX = true;
    eventScaleY = false; 
  }
});
  
$('.chart').bind('mousewheel', function(e){
  e.preventDefault();
    if(e.originalEvent.wheelDelta /120 > 0) {
      if(eventScaleY)
        cameraY+=10;
      else
        cameraX+=10;
    }
    else{
      if(eventScaleY)
      {
        if(cameraY>10)
        {
          cameraY-=10;
        }
      }
      else
        if(cameraX>10)
        {
          cameraX-=10;
        }
    }
});  

function calcPos(_pos){
  if(zoom!=12)
  {
    var scale = 0.0084/(13-between);
  }
  else
    var scale = 0.0084;

  var pos = (((heightCanvas)-_pos)*(scale));
  var price = pos+(currentPrice-((heightCanvas)*0.5)*(scale));
  return price;
}

$('.chart').on("click", function(e)
{
  var price = calcPos(mouse.y);
  if(eventBuy)
  {
    buy(price.toFixed(2), 1);
    eventBuy = false; 
    $("#buy").removeClass("btn--active");
  }
  else if(eventSell)
  {
    sell(price.toFixed(2), 1);
    eventSell = false; 
    $("#sell").removeClass("btn--active");
  }
  else
  {
    var line = new Line(Position(0, price), Position(widthCnavas, price), 1, "#FFF", String(price.toFixed(fixed)));
    lines.push(line);
  }
});

function buy(_price, _count)
{
  console.log(currentClient);
  port.postMessage({msgid: 10004, price:_price, sell:0, trdacc: currentTrdacc, firmid: currentClient, count: _count});     
}
function sell(_price, _count)
{
  port.postMessage({msgid: 10004, price:_price, sell:1, trdacc: currentTrdacc, firmid: currentClient, count: _count});
}

function getScale(s)
{
  var r = "1";
  for(var i = 1; i < String(s).length-2; i++)
    r += "0";
  return parseInt(r);
}

function getPrice(p,s=1)
{
  var r = 200-(((p)/getScale(p))*s);
  r = r > 0 ? r : r * -1;
  return p;
}
function abs(r){
  r = r > 0 ? r : r * -1;
  return r;
}

function calcGraph()
{ 
  for(var _size = size; _size < graph.length; _size++)//if(graph.length > 0) 
  {
    var sate = "";
    var open = graph[_size].o;
    var close = graph[_size].c;
    var high = graph[_size].h;
    var low = graph[_size].l;
    var date = graph[_size].d;
    var volume = graph[_size].v;
    var price = IntToFloat(close, fscale);

    if(close >= open) state = "bull";
    else state = "bear";  

    currentPrice = price;
    $("#nameGraph").html("["+String(graphName)+"]");

    if(_size < graph.length-1)
    {
      oldDate = date;

      var o = IntToFloat(open, mscale);
      var c = IntToFloat(close, mscale);
      var h = IntToFloat(high, mscale);
      var l = IntToFloat(low, mscale);

      var color = o>c?ColorSale:ColorBuy;
      step+=10;
      var oc = new Line(Position(step, c), Position(step, o), 7, color);
      var hl = new Line(Position(step, h), Position(step, l), 1, color);
      if(volume > 10000)
        var v = new Line(Position(step, 0), Position(step, 5), 7, ColorSale);
      else
        var v = new Line(Position(step, 0), Position(step, 5), 7, ColorBuy);
      candles.push(new Candle(oc, hl, v));
      cameraX = step-190;
      cameraY = (c - heightCanvas/2);
      camera.Set(cameraX, cameraY);  

    }
    else { 
      var o = IntToFloat(open, mscale);
      var c = IntToFloat(close, mscale);
      var h = IntToFloat(high, mscale);
      var l = IntToFloat(low, mscale);
     

      var color = o>c?ColorSale:ColorBuy;

      if(oldDate != date)
      {
        candles.shift();
        step+=10;
        var oc = new Line(Position(step, c), Position(step, o), 7, color);
        var hl = new Line(Position(step, h), Position(step, l), 1, color);
        var v = 0;

        if(volume > 10000)
           v = new Line(Position(step, 0), Position(step, 5), 7, ColorSale);
        else
           v = new Line(Position(step, 0), Position(step, 5), 7, ColorBuy);

        candles.push(new Candle(oc, hl, v));
        cameraX = step-190;
        oldDate = date;
      }
      else{
        var id = candles.length - 1;
        candles[id].open_close.Set(Position(step, c), Position(step, o), 7, color);
        candles[id].high_low.Set(Position(step, h), Position(step, l), 1, color);

        if(volume > 10000)
          candles[id].volume.Set(Position(step, 0), Position(step, 5), 7, ColorSale);
        else
          candles[id].volume.Set(Position(step, 0), Position(step, 5), 7, ColorBuy);
      }

      cameraY = (c - heightCanvas/2);
      camera.Set(cameraX, cameraY);
    }
    if(_size == graph.length-1)
    {
      noloadgraph = false;
      if(state == "bull") 
      {
        $("#price").removeClass("price--bear");
        $("#price").addClass("price--bull");
        $("#volume").removeClass("volume--buy");
        $("#volume").addClass("volume--sale");   
      }
      else 
      {
        $("#price").addClass("price--bear");
        $("#price").removeClass("price--bull");
        $("#volume").addClass("volume--buy");
        $("#volume").removeClass("volume--sale"); 
      }

      for(var i = 0; i < $(".prices span").length; i++)
      {
        var pos = $(".prices span").eq(i).position().top;
        $(".prices span").eq(i).html(String(calcPos(pos).toFixed(2)));
      }
      $("#price").html(String(currentPrice));
    }
  }
  if(graph.length != 0)
   size =  graph.length-1;
  setTimeout(calcGraph, 1000/60);
}

function getOrder(_id){
  for(var i = 0; i < orders.length; i++)
    if(orders[i].id == _id) return orders[i];
}

function calcBid(_id)
{
    var i = _id;
    if(bids[i].ccode == currentClass && bids[i].scode == currentSec)
    {
      var isFind = false;
      for(var j = 0; j < orders.length; j++)
        if(orders[j].id == bids[i].id)
          {
            isFind = true;
            //if(bids[i].status == 2)
              //$("#bids .bids_item").eq(j).css("color",orders[j].color);
            if(bids[i].status == 0)
            {
              orders[j].delete();
              $("#bids .bids_item").eq(j).remove();
            }
          }

      if(!isFind && bids[i].status!=0)
      {
        orders.push(new Order(bids[i].id, bids[i].sell?"S":"B", IntToFloat(bids[i].price, fscale), bids[i].count));
        var div = $('<div>', { class: 'bids_item'});
        var del = $('<div>', { class: 'icon'});
        var con = $('<div>', { class: 'text'});
        con.css("color",bids[i].status==1?"#777":(bids[i].sell?"#F00":"#0F0"));
        del.attr("data-id", bids[i].id);
        del.css("width","16px");
        del.css("height","16px");
        del.css("position","relative");
        del.css("margin-left","5px");
        del.css("fill", "#fa1039");
        del.css("cursor", "pointer");
        del.html("<svg class='svg-icon'><use xlink:href='#i-del'></use></svg>");
        del.on("click",function(e){
          var order = getOrder($(this).attr("data-id"));
          if(!order.isActive())
          {
            var id = order.delete();
            port.postMessage({msgid: 10005, id: order.id}); //Отмена ордера
            port.postMessage({msgid: 10006, id: order.id}); //Удаление ордера
            $("#bids .bids_item").eq(id).remove();
          }
          else
          {
            var id = order.delete();
            port.postMessage({msgid: 10006, id: order.id}); //Удаление ордера
            $("#bids .bids_item").eq(id).remove();
          }
        });
        con.html("Order "+(bids[i].sell?"Sell":"Buy")+": № "+bids[i].id+" Price: "+IntToFloat(bids[i].price, fscale)+" Count: "+bids[i].count);
        div.append(con);
        div.append(del);
        $("#bids").append(div);
        $("#bids").scrollTop($("#bids .bids_item").height()*$("#bids .bids_item").length);
      }
    }
}
function calcBids(_u = false)
{
  if(_u)
  {
    for(var b = 0; b < bids.length; b++)
      calcBid(b);
  }
  else
    if(activeIdBid != -1)
    {
      calcBid(findById(activeIdBid, bids));
      activeIdBid = -1;
    }

  if(!_u)
  setTimeout(calcBids, 1000/60);
}
function calcDeal(_id)
{
    var i = _id;
    if(deals[i].ccode == currentClass && deals[i].scode == currentSec)
    {
      for(var j = 0; j < orders.length; j++)
        if(orders[j].id == deals[i].id_order) 
        { 
          orders[j].setActive(true);
          $("#bids .bids_item .text").eq(j).css("color",orders[j].color);
          orders[j].setPrice(deals[i].price);
        }
    } 
}
function calcDeals(_u = false)
{
  if(_u)
  {
    for(var d = 0; d < deals.length; d++)
      calcDeal(d);
  }
  else
    if(activeIdDeal != -1)
    {
      calcDeal(findById(activeIdDeal, deals));
      activeIdDeal = -1;
    }

  if(!_u)
  setTimeout(calcDeals, 1000/60);
}

var currentOrder = 0;
$('#canvas').bind('contextmenu', function(e){
    return false;
});
$('#canvas').mousedown(function(event){
    event.preventDefault();
    if(event.button == 2 && $("#canvas").css("cursor") == "pointer"){
      if(!currentOrder.isActive())
      {
        port.postMessage({msgid: 10005, id: currentOrder.id}); //Отмена ордера
        port.postMessage({msgid: 10006, id: currentOrder.id}); //Удаление ордера
        $("#bids .bids_item").eq(findById(currentOrder.id, orders)).remove();
        currentOrder.delete();
      }
      else
      {
        var id = currentOrder.delete();
        port.postMessage({msgid: 10006, id: id}); //Удаление ордера
        $("#bids .bids_item").eq(id).remove();
        currentOrder = 0;
      }
    }
});
function calcOrders()
{
  var isFind = false;
  currentPriceOrder = 0;
  currentCountOrder = 0;
  for(var i = 0; i < orders.length; i++)
  {
      if(orders[i].Line.isCollision()) 
      {
        $("#canvas").css("cursor","pointer");
        currentOrder = orders[i];
        isFind = true;
      }
      if(!orders[i].sell)
      {
        currentPriceOrder = orders[i].price;
        currentCountOrder = orders[i].count;

        var orderPrice = (currentLot*orders[i].price*orders[i].count).toFixed(2);
        var curPrice = (currentLot*currentPrice*orders[i].count).toFixed(2);
        curPrice = (curPrice - procent(curPrice)) - procent(orderPrice);
        if(orderPrice < curPrice)
        {
          orders[i].Line.SetExLabel("+ "+(curPrice-orderPrice).toFixed(2));
          //$("#bids .bids_item .text").eq(j).css("color",orders[j].color);
        }
        else
          orders[i].Line.SetExLabel("- "+(orderPrice-curPrice).toFixed(2));
      }
      else if(currentCountOrder)
      { 
          var orderPrice = (currentLot*currentPriceOrder*currentCountOrder).toFixed(2);
          var curPrice = (currentLot*orders[i].price*orders[i].count).toFixed(2);
          curPrice = (curPrice - procent(curPrice)) - procent(orderPrice);
          if(orderPrice < curPrice)
            orders[i].Line.SetExLabel("+ "+(curPrice-orderPrice).toFixed(2));
          else
            orders[i].Line.SetExLabel("- "+(orderPrice-curPrice).toFixed(2));
      }
  }
  if(!isFind) 
  {
    $("#canvas").css("cursor","auto");
  }
  setTimeout(calcOrders, 1000/60);
}
function calcLimits()
{
  for(var i = 0; i < limits.length; i++)
  {
    if(limits[i].trdacc == currentTrdacc && limits[i].scode == currentSec)
    {
      currentBalance = (limits[i].cbal>0?limits[i].cbal/currentLot:0);
      $("#blance-info .value").html(currentBalance);
    }
  }
  setTimeout(calcLimits, 1000/60);
}
function Message(data)
{
  //console.log(data.parrent);
  switch(data.msgid)
  {
    case 10000: { //Авторизован
                  $("#auth").addClass("hidden");
                  $(".controlP").removeClass("hidden");
                  $("#trader").removeClass("hidden");
                  setTimeout(function(){
                    port.postMessage({msgid: 10003}); //Загрузка классов
                  }, 3000);
                  setTimeout(function(){
                    port.postMessage({msgid: 2}); //Текущий график
                  },3000);
                  setTimeout(function(){
                    calcBids(true);
                    calcDeals(true);
                  },3000);
                }
                break;
    case 10001: { //PIN
                  $("#authInp").addClass("hidden");
                  $("#pinInp").removeClass("hidden");
                  $(".message").html(data.message);
                }
                break;
    case 10002: { //Сообщение
                  $(".message").html(data.message);
                }
                break;
    case 10003: { //Сообщение терминала
                  $("#terminal_log").html(data.message+"<br><br>"+$("#terminal_log").html());
                }
                break;
    case 11111: {
                  console.log("close");
                }
                break;
    case 10004: { //Текущая цена и график
                  if(size == 0 && data.graph.length != 1) { graph = data.graph; }
                  if(data.graph.length == 1) { graph.shift(); graph.push(data.graph[0]); }
                  graphName = data.name;
                }
                break;
    case 10005: { //Стакан
                  if(data.message == undefined) return;
                  data.message.getPrice = function (price)  {
                                                              for (var i in this) {
                                                                  if(i == price)
                                                                    return this[i];
                                                              }
                                                              return this[i];
                                                            }
                  for(var i = 0; i < $(".prices span").length; i++)
                  {
                    var price = $(".prices span").eq(i).html().replace(".","");
                    var buy = data.message.getPrice(price).b;
                    var sale = data.message.getPrice(price).s;
                    if(buy > 0)
                      $(".stakan span").eq(i).html(String(buy).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
                    else if(sale > 0) $(".stakan span").eq(i).html(String(sale).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '));
                    else $(".stakan span").eq(i).html("0");
                  }
                }
                break;
    case 10006: { //classList
                    classList = data.message;
                    console.log(classList);

                    for(var i = 0; i < classList.length; i++)
                    {

                      var div = $('<div>', { class: 'select_item'});
                      div.attr("data-id", i);
                      div.attr("data-code", classList[i].code);
                      div.html(classList[i].name);
                      div.on("click", function(e){
                        $("#class_inp").val($(this).html());
                        $("#class_inp").attr("data-code",  $(this).attr("data-code"));
                        $("#select_class_inp").css("display", "none");
                        $('#select_graph_inp').html("");
                        var _class = classList[$(this).attr("data-id")];
                        for(var j = 0; j < _class.sections.length; j++)
                        {
                          if($(this).attr("data-code") == String(currentClass) && String(_class.sections[j].code) == String(currentSec))
                          {
                            fscale = Number(_class.sections[j].scale);
                            currentLot = Number(_class.sections[j].lot);
                          }

                          var div = $('<div>', { class: 'select_item'});
                          div.attr("data-id", j);
                          div.attr("data-code", _class.sections[j].code);
                          div.attr("data-scale", _class.sections[j].scale);
                          div.html(_class.sections[j].name+", Лот: "+_class.sections[j].lot);
                          div.on("click", function(e){
                            $("#graph_inp").val($(this).html());
                            $("#select_graph_inp").css("display", "none");
                            $("#graph_inp").attr("data-code", $(this).attr("data-code"));
                            fscale = Number($(this).attr("data-scale"));
                          });
                          div.appendTo('#select_graph_inp');
                        }
                      });
                      div.appendTo('#select_class_inp');
                    }
                }
                break;
    case 10007: {
                    balanses = data.balanses;
                    trdaccs = data.trdaccs;

                    for(var i = 0; i < balanses.length; i++)
                    {
                      var ssum = "\""+balanses[i].ucode+"\""+": ";
                      var sum = 0;
                      currentClient = String(balanses[i].ucode);

                      for(var j = 0; j < balanses[i].valutes.length; j++)
                        for(var k = 0; k < trdaccs.length; k++)
                          if(trdaccs[k].firmid == balanses[i].valutes[j].firmid)
                            for(var l = 0; l < trdaccs[k].classList.length; l++)
                              if(trdaccs[k].classList[l] == currentClass)
                              {
                                currentTrdacc = String(trdaccs[k].trdacc);
                                sum += balanses[i].valutes[j].cbal;
                              }

                     $("#sum").html(sum.toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')+" руб.");
                    }
                }
                break;
    case 10008: {
                  bids = data.bids;
                  activeIdBid = data.activeId;
                }
                break;
    case 10009: {
                  deals = data.deals;
                  activeIdDeal = data.activeId;
                }
                break;
    case 10010: {
                  limits = data.limits;
                }
                break;
  }
}

port.postMessage({msgid: 1}); //Проверка авторизации

$("#connect").on("click", function(e){
  var login = String($("#login").val());
  var passwd = String($("#passwd").val());
  var nameServer = String($("#name_server").val());
  port.postMessage({msgid: 10000, ns:nameServer, login:login, password:passwd});
});

$("#pin").on("keypress", function(e){
  if(e.keyCode == 13 && String($("#pin").val()).length > 0)
  {
    port.postMessage({msgid: 10001, pin:String($("#pin").val())});
  }
});

function Frame(){
 if(!noloadgraph)
  { 
    camera.Set(cameraX, cameraY);
    render(candles, camera, lines);
    render1(candles, camera, lines);
  }
  else
  { 
    ctx.setTransform(1,0,0,1,0,0);
    ctx1.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, widthCnavas, heightCanvas);
    ctx1.clearRect(0, 0, widthCnavas, 10);
    ctx.fillStyle = "#FFF";
    ctx.textBaseline = 'top';
    ctx.font = "12px Arial";
    ctx.lineWidth = 1;  
    ctx.fillText("Загрузка...",widthCnavas/2, heightCanvas/2);
  }
  requestAnimationFrame(Frame);
}


var requestAnimationFrame = (function()
{
    return window.requestAnimationFrame||
            window.webkitRequestAnimationFrame||
            window.mozRequestAnimationFrame||
            window.oRequestAnimationFrame||
            window.msRequestAnimationFrame||
            function(callback)
            { window.setTimeout(callback, 1000 / 60);}
})();

Frame();
calcGraph();
calcBids();
calcDeals();
calcOrders();
calcLimits();