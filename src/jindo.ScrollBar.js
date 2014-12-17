/**
	@fileOverview 이미지 스크롤바 컴포넌트
	@author senxation
	@version #__VERSION__#
**/
/**
	이미지 스크롤바 컴포넌트
	ScrollBar 컴포넌트는 정해진 크기의 박스내의 내용을 스크롤바를 이용해 이동하여 볼 수 있게합니다.
	스크롤바의 위치와 크기는 마크업의 정의에 따라 커스터마이징할 수 있습니다.
	박스내 내용이 고정되어있고 변하지 않는 경우에 사용합니다.
	
	@class jindo.ScrollBar
	@extends jindo.UIComponent
	@uses jindo.Slider
	@uses jindo.RolloverArea
	@uses jindo.Transition
	@keyword scrollbar, 스크롤바
**/
jindo.ScrollBar = new jindo.$Class({
	/** @lends jindo.ScrollBar.prototype */

	_bMouseEnter : false,
	_bIsEventAttachedForCommon : false,
	_bIsEventAttachedForVertical : false,
	_bIsEventAttachedForHorizontal : false,
	
	/**
		@constructor
		@param {HTMLElement} el
		@param {Object} [oOption] 옵션
			@param {String} [oOption.sClassPrefix="scrollbar-"] 클래스명 접두어
			@param {Number} [oOption.nDelta=16] 스크롤 속도
			@param {String} [oOption.sClassNameForRollover="rollover"] Rollover에 반응할 클래스명
			@param {Boolean} [oOption.bActivateOnload=true] 컴포넌트 로드시 activate() 수행여부
		@example
			var oScrollBar = new jindo.ScrollBar("scroll", {
				sClassPrefix : "scrollbar-", // (String) Class Prefix
				nDelta : 16, // (Number) 스크롤 속도
				sClassNameForRollover : "rollover", // (String) Rollover에 반응할 class 명
				bActivateOnload : true
			}).attach({
				scroll : function(oCustomEvent) {
					//스크롤위치가 바뀔 때 마다 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	sDirection : (String) "left" 또는 "top"
					//	nPosition : (Number) 스크롤된 위치
					//}
				}
			});
	**/	
	$init : function(el, oOption) {
		
		this.option({
			sClassPrefix : "scrollbar-",
			nDelta : 16, //스크롤 속도
			sClassNameForRollover : "rollover", // (String) Rollover에 반응할 class 명
			bActivateOnload : true
		});
		
		this.option(oOption || {});
		
		this._el = jindo.$(el);
		this._oOldPos = { left : null, top : null };
		
		this._oTimer = new jindo.Timer();
		this._oTransition = new jindo.Transition().fps(30);
		
		this._wfOnMouseEnter = jindo.$Fn(this._onMouseEnter, this);
		this._wfOnMouseLeave = jindo.$Fn(this._onMouseLeave, this);
		
		this._wfOnWheel = jindo.$Fn(this._onWheel, this);
		this._wfOnMouseUp = jindo.$Fn(this._onMouseUp, this);

		this._assignHTMLElements();
		this._initialize4Tablet();
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_assignHTMLElements : function(){
		var el = this._el,
			sClassPrefix = this.option("sClassPrefix");

		this._elBox = jindo.$$.getSingle("."+sClassPrefix+"box", el);
		this._elContent = jindo.$$.getSingle("."+sClassPrefix+"content", el);
		
		var welBox = jindo.$Element(this._elBox),
			welContent = jindo.$Element(this._elContent);
			
		this._oBoxSize = {
			nWidth: welBox.width(),
			nHeight: welBox.height()
		};
		
		this._oContentSize = {
			nWidth: welContent.width(),
			nHeight: welContent.height()
		};

		this._oHorizontal = {
			elScrollBar : jindo.$$.getSingle("."+sClassPrefix+"h", el)
		};
		
		var oH = this._oHorizontal;
		if (oH.elScrollBar) {
			oH.elTrack = jindo.$$.getSingle("." + sClassPrefix + "track", oH.elScrollBar);
			oH.elThumb = jindo.$$.getSingle("." + sClassPrefix + "thumb", oH.elTrack);
			oH.elThumbHead = jindo.$$.getSingle("."+sClassPrefix+"thumb-head", oH.elThumb);
			oH.elThumbBody = jindo.$$.getSingle("."+sClassPrefix+"thumb-body", oH.elThumb);
			oH.elThumbFoot = jindo.$$.getSingle("."+sClassPrefix+"thumb-foot", oH.elThumb);			
			oH.elButtonLeft = jindo.$$.getSingle("." + sClassPrefix + "button-left", oH.elScrollBar);
			oH.elButtonRight = jindo.$$.getSingle("." + sClassPrefix + "button-right", oH.elScrollBar);
		}
		
		this._oVertical = {
			elScrollBar : jindo.$$.getSingle("."+sClassPrefix+"v", el)
		};
		var oV = this._oVertical;
		if (oV.elScrollBar) {
			oV.elTrack = jindo.$$.getSingle("." + sClassPrefix + "track", oV.elScrollBar);
			oV.elThumb = jindo.$$.getSingle("." + sClassPrefix + "thumb", oV.elTrack);
			oV.elThumbHead = jindo.$$.getSingle("."+sClassPrefix+"thumb-head", oV.elThumb);
			oV.elThumbBody = jindo.$$.getSingle("."+sClassPrefix+"thumb-body", oV.elThumb);
			oV.elThumbFoot = jindo.$$.getSingle("."+sClassPrefix+"thumb-foot", oV.elThumb);
			oV.elButtonUp = jindo.$$.getSingle("." + sClassPrefix + "button-up", oV.elScrollBar);
			oV.elButtonDown = jindo.$$.getSingle("." + sClassPrefix + "button-down", oV.elScrollBar);
		}
	},
	
	/**
		box 엘리먼트를 가져온다.
		
		@method getBox
		@return {HTMLElement}
	**/
	getBox : function() {
		return this._elBox;
	},
	
	/**
		content 엘리먼트를 가져온다
		
		@method getContent
		@return {HTMLElement}
	**/
	getContent : function() {
		return this._elContent;
	},
	
	/**
		초기 로딩시 정해진 박스의 크기를 가져온다.
		
		@method getDefaultBoxSize
		@return {Object}
		@example
			var oSize = {
				nWidth : (Number), 
				nHeight : (Number)
			}
	**/
	getDefaultBoxSize : function() {
		return this._oBoxSize;
	},
	
	/**
		초기 로딩시 정해진 박스의 크기를 가져온다.
		
		@method getDefaultContentSize
		@return {Object}
		@example
			var oSize = {
				nWidth : (Number), 
				nHeight : (Number)
			}
	**/
	getDefaultContentSize : function() {
		return this._oContentSize;
	},
	
	/**
		가로 스크롤바에 해당하는 HTMLElement 객체들을 가져온다.
		
		@method getScrollBarHorizontal
		@return {Object}
		@example
			var oScrollBarHorizontal = {
				elScrollBar : (HTMLElement),
				elTrack : (HTMLElement),
				elThumb : (HTMLElement),
				elThumbHead : (HTMLElement),
				elThumbBody : (HTMLElement),
				elThumbFoot : (HTMLElement),
				elButtonLeft : (HTMLElement), 
				elButtonRight : (HTMLElement)
			}
	**/
	getScrollBarHorizontal : function() {
		return this._oHorizontal;
	},
	
	/**
		세로 스크롤바에 해당하는 HTMLElement 객체들을 가져온다.
		
		@method getScrollBarVertical
		@return {Object}
		@example
			var oScrollBarVertical = {
				elScrollBar : (HTMLElement),
				elTrack : (HTMLElement),
				elThumb : (HTMLElement),
				elThumbHead : (HTMLElement),
				elThumbBody : (HTMLElement),
				elThumbFoot : (HTMLElement),
				elButtonUp : (HTMLElement), 
				elButtonDown : (HTMLElement)
			}
	**/
	getScrollBarVertical : function() {
		return this._oVertical;
	},
	
	/**
		가로 스크롤에 해당하는 슬라이더 객체를 가져온다.
		
		@method getSliderHorizontal
		@return {jindo.Slider}
	**/
	getSliderHorizontal : function() {
		return this._oSliderHorizontal || null;
	},
	
	/**
		세로 스크롤에 해당하는 슬라이더 객체를 가져온다.
		
		@method getSliderVertical
		@return {jindo.Slider}
	**/
	getSliderVertical : function() {
		return this._oSliderVertical || null;
	},
	
	/**
		RolloverArea 객체를 가져온다.
		
		@method getRolloverArea
		@return {jindo.RolloverArea}
	**/
	getRolloverArea : function() {
		return this._oRolloverArea;
	},
	
	_attachEvent : function(sDirection) {
		var sClassPrefix = this.option("sClassPrefix"),
			self = this,
			oH = this.getScrollBarHorizontal(),
			oV = this.getScrollBarVertical();	
		
		function attach(o) {
			if (o.elScrollBar) {
				var sClassNameForRollover = self.option("sClassNameForRollover");
				jindo.$Element(o.elTrack).addClass(sClassNameForRollover);
				jindo.$Element(o.elThumb).addClass(sClassNameForRollover);
				if (o.elButtonLeft) {
					jindo.$Element(o.elButtonLeft).addClass(sClassNameForRollover);	
				}
				if (o.elButtonRight) {
					jindo.$Element(o.elButtonRight).addClass(sClassNameForRollover);
				}
				if (o.elButtonUp) {
					jindo.$Element(o.elButtonUp).addClass(sClassNameForRollover);
				}
				if (o.elButtonDown) {
					jindo.$Element(o.elButtonDown).addClass(sClassNameForRollover);
				}
			}
		}
		
		function attachH() {
			if (!self._bIsEventAttachedForHorizontal) {
				attach(oH);
			}
			self._bIsEventAttachedForHorizontal = true;
		}
		
		function attachV() {
			if (!self._bIsEventAttachedForVertical) {
				attach(oV);
			}
			self._bIsEventAttachedForVertical = true;
		}
		
		//공통 이벤트
		if(!this._bIsEventAttachedForCommon) {
			this._initSliders();
			this._initRolloverArea();
			
			this._wfOnMouseEnter.attach(this._el, "mouseenter");
			this._wfOnMouseLeave.attach(this._el, "mouseleave");
			this._wfOnWheel.attach(document, "mousewheel");
			this._wfOnMouseUp.attach(document, "mouseup");
			this._bIsEventAttachedForCommon = true;
			jindo.$Element(this._el).removeClass(sClassPrefix + "noscript");
		}

		//방향이 없으면 전부
		if (!sDirection) {
			attachH();
			attachV();
		}
		if (sDirection == "horizontal") {
			attachH();
		}
		if (sDirection == "vertical") {
			attachV();
		}
	},
	
	_detachEvent : function(sDirection) {
		var sClassPrefix = this.option("sClassPrefix"),
			self = this,
			oH = this.getScrollBarHorizontal(),
			oV = this.getScrollBarVertical();	
		
		function detach(o) {
			if (o.elScrollBar) {
				var sClassNameForRollover = self.option("sClassNameForRollover");
				jindo.$Element(o.elTrack).removeClass(sClassNameForRollover);
				jindo.$Element(o.elThumb).removeClass(sClassNameForRollover);
				if (o.elButtonLeft) {
					jindo.$Element(o.elButtonLeft).removeClass(sClassNameForRollover);	
				}
				if (o.elButtonRight) {
					jindo.$Element(o.elButtonRight).removeClass(sClassNameForRollover);
				}
				if (o.elButtonUp) {
					jindo.$Element(o.elButtonUp).removeClass(sClassNameForRollover);
				}
				if (o.elButtonDown) {
					jindo.$Element(o.elButtonDown).removeClass(sClassNameForRollover);
				}
			}
		}
		
		function detachH() {
			if (self._bIsEventAttachedForHorizontal) {
				detach(oH);
			}
			self._bIsEventAttachedForHorizontal = false;
		}
		
		function detachV() {
			if (self._bIsEventAttachedForVertical) {
				detach(oV);
			}
			self._bIsEventAttachedForVertical = false;
		}

		//방향이 없으면 전부
		if (!sDirection) {
			detachH();
			detachV();
		}
		else if (sDirection == "horizontal") {
			detachH();
		}
		else if (sDirection == "vertical") {
			detachV();
		}

		//공통 이벤트
		if(this._bIsEventAttachedForCommon && !this._bIsEventAttachedForHorizontal && !this._bIsEventAttachedForVertical) {
			this._wfOnMouseEnter.detach(this._el, "mouseenter");
			this._wfOnMouseLeave.detach(this._el, "mouseleave");
			this._wfOnWheel.detach(document, "mousewheel");
			this._wfOnMouseUp.detach(document, "mouseup");
			this._bMouseEnter = false;
			this._bIsEventAttachedForCommon = false;
			this.getRolloverArea().deactivate();
			jindo.$Element(this._el).addClass(sClassPrefix + "noscript");	
		}
	},
	
	_activateH : function() {
		var oSliderH = this.getSliderHorizontal();
		if (oSliderH) {
			oSliderH.activate();
			this.getBox().scrollLeft = 0;
			this.setScrollLeft(0);
		}
	},
	
	_activateV : function() {
		var oSliderV = this.getSliderVertical();
		if (oSliderV) {
			oSliderV.activate();
			this.getBox().scrollTop = 0;
			this.setScrollTop(0);
		}
	},
	
	/**
		스크롤바의 동작을 활성화한다.
		@param {String} sDirection "vertical" || "horizontal" || null
	**/
	_onActivate : function(sDirection) {
		this._attachEvent(sDirection || null);
		this._activate4Tablet();
		
		if(!sDirection) {
			this._activateH();
			this._activateV();
			jindo.$Element(this._el).removeClass(this.option("sClassPrefix") + "noscript");
			return;
		}
		if(sDirection == "horizontal") {
			this._activateH();
			return;
		}
		if(sDirection == "vertical") {
			this._activateV();
			return;
		}
	},
	
	_deactivateH : function() {
		var oSliderH = this.getSliderHorizontal();
		if (oSliderH) {
			oSliderH.deactivate();
			this.getContent().style.left = "0px";
			this.getBox().scrollLeft = 0;
		}
	},
	
	_deactivateV : function() {
		var oSliderV = this.getSliderVertical();
		if (oSliderV) {
			oSliderV.deactivate();
			this.getContent().style.top = "0px";
			this.getBox().scrollTop = 0;
		}
	},
	
	/**
		스크롤바의 동작을 비활성화한다.
		@param {String} sDirection "vertical" || "horizontal" || null
	**/
	_onDeactivate : function(sDirection) {
		this._detachEvent(sDirection || null);
		this._deactivate4Tablet();
		
		if(!sDirection) {
			this._deactivateH();
			this._deactivateV();
			jindo.$Element(this._el).addClass(this.option("sClassPrefix") + "noscript");
			return;
		}
		if(sDirection == "horizontal") {
			this._deactivateH();
			return;
		}
		if(sDirection == "vertical") {
			this._deactivateV();
			return;
		}
	},
	
	_initSliders : function() {
		var self = this,
			sClassPrefix = this.option("sClassPrefix"),
			oH = this.getScrollBarHorizontal(),
			oV = this.getScrollBarVertical();		
		
		if (oH.elScrollBar) {

			this._nScrollWidth = jindo.$Element(this._elContent).width() - jindo.$Element(this._elBox).width();
			
			this._oSliderHorizontal = new jindo.Slider(oH.elTrack, {
				sClassPrefix: sClassPrefix,
				bVertical: false,
				nMinValue: 0,
				nMaxValue: this._nScrollWidth
			});
			this._oSliderHorizontal._oTransition = new jindo.Transition().fps(30);
			
			this._oSliderHorizontal.attach({
				beforeChange: function(oCustomEvent){
					var nTrackWidth = jindo.$Element(this.getTrack()).width(),
						nThumbWidth = jindo.$Element(this.getThumb(oCustomEvent.nIndex)).width(),
						nAvailWidth = nTrackWidth - nThumbWidth;
					
					oCustomEvent.nPos = Math.min(oCustomEvent.nPos, nAvailWidth); 
					oCustomEvent.nPos = Math.max(oCustomEvent.nPos, 0);

					if (oCustomEvent.bJump) {
						oCustomEvent.stop();
						
						this._oTransition.abort().start(200, this.getThumb(oCustomEvent.nIndex), {
							"@left" : jindo.Effect.easeOut(oCustomEvent.nPos + 'px') 
						}).attach({
							playing : function(oCustomEvent2) {
								self.setScrollLeft(self._oSliderHorizontal._getValue(0, parseInt(oCustomEvent2.sValue, 10)));
							}
						});
					} else {
						self.setScrollLeft(this._getValue(0, oCustomEvent.nPos));
					}
				}
			});
			
		}
		
		if (oV.elScrollBar) {
			this._nScrollHeight = jindo.$Element(this._elContent).height() - jindo.$Element(this._elBox).height();

			this._oSliderVertical = new jindo.Slider(oV.elTrack, {
				sClassPrefix: sClassPrefix,
				bVertical: true,
				nMinValue: 0,
				nMaxValue: this._nScrollHeight
			});
			this._oSliderVertical._oTransition = new jindo.Transition().fps(30);
			
			this._oSliderVertical.attach({
				beforeChange: function(oCustomEvent){
					var nTrackHeight = jindo.$Element(this.getTrack()).height(),
						nThumbHeight = jindo.$Element(this.getThumb(oCustomEvent.nIndex)).height(),
						nAvailHeight = nTrackHeight - nThumbHeight;
					
					oCustomEvent.nPos = Math.min(oCustomEvent.nPos, nAvailHeight); 
					oCustomEvent.nPos = Math.max(oCustomEvent.nPos, 0);

					if (oCustomEvent.bJump) {
						oCustomEvent.stop();
						this._oTransition.abort().start(200, this.getThumb(oCustomEvent.nIndex), {
							"@top" : jindo.Effect.easeOut(oCustomEvent.nPos + 'px') 
						}).attach({
							playing : function(oCustomEvent2) {
								self.setScrollTop(self._oSliderVertical.values(0));
							}
						});
					} else {
						self.setScrollTop(this._getValue(0, oCustomEvent.nPos));
					}
				}
			});
			
		}		
		
	},

	_initRolloverArea : function(){
		var self = this,
			sClassPrefix = this.option("sClassPrefix"),
			sClassNameForRollover = this.option("sClassNameForRollover");
			
		this._oRolloverArea = new jindo.RolloverArea(this._el, {
			sClassName : sClassNameForRollover, // (String) 컴포넌트가 적용될 엘리먼트의 class 명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트에 Rollover 컴포넌트가 적용된다.
			sClassPrefix : sClassPrefix // (String) 컴포넌트가 적용될 엘리먼트에 붙게될 class명의 prefix. (prefix+"over|down")
		}).attach({
			over: function(oCustomEvent){
				oCustomEvent.stop();
				self._onRollover("over", oCustomEvent.element);
			},
			down: function(oCustomEvent){
				oCustomEvent.stop();
				self._onMouseDown(oCustomEvent.element);
				self._onRollover("down", oCustomEvent.element);
			},
			up: function(oCustomEvent){
				oCustomEvent.stop();
				self._onMouseUp(oCustomEvent.element);
				self._onRollover("up", oCustomEvent.element);
			},
			out: function(oCustomEvent){
				oCustomEvent.stop();
				self._onRollover("out", oCustomEvent.element);
			}
		});
	},
	
	/**
		content의 내용의 크기가 달라졌을때 스크롤바의 이동 값을 재설정해준다.
		
		@method reset
	**/	
	reset : function() {
		var oSliderH = this.getSliderHorizontal(),
			oSliderV = this.getSliderVertical();
		
		if (oSliderH) {
			this._nScrollWidth = jindo.$Element(this._elContent).width() - jindo.$Element(this._elBox).width();
			oSliderH.option("nMaxValue", this._nScrollWidth);
			this.setScrollLeft(0);
		}
		if (oSliderV) {
			this._nScrollHeight = jindo.$Element(this._elContent).height() - jindo.$Element(this._elBox).height();
			oSliderV.option("nMaxValue", this._nScrollHeight);
			this.setScrollTop(0);			
		}
		
		this._elBox.scrollLeft = 0;
		this._elBox.scrollTop = 0;		
	},
	
	/**
		가로 스크롤이 화면에 표시되었는지 여부를 가져온다.
		
		@method hasScrollBarHorizontal
		@return {Boolean} 
	**/
	hasScrollBarHorizontal : function() {
		var sClassPrefix = this.option("sClassPrefix"),
			o = this.getScrollBarHorizontal();
		
		if (o.elScrollBar) {
			var welScrollBar = jindo.$Element(o.elScrollBar);
			return welScrollBar.visible() || welScrollBar.hasClass(sClassPrefix + "show");	
		}
		return false;
		
	},
	
	/**
		세로 스크롤이 화면에 표시되었는지 여부를 가져온다.
		
		@method hasScrollBarVertical
		@return {Boolean} 
	**/
	hasScrollBarVertical : function() {
		var sClassPrefix = this.option("sClassPrefix"),
			o = this.getScrollBarVertical();
		
		if (o.elScrollBar) {
			var welScrollBar = jindo.$Element(o.elScrollBar);
			return welScrollBar.visible() || welScrollBar.hasClass(sClassPrefix + "show");
		}
		return false;
	},
	
	/**
		세로 스크롤바의 포지션을 설정한다.
		
		@method setScrollTop
		@param {Number} n 포지션 값
		@remark 0.1.2 버전부터 slider 0.3.2버전 필요
	**/
	setScrollTop : function(n) {
		n = Math.min(n, this._nScrollHeight || 0);
		n = Math.max(n, 0);
		n = Math.round(n);

		var htParam = {
			sDirection : "top",
			nPosition : n
		};
		
		jindo.$Element(this._elContent).css("top", (htParam.nPosition * -1) + "px");
		var oSliderV = this.getSliderVertical();
		if (oSliderV) {
			oSliderV.values(0, htParam.nPosition, false); //커스텀 이벤트를 발생하지 않으면서 이동
		}
		
		this._fireScrollEvent(htParam);
	},

	/**
		가로 스크롤바의 포지션을 설정한다.
		
		@method setScrollLeft
		@param {Number} n 포지션 값
		@remark 0.1.2 버전부터 slider 0.3.2버전 필요
	**/
	setScrollLeft : function(n) {
		n = Math.min(n, this._nScrollWidth || 0);
		n = Math.max(n, 0);
		n = Math.round(n);
		
		var htParam = {
			sDirection : "left",
			nPosition : n
		};
		
		jindo.$Element(this._elContent).css("left", (htParam.nPosition * -1) +"px");
		var oSliderH = this.getSliderHorizontal();
		if (oSliderH) {
			oSliderH.values(0, htParam.nPosition, false); //커스텀 이벤트를 발생하지 않으면서 이동
		}
		
		this._fireScrollEvent(htParam);
	},
	
	/**
		세로 스크롤바의 포지션을 상대 값으로 설정한다.
		
		@method setScrollTopBy
		@param {Number} n 상대적인 포지션 값
	**/
	setScrollTopBy : function(n) {
		this.setScrollTop(this.getScrollTop()+n);
	},

	/**
		가로 스크롤바의 포지션을 상대 값으로 설정한다.
		
		@method setScrollLeftBy
		@param {Number} n 상대적인 포지션 값
	**/
	setScrollLeftBy : function(n) {
		this.setScrollLeft(this.getScrollLeft()+n);
	},

	/**
		컨텐트 영역의 세로 스크롤 위치를 구한다.
		
		@method getScrollTop
		@return {Number} 세로 스크롤 위치
	**/
	getScrollTop : function() {
		return parseInt(jindo.$Element(this._elContent).css("top"), 10) * -1;
	},
	
	/**
		컨텐트 영역의 가로 스크롤 위치를 구한다.
		
		@method getScrollLeft
		@return {Number} 가로 스크롤 위치
	**/
	getScrollLeft : function() {
		return parseInt(jindo.$Element(this._elContent).css("left"), 10) * -1;
	},
	
	_getElementType : function(wel) {
		var sClassPrefix = this.option("sClassPrefix");
		
		if (wel.hasClass(sClassPrefix+"track")) {
			return "track";
		}
		else if (wel.hasClass(sClassPrefix+"thumb")) {
			return "thumb";
		}
		else if (wel.hasClass(sClassPrefix+"button-up")) {
			return "button-up";
		}
		else if (wel.hasClass(sClassPrefix+"button-up")) {
			return "button-up";
		}
		else if (wel.hasClass(sClassPrefix+"button-down")) {
			return "button-down";
		}
		else if (wel.hasClass(sClassPrefix+"button-left")) {
			return "button-left";
		}
		else if (wel.hasClass(sClassPrefix+"button-right")) {
			return "button-right";
		}
		else {
			return false;
		}
	},
	
	_fireScrollEvent : function(htParam) {
		/**
			스크롤위치가 바뀔 때
			
			@event scroll
			@param {String} sType 커스텀 이벤트명
			@param {String} sDirection 
			<ul>
			<li>"left"</li>
			<li>"top"</li>
			</ul>
			@param {Number} nPosition 스크롤된 위치
			@example
				//커스텀 이벤트 핸들링 예제
				oScrollBar.attach("scroll", function(oCustomEvent) { ... });
		**/

		if (this._oOldPos[htParam.sDirection] === htParam.nPosition) { return; }
		this._oOldPos[htParam.sDirection] = htParam.nPosition;

		this.fireEvent("scroll", htParam);
	},
	
	_onWheel : function(we) {
		if (!this._bMouseEnter) {
			return;
		}
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		
		var nDelta = we.mouse().delta,
			nDirection  = nDelta===0?0:nDelta / Math.abs(nDelta) * -1,
			n = Math.ceil(Math.abs(nDelta)) * nDirection * this.option("nDelta"),
			bH = this.hasScrollBarHorizontal(),
			bV = this.hasScrollBarVertical();
			
		if (!bH && !bV) {
			return;
		}
		
		if (this.hasScrollBarVertical() && this._bIsEventAttachedForVertical) {
			this.setScrollTop(this.getScrollTop()+n);
			return;
		}
		
		this.setScrollLeft(this.getScrollLeft()+n);
	},
	
	_onMouseDown : function(el) {
		var wel = jindo.$Element(el),
			self = this,
			setScrollBy,
			sElementType = this._getElementType(wel);
		
		switch (sElementType) {
			case "button-up" :
				setScrollBy = function (n){
					self.setScrollTopBy(~~(n * -1));
				};
			break;
			case "button-down" :
				setScrollBy = function (n){
					self.setScrollTopBy(n);
				};
			break;
			case "button-left" :
				setScrollBy = function (n){
					self.setScrollLeftBy(~~(n * -1));
				};
			break;
			case "button-right" :
				setScrollBy = function (n){
					self.setScrollLeftBy(n);
				};
			break;
			default :
			return;
		}
		
		setScrollBy(16);
		this._oTimer.start(function(){
			setScrollBy(16);
			return true;
		}, 100);
		
	},
	
	_onMouseUp : function(el) {
		this._oTimer.abort();
	},
	
	_onMouseEnter : function(we) {
		this._bMouseEnter = true;
	},
	
	_onMouseLeave : function(we) {
		this._bMouseEnter = false;
	},
	
	_onRollover : function(sType, el) {
		var wel = jindo.$Element(el),
			sClassPrefix = this.option("sClassPrefix"),
			sElementType = this._getElementType(wel);
		
		switch (sType) {
			case "over" :
				wel.addClass(sClassPrefix + sElementType + "-over");		
			break;
			case "down" :
				wel.addClass(sClassPrefix + sElementType + "-hold");
			break;
			case "up" :
				wel.removeClass(sClassPrefix + sElementType + "-hold");
			break;
			case "out" :
				wel.removeClass(sClassPrefix + sElementType + "-over");
			break;
		}
		
	},
	
	_initialize4Tablet : function() {
		
		this._fpOnTouchDragStart = jindo.$Fn(function(oEvent) {
			this._oPos4Tablet = oEvent.pos();
		}, this);
		
		this._fpOnTouchDragMove = jindo.$Fn(function(oEvent) {
			
			if (!this._oPos4Tablet) { return; }
			
			var oOldPos = this._oPos4Tablet;
			var oNewPos = oEvent.pos();
			
			this.setScrollLeftBy(oOldPos.pageX - oNewPos.pageX);
			this.setScrollTopBy(oOldPos.pageY - oNewPos.pageY);

			this._oPos4Tablet = oNewPos;
			
			oEvent.stopDefault();
			
		}, this);
		
		this._fpOnTouchDragEnd = jindo.$Fn(function(oEvent) {
			this._oPos4Tablet = null;
		}, this);
		
	},
	
	_activate4Tablet : function() {
		
		var elEl = this._elContent;
		
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._el).preventTapHighlight(true);
		
		this._fpOnTouchDragStart.attach(elEl, 'touchstart');
		this._fpOnTouchDragMove.attach(elEl, 'touchmove');
		this._fpOnTouchDragEnd.attach(elEl, 'touchend');
		
	},
	
	_deactivate4Tablet : function() {
		
		var elEl = this._elContent;
		
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._el).preventTapHighlight(false);
		
		this._fpOnTouchDragStart.detach(elEl, 'touchstart');
		this._fpOnTouchDragMove.detach(elEl, 'touchmove');
		this._fpOnTouchDragEnd.detach(elEl, 'touchend');
		
	}
	
}).extend(jindo.UIComponent);
