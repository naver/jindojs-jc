/**
	@fileOverview jindo.RolloverArea와 달리 mousedown/mouseup이 아닌 click과 dbclick이벤트를 체크하는 컴포넌트
	@version #__VERSION__#
**/
/**
	RolloverArea와 달리 mousedown/mouseup이 아닌 click이벤트를 체크하는 컴포넌트
	RolloverClick 컴포넌트는 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 엘리먼트에 마우스액션이 있을 경우 클래스명을 변경하는 이벤트를 발생시킨다.
	
	@class jindo.RolloverClick
	@extends jindo.UIComponent
	@uses jindo.RolloverArea
	@keyword rolloverclick, click, 롤오버클릭
**/
jindo.RolloverClick = jindo.$Class({
	/** @lends jindo.RolloverClick.prototype */
	
	/**
		RolloverClick 컴포넌트를 초기화한다.
		
		@constructor
		@param {HTMLElement} el RolloverArea에 적용될 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
		@param {Object} [htOption] 옵션 객체
			@param {Boolean} [htOption.bActivateOnload=true] 컴포넌트 초기화 시점에 컴포넌트를 활성화(이벤트 바인딩) 시킬지 여부. false로 지정한경우에는 사용자가 직접 activate함수를 사용하여 활성화시킬수 있다.
			@param {String} [htOption.sCheckEvent="click"] 체크할 마우스이벤트명. "mousedown" 혹은 "mouseup"으로 대체가능
			@param {Boolean} [htOption.bCheckDblClick=false] 더블클릭 이벤트를 체크할것인지 여부
			@param {Object} [htOption.RolloverArea] jindo.RolloverArea에 적용될 옵션 (RolloverArea 컴포넌트 문서 참고)
		@exmaple
			var oRolloverClick = new jindo.RolloverClick(document.body,{bActivateOnload:flase, ... });
			oRolloverClick.activate();
	**/
	$init : function(el, htOption) {
		this.option({ 
			bActivateOnload : true,
			sCheckEvent : "click",
			bCheckDblClick : false, // (Boolean) 더블클릭이벤트를 체크할 지 여부
			RolloverArea : { //RolloverArea에 적용될 옵션 객체
				sClassName : "rollover", // (String) 컴포넌트가 적용될 엘리먼트의 class 명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트에 Rollover 컴포넌트가 적용된다.
				sClassPrefix : "rollover-", // (String) 컴포넌트가 적용될 엘리먼트에 붙게될 class명의 prefix. (prefix+"over|down")
				bCheckMouseDown : false,
				bActivateOnload : false,
				htStatus : {
					sOver : "over", // (String) mouseover시 추가될 클래스명
					sDown : "down" // (String) mousedown시 추가될 클래스명
				}  
			}
		});
		this.option(htOption || {});
		
		var self = this;
		this._oRolloverArea = new jindo.RolloverArea(el, this.option("RolloverArea")).attach({
			over : function(oCustomEvent) {
				/**
					MouseOver 이벤트 발생시(적용된 Element에 마우스가 커서가 올라간 경우)
					
					@event over
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} element 이벤트가 발생 Element
					@param {Object} htStatus htStatus 옵션 값
					@param {jindo.$Event} weEvent 이벤트 객체
					@param {Function} stop 수행시 클래스명이 추가되지 않는다
					@example
						oRolloverClick.attach("over", function(oCustomEvent) { ... });
				**/
				if (!self.fireEvent("over", oCustomEvent)) {
					oCustomEvent.stop();
				}
			},
			out : function(oCustomEvent) {
				/**
					MouseOut 이벤트 발생시(적용된 Element에서 마우스가 빠져나간 경우)
					
					@event out
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} element 이벤트가 발생 Element
					@param {Object} htStatus htStatus 옵션 값
					@param {jindo.$Event} weEvent 이벤트 객체
					@param {Function} stop 수행시 클래스명이 제거되지 않는다
					@example
						oRolloverClick.attach("out", function(oCustomEvent) { ... });
				**/
				if (!self.fireEvent("out", oCustomEvent)) {
					oCustomEvent.stop();
				}
			}
		});
		this._wfClick = jindo.$Fn(this._onClick, this);
		this._wfDblClick = jindo.$Fn(this._onClick, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_onClick : function(we) {
		var elRollover = we.element,
			sType = "click";
			
		if (we.type == "dblclick") {
			sType = we.type;
		}
		
		while ((elRollover = this._oRolloverArea._findRollover(elRollover))) {
			/**
				click 이벤트 발생시(적용된 Element 위에서 마우스가 클릭된경우 발생)
				
				@event click
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@example
					oRolloverClick.attach("click", function(oCustomEvent) { ... });
			**/
			/**
				dblclick 이벤트 발생시(적용된 Element에 마우스를 눌렀다가 놓은 경우 발생)
				
				@event dblclick
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@example
					oRolloverClick.attach("dblclick", function(oCustomEvent) { ... });
			**/
			this.fireEvent(sType, { 
				element : elRollover,
				htStatus : this._oRolloverArea.option("htStatus"),
				weEvent : we
			});
			
			elRollover = elRollover.parentNode;
		}
	},
	
	/**
		RolloverClick를 활성화시킨다.
		@return {this}
	**/
	_onActivate : function() {
		this._wfClick.attach(this._oRolloverArea._elArea, this.option("sCheckEvent"));
		if (this.option("bCheckDblClick")) {
			this._wfDblClick.attach(this._oRolloverArea._elArea, 'dblclick');
		}
		this._oRolloverArea.activate();
	},
	
	/**
		RolloverClick를 비활성화시킨다.
		@return {this}
	**/
	_onDeactivate : function() {
		this._wfClick.detach(this._oRolloverArea._elArea, this.option("sCheckEvent"));
		this._wfDblClick.detach(this._oRolloverArea._elArea, 'dblclick');
		this._oRolloverArea.deactivate();
	}
}).extend(jindo.UIComponent);