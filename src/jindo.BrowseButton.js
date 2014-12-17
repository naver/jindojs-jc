/**
	@fileOverview FileSelect (input[type=file])의 찾아보기(browse) 버튼의 디자인을 대체 적용하는 컴포넌트
	@author hooriza, modified by senxation
	@version #__VERSION__#
**/
/**
	jindo.BrowseButton 컴포넌트는 File Input 컨트롤의 찾아보기 버튼의 디자인을 커스터마이징 합니다.
	  
	@class jindo.BrowseButton
	@extends jindo.UIComponent
	
	@keyword input, file, browse, button, 파일, 찾아보기, 디자인
**/
jindo.BrowseButton = jindo.$Class({
	/** @lends jindo.BrowseButton.prototype */
	/**
		@constructor
		@param {HTMLElement} el 기준 엘리먼트
		@param {Object} [htOption] 옵션 객체
		 	@param {String} [htOption.sClassPrefix="browse-"] 지정된 마크업을 읽어오는 클래스명의 접두어<br/>[prefix]box, [prefix]file-input, [prefix]button, [prefix]applied, [prefix]over 클래스명이 사용되어진다.
		 	@param {Boolean} [htOption.bActivateOnload=true] 컴포넌트 로드시 activate 여부
		@example
			new jindo.BrowseButton(jindo.$('file'), jindo.$('button'), { 
				sClassPrefix : 'button-' 
				//컴포넌트가 적용되면 대체 버튼 엘리먼트에 클래스명 sClassPrefix+"applied" 가 추가됨
				//대체 버튼 엘리먼트에 마우스 오버시 sClassPrefix+"over" 가 추가됨
			}).attach({
				'over' : function(){
					//찾아보기 버튼에 커서가 over 되었을 때 발생
				},
				'out' : function(){
					//찾아보기 버튼에서 커서가 out 되었을 때 발생
				},
				'sourceChange' : function(){
					//선택된 파일의 값이 바뀌었을때 발생
					jindo.$("input").value = this.getFileSelect().value;
				}
			});
	**/
	$init : function(el, htOption) {
		this.option({
			sClassPrefix : 'browse-',
			bActivateOnload : true
		});
		
		this.option(htOption || {});
		this._el = jindo.$(el);

		if (this.option('bActivateOnload')) {
			this.activate();
		}
	},

	_onActivate : function() {
		this._assignHTMLElement();
		this._attachEvents();
	},

	_onDeactivate : function() {
		this._detachEvents();
		this._unassignHTMLElement();
	},
	
	_assignHTMLElement : function() {
		var sClassPrefix = this.option('sClassPrefix');
		
		this._elBox = jindo.$$.getSingle("." + sClassPrefix + "box", this._el);
		this._elFileSelect = jindo.$$.getSingle("." + sClassPrefix + "file-input", this._el);
		this._elBrowseButton = jindo.$$.getSingle("." + sClassPrefix + "button", this._el);

		this._sTmpFileSelectCssText = this._elFileSelect.style.cssText;
		this._elFileSelect.style.cssText = "top:-.5em !important; height:500px !important;";
		jindo.$Element(this._elBrowseButton).addClass(sClassPrefix + 'applied');
	},

	_unassignHTMLElement : function() {
		var sClassPrefix = this.option('sClassPrefix');
		this._elFileSelect.style.cssText = this._sTmpFileSelectCssText;
		jindo.$Element(this._elBrowseButton).removeClass(sClassPrefix + 'applied');
	},
	
	_adjustFileSelectPos : function(nX) {
		this.getFileSelect().style.right = jindo.$Element(this.getBox()).offset().left + jindo.$Element(this.getBox()).width() - nX - 20 + 'px';
	},
	
	_attachEvents : function() {
		var elBrowseButton = this.getBrowseButton(),
			welBrowseButton = jindo.$Element(elBrowseButton),
			elBox = this.getBox(),
			elFileSelect = this.getFileSelect();

		this._wfHoverOnBrowseButton = jindo.$Fn(function(we) {
			welBrowseButton.addClass(this.option('sClassPrefix') + 'over');
			/**
				찾아보기 버튼 커서가 over 되었을 때 발생
				
				@event over
				@param {String} sType 커스텀 이벤트명
				@example
					// over 커스텀 이벤트 핸들링 예제
					oBrowseButton.attach("over", function(){
						alert('사용자가 마우스 커서를 버튼 위로 올렸습니다');
					});
			**/
			this.fireEvent('over');			
			this._adjustFileSelectPos(we.pos().pageX);
		}, this);

		this._wfRestore = jindo.$Fn(function(we) {
			welBrowseButton.removeClass(this.option('sClassPrefix') + 'over');
			elFileSelect.style.right = "0px";
			/**
				찾아보기 버튼 커서가 out 되었을 때 발생
				
				@event out
				@param {String} sType 커스텀 이벤트명
				@example
					// out 커스텀 이벤트 핸들링 예제
					oBrowseButton.attach("out", function(){
						alert('사용자가 마우스 커서를 버튼 밖으로 이동하였습니다');
					});
			**/
			this.fireEvent('out');
		}, this);

		this._wfMouseMoveOnFloat = jindo.$Fn(function(we) {
			this._adjustFileSelectPos(we.pos().pageX);
		}, this);

		this._wfChange = jindo.$Fn(function(we) {
			/**
				파일이 변경되었을 때 발생
				
				@event sourceChange
				@param {String} sType 커스텀 이벤트명
				@example
					// sourceChange 커스텀 이벤트 핸들링 예제
					oBrowseButton.attach("sourceChange", function(){
						alert('파일이 변경되었습니다');
					});
			**/
			this.fireEvent('sourceChange');
		}, this);

		this._wfHoverOnBrowseButton.attach(elBox, 'mouseover');
		this._wfMouseMoveOnFloat.attach(elBox, 'mousemove');
		this._wfRestore.attach(elBox, 'mouseout');
		this._wfChange.attach(this.getFileSelect(), 'change');

	},

	_detachEvents : function() {

		var elBrowseButton = this.getBrowseButton(),
			welBrowseButton = jindo.$Element(elBrowseButton),
			elBox = this.getBox(),
			elFileSelect = this.getFileSelect();

		this._wfHoverOnBrowseButton.detach(elBox, 'mouseover');
		this._wfMouseMoveOnFloat.detach(elBox, 'mousemove');
		this._wfRestore.detach(elBox, 'mouseout');
		this._wfChange.detach(this.getFileSelect(), 'change');

	},
	
	/**
		File Input을 감싸고 있는 Box 엘리먼트를 가져온다.
		
		@method getBox
		@return {HTMLElement} File Input을 감싸고 있는 Box 엘리먼트
	**/
	getBox : function() {
		return this._elBox;
	},
	
	/**
		적용된 File Input (input[type=file])을 가져온다.
		
		@method getFileSelect
		@return {HTMLElement} 적용된 File Input 엘리먼트
	**/
	getFileSelect : function() {
		return this._elFileSelect;
	},
	
	/**
		대체될 찾아보기 버튼을 가져온다.
		
		@method getBrowseButton
		@return {HTMLElement} 대체될 찾아보기 버튼 엘리먼트
	**/
	getBrowseButton : function() {
		return this._elBrowseButton;
	}
}).extend(jindo.UIComponent);
