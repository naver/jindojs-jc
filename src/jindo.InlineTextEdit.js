/**
	@fileOverview 문서내의 Text 노드를 Text Input으로 변환시켜 즉시 수정할 수 있게해주는 컴포넌트
	@author senxation
	@version #__VERSION__#
**/

/**
	문서내의 Text 노드를 Text Input으로 변환시켜 즉시 수정할 수 있게해주는 컴포넌트
	
	@class jindo.InlineTextEdit
	@extends jindo.Component
	
	@keyword inline, input, edit, 인라인, 수정
**/
jindo.InlineTextEdit = jindo.$Class({
	/** @lends jindo.InlineTextEdit.prototype */
	
	_bIsEditing : false,
	
	/**
		@constructor
		@param {Object} [htOption] 옵션
			@param {HTMLElement} [htOption.elInput] 수정시 표시될 Input 엘리먼트 (또는 textarea)<br/>기본 값 : `jindo.$('<input type="text">'`)
			@param {Boolean} [htOption.bHandleBlur=true] 수정중인 Input 엘리먼트에서 blur되었을 때 적용(apply())할지 여부
			@param {Boolean} [htOption.bHandleKeyDown=true] enter키 입력시 적용/esc키 입력시 취소를 적용할지 여부
		@example
			var oInlineTextEdit = new jindo.InlineTextEdit({
				elInput : jindo.$('<input type="text">') 수정시 표시될 Input 엘리먼트
			}).attach({
				beforeChange : function(oCustomEvent) {
					//수정이 성공적으로 완료되고 수정된 값이 적용되기 전에 발생
					//oCustomEvent = {
					//	sText : (String) 수정될 값, 핸들러내에서 수정가능
					//	elInput : (HTMLElement) 수정을 위해 표시된 Input 엘리먼트
					//	elText : (HTMLElement) 수정될 엘리먼트
					//};
					//oCustomEvent.stop(); 수행시 elText의 값이 변경되지 않고 change 커스텀 이벤트가 발생하지 않음
				},
				change : function(oCustomEvent) {
					//수정된 값이 적용된 이후에 발생
					//oCustomEvent = {
					//	sText : (String) 수정된 값
					//	elInput : (HTMLElement) 수정을 위해 표시된 Input 엘리먼트
					//	elText : (HTMLElement) 수정된 엘리먼트
					//};
				}
			});
	**/
	$init : function(htOption) {
		var htDefaultOption = {
			elInput : jindo.$('<input type="text">'),
			bHandleBlur : true,
			bHandleKeyDown : true
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._wfBlur = jindo.$Fn(this._onBlur, this);
		this._wfKeyDown = jindo.$Fn(this._onKeyDown, this);
	},
	
	/**
		수정시 보여지는 입력컨트롤 엘리먼트를 리턴한다.
		
		@method getTextInput
		@return {HTMLElement}
	**/
	getTextInput : function() {
		return this._getTextInput().$value();
	},
	
	_getTextInput : function() {
		if (this._welInput && this._welInput.$value()) {
			return this._welInput;
		} else {
			return (this._welInput = jindo.$Element(this.option("elInput")));
		}
	},
	
	_resize : function(elFrom, elTo) {
		var wel = jindo.$Element(elFrom);
		var welTo = jindo.$Element(elTo);
		welTo.width(wel.width()).height(wel.height());
	},
	
	/**
		수정중인지 여부를 가져온다.
		
		@method isEditing
		@return {Boolean}
	**/
	isEditing : function() {
		return this._bIsEditing;
	},
	
	/**
		지정된 엘리먼트를 수정한다.
		수정 이후에 입력컨트롤이 blur되면 수정된 값이 반영되고, 수정중 esc키가 입력되면 수정이 취소된다.
		
		@method edit
		@param {HTMLElement} el 수정할 엘리먼트
		@param {HTMLElement} elGetSizeFrom Text Input의 사이즈를 지정하기위해 사이즈를 구할 엘리먼트 (생략시 기본값은 el)
		@return {this} 
		@example
			oInlineTextEdit.edit(jindo.$("text"));
	**/
	edit : function(el, elGetSizeFrom) {
		var wel = jindo.$Element(el),
			welInput = this._getTextInput(),
			elInput = welInput.$value();
		
		this._welHidden = wel;
		wel.after(elInput);
		this._resize(elGetSizeFrom || el, elInput);
		wel.hide();
		elInput.value = wel.text();	
		elInput.focus();
		
		this._bIsEditing = true;
		if (this.option("bHandleBlur")) {
			this._wfBlur.attach(elInput, "blur");
		}
		if (this.option("bHandleKeyDown")) {
			this._wfKeyDown.attach(elInput, "keydown");
		}
		return this;
	},
	
	/**
		수정중인 내용을 적용한다.
		
		@method apply
		@return {this}
	**/
	apply : function() {
		if (this.isEditing()) {
			var welInput = this._getTextInput(),
				elInput = welInput.$value(),
				sText = elInput.value,
				htCustomEvent = {
					sText : sText,
					elInput : elInput,
					elText : this._welHidden.$value()
				};
			
			/**
				수정이 성공적으로 완료되고 수정된 값이 적용되기 전
				
				@event beforeChange
				@param {String} sType 커스텀 이벤트명
				@param {String} sText 수정될 값, 핸들러내에서 변경가능
				@param {HTMLElement} elInput 수정을 위해 표시된 Input 엘리먼트
				@param {HTMLElement} elText 수정될 엘리먼트
				@param {Function} stop 수행시 elText의 값이 변경되지 않고 change 커스텀 이벤트가 발생하지 않음
				@example
					// 커스텀 이벤트 핸들링 예제
					oInlineTextEdit.attach("beforeChange", function(oCustomEvent) { ... });
			**/
			if (this._welHidden.text() != sText && this.fireEvent("beforeChange", htCustomEvent)) {
				this._welHidden.text(htCustomEvent.sText).show();
				this._bIsEditing = false;
				/**
					수정된 값이 적용된 이후
					
					@event change
					@param {String} sType 커스텀 이벤트명
					@param {String} sText 수정된 값, 핸들러내에서 변경가능
					@param {HTMLElement} elInput 수정을 위해 표시된 Input 엘리먼트
					@param {HTMLElement} elText 수정된 엘리먼트
					@example
						// 커스텀 이벤트 핸들링 예제
						oInlineTextEdit.attach("change", function(oCustomEvent) { ... });
				**/
				this.fireEvent("change", htCustomEvent);
			} else {
				this._welHidden.show();
			}
			this._wfBlur.detach(elInput, "blur").detach(elInput, "keydown");
			welInput.leave();
		}
		
		return this;
	},
	
	/**
		수정중인 내용을 취소한다.
		
		@method cancel
		@return {this}
	**/
	cancel : function() {
		if (this.isEditing()) {
			var welInput = this._getTextInput(), elInput = welInput.$value();
			
			this._welHidden.show();
			this._bIsEditing = false;
			this._wfBlur.detach(elInput, "blur").detach(elInput, "keydown");
			welInput.leave();
		}
		
		return this;
	},
	
	_onBlur : function(we) {
		this.apply();
	}, 
	
	_onKeyDown : function(we) {
		switch (we.key().keyCode) {
			case 27 : 
				this.cancel();
			break;
			case 13 :
				if (this.getTextInput().tagName.toLowerCase() == "input") {
					this.apply();
				} 
			break;
		}
	}
}).extend(jindo.Component);
