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
  $("#hammer").addClass("hidden");
});
$("#isTerminal").on("click", function(e){
  $(".itemP").removeClass("active");
  $(this).addClass("active");
  $("#trader").addClass("hidden");
  $("#hammer").addClass("hidden");
  $("#terminal").removeClass("hidden");
});
$("#isHammer").on("click", function(e){
  $(".itemP").removeClass("active");
  $(this).addClass("active");
  $("#trader").addClass("hidden");
  $("#hammer").removeClass("hidden");
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
      $("#cursor-info").html(String(calcPos(mouse.y).toFixed(2)));
    }
});
$(".chart").mouseout(function(e){
  $("#cursor-info").css("display", "none");
});
$("#buy").on("click", function(e){
  buy();
});
$("#sale").on("click", function(e){
  sale();
});

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
Line = function(_pos = Position(0, 0),_to = Position(0, 0),_size = 1,_color = "#fff", _label = "")
{
    this.id = tmp++;
    this.pos = _pos;
    this.to = _to;
    this.size = _size;
    this.color = _color;
    this.label = _label;
}
Line.prototype =
{
    constructor: Line,
    Set: function(_pos,_to,_size,_color,_type,_label)
    {
        this.label = _label || this.label;
        this.type = _type || this.type;
        this.color = _color || this.color;
        this.size = _size || this.size;
        this.pos = _pos || this.pos;
        this.to = _to || this.to;
    }
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
Order = function(_id, _price = 0, _count = 0)
{
    this.id = _id;
    this.price = _price;
    this.count = _count;
}
Order.prototype =
{
    constructor: Order
}

var mouse = Position(0 , 0);
var candles = [];
var lines = [];
var camera = Position(0, 0);

var widthCnavas = 200;
var heightCanvas = 210;

$("#cursor-info").css("display", "none");

var canvas = document.getElementById("canvas");
ctx = canvas.getContext('2d');
ctx.fillStyle = "#FFF";
ctx.textBaseline = 'top';
ctx.font = "12px Arial";
ctx.lineWidth = 1;      
ctx.fillText("Загрузка...",widthCnavas/2, heightCanvas/2);

var canvas1 = document.getElementById("canvas1");
ctx1 = canvas1.getContext('2d');
ctx1.fillStyle = "#FFF";
ctx1.textBaseline = 'top';
ctx1.font = "12px Arial";
ctx1.lineWidth = 1;      

function drawLine(_ctx, _data, _camera, _offest = Position(0 ,0), _scale = 1, _fscale = 10, _dash = 0, _flip = 1)
{
  var _p = _data.pos;
  var _t = _data.to;
  var _s = _data.size;
  var _c = _data.color;
  var _type = _data.type;
  var _label = _data.label;
  var _z = _scale;
  _z = !_z?1:_z;

  var x1,x2,y1,y2,scale;

  scale = _z*_fscale;//1+_z/100;
  x1 = _p.x-_camera.x-_offest.x;
  x2 = _t.x-_camera.x-_offest.x;
  y1 = _p.y-_camera.y-_offest.y;
  y2 = _t.y-_camera.y-_offest.y;

  _ctx.setTransform(1,0,0,1,0,0);

  if(_label != "")
  {
    _ctx.beginPath();
    _ctx.setTransform(1,0,0,1,0,_offest.y-10);
    _ctx.fillStyle = "#FFF";
    _ctx.textBaseline = 'top';
    _ctx.font = "8px Arial";
    _ctx.lineWidth = 1;      
    _ctx.fillText(_label, x1, (y1*-scale)); 
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
    _ctx.lineTo(x2, y2);
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

var oldDate = "";
var currentPrice = 0;
var zoom = 12;
var between = 12;
var fixed = 2;
var noloadgraph = true;
var step = 0;
var size = 0;
var cameraX = 0;
var cameraY = 0;
var port = chrome.runtime.connect({name: "popup"});
port.postMessage({msgid: 1}); //Проверка авторизации

chrome.runtime.onConnect.addListener(function(port) {
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

$('.chart').on("click", function(e){

  var price = calcPos(mouse.y);
  var line = new Line(Position(0, price), Position(widthCnavas, price), 1, "#FFF", String(price.toFixed(fixed)));
  lines.push(line);

});

function findById(_id)
{
  for(var i = 0; i < lines.length; i++)
    if(lines[i].id == _id) return i;
}

var orders = [];
var sum = 10000;
var innerSum = $("#sum");
innerSum.html(sum.toFixed(2));

function buy(){
  if(sum > currentPrice*5)
  {
    var line = new Line(Position(0, currentPrice), Position(widthCnavas, currentPrice), 1, "#F00", String(currentPrice.toFixed(fixed)+", 5"));
    lines.push(line);
    orders.push(new Order(line.id, currentPrice, 5));
    sum -= currentPrice*5;
    innerSum.html(sum.toFixed(2));
  }
}
function sale(){
  if(orders.length > 0)
  {
      var order = orders.pop();
      lines.splice(findById(order.id), 1);
      var line = new Line(Position(0, currentPrice), Position(widthCnavas, currentPrice), 1, "#0F0", String(currentPrice.toFixed(fixed)));
      lines.push(line);
      sum += currentPrice*order.count;
      innerSum.html(sum.toFixed(2));
      setTimeout(function() {lines.splice(findById(line.id), 1)}, 5000);
  }
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
function Message(data)
{
  //console.log(data.parrent);
  switch(data.msgid)
  {
    case 10000: { //Авторизован
                  $("#auth").addClass("hidden");
                  $(".controlP").removeClass("hidden");
                  $("#trader").removeClass("hidden");
                  setInterval(function(){if(noloadgraph) port.postMessage({msgid: 10002});}, 3000);
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
    case 10004: { //Текущая цена и график

                  currentPrice = data.message;

                  if(data.state == "bull") 
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
                  $("#nameGraph").html("["+String(data.name)+"]");

                  if(size < data.size && data.size > 1)
                    size = data.size;

                  if(data.size > 1)
                  {
                    oldDate = data.price.date;

                    var o = IntToFloat(data.price.open, 2);
                    var c = IntToFloat(data.price.close, 2);
                    var h = IntToFloat(data.price.high, 2);
                    var l = IntToFloat(data.price.low, 2);

                    var color = o>c?ColorSale:ColorBuy;
                    step+=10;
                    var oc = new Line(Position(step, c), Position(step, o), 7, color);
                    var hl = new Line(Position(step, h), Position(step, l), 1, color);
                    if(data.price.volume > 10000)
                      var v = new Line(Position(step, 0), Position(step, 5), 7, ColorSale);
                    else
                      var v = new Line(Position(step, 0), Position(step, 5), 7, ColorBuy);
                    candles.push(new Candle(oc, hl, v));
                    cameraX = step-190;
                    cameraY = (c - heightCanvas/2);
                    camera.Set(cameraX, cameraY);
                    
                  }
                  else {
                    
                    var o = IntToFloat(data.price.open, 2);
                    var c = IntToFloat(data.price.close, 2);
                    var h = IntToFloat(data.price.high, 2);
                    var l = IntToFloat(data.price.low, 2);
                   

                    var color = o>c?ColorSale:ColorBuy;

                    if(oldDate != data.price.date)
                    {
                      candles.shift();
                      step+=10;
                      var oc = new Line(Position(step, c), Position(step, o), 7, color);
                      var hl = new Line(Position(step, h), Position(step, l), 1, color);
                      var v = 0;

                      if(data.price.volume > 10000)
                         v = new Line(Position(step, 0), Position(step, 5), 7, ColorSale);
                      else
                         v = new Line(Position(step, 0), Position(step, 5), 7, ColorBuy);

                      candles.push(new Candle(oc, hl, v));
                      cameraX = step-190;
                      oldDate = data.price.date;
                    }
                    else{
                      var id = candles.length - 1;
                      candles[id].open_close.Set(Position(step, c), Position(step, o), 7, color);
                      candles[id].high_low.Set(Position(step, h), Position(step, l), 1, color);

                      if(data.price.volume > 10000)
                        candles[id].volume.Set(Position(step, 0), Position(step, 5), 7, ColorSale);
                      else
                        candles[id].volume.Set(Position(step, 0), Position(step, 5), 7, ColorBuy);
                    }

                    cameraY = (c - heightCanvas/2);
                    camera.Set(cameraX, cameraY);
                    
                  }

                  if(candles.length >= size && size) noloadgraph = false;
                  
                }
                break;
    case 10005: { //Стакан
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
  }
}

$("#connect").on("click", function(e){
  var login = String($("#login").val());
  var passwd = String($("#passwd").val());
  port.postMessage({msgid: 10000, login:login, password:passwd});
});

$("#pin").on("keypress", function(e){
  if(e.keyCode == 13 && String($("#pin").val()).length > 0)
  {
    port.postMessage({msgid: 10001, pin:String($("#pin").val())});
  }
});

function Frame(){
 camera.Set(cameraX, cameraY); 
 if(!noloadgraph)
  { 
    render(candles, camera, lines);
    render1(candles, camera, lines);
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