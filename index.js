Ext.apply(Ext.data.SortTypes,{asPrice:function(a){if((""+a).length==0){return 0
}return parseFloat(removeWhitespaces(a))
},asTime:function(b){var a=""+b;
if(a.length<7){return 0
}if(a.length<8){a="0"+a
}return parseFloat(preprocess4Sort(a))
},asDate:function(e){var a=""+e;
if(a.length<9){return 0
}if(a=="GTC"||a=="�� ������"){return Number.MAX_VALUE-1
}if(a.substr(2,1)=="."){if(a.length<10){a="0"+a
}var c=a.substr(0,2);
var d=a.substr(3,2);
var b=a.substr(6,4);
a=""+b+d+c
}else{if(a.substr(4,1)=="."){var c=a.substr(0,4);
var d=a.substr(5,2);
var b=a.substr(7,4);
a=""+b+d+c
}else{return 0
}}return parseFloat(preprocess4Sort(a))
},asNumber:function(a){return parseFloat(preprocess4Sort(a))
}});
var needCheckServer=false;
var serverCheckJob;
startServerChecker=function(){needCheckServer=true;
var a=function(){if(!needCheckServer){clearInterval(serverCheckJob);
return
}var b=new XMLHttpRequest();
b.open("GET","settings.xml",true);
b.onerror=function(){if(needCheckServer){location.reload()
}};
b.timeout=3000;
b.ontimeout=function(){if(needCheckServer){location.reload()
}};
b.send()
};
serverCheckJob=setInterval(a,5*60*1000)
};
stopServerChecker=function(){needCheckServer=false;
if(serverCheckJob!=null){clearInterval(serverCheckJob)
}};
startServerChecker();
var numeric1Test=/^[0-9]*$/;
var alphanum1Test=/^[a-zA-Z0-9]*$/;
var alphanum2Test=/^[a-zA-Z0-9_-]*$/;
var alphanum3Test=[/^[a-zA-Z0-9_-]*$/,/[a-z]/,/[A-Z]/,/[0-9]/];
var alphanum4Test=/^[-a-zA-Z0-9а-яА-ЯёЁ_:;!@()\?]+[-a-zA-Z0-9а-яА-ЯёЁ_,:;!=@.+()\? ]*$/;
Ext.apply(Ext.form.field.VTypes,{numeric1:function(b,a){return numeric1Test.test(b)
},numeric1Text:Ext.form.field.VTypes.numeric1Test,alphanum1:function(b,a){return alphanum1Test.test(b)
},alphanum1Text:Ext.form.field.VTypes.alphanum1Test,alphanum2:function(b,a){return alphanum2Test.test(b)
},alphanum2Text:Ext.form.field.VTypes.alphanum2Test,alphanum3:function(c,b){for(var a=0;
a<alphanum3Test.length;
a++){if(!alphanum3Test[a].test(c)){return false
}}return true
},alphanum3Text:Ext.form.field.VTypes.alphanum3Test,alphanum4:function(c,b){var a=c.split("\u000A").join("");
return alphanum4Test.test(a)
},alphanum4Text:Ext.form.field.VTypes.alphanum4Test});
Ext.define("webquik.menu.Menu",{override:"Ext.menu.Menu",onMouseLeave:function(b){var d=this.activeItem,c=d&&d.menu,a=c&&c.getEl();
if(Ext.isChrome&&a&&a.contains(b.getRelatedTarget())){return
}this.callParent([b])
}});
Ext.define("webquik.tip.ToolTip",{override:"Ext.tip.ToolTip",onShow:function(){if(!device.mobile()){this.callParent()
}}});
Ext.define("webquik.view.Table",{override:"Ext.view.Table",autoSizeColumn:function(a){if(Ext.isNumber(a)){a=this.getGridColumns()[a]
}if(a){if(a.isGroupHeader){a.autoSize();
return
}delete a.flex;
a.setWidth(this.getMaxContentWidth(a))
}},getMaxContentWidth:function(d){var f=this,l=f.el.query(d.getCellInnerSelector()),b=d.getWidth(),c=0,e=l.length,j=Ext.supports.ScrollWidthInlinePaddingBug,a=f.body.select(f.getColumnSizerSelector(d)),g=Math.max,k=0,h;
if(j&&e>0){k=f.getCellPaddingAfter(l[0])
}a.setWidth(1);
h=d.textEl.dom.offsetWidth+d.titleEl.getPadding("lr");
for(;
c<e;
c++){h=g(h,l[c].scrollWidth)
}if(j){h+=k
}h=g(h,40);
a.setWidth(b);
return h
}});
WQM_SUFFIX="_m";
function setWQM(a){if(a){_M=WQM_SUFFIX;
if(!device.mobile()){window.localStorage._M=WQM_SUFFIX
}}else{_M="";
if(!device.mobile()){delete window.localStorage._M
}}Ext.define("webquik.panel.Tool",{override:"Ext.panel.Tool",initComponent:function(){this.callParent(arguments);
if(device.mobile()){this.width=30;
this.padding="0 7 0 8"
}}});
Ext.define("webquik.grid.column.Column",{override:"Ext.grid.column.Column",cls:device.mobile()?"column"+_M:""});
Ext.define("webquik.menu.Menu",{override:"Ext.menu.Menu",initComponent:function(){this.callParent(arguments);
if(device.mobile()){this.setAutoScroll(true);
this.setOverflowXY("hidden","auto");
this.addCls("menu"+_M)
}}})
}_D_M=device.mobile();
setWQM(window.localStorage._M||_D_M);
C_S_DELIM="\u00A6";
CALC_PORTFOLIO_DELIM=" | ";
CALC_PORTFOLIO_DEF_CURR="SUR";
CALC_PORTFOLIO_DEF_TAG="EQTV";
NODE_HIGHLIGHT_DURATION=900;
NODE_HIGHLIGHT_STEPS=2;
DEFAULT_CHART_UPDATE_FREQUENCY=0.5;
_LOGIN="";
THEME_AUX_CLASS=device.mobile()?" dark":"";
THEME_ICONS=device.mobile()?"/dark":"";
document.getElementById("access").disabled=!device.mobile();
document.getElementById("gray").disabled=device.mobile();
document.getElementById("wq-access").disabled=!device.mobile();
document.getElementById("wq-gray").disabled=device.mobile();
if(localStorage.getItem("theme")=="access"){document.getElementById("access").disabled=false;
document.getElementById("gray").disabled=true;
document.getElementById("wq-access").disabled=false;
document.getElementById("wq-gray").disabled=true;
THEME_AUX_CLASS=" dark";
THEME_ICONS="/dark"
}if(localStorage.getItem("theme")=="gray"){document.getElementById("access").disabled=true;
document.getElementById("gray").disabled=false;
document.getElementById("wq-access").disabled=true;
document.getElementById("wq-gray").disabled=false;
THEME_AUX_CLASS="";
THEME_ICONS=""
}function onLStorage(a){}Ext.define("webquik.app.Controller",{override:"Ext.app.Controller",wnd:window});
Ext.define("webquik.panel.AbstractPanel",{override:"Ext.panel.AbstractPanel",wnd:window});
window.onbeforeunload=function(){if(device.mobile()){if(webquik.app.wqctrls.statusCheckerCtrl.appload){return"webQUIK"
}return
}if(window.mainWin){webquik.app.wqctrls.winsCtrl.delAllExcludeMain();
return
}var e=[];
var g=webquik.app.wqviews;
for(var c in g){if(Ext.isArray(g[c])){e.push(g[c])
}}g=webquik.app.wqviews.charts;
for(var c in g){e.push(g[c])
}g=webquik.app.wqviews.quotes;
for(var c in g){e.push(g[c])
}for(var f=0;
f<e.length;
f++){var b=e[f];
var d=b.length-1;
while(d>=0){var a=b[d];
if(a.wnd){if(a.wnd===window){a.destroy()
}}else{wsSendJse('Attempt to unregister an object without property "wnd", xtype: '+a.xtype+", id: "+a.id)
}d--
}}e=[];
g=webquik.app.wqctrls;
for(var c in g){if(Ext.isArray(g[c])){e.push(g[c])
}}for(var f=0;
f<e.length;
f++){var b=e[f];
var d=b.length-1;
while(d>=0){var a=b[d];
if(a.wnd){if(a.wnd===window){if(a.unbookCurrPairs){a.unbookCurrPairs()
}else{if(a.unregisterOrderCtrl){a.unregisterOrderCtrl()
}else{if(a.unbookRfs){a.unbookRfs()
}else{b.splice(d,1)
}}}}}else{wsSendJse('Attempt to unregister an object without property "wnd", xtype: '+a.xtype+", id: "+a.id)
}d--
}}};
Ext.application({name:"webquik",appFolder:"classes",requires:["webquik.PortalPanel","webquik.Portlet","webquik.PortalColumn","webquik.PortalDropZone","webquik.FxDropZone","webquik.WqWebSocket","Ext.ux.form.MultiSelect","Ext.ux.form.ItemSelector"],views:["Login","PasswordChange","TopToolbar","Portal","SecurityTree","NewTabGrid","grid.ClearSortGrid","grid.Orders","grid.StopOrders","grid.Trades","grid.CashLimits","grid.DepoLimits","grid.FutClientLimits","grid.FutClientPos","grid.ClientPortfolio","grid.BuySell","grid.MessagesGrid","grid.DetailedInfoGrid","grid.SecurityInfo","grid.Params","grid.News","grid.Mnp","QuoteGrid","ChartPanel","ChartSettings","window.NewOrder","window.NewOrderTab1","window.NewOrderTab2","window.NewOrderTab3","window.SecurityInfoWindow","window.MessagesWindow","window.NewMnp","window.CancelMnp","window.ConfirmMnp","window.NewSecurityList","window.AddReceiver","indicator.Price","indicator.Volume","indicator.MA","indicator.Bollinger","indicator.AO","indicator.MACD","indicator.Momentum","indicator.RSI","indicator.Stochastic","ColorSelector","SecuritySearch","SearchResults","MySecursTabGrid","MessagePanel","CustomPortlet","CustomTabPanel","NewTabButton","ThemeSwitcher","fx.CurrPairsPanel","fx.CurrPairEntry","fx.CurrPairLadder","fx.CurrChoiceBtn","fx.BaseCurrPairBlock","fx.PlusCurrPairBlock","fx.AddCurrPairDialog","fx.Spread","fx.OrderVolume","fx.CPLevel","fx.LevelOrderVolume","fx.QuotePan","fx.NewCPOrder","fx.ContainerHBox","fx.SettleDateField","fx.AutoDPSNumberField","fx.RequestForStream","fx.ContainerHBoxRFS","fx.InformPanelRFS","fx.InformQuotesRFS","fx.InformQuotesRFSLine","fx.CountDownTimer","fx.CurrPairsChoiceCombo","WinsGrid","SecuritySearchCombo","Portal_m","TopToolbar_m","ChartPanel_m"],controllers:["login","passwordchange","Portal","NewTabGrid","StatusChecker","OrdersUpdate","StopOrdersUpdate","TradesUpdate","CashLimitsUpdate","DepoLimitsUpdate","FutClientLimitsUpdate","FutClientPosUpdate","ClientPortfolioUpdate","BuySellUpdate","UpdateMessages","TranReply","pinview","UserProperties","ParamsUpdate","LastChange","search","NewsUpdate","ClassUpdate","fx.CtrlCurrPair","fx.CtrlNewCPOrder","fx.CtrlRequestForStream","CtrlWins","CtrlSecurityLists","CtrlWSocket","CtrlTrdAccsList","CtrlClientCodesList","LocalStorageCtrl","CtrlSettings","CtrlCustomPortlet_m","CtrlMnp"],models:["OrderModel","StopOrderModel","TradesModel","CashLimitsModel","DepoLimitsModel","FutClientLimitsModel","FutClientPosModel","ClientPortfolioModel","SecurityTree","MessagesModel","SearchResultsTreeModel","DetailedInfoModel","BuySellModel","ParamModel","SecuritySearchModel","NewOrderClass","NewOrderSecurity","NewOrderAccount","NewOrderClientCode","NewsModel","MnpModel"],stores:["OrderStore","StopOrderStore","TradesStore","CashLimitsStore","DepoLimitsStore","FutClientLimitsStore","FutClientPosStore","ClientPortfolioStore","SecurityInfoStore","SearchResultsTreeStore","MessagesStore","DetailedInfoStore","BuySellStore","SecuritySearchStore","NewOrderClass","NewOrderSecurity","NewOrderAccount","NewOrderClientCode","NewsStore","MnpStore"],launch:function(){if(window.WebSocket){webquik.app.is20000Processed=false;
delete Ext.tip.Tip.prototype.minWidth;
Ext.EventManager.addListener(Ext.getBody(),"keydown",function(d){var c=d.getTarget().type;
if(c!="text"&&c!="textarea"&&c!="password"&&d.getKey()=="8"){d.preventDefault()
}});
Ext.util.Format.thousandSeparator=" ";
window.addEventListener("wheel",onWheel);
addEvent(window,"storage",onLStorage);
var a=false;
try{a=window.opener&&window.opener.webquik&&window.opener.webquik.app.wins
}catch(b){}if(a&&!device.mobile()){webquik.app.wins=window.opener.webquik.app.wins;
webquik.app.wqsetts=window.opener.webquik.app.wqsetts;
webquik.app.data=window.opener.webquik.app.data;
webquik.app.wqctrls=window.opener.webquik.app.wqctrls;
webquik.app.wqstores=window.opener.webquik.app.wqstores;
webquik.app.wqviews=window.opener.webquik.app.wqviews;
webquik.app.portfolioCalcParams=window.opener.webquik.app.portfolioCalcParams;
Ext.create("Ext.container.Viewport",{layout:{align:"middle",pack:"center",type:"hbox"},listeners:{afterrender:function(){webquik.app.getController("login").resigninuser()
}}})
}else{webquik.app.wqctrls={};
webquik.app.wqctrls.lastChangeCtrls=[];
webquik.app.wqctrls.detailedInfoGridCtrls=[];
webquik.app.wqctrls.orderTabCtrls=[];
webquik.app.wqctrls.requestForStreamCtrls=[];
webquik.app.wqctrls.currPairsCtrls=[];
webquik.app.wqctrls.loginCtrl=webquik.app.getController("login");
webquik.app.wqctrls.wSocketCtrl=webquik.app.getController("CtrlWSocket");
webquik.app.wqctrls.passwordchangeCtrl=webquik.app.getController("passwordchange");
webquik.app.wqctrls.userPropertiesCtrl=webquik.app.getController("UserProperties");
webquik.app.wqctrls.paramsUpdateCtrl=webquik.app.getController("ParamsUpdate");
webquik.app.wqctrls.statusCheckerCtrl=webquik.app.getController("StatusChecker");
webquik.app.wqctrls.cashLimitsUpdateCtrl=webquik.app.getController("CashLimitsUpdate");
webquik.app.wqctrls.tradesUpdateCtrl=webquik.app.getController("TradesUpdate");
webquik.app.wqctrls.ordersUpdateCtrl=webquik.app.getController("OrdersUpdate");
webquik.app.wqctrls.stopOrdersUpdateCtrl=webquik.app.getController("StopOrdersUpdate");
webquik.app.wqctrls.currPairsCtrl=webquik.app.getController("fx.CtrlCurrPair");
webquik.app.wqctrls.tranReplyCtrl=webquik.app.getController("TranReply");
webquik.app.wqctrls.updateMessagesCtrl=webquik.app.getController("UpdateMessages");
webquik.app.wqctrls.clientPortfolioUpdateCtrl=webquik.app.getController("ClientPortfolioUpdate");
webquik.app.wqctrls.buySellUpdateCtrl=webquik.app.getController("BuySellUpdate");
webquik.app.wqctrls.newsUpdateCtrl=webquik.app.getController("NewsUpdate");
webquik.app.wqctrls.searchCtrl=webquik.app.getController("search");
webquik.app.wqctrls.futClientPosUpdateCtrl=webquik.app.getController("FutClientPosUpdate");
webquik.app.wqctrls.futClientLimitsUpdateCtrl=webquik.app.getController("FutClientLimitsUpdate");
webquik.app.wqctrls.depoLimitsUpdateCtrl=webquik.app.getController("DepoLimitsUpdate");
webquik.app.wqctrls.trdAccsListCtrl=webquik.app.getController("CtrlTrdAccsList");
webquik.app.wqctrls.clientCodesListCtrl=webquik.app.getController("CtrlClientCodesList");
webquik.app.wqctrls.classUpdateCtrl=webquik.app.getController("ClassUpdate");
webquik.app.wqctrls.winsCtrl=webquik.app.getController("CtrlWins");
webquik.app.wqctrls.settingsCtrl=webquik.app.getController("CtrlSettings");
webquik.app.wqctrls.localStorageCtrl=webquik.app.getController("LocalStorageCtrl");
webquik.app.wqctrls.mnpCtrl=webquik.app.getController("CtrlMnp");
webquik.app.wqstores={};
webquik.app.wqstores.securityTreeStore;
webquik.app.wqstores.messagesStore=webquik.app.getStore("MessagesStore");
webquik.app.wqstores.cashLimitsStore=webquik.app.getStore("CashLimitsStore");
webquik.app.wqstores.tradesStore=webquik.app.getStore("TradesStore");
webquik.app.wqstores.orderStore=webquik.app.getStore("OrderStore");
webquik.app.wqstores.stopOrderStore=webquik.app.getStore("StopOrderStore");
webquik.app.wqstores.clientPortfolioStore=webquik.app.getStore("ClientPortfolioStore");
webquik.app.wqstores.buySellStore=webquik.app.getStore("BuySellStore");
webquik.app.wqstores.newsStore=webquik.app.getStore("NewsStore");
webquik.app.wqstores.securitySearchStore=webquik.app.getStore("SecuritySearchStore");
webquik.app.wqstores.futClientPosStore=webquik.app.getStore("FutClientPosStore");
webquik.app.wqstores.futClientLimitsStore=webquik.app.getStore("FutClientLimitsStore");
webquik.app.wqstores.depoLimitsStore=webquik.app.getStore("DepoLimitsStore");
webquik.app.wqstores.mnpStore=webquik.app.getStore("MnpStore");
webquik.app.wqviews={};
webquik.app.wqviews.charts={};
webquik.app.wqviews.quotes={};
webquik.app.wqviews.paramsGrids=[];
webquik.app.wqviews.mySecsGrids=[];
webquik.app.wqviews.cashLimits=[];
webquik.app.wqviews.trades=[];
webquik.app.wqviews.orders=[];
webquik.app.wqviews.stopOrders=[];
webquik.app.wqviews.messagesGrids=[];
webquik.app.wqviews.clientPortfolioGrids=[];
webquik.app.wqviews.buySellGrids=[];
webquik.app.wqviews.newsGrids=[];
webquik.app.wqviews.securityInfoGrids=[];
webquik.app.wqviews.futClientPosGrids=[];
webquik.app.wqviews.futClientLimitsGrids=[];
webquik.app.wqviews.depoLimits=[];
webquik.app.wqviews.mnpGrids=[];
webquik.app.data={};
webquik.app.wqsetts={wss_host_n_port:window.location.hostname+":"+(window.location.port?window.location.port:"443"),alert_days_for_pass_change:5,data_wait_timeout:300,mnp_timeout:10000,show_graf:GRAF_D3,max_table_rows:1000,mobile_vertical_rows:30};
DATA_WAIT_TIMEOUT=webquik.app.wqsetts.data_wait_timeout;
webquik.app.wqctrls.settingsCtrl.requestSettings();
Ext.create("Ext.container.Viewport",{layout:{align:"middle",pack:"center",type:"hbox"},items:[{xtype:"loginview"}]})
}}else{document.write(Locale.message.notSupportMsg)
}}});
Ext.Error.handle=function(a){console.dir(a);
wsSendJse("sourceClass: "+a.sourceClass+", sourceMetod: "+a.sourceMetod+", msg: "+a.msg)
};
window.onerror=function(c,b,a){wsSendJse(a+" : "+b+" : "+c)
};
function wsSendJse(a){if(webquik.app.wqctrls.wSocketCtrl){webquik.app.wqctrls.wSocketCtrl.sendJseLog(a)
}else{webSocket.send('{"msgid":10007,"error":"'+a+'"}')
}}function getSortTypeByParamType(a){switch(a){case 0:return"asPrice";
case 1:return"asPrice";
case 2:return null;
case 3:return"asDate";
case 4:return"asTime";
case 5:return"asPrice";
default:return null
}}function getActualCurrCode(b){var a=b;
switch(b){case"SUR":case"RUR":case"RUB":a="RUB";
break;
default:}return a
}function onWheel(){var a=Ext.get(Ext.Element.getActiveElement());
if(a&&(a.id==sessionStorage.getItem("headerMenuId"))){a.hide()
}}(function(){MsgidCounter={mapIdName:{20000:"Авторизация",20001:"Запрос PIN",20002:"Ответ на запрос длины пароля",20003:"Ответ на запрос смены пароля",20004:"Сообщения авторизации",20005:"Результат сохранения профиля",20008:"Статус соединения",20014:"Сообщения сервера",21000:"Классы",21001:"Заявки",21003:"Сделки",21004:"Денежн.лимиты",21005:"Бумаж.лимиты",21006:"Ограничения",21007:"Позиции",21008:"Сообщения брокера",21009:"Ответы на транзакции",21011:"Основные торги",t21011:"Торги для ТТП",21012:"Купить/Продать",21013:"Портфель",21014:"Стаканы",21015:"Ответ по RFS",21016:"Графики",21017:"Новости",21018:"Тексты новостей",21019:"Валютные пары",21020:"Инфо по бумаге",21021:"Котировки RFS",21022:"Торговые счета",21023:"Торги по вал.парам",21024:"Список вал.пар",22000:"Ответ по заявке",22001:"Ответ по стоп-заявке",22002:"Ответ по связ.стоп-заявке",22003:"Ответ по услов.стоп-заявке",22004:"Ответ по FX-заявке",22100:"Ответ по снятию заявки",22101:"Ответ по снятию стоп-заявки"},start:function(a){a=a||60;
this.startTime=Date.now();
this.msgids={};
if(!localStorage.MsgidCounter){localStorage.MsgidCounter="{msgids:{}}"
}this.interval=1000;
this.secunds=0;
this.task=setInterval(this.intermediate,this.interval,this,a)
},stop:function(){this.startTime=undefined;
clearInterval(this.task);
this.task=undefined
},reset:function(){this.startTime=Date.now();
this.msgids={};
localStorage.MsgidCounter="{msgids:{}}"
},intermediate:function(b,c){cl("intermediate: "+b.secunds);
if(!b.startTime){return
}b.secunds=Number.parseInt((Date.now()-b.startTime)/1000);
var d;
for(var a in b.msgids){d=b.msgids[a];
d[b.secunds]=d.c
}localStorage.MsgidCounter=Ext.JSON.encode(b);
if(b.secunds>=c){b.stop();
b.showBySecunds()
}},countMsgid:function(e){var d=e.msgid;
if(d==21011){answ:for(var c in e.dataResult){for(var b in e.dataResult[c]){if(b!=="last"&&b!=="lastchange"&&b!=="bid"&&b!=="offer"){d="t21011";
break answ
}}}}this.msgids[d]=this.msgids[d]?this.msgids[d]:{c:0};
var a=this.msgids[d].c;
this.msgids[d].c=a?++a:1;
this.msgids[d].t=Date.now()-this.startTime;
console.log(this.getStrMsgid(d,this.msgids));
localStorage.MsgidCounter=Ext.JSON.encode(this)
},getStrMsgid:function(a,b){return a+": "+b[a].c+" in "+Number.parseInt(b[a].t/1000)
},showMsgids:function(){this.msgids=Ext.JSON.decode(localStorage.MsgidCounter).msgids;
console.dir(this.msgids);
for(var a in this.msgids){console.log(this.getStrMsgid(a,this.msgids))
}},showBySecunds:function(){var g=" ¦ ";
var c=[];
var h=[];
var o=0;
var d;
for(var a in this.msgids){d=-1;
for(var p in this.msgids[a]){c[++d]=p;
var k=Number(p);
if(k){o=Math.max(o,p)
}}break
}for(var a in this.msgids){h[a]=[];
d=-1;
for(var p in this.msgids[a]){h[a][++d]=this.msgids[a][p]
}}var l,f=[];
for(var b in h){var n=h[b];
var m=0;
for(var e=1;
e<n.length-2;
e++){m=Math.max(m,n[e]-n[e-1])
}f[b]={};
f[b]["name"]=this.mapIdName[b];
f[b][c[c.length-3]+" sec"]=n[n.length-3];
f[b]["avg"]=+((n[n.length-3]/c[c.length-3]).toFixed(2));
f[b]["max"]=m;
l=b+g+n[n.length-3]+g+n[n.length-2]
}console.table(f)
}}
})();