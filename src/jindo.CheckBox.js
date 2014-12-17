/**
	@fileOverview 체크박스나 라디오버튼의 디자인을 대체하기 위한 HTML Component 
	@author hooriza, modified by senxation
	@version #__VERSION__#
**/

/**
	jindo.CheckBox 컴포넌트는 Checkbox/Radio Button 컨트롤의 디자인을 커스터마이징합니다.
	
	@class jindo.CheckBox
	@extends jindo.HTMLComponent
	
	@keyword input, checkbox, 체크박스, 디자인
**/
jindo.CheckBox = jindo.$Class({
	/** @lends jindo.CheckBox.prototype */
	sTagName : 'input[type=checkbox]', //'input[type=radio]'
	
	/**
		CheckBox 컴포넌트를 생성한다.
		@constructor 
		@param {String | HTMLElement} el input[type=checkbox] 또는 input[type=radio]를 감싸고 있는 엘리먼트 혹은 그 id
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassPrefix="checkbox-"] 클래스명의 접두어. [prefix]mark, [prefix]focused, [prefix]applied, [prefix]disabled, [prefix]checked 클래스명이 사용된다.
		@remark input[type=checkbox], input[type=radio]에 이벤트를 직접 바인딩해서 사용할 경우 제대로 동작하지 않음
		@example
			<span id="ajax_checkbox">
				<span class="ajax_checkbox_mark"></span><input type="checkbox" name="c" id="c1" />
			</span> 
			<label for="c1">첫번째</label>
			
			<script type="text/javascript" language="javascript">
				var oCheckBox = jindo.CheckBox(jindo.$('ajax_checkbox'), { sClassPrefix : 'checkbox-' }).attach({
					beforeChange : function(oCustomEvent) {
						//전달되는 이벤트객체 oCustomEvent = {
						//	bChecked : (Boolean) 체크 여부
						//}
						//oCustomEvent.stop(); 수행시 체크/해제 되지 않음
					},
					change : function(oCustomEvent) {
						//전달되는 이벤트객체 oCustomEvent = {
						//	bChecked : (Boolean) 체크 여부
						//}
					}
				});
			</script>
	**/
	$init : function(el, htOption) {
		this.option({
			sClassPrefix : 'checkbox-'
		});
		
		this.option(htOption || {});

		this._elWrapper = jindo.$(el);
		this._welWrapper = jindo.$Element(el);
		this._assignHTMLElements();
		
		this.wfOnClickInput = jindo.$Fn(this._onClickInput, this);
		this.wfOnClickWrapper = jindo.$Fn(this._onClickWrapper, this);
		this.wfOnFocusInput = jindo.$Fn(this._onFocusInput, this);
		this.wfOnBlurInput = jindo.$Fn(this._onBlurInput, this);
		
		this.activate();
		this.paint();
	},
	
	_assignHTMLElements : function() {
		var elWrapper = this._elWrapper;
		/**
			해당 input[type=checkbox] 엘리먼트
			@ignore
		**/
		this._elInput = jindo.$$.getSingle('input', elWrapper);
		/**
			해당 input[type=checkbox] 엘리먼트를 대체할 엘리먼트
			@ignore
		**/
		if (this._elInput.type == "radio") {
			this.sTagName = "input[type=radio]";
			this.option("sClassPrefix", "radio-");
		}
		var sPrefix = this.option('sClassPrefix');
		this._elSubstitute = jindo.$$.getSingle("." + sPrefix + "mark", elWrapper);
		this._welSubstitute = jindo.$Element(this._elSubstitute);
	},
	
	/**
		Input 엘리먼트를 구한다.
		
		@method getInput
		@return {HTMLElement} Input 엘리먼트
	**/
	getInput : function() {
		return this._elInput;
	},
	
	/**
		Input 엘리먼트의 Check 여부를 가져온다.
		
		@method getChecked
		@return {Boolean} Input 엘리먼트의 Check 여부
	**/
	getChecked : function() {
		return this.getInput().checked;
	},
	
	/**
		Input 엘리먼트의 Check 여부를 설정한다.
		
		@method setChecked
		@param {Boolean} b 체크 할지 여부 (true : 체크, false : 체크안함)
		@param {Boolean} [bFireEvent=true] change 이벤트의 발생 여부
		@return {this} Input 엘리먼트의 Check 여부를 설정한 인스턴스 자신
	**/
	setChecked : function(b, bFireEvent) {
		if (typeof bFireEvent == "undefined") {
			bFireEvent = true;
		}
		
		var elInput = this.getInput(),
			bValue = elInput.checked;
		
		if (bValue != b) {
			elInput.checked = b;
			
			switch (elInput.type) {
				case "checkbox" :
					this.paint();
				break;
				case "radio" :
					var self = this;
					//name이 같은 input만 다시 그림
					jindo.$A(this.constructor._aInstances).forEach(function(oRadioButton){
						if (oRadioButton.getInput().name == elInput.name) {
							oRadioButton.paint();
						} 
					});
				break;
			}
			
			if (bFireEvent) {
				this._fireChangeEvent(b);
			}
		}
		
		return this;
	},
	
	_fireChangeEvent : function(b) {
		/**
			 값이 변경되면 발생
			
			@event change
			@param {String} 커스텀 이벤트명
			@param {Boolean} bChecked 체크 상태 값
			@example
				// change 커스텀 이벤트 핸들링 예제
				oCheckBox.attach("change", function(oCustomEvent) { ... });
		**/
		this.fireEvent("change", {
			bChecked : b
		});
	},
	
	/**
		CheckBox를 enable 시킨다.
		
		@method enable
		@return {this} CheckBox를 enable 시킨 인스턴스 자신
	**/
	enable : function() {
		this.getInput().disabled = false;
		this.paint();
		return this;
	},
	
	/**
		CheckBox를 disable 시킨다.
		
		@method disable
		@return {this} CheckBox를 disable 시킨 인스턴스 자신
	**/
	disable : function() {
		this.getInput().disabled = true;
		this.paint();
		return this;
	},
	
	_onClickInput : function(we) {
		we.stop(jindo.$Event.CANCEL_DEFAULT);
		
		var self = this;
		setTimeout(function(){ //Scope 안에서 input[type=checkbox]의 checked가 이상함!
			self._welWrapper.fireEvent("click");	
		}, 1);
	},
	
	_onClickWrapper : function(we) {
		var elInput = this._elInput;
		if (elInput.disabled || we.element === elInput) { /* Diabled거나 Label을 클릭했거나 키보드 스페이스로 직접 선택했을 때 */
			return;
		}
		elInput.focus();
		
		/**
			 값이 변경되기 전에 발생
			
			@event beforeChange
			@param {String} sType 커스텀 이벤트명
			@param {Boolean} bChecked 체크 상태 값
			@param {Function} stop stop 함수를 실행하게 되면 값이 변경되지 않는다.
			@example
				// beforeChange 커스텀 이벤트 핸들링 예제
				oCheckBox.attach("beforeChange", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent("beforeChange", { bChecked : elInput.checked })) {
			this.setChecked(((elInput.type == "radio") ? true : !elInput.checked));
		}
	},
	
	_onFocusInput : function(we) {
		this._welWrapper.addClass(this.option('sClassPrefix') + 'focused'); 
	},
	
	_onBlurInput : function(we) {
		this._welWrapper.removeClass(this.option('sClassPrefix') + 'focused');
	},
	
	/**
		컴포넌트를 활성화한다.
	**/
	_onActivate : function() {
		
		this.$super._onActivate();

		this._welWrapper.addClass(this.option('sClassPrefix') + 'applied');
		
		this.wfOnClickInput.attach(this._elInput, 'click');
		this.wfOnClickWrapper.attach(this._elWrapper, 'click');
		this.wfOnFocusInput.attach(this._elInput, 'focus');
		this.wfOnBlurInput.attach(this._elInput, 'blur');

	},
	
	/**
		컴포넌트를 비활성화한다.
	**/
	_onDeactivate : function() {
		
		this._welWrapper.removeClass(this.option('sClassPrefix') + 'applied');
		
		this.wfOnClickInput.detach(this._elInput, 'click');
		this.wfOnClickWrapper.detach(this._elWrapper, 'click');
		this.wfOnFocusInput.detach(this._elInput, 'focus');
		this.wfOnBlurInput.detach(this._elInput, 'blur');
		
		this.$super._onDeactivate();
		
	},
	
	/**
		컴포넌트를 새로 그려준다. (HTMLComponent 공통메서드)
	**/
	_onPaint : function() {
		var sPrefix = this.option('sClassPrefix');
		
		if (this._elInput.disabled){
			this._welWrapper.addClass(sPrefix + 'disabled');	
		} else {
			this._welWrapper.removeClass(sPrefix + 'disabled');
		}
		
		if (this._elInput.checked){
			this._welSubstitute.addClass(sPrefix + 'checked');	
		} else {
			this._welSubstitute.removeClass(sPrefix + 'checked');
		}
	}
	
}).extend(jindo.HTMLComponent);
