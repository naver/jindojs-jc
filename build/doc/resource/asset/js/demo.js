jindo.Component=jindo.$Class({_htEventHandler:null,_htOption:null,$init:function(){var aInstance=this.constructor.getInstance();aInstance.push(this);this._htEventHandler={};this._htOption={};this._htOption._htSetter={};},option:function(sName,vValue){switch(typeof sName){case"undefined":return this._htOption;case"string":if(typeof vValue!="undefined"){if(sName=="htCustomEventHandler"){if(typeof this._htOption[sName]=="undefined"){this.attach(vValue);}else{return this;}}
this._htOption[sName]=vValue;if(typeof this._htOption._htSetter[sName]=="function"){this._htOption._htSetter[sName](vValue);}}else{return this._htOption[sName];}
break;case"object":for(var sKey in sName){if(sKey=="htCustomEventHandler"){if(typeof this._htOption[sKey]=="undefined"){this.attach(sName[sKey]);}else{continue;}}
this._htOption[sKey]=sName[sKey];if(typeof this._htOption._htSetter[sKey]=="function"){this._htOption._htSetter[sKey](sName[sKey]);}}
break;}
return this;},optionSetter:function(sName,fSetter){switch(typeof sName){case"undefined":return this._htOption._htSetter;case"string":if(typeof fSetter!="undefined"){this._htOption._htSetter[sName]=jindo.$Fn(fSetter,this).bind();}else{return this._htOption._htSetter[sName];}
break;case"object":for(var sKey in sName){this._htOption._htSetter[sKey]=jindo.$Fn(sName[sKey],this).bind();}
break;}
return this;},fireEvent:function(sEvent,oEvent){oEvent=oEvent||{};var fInlineHandler=this['on'+sEvent],aHandlerList=this._htEventHandler[sEvent]||[],bHasInlineHandler=typeof fInlineHandler=="function",bHasHandlerList=aHandlerList.length>0;if(!bHasInlineHandler&&!bHasHandlerList){return true;}
aHandlerList=aHandlerList.concat();oEvent.sType=sEvent;if(typeof oEvent._aExtend=='undefined'){oEvent._aExtend=[];oEvent.stop=function(){if(oEvent._aExtend.length>0){oEvent._aExtend[oEvent._aExtend.length-1].bCanceled=true;}};}
oEvent._aExtend.push({sType:sEvent,bCanceled:false});var aArg=[oEvent],i,nLen;for(i=2,nLen=arguments.length;i<nLen;i++){aArg.push(arguments[i]);}
if(bHasInlineHandler){fInlineHandler.apply(this,aArg);}
if(bHasHandlerList){var fHandler;for(i=0,fHandler;(fHandler=aHandlerList[i]);i++){fHandler.apply(this,aArg);}}
return!oEvent._aExtend.pop().bCanceled;},attach:function(sEvent,fHandlerToAttach){if(arguments.length==1){jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler,sEvent){this.attach(sEvent,fHandler);},this).bind());return this;}
var aHandler=this._htEventHandler[sEvent];if(typeof aHandler=='undefined'){aHandler=this._htEventHandler[sEvent]=[];}
aHandler.push(fHandlerToAttach);return this;},detach:function(sEvent,fHandlerToDetach){if(arguments.length==1){jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler,sEvent){this.detach(sEvent,fHandler);},this).bind());return this;}
var aHandler=this._htEventHandler[sEvent];if(aHandler){for(var i=0,fHandler;(fHandler=aHandler[i]);i++){if(fHandler===fHandlerToDetach){aHandler=aHandler.splice(i,1);break;}}}
return this;},detachAll:function(sEvent){var aHandler=this._htEventHandler;if(arguments.length){if(typeof aHandler[sEvent]=='undefined'){return this;}
delete aHandler[sEvent];return this;}
for(var o in aHandler){delete aHandler[o];}
return this;}});jindo.Component.factory=function(aObject,oOption){var aReturn=[],oInstance;if(typeof oOption=="undefined"){oOption={};}
for(var i=0,el;(el=aObject[i]);i++){oInstance=new this(el,oOption);aReturn[aReturn.length]=oInstance;}
return aReturn;};jindo.Component.getInstance=function(){if(typeof this._aInstance=="undefined"){this._aInstance=[];}
return this._aInstance;};jindo.UIComponent=jindo.$Class({$init:function(){this._bIsActivating=false;},isActivating:function(){return this._bIsActivating;},activate:function(){if(this.isActivating()){return this;}
this._bIsActivating=true;if(arguments.length>0){this._onActivate.apply(this,arguments);}else{this._onActivate();}
return this;},deactivate:function(){if(!this.isActivating()){return this;}
this._bIsActivating=false;if(arguments.length>0){this._onDeactivate.apply(this,arguments);}else{this._onDeactivate();}
return this;}}).extend(jindo.Component);jindo.DragArea=jindo.$Class({$init:function(el,htOption){this.option({sClassName:'draggable',bFlowOut:true,bSetCapture:true,nThreshold:0});this.option(htOption||{});this._el=el;this._bIE=jindo.$Agent().navigator().ie;this._htDragInfo={"bPrepare":false};this._bHandleDown=false;this._bIsDragging=false;this._wfOnMouseDown=jindo.$Fn(this._onMouseDown,this);this._wfOnMouseMove=jindo.$Fn(this._onMouseMove,this);this._wfOnMouseUp=jindo.$Fn(this._onMouseUp,this);this._wfOnDragStart=jindo.$Fn(this._onDragStart,this);this._wfOnSelectStart=jindo.$Fn(this._onSelectStart,this);this.activate();},_findDraggableElement:function(el){if(jindo.$$.test(el,"input[type=text], textarea, select")){return null;}
var self=this;var sClass='.'+this.option('sClassName');var isChildOfDragArea=function(el){if(el===null){return false;}
if(self._el===document||self._el===el){return true;}
return jindo.$Element(self._el).isParentOf(el);};var elReturn=jindo.$$.test(el,sClass)?el:jindo.$$.getSingle('! '+sClass,el);if(!isChildOfDragArea(elReturn)){elReturn=null;}
return elReturn;},isDragging:function(){return this._bIsDragging&&!this._htDragInfo.bPrepare;},stopDragging:function(){this._stopDragging(true);return this;},_stopDragging:function(bInterupted){this._wfOnMouseMove.detach(document,'mousemove');this._wfOnMouseUp.detach(document,'mouseup');var htInfo=this._htDragInfo;if(this.isDragging()){var welDrag=jindo.$Element(htInfo.elDrag);this.fireEvent('dragEnd',{"elArea":this._el,"elHandle":htInfo.elHandle,"elDrag":htInfo.elDrag,"nX":parseInt(welDrag.css("left"),10)||0,"nY":parseInt(welDrag.css("top"),10)||0,"bInterupted":bInterupted});}
this._bIsDragging=false;this._bForceDrag=false;htInfo.bPrepare=false;if(this._bIE&&this._elSetCapture){this._elSetCapture.releaseCapture();this._elSetCapture=null;}},_onActivate:function(){this._wfOnMouseDown.attach(this._el,'mousedown');this._wfOnDragStart.attach(this._el,'dragstart');this._wfOnSelectStart.attach(this._el,'selectstart');},_onDeactivate:function(){this._wfOnMouseDown.detach(this._el,'mousedown');this._wfOnDragStart.detach(this._el,'dragstart');this._wfOnSelectStart.detach(this._el,'selectstart');},attachEvent:function(){this.activate();},detachEvent:function(){this.deactivate();},isEventAttached:function(){return this.isActivating();},startDragging:function(el){var el=this._findDraggableElement(el);if(el){this._bForceDrag=true;this._htDragInfo={bPrepare:true,elHandle:el,elDrag:el};this._wfOnMouseMove.attach(document,'mousemove');this._wfOnMouseUp.attach(document,'mouseup');return true;}
return false;},_onMouseDown:function(we){if(!we.mouse().left||we.mouse().right){this._stopDragging(true);return;}
var el=this._findDraggableElement(we.element);if(el){var oPos=we.pos();this._htDragInfo={bPrepare:true,nButton:we._event.button,elHandle:el,elDrag:el,nPageX:oPos.pageX,nPageY:oPos.pageY};this._bHandleDown=true;if(this.fireEvent('handleDown',{elHandle:el,elDrag:el,weEvent:we})){this._wfOnMouseMove.attach(document,'mousemove');}
this._wfOnMouseUp.attach(document,'mouseup');we.stop(jindo.$Event.CANCEL_DEFAULT);}},_onMouseMove:function(we){this._bIsDragging=true;var htInfo=this._htDragInfo,htParam,htRect,oPos=we.pos();if(htInfo.bPrepare){var nThreshold=this.option('nThreshold');var htDiff={};if(!this._bForceDrag&&nThreshold){htDiff.nPageX=oPos.pageX-htInfo.nPageX;htDiff.nPageY=oPos.pageY-htInfo.nPageY;var nDistance=Math.sqrt(htDiff.nPageX*htDiff.nPageX+htDiff.nPageY*htDiff.nPageY);if(nThreshold>nDistance){return;}}
if(this._bIE&&this.option("bSetCapture")){this._elSetCapture=(this._el===document)?document.body:this._findDraggableElement(we.element);if(this._elSetCapture){this._elSetCapture.setCapture(false);}}
htParam={elArea:this._el,elHandle:htInfo.elHandle,elDrag:htInfo.elDrag,htDiff:htDiff,weEvent:we};if(this.fireEvent('dragStart',htParam)){var welDrag=jindo.$Element(htParam.elDrag);htInfo.bPrepare=false;htInfo.elHandle=htParam.elHandle;htInfo.elDrag=htParam.elDrag;htInfo.nX=parseInt(welDrag.css('left'),10)||0;htInfo.nY=parseInt(welDrag.css('top'),10)||0;var htOffset=welDrag.offset();htInfo.nClientX=htOffset.left+welDrag.width()/2;htInfo.nClientY=htOffset.top+welDrag.height()/2;}else{this._bIsDragging=false;return;}}
var htGap={"nX":oPos.pageX-htInfo.nPageX,"nY":oPos.pageY-htInfo.nPageY};if(this._bForceDrag){htGap.nX=oPos.clientX-htInfo.nClientX;htGap.nY=oPos.clientY-htInfo.nClientY;}
htParam={"elArea":this._el,"elFlowOut":htInfo.elDrag.parentNode,"elHandle":htInfo.elHandle,"elDrag":htInfo.elDrag,"weEvent":we,"nX":htInfo.nX+htGap.nX,"nY":htInfo.nY+htGap.nY,"nGapX":htGap.nX,"nGapY":htGap.nY};if(this.fireEvent('beforeDrag',htParam)){var elDrag=htInfo.elDrag;if(this.option('bFlowOut')===false){var elParent=htParam.elFlowOut,aSize=[elDrag.offsetWidth,elDrag.offsetHeight],nScrollLeft=0,nScrollTop=0;if(elParent==document.body){elParent=null;}
if(elParent&&aSize[0]<=elParent.scrollWidth&&aSize[1]<=elParent.scrollHeight){htRect={nWidth:elParent.clientWidth,nHeight:elParent.clientHeight};nScrollLeft=elParent.scrollLeft;nScrollTop=elParent.scrollTop;}else{var htClientSize=jindo.$Document().clientSize();htRect={nWidth:htClientSize.width,nHeight:htClientSize.height};}
if(htParam.nX!==null){htParam.nX=Math.max(htParam.nX,nScrollLeft);htParam.nX=Math.min(htParam.nX,htRect.nWidth-aSize[0]+nScrollLeft);}
if(htParam.nY!==null){htParam.nY=Math.max(htParam.nY,nScrollTop);htParam.nY=Math.min(htParam.nY,htRect.nHeight-aSize[1]+nScrollTop);}}
if(htParam.nX!==null){elDrag.style.left=htParam.nX+'px';}
if(htParam.nY!==null){elDrag.style.top=htParam.nY+'px';}
this.fireEvent('drag',htParam);}},_onMouseUp:function(we){this._stopDragging(false);var htInfo=this._htDragInfo;if(this._bHandleDown){this._bHandleDown=false;this.fireEvent("handleUp",{weEvent:we,elHandle:htInfo.elHandle,elDrag:htInfo.elDrag});}},_onDragStart:function(we){if(this._findDraggableElement(we.element)){we.stop(jindo.$Event.CANCEL_DEFAULT);}},_onSelectStart:function(we){if(this._bIsDragging||this._findDraggableElement(we.element)){we.stop(jindo.$Event.CANCEL_DEFAULT);}}}).extend(jindo.UIComponent);

var demo = (function(){
	var openWindow = function(sUrl) {
		window.open(sUrl, '_blank');
	};

	var init = function(aDemo) {
		var a = [];
		a.push('<div class="buttons">');
		a.push('	<button class="openWindow" type="button">Open as new window</button>');
		//a.push('	<button class="viewSource" type="button">View source</button></div>');
		a.push('</div>');
		a.push('<ol id="demo_list">');
		a.push('{for i:demo in demos}	<li {if i==0}class="selected"{/if}><a href="{=demo.url}" target="demo_iframe">{=demo.title}</a></li>{/for}');
		a.push('</ol>');
		a.push('<div class="iframe_container">');
		a.push('	<iframe name="demo_iframe" src="' + aDemo[0].url + '" frameborder="0"></iframe>');
		a.push('	<div id="iframe_resizebar" class="draggable"></div>');
		a.push('</div>');
		a.push('<div id="desc" class="desc">' + aDemo[0].desc + '</div>');
		var sTemplate = a.join("\n");
		$("demo").innerHTML = $Template(sTemplate).process({demos : aDemo});
		var elIframe = $$.getSingle("iframe[name=demo_iframe]");
		var welIframe = $Element(elIframe);
		var waLi = $A($$("li", $("demo_list")));
		
		$Fn(function(we){
			we.stop();
			var wel = $Element(we.element);
			switch (we.element.tagName.toLowerCase()) {
				case "button" :
					var sUrl = elIframe.src;
					if(wel.hasClass("openWindow")) {
						demo.openWindow(sUrl);
					}
					//if(wel.hasClass("viewSource")) viewSource(sUrl);
					break;
				case "a" :
					$Element($$.getSingle("li.selected")).removeClass("selected");
					$$.getSingle("iframe[name=demo_iframe]").src = wel.$value().href;
					wel.parent().addClass("selected");
					$("desc").innerHTML = aDemo[waLi.indexOf(wel.parent().$value())].desc;
					break;
			}
		}).attach($("demo"), "click");
		
		var welCover = $Element($("<div style='position:absolute;top:0;left:0;background-color:#fff;'></div>"));
		
		new jindo.DragArea($("demo"), {
			bSetCapture : false
		}).attach({
			dragStart : function(oCustomEvent) {
				welCover.appendTo(elIframe.parentNode);
				welCover.width(welIframe.width()).height(welIframe.height());
				welCover.opacity(0.5);
				this._nIframeHeight = welIframe.height();
			},
			beforeDrag : function(oCustomEvent) {
				oCustomEvent.stop();
				var nNewHeight = Math.max(200, this._nIframeHeight + oCustomEvent.nGapY);
				welIframe.height(nNewHeight);
				welCover.height(nNewHeight);
			},
			dragEnd : function(oCustomEvent) {
				welCover.leave();
			}
		});
	};
	
	return {
		openWindow : openWindow,
		init : init
	};
}());

$Fn(function(we){
	if (typeof aDemo != "undefined" && aDemo.length > 0) {
		demo.init(aDemo);
	}
	
	var elCustomEventTable = $$.getSingle("table.customevent");
	if (elCustomEventTable) {
		$Element(elCustomEventTable).delegate("click", "tr.title", function(we){
			var welNext = $Element(we.element).next();
			if (welNext.test("tr.desc")) {
				welNext.toggle();
			}
		});
	}
	
	var elMethodTable = $$.getSingle("table.method");
	if (elMethodTable) {
		$Element(elMethodTable).delegate("click", "tr.title", function(we){
			var welNext = $Element(we.element).next();
			if (welNext.test("tr.desc")) {
				welNext.toggle();
			}
		});
	}
}).attach(window,"load");
