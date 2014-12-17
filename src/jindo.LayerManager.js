/**
	@fileOverview 특정 엘리먼트 및 엘리먼트 그룹에서 발생한 이벤트에 따라 레이어를 보여주고 숨겨주는 역할을 하는 컴포넌트
	@version #__VERSION__#
**/
/**
	특정 엘리먼트와 지정한 엘리먼트 그룹에서 발생한 이벤트에 따라 레이어를 보여주고 숨겨주는 컴포넌트
	
	@class jindo.LayerManager
	@extends jindo.UIComponent
	@uses jindo.Timer
	
	@keyword layer, manager, 레이어, 관리
**/
jindo.LayerManager = jindo.$Class({
	/** @lends jindo.LayerManager.prototype */
	
	_bIsActivating  : false,
	_bIsHiding : false, //hide() 메서드가 Timer로 수행되고 있는지의 여부
	_bIsShowing : false,
	_aLink : null,
	
	/**
		LayerManager 컴포넌트를 초기화한다.
		@constructor
		@param {HTMLElement | String} el 숨기고자하는 레이어 엘리먼트 (혹은 id)
		@param {Object} [htOption] 추가 옵션
			@param {String} [htOption.sCheckEvent="click"] 레이어가 숨김동작을 확인할 이벤트 종류. 이 이벤트는 document.body에 바인딩된다. 이벤트 명은 on을 제외하고 입력한다. 예를들어 레이어에서 커서가 벗어나 document.body에 마우스오버되었을 경우 레이어가 닫히게 하고 싶은 경우 "mouseover"로 지정한다. ("mouseout" 아님)
			@param {Number} [htOption.nCheckDelay=100] 레이어 숨김여부를 확인하기 위한 지연시간. sCheckEvent옵션으로 정의된 이벤트가 발생하고 난 후, 지정된 지연시간 전에 link된 엘리먼트에 mouseover되는 경우 레이어가 숨겨지지 않고 취소 된다. 이때 ignore 커스텀 이벤트가 발생한다.<br/>- 단위는 ms(1000이 1초)
			@param {Number} [htOption.nShowDelay=0] 레이어가 보여지기까지의 지연시간<br/>- 단위는 ms(1000이 1초)
			@param {Number} [htOption.nHideDelay=100] 레이어가 숨겨지기까지의 지연시간<br/>- 단위는 ms(1000이 1초)
	**/
	$init: function(el, htOption){
		this.option({
			sCheckEvent: "click",
			nCheckDelay: 100,
			nShowDelay: 0,
			nHideDelay: 100
		});
		
		this.option(htOption || {});
		this.setLayer(el);
		
		this._aLink = [];
		this._oShowTimer = new jindo.Timer();
		this._oHideTimer = new jindo.Timer();
		this._oEventTimer = new jindo.Timer();
		this._wfOnEvent = jindo.$Fn(this._onEvent, this);
		this.getVisible();
		this.activate();
	},
	
	/**
		컴포넌트를 활성화한다.
	**/
	_onActivate : function() {
		this._wfOnEvent.attach(document, this.option("sCheckEvent"));
	},
	
	/**
		컴포넌트를 비활성화한다.
	**/
	_onDeactivate : function() {
		this._wfOnEvent.detach(document, this.option("sCheckEvent"));
	},
	
	/**
		Layer가 보여지고 있는지 여부를 가져온다.
		
		@method getVisible
		@return {Boolean}
	**/
	getVisible: function(){
		return this._wel.visible();
	},
	
	_check: function(el){
		var wel = jindo.$Element(el);
		for (var i = 0, elLink, welLink; (elLink = this._aLink[i]); i++) {
			welLink = jindo.$Element(elLink);
			if (welLink) {
				elLink = welLink.$value();
				if (elLink && wel && (el == elLink || wel.isChildOf(elLink))) {
					return true;
				} 
			}
		}
		return false;
	},
	
	_find: function(el){
		for (var i = 0, elLink; (elLink = this._aLink[i]); i++) {
			if (elLink == el) {
				return i;
			} 
		}
		return -1;
	},
	
	/**
		보여주고 숨겨줄 레이어 객체를 가져온다.
		
		@method getLayer
		@return {HTMLElement} 
	**/
	getLayer : function() {
		return this._el;
	},
	
	/**
		보여주고 숨겨줄 레이어 객체를 설정한다.
		
		@method setLayer
		@param {HTMLElement} el 레이어 엘리먼트
		@return {this} 
	**/
	setLayer : function(el) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(el);
		return this;
	},
	
	/**
		link된 엘리먼트 배열을 가져온다.
		
		@method getLinks
		@return {Array}
	**/
	getLinks : function() {
		return this._aLink;
	},
	
	/**
		link할 엘리먼트 배열을 설정한다.
		
		@method setLinks
		@param {Array} a 엘리먼트 배열
		@return {this} 인스턴스 자신
	**/
	setLinks : function(a) {
		this._aLink = jindo.$A(a).unique().$value();
		return this;
	},
	
	/**
		생성자의 옵션으로 지정한 이벤트가 발생해도 레이어를 닫지 않게 할 엘리먼트를 지정한다
		
		@method link
		@param {vElement} vElement 이벤트를 무시할 엘리먼트 또는 엘리먼트의 ID (인자를 여러개 주어서 다수 지정 가능)
		@return {this} 인스턴스 자신
		@example
			o.link(jindo.$("one"), "two", oEl);
	**/
	link: function(vElement){
		if (arguments.length > 1) {
			for (var i = 0, len = arguments.length; i < len; i++) {
				this.link(arguments[i]);
			}
			return this;
		}
		
		if (this._find(vElement) != -1) {
			return this;
		} 
		
		this._aLink.push(vElement);
		return this;
	},
	
	/**
		생성자의 옵션으로 지정한 이벤트가 발생해도 레이어를 닫지 않게 할 엘리먼트 지정한 것을 제거한다
		
		@method unlink
		@param {vElement} vElement 이벤트가 무시된 엘리먼트 또는 엘리먼트의 ID (인자를 여러개 주어서 다수 지정 가능)
		@return {this} 인스턴스 자신
		@example
			o.unlink(jindo.$("one"), "two", oEl);
	**/
	unlink: function(vElement){
		if (arguments.length > 1) {
			for (var i = 0, len = arguments.length; i < len; i++) {
				this.unlink(arguments[i]);
			}
			return this;
		}
		
		var nIndex = this._find(vElement);
		if (nIndex > -1) {
			this._aLink.splice(nIndex, 1);
		}
		
		return this;
	},
	
	_fireEventBeforeShow : function() {
		/**
			레이어를 보여주기 전에 발생
			
			@event beforeShow
			@param {String} sType 커스텀 이벤트명
			@param {Array} aLinkedElement link된 엘리먼트들
			@param {Element} elLayer 보여지고 감춰지는 대상 레이어
			@param {Function} stop 레이어 보여주는 것을 중단하는 메서드
			@example
				// beforeShow 커스텀 이벤트 핸들링
				oLayerManager.attach("beforeShow", function(oCustomEvent) { ... });
			@example
				// 레이어가 보여지지 않도록 처리
				oLayerManager.attach("beforeShow", function(oCustomEvent) {
					oCustomEvent.stop();
				});
		**/
		return this.fireEvent("beforeShow", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks()
		});
	},
	
	_fireEventShow : function() {
		this._bIsShowing = false;
		/**
			레이어가 화면에 나타나는 것이 끝난 후 발생
			
			@event show
			@param {String} sType 커스텀 이벤트명
			@param {Array} aLinkedElement link된 엘리먼트들
			@param {Element} elLayer 보여지고 감춰지는 대상 레이어
			@example
				// show 커스텀 이벤트 핸들링
				oLayerManager.attach("show", function(oCustomEvent) { ... });
		**/
		this.fireEvent("show", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks()
		});
	},
	
	_fireEventBeforeHide : function() {
		/**
			레이어를 감추기 전에 발생
			
			@event beforeHide
			@param {String} sType 커스텀 이벤트명
			@param {Array} aLinkedElement link된 엘리먼트들
			@param {Element} elLayer 보여지고 감춰지는 대상 레이어
			@param {Function} stop 레이어를 감추는 것을 중단하는 메서드
			@example
				// beforeHide 커스텀 이벤트 핸들링
				oLayerManager.attach("beforeHide", function(oCustomEvent) { ... });
			@example
				// 레이어가 감춰지지 않도록 처리
				oLayerManager.attach("beforeHide", function(oCustomEvent) {
					oCustomEvent.stop();
				});
		**/
		var bRet = this.fireEvent("beforeHide", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks()
		});
		
		if (!bRet) { this._bIsHiding = false; }
		return bRet;
	},
	
	_fireEventHide : function() {
		this._bIsHiding = false;
		/**
			레이어가 감춰진 후 발생
			
			@event hide
			@param {String} sType 커스텀 이벤트명
			@param {Array} aLinkedElement link된 엘리먼트들
			@param {Element} elLayer 보여지고 감춰지는 대상 레이어
			@example
				// hide 커스텀 이벤트 핸들링
				oLayerManager.attach("hide", function(oCustomEvent) { ... });
		**/
		this.fireEvent("hide", {
			elLayer : this.getLayer(),
			aLinkedElement : this.getLinks()
		});
	},
	
	_show: function(fShow, nDelay){
		var self = this;
		
		this._oEventTimer.abort();
		this._bIsShowing = true;
		this._bIsHiding = false;

		if (nDelay <= 0) { self._oHideTimer.abort(); }
		this._oShowTimer.start(function() {
			fShow();
		}, nDelay);
	},
	
	_hide: function(fHide, nDelay){
		var self = this;

		this._bIsShowing = false;
		this._bIsHiding = true;
		
		if (nDelay <= 0) { self._oShowTimer.abort(); }
		this._oHideTimer.start(function() {
			fHide();
		}, nDelay);
	},
	
	/**
		레이어를 보여준다.
		
		@method show
		@param {Number} nDelay 레이어를 보여줄 때의 지연시간을 지정 (생략시 옵션으로 지정한 nShowDelay 값을 따른다)
		@return {this} 인스턴스 자신
	**/
	show : function(nDelay) {
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nShowDelay");
		}
		var self = this;
		this._show(function(){
			if (!self.getVisible()) {
				if (self._fireEventBeforeShow()) {
					self._wel.show();
					self._fireEventShow();
				}
			}
		}, nDelay);
		
		return this;
	},
	
	/**
		레이어를 숨긴다.
		
		@method hide
		@param {Number} nDelay nDelay 레이어를 숨길 때의 지연시간을 지정 (생략시 옵션으로 지정한 nHideDelay 값을 따른다)
		@return {this} 인스턴스 자신
	**/
	hide : function(nDelay) {
		if (typeof nDelay == "undefined") {
			nDelay = this.option("nHideDelay");
		}
		var self = this;
		this._hide(function(){
			if (self.getVisible()) {
				if (self._fireEventBeforeHide()) {
					self._wel.hide();
					self._fireEventHide();
				}
			}
		}, nDelay);
		return this;
	},
	
	/**
		레이어를 보여주거나 숨기도록 요청한다.
		
		@method toggle
		@param {Number} nDelay 레이어를 보여주거나 숨길 때의 지연시간을 지정 (생략시 옵션으로 지정한 showDelay/hideDelay 값을 따른다)
		@return {this} 인스턴스 자신
	**/
	toggle: function(nDelay){
		if (!this.getVisible() || this._bIsHiding) {
			this.show(nDelay || this.option("nShowDelay"));
		} else {
			this.hide(nDelay || this.option("nHideDelay"));
		}
		return this;
	},
	
	_onEvent : function(we){
		var el = we.element,
			self = this;
		
		this._oEventTimer.start(function() {
			if (!self._bIsHiding && self.getVisible()) {
				if (self._check(el)) { // hide()수행중이 아니고 links 객체들 안에서 발생한거면 무시
					if (!self._bIsShowing) {
						/**
							sCheckEvent가 발생했으나 레이어를 숨기지 않도록 무시된 경우에 발생
							
							@event ignore
							@param {String} sType 커스텀 이벤트명
							@param {Array} aLinkedElement link된 엘리먼트들
							@param {Element} elLayer 보여지고 감춰지는 대상 레이어
							@param {String} sCheckEvent 발생된 이벤트 타입
							@example
								// ignore 커스텀 이벤트 핸들링
								oLayerManager.attach("ignore", function(oCustomEvent) { ... });
						**/
						self.fireEvent("ignore", {
							sCheckEvent : self.option("sCheckEvent")
						});
						self._oHideTimer.abort();
						self._bIsHiding = false;
					}
				} else { //이벤트에 의해 hide()
					//mousedown시 disabled된 input일 경우 el이 제대로 리턴되지 않는 IE버그 수정
					// [JINDOSUS-1630] 오페라에서 키보드 사용시 OPTION 에서 mousedown 이벤트가 발생하는 버그 회피
					if (typeof el.tagName !== "undefined" && el.tagName !== 'OPTION') {
						self.hide();
					}
				}
			}
		}, this.option("nCheckDelay"));	//link된 레이어 내를 클릭해서 레이어를 닫으려하는 경우 처리
	}
}).extend(jindo.UIComponent);