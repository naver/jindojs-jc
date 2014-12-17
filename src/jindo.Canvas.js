/**
	@version #__VERSION__#
**/

// Copyright 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var G_vmlCanvasManager;
if(!document.createElement('canvas').getContext){(function(){var m=Math,mr=m.round,ms=m.sin,mc=m.cos,abs=m.abs,sqrt=m.sqrt,Z=10,Z2=Z/2,slice=Array.prototype.slice,dec2hex=[];for(var i=0;i<16;i++){for(var j=0;j<16;j++){dec2hex[i*16+j]=i.toString(16)+j.toString(16);}}
function getContext(){return this.context_||(this.context_=new CanvasRenderingContext2D_(this));}
function bind(f,obj,var_args){var a=slice.call(arguments,2);return function(){return f.apply(obj,a.concat(slice.call(arguments)));};}
var G_vmlCanvasManager_={init:function(opt_doc){if(/MSIE/.test(navigator.userAgent)&&!window.opera){var doc=opt_doc||document;doc.createElement('canvas');doc.attachEvent('onreadystatechange',bind(this.init_,this,doc));}},init_:function(doc){if(!doc.namespaces['g_vml_']){doc.namespaces.add('g_vml_','urn:schemas-microsoft-com:vml','#default#VML');}
if(!doc.namespaces['g_o_']){doc.namespaces.add('g_o_','urn:schemas-microsoft-com:office:office','#default#VML');}
if(!doc.styleSheets['ex_canvas_']){var ss=doc.createStyleSheet();ss.owningElement.id='ex_canvas_';ss.cssText='canvas{display:inline-block;overflow:hidden;'+'text-align:left;width:300px;height:150px}'+'g_vml_\\:*{behavior:url(#default#VML)}'+'g_o_\\:*{behavior:url(#default#VML)}';}
var els=doc.getElementsByTagName('canvas');for(var i=0;i<els.length;i++){this.initElement(els[i]);}},initElement:function(el){if(!el.getContext){el.getContext=getContext;el.innerHTML='';el.attachEvent('onpropertychange',onPropertyChange);el.attachEvent('onresize',onResize);var attrs=el.attributes;if(attrs.width&&attrs.width.specified){el.style.width=attrs.width.nodeValue+'px';}else{el.width=el.clientWidth;}
if(attrs.height&&attrs.height.specified){el.style.height=attrs.height.nodeValue+'px';}else{el.height=el.clientHeight;}}
return el;}};G_vmlCanvasManager_.init();function onPropertyChange(e){var el=e.srcElement;switch(e.propertyName){case'width':el.style.width=el.attributes.width.nodeValue+'px';el.getContext().clearRect();break;case'height':el.style.height=el.attributes.height.nodeValue+'px';el.getContext().clearRect();break;}}
function onResize(e){var el=e.srcElement;if(el.firstChild){el.firstChild.style.width=el.clientWidth+'px';el.firstChild.style.height=el.clientHeight+'px';}}
function createMatrixIdentity(){return[[1,0,0],[0,1,0],[0,0,1]];}
function matrixMultiply(m1,m2){var result=createMatrixIdentity();for(var x=0;x<3;x++){for(var y=0;y<3;y++){var sum=0;for(var z=0;z<3;z++){sum+=m1[x][z]*m2[z][y];}
result[x][y]=sum;}}
return result;}
function copyState(o1,o2){o2.fillStyle=o1.fillStyle;o2.lineCap=o1.lineCap;o2.lineJoin=o1.lineJoin;o2.lineWidth=o1.lineWidth;o2.miterLimit=o1.miterLimit;o2.shadowBlur=o1.shadowBlur;o2.shadowColor=o1.shadowColor;o2.shadowOffsetX=o1.shadowOffsetX;o2.shadowOffsetY=o1.shadowOffsetY;o2.strokeStyle=o1.strokeStyle;o2.globalAlpha=o1.globalAlpha;o2.arcScaleX_=o1.arcScaleX_;o2.arcScaleY_=o1.arcScaleY_;o2.lineScale_=o1.lineScale_;}
function processStyle(styleString){var str,alpha=1;styleString=String(styleString);if(styleString.substring(0,3)=='rgb'){var start=styleString.indexOf('(',3);var end=styleString.indexOf(')',start+1);var guts=styleString.substring(start+1,end).split(',');str='#';for(var i=0;i<3;i++){str+=dec2hex[Number(guts[i])];}
if(guts.length==4&&styleString.substr(3,1)=='a'){alpha=guts[3];}}else{str=styleString;}
return{color:str,alpha:alpha};}
function processLineCap(lineCap){switch(lineCap){case'butt':return'flat';case'round':return'round';case'square':break;default:return'square';}}
function CanvasRenderingContext2D_(surfaceElement){this.m_=createMatrixIdentity();this.mStack_=[];this.aStack_=[];this.currentPath_=[];this.strokeStyle='#000';this.fillStyle='#000';this.lineWidth=1;this.lineJoin='miter';this.lineCap='butt';this.miterLimit=Z*1;this.globalAlpha=1;this.canvas=surfaceElement;var el=surfaceElement.ownerDocument.createElement('div');el.style.width=surfaceElement.clientWidth+'px';el.style.height=surfaceElement.clientHeight+'px';surfaceElement.appendChild(el);this.element_=el;this.arcScaleX_=1;this.arcScaleY_=1;this.lineScale_=1;}
var contextPrototype=CanvasRenderingContext2D_.prototype;contextPrototype.clearRect=function(){this.element_.innerHTML='';};contextPrototype.beginPath=function(){this.currentPath_=[];};contextPrototype.moveTo=function(aX,aY){var p=this.getCoords_(aX,aY);this.currentPath_.push({type:'moveTo',x:p.x,y:p.y});this.currentX_=p.x;this.currentY_=p.y;};contextPrototype.lineTo=function(aX,aY){var p=this.getCoords_(aX,aY);this.currentPath_.push({type:'lineTo',x:p.x,y:p.y});this.currentX_=p.x;this.currentY_=p.y;};contextPrototype.bezierCurveTo=function(aCP1x,aCP1y,aCP2x,aCP2y,aX,aY){var p=this.getCoords_(aX,aY);var cp1=this.getCoords_(aCP1x,aCP1y);var cp2=this.getCoords_(aCP2x,aCP2y);bezierCurveTo(this,cp1,cp2,p);};function bezierCurveTo(self,cp1,cp2,p){self.currentPath_.push({type:'bezierCurveTo',cp1x:cp1.x,cp1y:cp1.y,cp2x:cp2.x,cp2y:cp2.y,x:p.x,y:p.y});self.currentX_=p.x;self.currentY_=p.y;}
contextPrototype.quadraticCurveTo=function(aCPx,aCPy,aX,aY){var cp=this.getCoords_(aCPx,aCPy);var p=this.getCoords_(aX,aY);var cp1={x:this.currentX_+2.0/3.0*(cp.x-this.currentX_),y:this.currentY_+2.0/3.0*(cp.y-this.currentY_)};var cp2={x:cp1.x+(p.x-this.currentX_)/3.0,y:cp1.y+(p.y-this.currentY_)/3.0};bezierCurveTo(this,cp1,cp2,p);};contextPrototype.arc=function(aX,aY,aRadius,aStartAngle,aEndAngle,aClockwise){aRadius*=Z;var arcType=aClockwise?'at':'wa';var xStart=aX+mc(aStartAngle)*aRadius-Z2;var yStart=aY+ms(aStartAngle)*aRadius-Z2;var xEnd=aX+mc(aEndAngle)*aRadius-Z2;var yEnd=aY+ms(aEndAngle)*aRadius-Z2;if(xStart==xEnd&&!aClockwise){xStart+=0.125;}
var p=this.getCoords_(aX,aY);var pStart=this.getCoords_(xStart,yStart);var pEnd=this.getCoords_(xEnd,yEnd);this.currentPath_.push({type:arcType,x:p.x,y:p.y,radius:aRadius,xStart:pStart.x,yStart:pStart.y,xEnd:pEnd.x,yEnd:pEnd.y});};contextPrototype.rect=function(aX,aY,aWidth,aHeight){this.moveTo(aX,aY);this.lineTo(aX+aWidth,aY);this.lineTo(aX+aWidth,aY+aHeight);this.lineTo(aX,aY+aHeight);this.closePath();};contextPrototype.strokeRect=function(aX,aY,aWidth,aHeight){var oldPath=this.currentPath_;this.beginPath();this.moveTo(aX,aY);this.lineTo(aX+aWidth,aY);this.lineTo(aX+aWidth,aY+aHeight);this.lineTo(aX,aY+aHeight);this.closePath();this.stroke();this.currentPath_=oldPath;};contextPrototype.fillRect=function(aX,aY,aWidth,aHeight){var oldPath=this.currentPath_;this.beginPath();this.moveTo(aX,aY);this.lineTo(aX+aWidth,aY);this.lineTo(aX+aWidth,aY+aHeight);this.lineTo(aX,aY+aHeight);this.closePath();this.fill();this.currentPath_=oldPath;};contextPrototype.createLinearGradient=function(aX0,aY0,aX1,aY1){var gradient=new CanvasGradient_('gradient');gradient.x0_=aX0;gradient.y0_=aY0;gradient.x1_=aX1;gradient.y1_=aY1;return gradient;};contextPrototype.createRadialGradient=function(aX0,aY0,aR0,aX1,aY1,aR1){var gradient=new CanvasGradient_('gradientradial');gradient.x0_=aX0;gradient.y0_=aY0;gradient.r0_=aR0;gradient.x1_=aX1;gradient.y1_=aY1;gradient.r1_=aR1;return gradient;};contextPrototype.drawImage=function(image,var_args){var dx,dy,dw,dh,sx,sy,sw,sh;var oldRuntimeWidth=image.runtimeStyle.width;var oldRuntimeHeight=image.runtimeStyle.height;image.runtimeStyle.width='auto';image.runtimeStyle.height='auto';var w=image.width;var h=image.height;image.runtimeStyle.width=oldRuntimeWidth;image.runtimeStyle.height=oldRuntimeHeight;if(arguments.length==3){dx=arguments[1];dy=arguments[2];sx=sy=0;sw=dw=w;sh=dh=h;}else if(arguments.length==5){dx=arguments[1];dy=arguments[2];dw=arguments[3];dh=arguments[4];sx=sy=0;sw=w;sh=h;}else if(arguments.length==9){sx=arguments[1];sy=arguments[2];sw=arguments[3];sh=arguments[4];dx=arguments[5];dy=arguments[6];dw=arguments[7];dh=arguments[8];}else{throw Error('Invalid number of arguments');}
var d=this.getCoords_(dx,dy);var w2=sw/2;var h2=sh/2;var vmlStr=[];var W=10;var H=10;vmlStr.push(' <g_vml_:group',' coordsize="',Z*W,',',Z*H,'"',' coordorigin="0,0"',' style="width:',W,'px;height:',H,'px;position:absolute;');if(this.m_[0][0]!=1||this.m_[0][1]){var filter=[];filter.push('M11=',this.m_[0][0],',','M12=',this.m_[1][0],',','M21=',this.m_[0][1],',','M22=',this.m_[1][1],',','Dx=',mr(d.x/Z),',','Dy=',mr(d.y/Z),'');var max=d;var c2=this.getCoords_(dx+dw,dy);var c3=this.getCoords_(dx,dy+dh);var c4=this.getCoords_(dx+dw,dy+dh);max.x=m.max(max.x,c2.x,c3.x,c4.x);max.y=m.max(max.y,c2.y,c3.y,c4.y);vmlStr.push('padding:0 ',mr(max.x/Z),'px ',mr(max.y/Z),'px 0;filter:progid:DXImageTransform.Microsoft.Matrix(',filter.join(''),", sizingmethod='clip');");}else{vmlStr.push('top:',mr(d.y/Z),'px;left:',mr(d.x/Z),'px;');}
vmlStr.push(' ">','<g_vml_:image src="',image.src,'"',' style="width:',Z*dw,'px;',' height:',Z*dh,'px;"',' cropleft="',sx/w,'"',' croptop="',sy/h,'"',' cropright="',(w-sx-sw)/w,'"',' cropbottom="',(h-sy-sh)/h,'"',' />','</g_vml_:group>');this.element_.insertAdjacentHTML('BeforeEnd',vmlStr.join(''));};contextPrototype.stroke=function(aFill){var lineStr=[];var lineOpen=false;var a=processStyle(aFill?this.fillStyle:this.strokeStyle);var color=a.color;var opacity=a.alpha*this.globalAlpha;var W=10;var H=10;lineStr.push('<g_vml_:shape',' filled="',!!aFill,'"',' style="position:absolute;width:',W,'px;height:',H,'px;"',' coordorigin="0 0" coordsize="',Z*W,' ',Z*H,'"',' stroked="',!aFill,'"',' path="');var newSeq=false;var min={x:null,y:null};var max={x:null,y:null};var i;for(i=0;i<this.currentPath_.length;i++){var p=this.currentPath_[i];var c;switch(p.type){case'moveTo':c=p;lineStr.push(' m ',mr(p.x),',',mr(p.y));break;case'lineTo':lineStr.push(' l ',mr(p.x),',',mr(p.y));break;case'close':lineStr.push(' x ');p=null;break;case'bezierCurveTo':lineStr.push(' c ',mr(p.cp1x),',',mr(p.cp1y),',',mr(p.cp2x),',',mr(p.cp2y),',',mr(p.x),',',mr(p.y));break;case'at':case'wa':lineStr.push(' ',p.type,' ',mr(p.x-this.arcScaleX_*p.radius),',',mr(p.y-this.arcScaleY_*p.radius),' ',mr(p.x+this.arcScaleX_*p.radius),',',mr(p.y+this.arcScaleY_*p.radius),' ',mr(p.xStart),',',mr(p.yStart),' ',mr(p.xEnd),',',mr(p.yEnd));break;}
if(p){if(min.x===null||p.x<min.x){min.x=p.x;}
if(max.x===null||p.x>max.x){max.x=p.x;}
if(min.y===null||p.y<min.y){min.y=p.y;}
if(max.y===null||p.y>max.y){max.y=p.y;}}}
lineStr.push(' ">');if(!aFill){var lineWidth=this.lineScale_*this.lineWidth;if(lineWidth<1){opacity*=lineWidth;}
lineStr.push('<g_vml_:stroke',' opacity="',opacity,'"',' joinstyle="',this.lineJoin,'"',' miterlimit="',this.miterLimit,'"',' endcap="',processLineCap(this.lineCap),'"',' weight="',lineWidth,'px"',' color="',color,'" />');}else if(typeof this.fillStyle=='object'){var fillStyle=this.fillStyle;var angle=0;var focus={x:0,y:0};var shift=0;var expansion=1;var p0;if(fillStyle.type_=='gradient'){var x0=fillStyle.x0_/this.arcScaleX_;var y0=fillStyle.y0_/this.arcScaleY_;var x1=fillStyle.x1_/this.arcScaleX_;var y1=fillStyle.y1_/this.arcScaleY_;p0=this.getCoords_(x0,y0);var p1=this.getCoords_(x1,y1);var dx=p1.x-p0.x;var dy=p1.y-p0.y;angle=Math.atan2(dx,dy)*180/Math.PI;if(angle<0){angle+=360;}
if(angle<1e-6){angle=0;}}else{p0=this.getCoords_(fillStyle.x0_,fillStyle.y0_);var width=max.x-min.x;var height=max.y-min.y;focus={x:(p0.x-min.x)/width,y:(p0.y-min.y)/height};width/=this.arcScaleX_*Z;height/=this.arcScaleY_*Z;var dimension=m.max(width,height);shift=2*fillStyle.r0_/dimension;expansion=2*fillStyle.r1_/dimension-shift;}
var stops=fillStyle.colors_;stops.sort(function(cs1,cs2){return cs1.offset-cs2.offset;});var length=stops.length;var color1=stops[0].color;var color2=stops[length-1].color;var opacity1=stops[0].alpha*this.globalAlpha;var opacity2=stops[length-1].alpha*this.globalAlpha;var colors=[];for(i=0;i<length;i++){var stop=stops[i];colors.push(stop.offset*expansion+shift+' '+stop.color);}
lineStr.push('<g_vml_:fill type="',fillStyle.type_,'"',' method="none" focus="100%"',' color="',color1,'"',' color2="',color2,'"',' colors="',colors.join(','),'"',' opacity="',opacity2,'"',' g_o_:opacity2="',opacity1,'"',' angle="',angle,'"',' focusposition="',focus.x,',',focus.y,'" />');}else{lineStr.push('<g_vml_:fill color="',color,'" opacity="',opacity,'" />');}
lineStr.push('</g_vml_:shape>');this.element_.insertAdjacentHTML('beforeEnd',lineStr.join(''));};contextPrototype.fill=function(){this.stroke(true);};contextPrototype.closePath=function(){this.currentPath_.push({type:'close'});};contextPrototype.getCoords_=function(aX,aY){var m=this.m_;return{x:Z*(aX*m[0][0]+aY*m[1][0]+m[2][0])-Z2,y:Z*(aX*m[0][1]+aY*m[1][1]+m[2][1])-Z2};};contextPrototype.save=function(){var o={};copyState(this,o);this.aStack_.push(o);this.mStack_.push(this.m_);this.m_=matrixMultiply(createMatrixIdentity(),this.m_);};contextPrototype.restore=function(){copyState(this.aStack_.pop(),this);this.m_=this.mStack_.pop();};function matrixIsFinite(m){for(var j=0;j<3;j++){for(var k=0;k<2;k++){if(!isFinite(m[j][k])||isNaN(m[j][k])){return false;}}}
return true;}
function setM(ctx,m,updateLineScale){if(!matrixIsFinite(m)){return;}
ctx.m_=m;if(updateLineScale){var det=m[0][0]*m[1][1]-m[0][1]*m[1][0];ctx.lineScale_=sqrt(abs(det));}}
contextPrototype.translate=function(aX,aY){var m1=[[1,0,0],[0,1,0],[aX,aY,1]];setM(this,matrixMultiply(m1,this.m_),false);};contextPrototype.rotate=function(aRot){var c=mc(aRot);var s=ms(aRot);var m1=[[c,s,0],[-s,c,0],[0,0,1]];setM(this,matrixMultiply(m1,this.m_),false);};contextPrototype.scale=function(aX,aY){this.arcScaleX_*=aX;this.arcScaleY_*=aY;var m1=[[aX,0,0],[0,aY,0],[0,0,1]];setM(this,matrixMultiply(m1,this.m_),true);};contextPrototype.transform=function(m11,m12,m21,m22,dx,dy){var m1=[[m11,m12,0],[m21,m22,0],[dx,dy,1]];setM(this,matrixMultiply(m1,this.m_),true);};contextPrototype.setTransform=function(m11,m12,m21,m22,dx,dy){var m=[[m11,m12,0],[m21,m22,0],[dx,dy,1]];setM(this,m,true);};contextPrototype.clip=function(){};contextPrototype.arcTo=function(){};contextPrototype.createPattern=function(){return new CanvasPattern_();};function CanvasGradient_(aType){this.type_=aType;this.x0_=0;this.y0_=0;this.r0_=0;this.x1_=0;this.y1_=0;this.r1_=0;this.colors_=[];}
CanvasGradient_.prototype.addColorStop=function(aOffset,aColor){aColor=processStyle(aColor);this.colors_.push({offset:aOffset,color:aColor.color,alpha:aColor.alpha});};function CanvasPattern_(){}
G_vmlCanvasManager=G_vmlCanvasManager_;CanvasRenderingContext2D=CanvasRenderingContext2D_;CanvasGradient=CanvasGradient_;CanvasPattern=CanvasPattern_;})();}

/**
	HTML5 Canvas 엘리먼트를 생성하고 간단한 그래픽 작업을 할 수 있도록 지원하는 컴포넌트
	
	@class jindo.Canvas
	@keyword canvas, graphic, 캔버스, 그래픽
**/
jindo.Canvas = jindo.$Class({
	/**
		@constructor
		@param {HTMLElement} [el] canvas 엘리먼트
	**/
	$init : function(el) {
		if (typeof el == "undefined") {
			el = jindo.Canvas.create();
		}
		this._el = el;
		this._elContainer = this._el.parentNode;
		this._oContext = jindo.Canvas.getContext(el);
	},
	
	/**
		canvas 엘리먼트를 가져온다.
		
		@method getElement
		@return {HTMLElement} canvas 엘리먼트
	**/
	getElement : function() {
		return this._el;
	},
	
	/**
		canvas 엘리먼트의 컨테이너 엘리먼트를 가져온다.
		
		@method getContainer
		@return {HTMLElement} 컨테이너 엘리먼트
	**/
	getContainer : function() {
		return this._elContainer;
	},
	
	/**
		canvas 엘리먼트의 너비를 구한다.
		
		@method width
		@return {Number} canvas 엘리먼트의 너비값
	**/
	/**
		canvas 엘리먼트의 너비를 설정한다.
		
		@method width
		@param {Number} n 지정할 너비값
		@return {this} 너비값을 설정한 canvas 인스턴스 자신
	**/
	width : function(n) {
		if (typeof n == "number") {
			this._el.width = n;
			return this;
		}
		return this._el.width;
	},
	
	/**
		canvas 엘리먼트의 높이를 구한다.
		
		@method height
		@return {Number} canvas 엘리먼트의 높이값 
	**/
	/**
		canvas 엘리먼트의 높이를 설정한다.
		
		@method height
		@param {Number} n 지정할 높이값
		@return {this} 높이값을 설정한 canvas 인스턴스 자신
	**/
	height : function(n) {
		if (typeof n == "number") {
			this._el.height = n;
			return this;
		}
		return this._el.height;
	},
	
	/**
		canvas 엘리먼트의 컨텍스트를 가져온다.
		
		@method getContext
		@return {Object} canvas의 컨텍스트 객체
	**/
	getContext : function(){
		return this._oContext;
	},
	
	/**
		canvas 엘리먼트 내부를 모두 지운다.
		
		@method clear
		@return {this} 내부를 모두 지운 canvas 인스턴스 자신
	**/
	clear : function(){
		this._oContext.clearRect(0, 0, this._el.width, this._el.height);
		return this;
	},
	
	_merge : function(ctx, htOption) {
		for (var sKey in htOption) {
			ctx[sKey] = htOption[sKey];
		}
	},
	
	/**
		여러개의 점으로 이루어진 선을 그린다.
		
		@method drawLine
		@param {Array} a 좌표셋의 배열
		@param {Object} htOption 컨텍스트에 지정할 옵션
		@param {Boolean} [bBlockAntiAlias=true] 안티앨리어싱을 막을지 여부
		@return {this} canvas 인스턴스 자신
		@remark 선의 두께 (lineWidth) 가 홀수일경우 x, y 좌표에 0.5를 더해 anti-aliasing되지 않도록 보정한다.
		@example
			drawLine([[0, 0], [1, 1]], { lineWidth : 1, strokeStyle : "rgb(255, 0, 0)" });
	**/
	drawLine : function(a, htOption, bBlockAntiAlias) {
		var ctx = this._oContext,
			nAdjust = 0,
			nLen = a.length,
			i;
		
		htOption = htOption || {};
		
		if (nLen > 1) {
			if (typeof bBlockAntiAlias == "undefined") {
				bBlockAntiAlias = true;
			}
			
			ctx.save();
			this._merge(ctx, htOption);
			
			ctx.beginPath();
			if (bBlockAntiAlias) {
				if (ctx.lineWidth % 2 === 1) {
					nAdjust = 0.5;
				}
				if (nLen === 2) {
					if (a[0][0] === a[1][0]) {
						ctx.moveTo((Math.round(a[0][0]) + nAdjust), a[0][1]);
						ctx.lineTo((Math.round(a[1][0]) + nAdjust), a[1][1]);
					}
					if (a[0][1] === a[1][1]) {
						ctx.moveTo(a[0][0], (Math.round(a[0][1]) + nAdjust));
						ctx.lineTo(a[1][0], (Math.round(a[1][1]) + nAdjust));
					}
				} else {
					ctx.moveTo((Math.round(a[0][0]) + nAdjust), (Math.round(a[0][1]) + nAdjust));
					for (i = 1; i < nLen; i++) {
						ctx.lineTo((Math.round(a[i][0]) + nAdjust), (Math.round(a[i][1]) + nAdjust));
					}
				}
			} else {
				ctx.moveTo(a[0][0], a[0][1]);
				for (i = 1; i < nLen; i++) {
					ctx.lineTo(a[i][0], a[i][1]);
				}
			}
			
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		}
		return this;
	},
	
	/**
		여러개의 점으로 이루어진 면을 그린다. 
		
		@method drawFace
		@param {Array} a 좌표셋의 배열
		@param {Object} htOption 컨텍스트에 지정할 옵션
		@return {this} canvas 인스턴스 자신
		@remark x, y 좌표에 0.5를 더해 anti-aliasing되지 않도록 보정한다.
		@example
			drawFace([[0, 0], [1, 1]], { fillStyle : "rgb(255, 0, 0)" });
	**/
	drawFace : function(a, htOption) {
		var ctx = this._oContext,
			nLen = a.length;
		
		htOption = htOption || {};
		
		if (nLen > 2) {
			ctx.save();
			this._merge(ctx, htOption);
			ctx.beginPath();
			ctx.moveTo(a[0][0], a[0][1]);
			for (var i = 1; i < nLen; i++) {
				ctx.lineTo(a[i][0], a[i][1]);
			}
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		return this;
	},
	
	_round : function(n, nLineWidth) {
		return (nLineWidth % 2 === 1) ? Math.round(n) + 0.5 : n; 
	},
	
	/**
		x, y 좌표를 기준으로 사각형 막대를 그린다. 
		
		@method drawRect
		@param {Number} nX x좌표
		@param {Number} nY y좌표
		@param {Number} nWidth 너비
		@param {Number} nHeight 높이
		@param {Object} htOption 컨텍스트에 지정할 옵션
		@param {Boolean} bBlockAntiAlias 안티앨리어싱을 막을지 여부 (디폴트 true) 
		@return {this} canvas 인스턴스 자신
		@remark nWidth 값이 0보다 작으면 왼쪽방향으로, 0보다 크면 오른쪽방향으로 그리고, nHeight 값이 0보다 작으면 위쪽방향으로, 0보다 크면 아래쪽방향으로 그린다. 
		@remark htOption.strokeStyle이 지정되어있고, 컨텍스트 객체의 선의 두께(lineWidth)가 홀수일경우 x, y 좌표에 0.5를 더해 anti-aliasing되지 않도록 보정한다.
		@example
			drawRect(20, 100, 100, 100, {
			    fillStyle : "rgb(200, 200, 200)"
			}, true);
			
			drawRect(20, 100, 100, 100, {
			    strokeStyle:"rgb(10, 10, 10)", lineWidth:1
			}, false);
			
			drawRect(20, 100, 100, 100, {
			    fillStyle : "rgb(200, 200, 200)", strokeStyle:"rgb(10, 10, 10)", lineWidth:1
			}, true);
	**/
	drawRect : function(nX, nY, nWidth, nHeight, htOption, bBlockAntiAlias) {
		var ctx = this._oContext,
			bFillDefined = typeof htOption["fillStyle"] != "undefined",
			bStrokeDefined = typeof htOption["strokeStyle"] != "undefined" && htOption["lineWidth"] > 0;
		
		htOption = htOption || {};
		
		if (bFillDefined || bStrokeDefined) {
			ctx.save();
			this._merge(ctx, htOption);
			
			if (bFillDefined) {
				ctx.fillRect(nX, nY, nWidth, nHeight);
			}
			if (bStrokeDefined) {
				if (typeof bBlockAntiAlias == "undefined") {
					bBlockAntiAlias = true;
				}
				
				if (bBlockAntiAlias) {
					nX = this._round(nX, ctx.lineWidth);
					nY = this._round(nY, ctx.lineWidth);
					nHeight = Math.round(nHeight);
					nWidth = Math.round(nWidth);
				}
				ctx.strokeRect(nX, nY, nWidth, nHeight);
			}
			ctx.restore();
		}
		return this;
	}
});

/**
	canvas 엘리먼트를 생성한다. 
	
	@method create
	@static
	@param {Number} nWidth canvas의 너비. canvas에 지정될 width 속성 값
	@param {Number} nHeight canvas의 높이. canvas에 지정될 height 속성 값
	@param {HTMLElement} [elParent] append될 부모 엘리먼트
	@return {HTMLElement} canvas 엘리먼트
	@remark IE는 exCanvas를 사용해 초기화한다.
	@example
		jindo.Canvas.create();
		jindo.Canvas.create(300, 200);
		jindo.Canvas.create(300, 200, document.body);
**/
jindo.Canvas.create = function(nWidth, nHeight, elParent) {
	var elCanvas = document.createElement('canvas');
	elCanvas.setAttribute("width", nWidth || 300);
	elCanvas.setAttribute("height", nHeight || 150);
	 
	if (typeof elCanvas.getContext == "undefined") {
		G_vmlCanvasManager.initElement(elCanvas);
	}
	if (elParent) {
		elParent.appendChild(elCanvas);
	}
	return elCanvas;
};

/**
	canvas 엘리먼트의 컨텍스트 객체를 가져온다.
	
	@method getContext
	@static
	@param {HTMLElement} el canvas 엘리먼트
	@return {Object} canvas의 컨텍스트 객체
**/
jindo.Canvas.getContext = function(el) {
	return el.getContext("2d");
};