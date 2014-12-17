/**
	@fileOverview 탭이동을 구현한 컴포넌트
	@author hooriza, modified by senxation
	@version #__VERSION__#
**/
/**
	jindo.TabControl 컴포넌트는 여러 패널로 나뉘어진 구조를 탭으로 네비게이팅 가능하게 합니다.
	
	@class jindo.TabControl
	@extends jindo.UIComponent
	@keyword tabcontrol, 탭컨트롤
**/
jindo.TabControl = jindo.$Class({
	/** @lends jindo.TabControl.prototype */

	_bIsActivating : false, //컴포넌트의 활성화 여부

	_nCurrentIndex : null, //현재 선택된 탭의 인덱스
	_welSelectedTab : null,
	_welSelectedPanel : null,
	
	/**
		TabControl 컴포넌트를 생성한다.
		
		@constructor
		@param {HTMLElement} el TabControl을 적용한 기준 엘리먼트.
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassPrefix="tc-"] 클래스명 접두어
			@param {String} [htOption.sCheckEvent="click"] 탭에 적용될 이벤트
			<ul>
			<li>"mouseover"</li>
			<li>"mousedown"</li>
			<li>"click"</li>
			</ul>
			@param {Boolean} [htOption.bActivateOnload=true] 로드시 activate() 수행여부
		@example
			<!--
				기준 엘리먼트는 반드시 같은 수의 classPrefix+"tab", classPrefix+"panel" 쌍을 가져야하고 각 쌍은 특정 엘리먼트로 감싸져있어야한다.
				아래 예 참고.
			-->
			<div id="tab">
				<ul>
					<li class="tc-tab">첫번째</li> <!-- tab의 클래스명은 옵션의 classPrefix+"tab"으로 정해야한다. -->
					<li class="tc-tab tc-selected">두번째</li> <!-- default로 선택될 탭을 지정할 경우 tab의 클래스명은 옵션의 classPrefix+"selected"으로 정한다. (탭이 선택되었을 때 해당 탭과 매칭되는 패널은 classPrefix+"selected"의 클래스명을 갖게 된다.) -->
					<li class="tc-tab">세번째</li>
				</ul>
				<div>
					<div class="tc-panel">SUB SUB #1</li> <!-- tab이 선택되었을때 보여지는 panel의 클래스명은 옵션의 classPrefix+"panel"으로 정해야한다. -->
					<div class="tc-panel tc-selected">SUB SUB #2</li> <!-- default로 선택될 탭을 지정할 경우 panel의 클래스명은 옵션의 classPrefix+"selected"으로 정한다. -->
					<div class="tc-panel">SUB SUB #3</li>
				</div>
			</div>
		@example
			var oTab = new jindo.TabControl(jindo.$('tab'), { 
				sClassPrefix : "tc-" // (String) 클래스명 앞에 붙게되는 prefix 선언
				sCheckEvent : "click", //탭에 적용될 이벤트 ("mouseover", "mousedown", "click")
				bActivateOnload : true //로드시 컴포넌트 활성화여부
			}).attach({
				beforeSelect : function(oCustomEvent) {
					//탭이 선택되기 전에 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					// 	nIndex : (Number) 선택된 탭의 인덱스
					// 	elTab : (HTMLElement) 선택된 탭
					// 	elPanel : (HTMLElement) 선택된 패널
					//}
					//oCustomEvent.stop()시 해당 탭이 선택되지 않음.
				}
				select : function(oCustomEvent) {
					//탭이 선택되었을 때 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					// 	nIndex : (Number) 선택된 탭의 인덱스
					// 	elTab : (HTMLElement) 선택된 탭
					// 	elPanel : (HTMLElement) 선택된 패널
					//}
				}
			});
	**/
	$init : function(el, htOption) {
		
		//옵션 초기화
		var htDefaultOption = {
			sClassPrefix : 'tc-', //Default Class Prefix
			sCheckEvent : "click", //탭에 적용될 이벤트 ("mouseover", "mousedown", "click")
			bActivateOnload : true //로드시 컴포넌트 활성화여부
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		//Base 엘리먼트 설정
		this._el = jindo.$(el);
		
		this._wfEventTab = jindo.$Fn(this._onEventTab, this);

		//컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
		this._assignHTMLElements();
		
		//활성화
		if(this.option("bActivateOnload")) {
			this._selectTab(this._elSelectedTab);
			this.activate(); //컴포넌트를 활성화한다.	
		}
	},
	
	/**
		컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
	**/
	_assignHTMLElements : function() {
		var sPrefix = this.option('sClassPrefix'),
			el = this._el;
		
		this._aTab = jindo.$$('.' + sPrefix + 'tab', el);
		this._aPanel = jindo.$$('.' + sPrefix + 'panel', el);
		this._elSelectedTab = jindo.$$.getSingle('.' + sPrefix + 'tab.' + sPrefix + 'selected', el) || this.getTab(0);
		this._waTab = jindo.$A(this._aTab);
	},
	
	/**
		n번째 탭 엘리먼트를 구한다.
		
		@method getTab
		@param {Number} n 몇 번째 탭 엘리먼트인지
		@return {HTMLElement}
	**/
	getTab : function(n) {
		return this.getTabs()[n];
	},

	/**
		탭 엘리먼트 목록을 구한다.
		
		@method getTabs
		@return {Array}
	**/
	getTabs : function() {
		return this._aTab;
	},

	/**
		n번째 패널 엘리먼트를 구한다.
		
		@method getPanel
		@param {Number} n 몇 번째 패널 엘리먼트인지
		@return {HTMLElement}
	**/
	getPanel : function(n) {
		return this.getPanels()[n];
	},

	/**
		패널 엘리먼트 목록을 구한다.
		
		@method getPanels
		@return {Array}
	**/
	getPanels : function() {
		return this._aPanel;
	},

	/**
		n번째 Tab을 선택한다.
		
		@method selectTab
		@param {Number} n 몇 번째 탭인지
		@param {Boolean} bFireEvent 선택시 사용자 이벤트를 발생할 지 여부
	**/
	selectTab : function(n, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;
		}
		
		this._selectTab(this.getTab(n), bFireEvent);
	},

	/**
		몇 번째 탭인지 구한다.
		
		@method getIndex
		@param {HTMLElement} elTab 탭 엘리먼트
		@return {Number}
	**/	
	getIndex : function(elTab) {
		return this._waTab.indexOf(elTab);
	},
	
	/**
		현재 몇번째 탭이 보여지고 있는지 구한다.
		
		@method getCurrentIndex
		@return {Number}
	**/
	getCurrentIndex : function() {
		return this._nCurrentIndex;
	},
	
	_selectTab : function(elTab, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;	
		}
		
		var sPrefix = this.option('sClassPrefix'),
			nIndex = this.getIndex(elTab),
			elPanel = this.getPanel(nIndex);
		
		if (bFireEvent) {
			/**
				탭이 선택되기 전
				
				@event beforeSelect
				@param {String} sType 커스텀 이벤트명
				@param {Number} nIndex 선택될 탭의 인덱스
				@param {HTMLElement} elTab 선택될 탭
				@param {HTMLElement} elPanel 선택될 패널
				@param {Function} stop 수행시 해당 탭이 선택되지 않음
				@example
					// 커스텀 이벤트 핸들링 예제
					oTabControl.attach("beforeSelect", function(oCustomEvent) { ... });
			**/
			if (!this.fireEvent("beforeSelect", {
				nIndex : nIndex,
				elTab : elTab,
				elPanel : elPanel
			})) {
				return;
			}
		}
		
		var welTab = jindo.$Element(elTab);
		if (this._welSelectedTab) {
			this._welSelectedTab.removeClass(sPrefix + 'selected');
		}
		this._welSelectedTab = welTab;
		welTab.addClass(sPrefix + 'selected');
		
		var welPanel = jindo.$Element(elPanel);
		if (this._welSelectedPanel) {
			this._welSelectedPanel.removeClass(sPrefix + 'selected');
		}
		this._welSelectedPanel = welPanel;
		welPanel.addClass(sPrefix + 'selected');
		
		this._nCurrentIndex = nIndex;
		
		if (bFireEvent) {
			/**
				탭이 선택된 후
				
				@event select
				@param {String} sType 커스텀 이벤트명
				@param {Number} nIndex 선택된 탭의 인덱스
				@param {HTMLElement} elTab 선택된 탭
				@param {HTMLElement} elPanel 선택된 패널
				@example
					// 커스텀 이벤트 핸들링 예제
					oTabControl.attach("select", function(oCustomEvent) { ... });
			**/
			this.fireEvent("select", {
				nIndex : nIndex,
				elTab : elTab,
				elPanel : elPanel
			});
		}
	},
	
	/**
		컴포넌트의 베이스 엘리먼트를 가져온다.
		
		@method getBaseElement
		@return {HTMLElement}
	**/
	getBaseElement : function() {
		return this._el;
	},
	
	/**
		컴포넌트를 활성화한다.
		@return {this}
	**/
	_onActivate : function() {
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._el).preventTapHighlight(true);
		this._wfEventTab.attach(this._el, this.option("sCheckEvent"));
	},
	
	/**
		컴포넌트를 비활성화한다.
		@return {this}
	**/
	_onDeactivate : function() {
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._el).preventTapHighlight(false);
		this._wfEventTab.detach(this._el, this.option("sCheckEvent"));
	},
	
	_onEventTab : function(we) {
		if (this.fireEvent(we.type, { weEvent : we })) {
			var sPrefix = this.option('sClassPrefix'),
				el = we.element,
				elTab = jindo.$$.test(el, '.' + sPrefix + 'tab') ? el : jindo.$$.getSingle('! .' + sPrefix + 'tab', el);
				
			if (elTab) {
				this._selectTab(elTab);	
			}
		}
	}
}).extend(jindo.UIComponent);