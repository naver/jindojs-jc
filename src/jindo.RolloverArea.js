/**
	@fileOverview 마우스의 롤오버 액션을 커스텀 이벤트 핸들링으로 쉽게 컨트롤할 수 있게 도와주는 컴포넌트
	@version #__VERSION__#
**/
/**
	마우스 이벤트에 따라 롤오버효과를 쉽게 처리할 수 있게 도와주는 컴포넌트
	RolloverArea 컴포넌트는 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 엘리먼트에 마우스액션이 있을 경우 클래스명을 변경하는 이벤트를 발생시킨다.
	
	@class jindo.RolloverArea
	@extends jindo.UIComponent
	@keyword rolloverarea, area, 롤오버에어리어
**/
jindo.RolloverArea = jindo.$Class({
	/** @lends jindo.RolloverArea.prototype */
	  
	/**
		RolloverArea 컴포넌트를 초기화한다.
		
		@constructor
		@param {HTMLElement} el 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassName="rollover"] RolloverArea 컴포넌트가 적용될 HTMLElement의 클래스명
			@param {String} [htOption.sClassPrefix="rollover-"] MouseOver, MouseDown이벤트 발생시 HTMLElement에 추가될 클래스명의 Prefix
			@param {Boolean} [htOption.bCheckMouseDown=true] MouseDown, MouseUp 이벤트를 사용여부. (false면 down, up시 클래스가 추가되지 않으며, 커스텀 함수도 발생하지 않음)
			@param {Boolean} [htOption.bActivateOnload=true] 컴포넌트 초기화 시점에 컴포넌트를 활성화(이벤트 바인딩) 시킬지 여부. false로 지정한경우에는 사용자가 직접 activate함수를 사용하여 활성화시킬수 있다.
			@param {Object} [htOption.htStatus] 이벤트 발생시 추가될 클래스명
			@param {String} [htOption.htStatus.sOver="over"] MouseOver 이벤트 발생시 추가될 클래스명
			@param {String} [htOption.htStatus.sDown="down"] MouseDown 이벤트 발생시 추가될 클래스명
		@example
			var oRolloverArea = new jindo.RolloverArea(document.body,{bActivateOnload:false, ... });
			oRolloverArea.activate();
		@example
			var oRolloverArea = new jindo.RolloverArea(document.body,{
			sClassPrefix : 'rollover-', htStatus : {
				sOver : "over", // MouseOver시 추가되는 클래스명 "rollover-over"
				sDown : "down" // MouseDown시 추가되는 클래스명 "rollover-down"
			}});
	**/
	$init : function(el, htOption) {
		this.option({ 
			sClassName : "rollover", 
			sClassPrefix : "rollover-",
			bCheckMouseDown : true,
			bActivateOnload : true,
			htStatus : {
				sOver : "over",
				sDown : "down"
			} 
		});
		this.option(htOption || {});
		
		this._elArea = jindo.$(el);
		this._aOveredElements = [];
		this._aDownedElements = [];
		this._wfMouseOver = jindo.$Fn(this._onMouseOver, this);
		this._wfMouseOut = jindo.$Fn(this._onMouseOut, this);
		this._wfMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfMouseUp = jindo.$Fn(this._onMouseUp, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_addOvered : function(el) {
		this._aOveredElements.push(el);
	},
	
	_removeOvered : function(el) {
		this._aOveredElements.splice(jindo.$A(this._aOveredElements).indexOf(el), 1);
	},
	
	_addStatus : function(el, sStatus) {
		jindo.$Element(el).addClass(this.option('sClassPrefix') + sStatus);
	},
	
	_removeStatus : function(el, sStatus) {
		jindo.$Element(el).removeClass(this.option('sClassPrefix') + sStatus);
	},
	
	_isInnerElement : function(elParent, elChild) {
		return elParent === elChild ? true : jindo.$Element(elParent).isParentOf(elChild);
	},
	
	/**
		RolloverArea를 활성화시킨다.
		@return {this}
	**/
	_onActivate : function() {
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._elArea).preventTapHighlight(true);
		this._wfMouseOver.attach(this._elArea, 'mouseover');
		this._wfMouseOut.attach(this._elArea, 'mouseout');
		if (this.option("bCheckMouseDown")) {
			this._wfMouseDown.attach(this._elArea, 'mousedown');
			this._wfMouseUp.attach(document, 'mouseup');
		}
	},
	
	/**
		RolloverArea를 비활성화시킨다.
		@return {this}
	**/
	_onDeactivate : function() {
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._elArea).preventTapHighlight(false);
		this._wfMouseOver.detach(this._elArea, 'mouseover');
		this._wfMouseOut.detach(this._elArea, 'mouseout');
		this._wfMouseDown.detach(this._elArea, 'mousedown');
		this._wfMouseUp.detach(document, 'mouseup');
		
		this._aOveredElements.length = 0;
		this._aDownedElements.length = 0;
	},
	
	_findRollover : function(el) {
		var sClassName = this.option('sClassName');
		return jindo.$$.test(el, '.' + sClassName) ? el : jindo.$$.getSingle('! .' + sClassName, el);
	},
	
	_onMouseOver : function(we) {
		var el = we.element,
			elRelated = we.relatedElement,
			htParam;
		
		for (; (el = this._findRollover(el)); el = el.parentNode) {
			if (elRelated && this._isInnerElement(el, elRelated)) {
				continue;
			}
			
			this._addOvered(el);
				
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			
			/**
				MouseOver 이벤트 발생시 (적용된 Element에 마우스가 커서가 올라간 경우)
				
				@event over
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@param {Function} stop 수행시 클래스명이 추가되지 않는다.
				@example
					oRolloverArea.attach("over", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent('over', htParam)) {
				this._addStatus(htParam.element, htParam.htStatus.sOver);
			} 
		}
	},
	
	_onMouseOut : function(we) {
		var el = we.element,
			elRelated = we.relatedElement,
			htParam;
		
		for (; (el = this._findRollover(el)); el = el.parentNode) {
			if (elRelated && this._isInnerElement(el, elRelated)) {
				continue;
			} 
			
			this._removeOvered(el);
				
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			
			/**
				MouseOut 이벤트 발생시 (적용된 Element에서 마우스가 빠져나간 경우)
				
				@event out
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@param {Function} stop 수행시 클래스명이 제거되지 않는다.
				@example
					oRolloverArea.attach("out", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent('out', htParam)) {
				this._removeStatus(htParam.element, htParam.htStatus.sOver);
			} 
		}
	},
	
	_onMouseDown : function(we) {
		var el = we.element,
			htParam;
			
		while ((el = this._findRollover(el))) {
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			this._aDownedElements.push(el);
			
			/**
				MouseDown 이벤트 발생시 (적용된 Element 위에서 마우스 버튼이 눌린 경우 발생)
				
				@event down
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement}element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@param {Function} stop 수행시 클래스명이 추가되지 않는다
				@example
					oRolloverArea.attach("down", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent('down', htParam)) {
				this._addStatus(htParam.element, htParam.htStatus.sDown);
			}
			
			el = el.parentNode;
		}
	},
	
	_onMouseUp : function(we) {
		var el = we.element,
			aTargetElementDatas = [],		
			aDownedElements = this._aDownedElements,
			htParam,
			elMouseDown,
			i;
		
		for (i = 0; (elMouseDown = aDownedElements[i]); i++) {
			aTargetElementDatas.push({ 
				element : elMouseDown,
				htStatus : this.option("htStatus"),
				weEvent : we
			});
		}
		
		for (; (el = this._findRollover(el)); el = el.parentNode) {
			if (jindo.$A(aDownedElements).indexOf(el) > -1) {
				continue;
			}
			
			aTargetElementDatas.push({ 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			});
		}
		
		for (i = 0; (htParam = aTargetElementDatas[i]); i++) {
			/**
				MouseUp 이벤트 발생시 (적용된 Element에 마우스를 눌렀다가 놓은경우 발생)
				
				@event up
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} element 이벤트가 발생 Element
				@param {Object} htStatus htStatus 옵션 값
				@param {jindo.$Event} weEvent 이벤트 객체
				@param {Function}stop 수행시 클래스명이 제거되지 않는다
				@example
					oRolloverArea.attach("up", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent('up', htParam)) {
				this._removeStatus(htParam.element, htParam.htStatus.sDown);
			}		
		}
		
		this._aDownedElements = [];
	}
}).extend(jindo.UIComponent);
