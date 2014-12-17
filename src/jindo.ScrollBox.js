/**
	@fileOverview 정해진 크기의 박스내의 내용에 따라 자동으로 스크롤바를 생성하는 스크롤박스 컴포넌트
	@author senxation
	@version #__VERSION__#
**/
/**
	정해진 크기의 박스내의 내용에 따라 자동으로 스크롤바를 생성하는 스크롤박스 컴포넌트
	ScrollBox 컴포넌트는 정해진 크기의 박스내의 내용을 스크롤바를 이용해 이동하여 볼 수 있게 한다.
	ScrollBar 컴포넌트와 다르게 박스내의 내용이 유동적으로 변할 때 스크롤이 나타나거나 사라지고 막대의 길이도 자동으로 구해진다.
	
	@class jindo.ScrollBox
	@extends jindo.ScrollBar
	@keyword scrollbox, 스크롤박스
**/
jindo.ScrollBox = new jindo.$Class({
	/** @lends jindo.ScrollBox.prototype */

	/**
		@constructor
		@param {HTMLElement} el
		@param {Object} [htOption] 옵션
			@param {String} [htOption.sClassPrefix="scrollbar-"] 클래스명 접두어
			@param {String} [htOption.sOverflowX="auto"] 가로스크롤을 보여주는 방법
			<ul>
			<li>"auto" : 자동</li>
			<li>"scroll" : 항상</li>
			<li>"hidden" : 보이지않음</li>
			</ul>
			@param {String} [htOption.sOverflowY="auto"] 세로스크롤을 보여주는 방법
			<ul>
			<li>"auto" : 자동</li>
			<li>"scroll" : 항상</li>
			<li>"hidden" : 보이지않음</li>
			</ul>
			@param {String} [htOption.sClassNameForRollover="rollover"] Rollover에 반응할 클래스명
			@param {Number} [htOption.nDelta=16] 스크롤 속도
			@param {Boolean} [htOption.bAdjustThumbSize=true] Thumb의 크기가 Content의 크기에따라 자동으로 변할지 여부
			@param {Number} [htOption.nMinThumbSize=50] bAdjustThumbSize가 true일경우 크기가 변해도 최소로 유지될 크기
			@param {Boolean} [htOption.bActivateOnload=true] 컴포넌트 로드시 activate() 수행여부
		@example
			var oScrollBox = new jindo.ScrollBox("scroll", {
				sClassPrefix : "scrollbar-", // (String) Class Prefix
				sOverflowX : "auto", // (String) 가로스크롤을 보여주는 방법 "auto"(자동) || "scroll" (항상)|| "hidden" (보이지않음) 
				sOverflowY : "auto", // (String) 세로스크롤을 보여주는 방법 "auto"(자동) || "scroll" (항상)|| "hidden" (보이지않음)
				bAdjustThumbSize : true, // (Boolean) Thumb의 크기가 Content의 크기에따라 자동으로 변할지 여부
				nMinThumbSize : 50, // (Number) bAdjustThumbSize가 true일경우 크기가 변해도 최소로 유지될 크기
				nDelta : 16 // (Number) 스크롤 속도
			});
	**/
	$init : function(el, htOption) {
		
		this.option({
			sClassPrefix : "scrollbar-",
			bActivateOnload : true,
			sOverflowX : "auto",
			sOverflowY : "auto",
				bAdjustThumbSize : true,
			nMinThumbSize : 50,
			nDelta : 16 //스크롤 속도
		});
		
		this.option(htOption || {});
		
		this._el = jindo.$(el);
		
		if (this.option("bActivateOnload")) {
			this.activate();
			this.reset();
		}
	},
	
	/**
		스크롤바의 보임/숨김 여부를 자동으로 설정한다.
		
		@method reset
	**/
	reset : function() {
		this._autoToggleScrollBar();
		
		//보정을 위한 상태설정		
		var oStatusH = this.hasScrollBarHorizontal();
		var oStatusV = this.hasScrollBarVertical();
		
		this._adjustBoxSize();
		this._adjustContentSize();
		
		//보정
		this._autoToggleScrollBar();
		if (oStatusH != this.hasScrollBarHorizontal() || oStatusV != this.hasScrollBarVertical()) {
			this._adjustBoxSize();
			this._adjustContentSize();
		}
		
		this._autoToggleAvailability();
		this._adjustTrackSize();
		this._adjustThumbSize();
		this.$super.reset();
	},

	/**
		컴포넌트를 활성화한다.
	**/
	_onActivate : function() {
		//활성화 로직 ex)event binding
		this.$super._onActivate();
		this.reset();
	},
	
	/**
		컴포넌트를 비활성화한다.
	**/
	_onDeactivate : function() {
		this.$super._onDeactivate();
		this._adjustBoxSize();
	},

	/**
		스크롤 박스의 크기를 설정한다.
		
		@method setSize
		@param {Number} [nWidth] 가로 크기
		@param {Number} [nHeight] 세로 크기
	**/
	setSize : function(nWidth, nHeight) {
		if (nWidth) {
			//jindo.$Element(this._el).width(nWidth);
			jindo.$Element(this._el).css("width", nWidth + "px");
		}
		if (nHeight) {
			//jindo.$Element(this._el).height(nHeight);
			jindo.$Element(this._el).css("height", nHeight + "px");
		}

		this.setBoxSize(nWidth, nHeight);

		this._oBoxSize = {
			nWidth : jindo.$Element(this._elBox).width(),
			nHeight : jindo.$Element(this._elBox).height()
		};
		this.reset(); 
	},

	/**
		컨텐트 엘리먼트의 크기를 구한다.
		
		@method getContentSize
		@return {Object}
		@example
			var oSize = {
				nWidth : (Number),
				nHeight : (Number)
			}
	**/
	getContentSize : function() {
		var welContent = jindo.$Element(this._elContent);
		
		return {
			nWidth : parseInt(welContent.width(), 10),
			nHeight : parseInt(welContent.height(), 10)
		};
	},

	/**
		컨텐트 엘리먼트의 크기를 설정한다.
		
		@method setContentSize
		@param {Number} nWidth 가로 크기
		@param {Number} nHeight 세로 크기
	**/	
	setContentSize : function(nWidth, nHeight) {
		var welContent = jindo.$Element(this._elContent);
		
		if (nWidth) {
			if (nWidth == Infinity) {
				welContent.css("width", "");
			}
			else {
				welContent.css("width", nWidth + "px");	
			}
			
		}

		if (nHeight) {
			if (nHeight == Infinity) {
				welContent.css("height", "auto");
			}
			else {
				welContent.css("height", nHeight + "px");	
			}
		}
		this.$super.reset();
	},
	
	/**
		박스 엘리먼트의 크기를 구한다.
		
		@method getBoxSize
		@example
			var oSize = {
				nWidth : (Number),
				nHeight : (Number)
			}
	**/
	getBoxSize : function() {
		var welBox = jindo.$Element(this._elBox);
		return {
			nWidth : parseInt(welBox.width(), 10),
			nHeight : parseInt(welBox.height(), 10)
		};
	},
	
	/**
		박스 엘리먼트의 크기를 설정한다.
		
		@method setBoxSize
		@param {Number} nWidth 가로 크기
		@param {Number} nHeight 가로 크기
	**/
	setBoxSize : function(nWidth, nHeight) {
		var welBox = jindo.$Element(this._elBox);
		if (nWidth) {
			//jindo.$Element(this._elBox).width(nWidth);
			welBox.css("width", nWidth + "px");
		}
		if (nHeight) {
			//jindo.$Element(this._elBox).height(nHeight);
			welBox.css("height", nHeight + "px");
		}
		this.$super.reset();
	},

	/**
		트랙 엘리먼트의 크기를 구한다.
		
		@method getTrackSize
		@param {Object} ht 엘리먼트 객체들
			@param {HTMLElement} ht.elScrollBar 스크롤바 엘리먼트
			@param {HTMLElement} ht.elTrack 트랙 엘리먼트
		@return {Object}
		@example
			var oSize = {
				nWidth : (Number),
				nHeight : (Number)
			}
	**/
	getTrackSize : function(ht) {
		if (!ht.elScrollBar) {
			return {
				nWidth : 0,
				nHeight : 0
			};	
		}
		var welTrack = jindo.$Element(ht.elTrack);
		return {
			nWidth : parseInt(welTrack.width(), 10),
			nHeight : parseInt(welTrack.height(), 10)
		};
	},
	
	/**
		트랙 엘리먼트의 크기를 설정한다.
		
		@method setTrackSize
		@param {Number} nWidth 가로 크기
		@param {Number} nHeight 세로 크기
	**/
	setTrackSize : function(o, nWidth, nHeight) {
		var welTrack = jindo.$Element(o.elTrack);
		if (nWidth) {
			//jindo.$Element(o.elTrack).width(nWidth);
			welTrack.css("width", nWidth + "px");
		}
		if (nHeight) {
			//jindo.$Element(o.elTrack).height(nHeight);
			welTrack.css("height", nHeight + "px");
		}
	},
	
	/**
		가로스크롤이 생겨야하는 상황인지 판단한다.
		
		@method isNeededScrollBarHorizontal
		@return {Boolean}
	**/
	isNeededScrollBarHorizontal : function() {
		
		if(this.option("sOverflowX") == "scroll") {
			return true;
		}
		
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getDefaultBoxSize();
		
		if (this.getScrollBarHorizontal().elScrollBar && this.option("sOverflowX") != "hidden") {
			if(this.hasScrollBarVertical()) {
				if(oContentSize.nWidth > oBoxSize.nWidth - jindo.$Element(this.getScrollBarVertical().elScrollBar).width()) {
					return true;	
				}
			}
			if (oContentSize.nWidth > oBoxSize.nWidth){
				return true;	
			}
		}
		return false;
	},
	
	/**
		세로스크롤이 생겨야하는 상황인지 판단한다.
		
		@method isNeededScrollBarVertical
		@return {Boolean}
	**/
	isNeededScrollBarVertical : function() {
		
		if(this.option("sOverflowY") == "scroll") {
			return true;
		}
		
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getDefaultBoxSize();

		if (this.getScrollBarVertical().elScrollBar && this.option("sOverflowY") != "hidden") {
			if(this.hasScrollBarHorizontal()) {
				if(oContentSize.nHeight > oBoxSize.nHeight - jindo.$Element(this.getScrollBarHorizontal().elScrollBar).height()) {
					return true;	
				}
			}
			if(oContentSize.nHeight > oBoxSize.nHeight) {
				return true;	
			}
		}
		return false;
	},
	
	_autoToggleScrollBar : function() {
		
		if (!this.isActivating()) {
			return;
		}
		
		var sClassPrefix = this.option("sClassPrefix");
		
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		var welScrollBar; 
		var bAjustThumbSize = this.option("bAdjustThumbSize");
		
		var bV = this.isNeededScrollBarVertical();
		if (oV.elScrollBar) {
			welScrollBar = jindo.$Element(oV.elScrollBar);
			if (bV) {
				welScrollBar.addClass(sClassPrefix + "show");
			} else {
				welScrollBar.removeClass(sClassPrefix + "show");
			}
			if (oV.elThumb && bAjustThumbSize) {
				jindo.$Element(oV.elThumb).css("height", "0px"); //ie6에서 문제때문에 스크롤바를 보여준 직후에 (trackSize를 조절해주기 이전) Thumb사이즈를 0로 만들어준다.
			}
		}
		var bH = this.isNeededScrollBarHorizontal();
		if (oH.elScrollBar) {
			welScrollBar = jindo.$Element(oH.elScrollBar);
			if (bH) {
				welScrollBar.addClass(sClassPrefix + "show");	
			} else {
				welScrollBar.removeClass(sClassPrefix + "show");
			}
			if (oH.elThumb && bAjustThumbSize) {
				jindo.$Element(oH.elThumb).css("width", "0px");
			}
		}

		//세로스크롤 안생기고, 가로스크롤생긴후에 세로스크롤이 필요해지는 경우!		
		if (oV.elScrollBar) {
			welScrollBar = jindo.$Element(oV.elScrollBar);
			if (this.isNeededScrollBarVertical()) {
				welScrollBar.addClass(sClassPrefix + "show"); 
			} else {
				welScrollBar.removeClass(sClassPrefix + "show");
			}
			if (oV.elThumb && bAjustThumbSize) {
				jindo.$Element(oV.elThumb).css("height", "0px");
			}	
		}
	},
	
	/**
		Track의 길이를 자동 조절한다.
	**/
	_adjustTrackSize : function() {
		if (!this.isActivating()) {
			return;
		}
		var oBoxSize = this.getDefaultBoxSize();
		
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		
		var bH = this.isNeededScrollBarHorizontal();
		//가로 스크롤
		if (bH && oH.elScrollBar) {
			var nTrackWidth = oBoxSize.nWidth;

			var wel = jindo.$Element(oH.elScrollBar);
			wel.css("top", oBoxSize.nHeight - wel.height() + "px");
		
			//세로 스크롤도 있는경우
			var nVerticalWidth = 0;
			if (this.hasScrollBarVertical() && oV.elScrollBar) {
				nVerticalWidth = parseInt(jindo.$Element(oV.elScrollBar).width(), 10);
				nTrackWidth -= nVerticalWidth;
			}	
			wel.width(nTrackWidth); //가로스크롤의 크기 조절
			
			var nButtonLeftWidth = 0;
			if (oH.elButtonLeft) {
				nButtonLeftWidth = parseInt(jindo.$Element(oH.elButtonLeft).width(), 10);
				nTrackWidth -= nButtonLeftWidth;
			}
			if (oH.elButtonRight) {
				nTrackWidth -= parseInt(jindo.$Element(oH.elButtonRight).width(), 10);
			}

			jindo.$Element(oH.elTrack).css("left", nButtonLeftWidth + "px"); //가로스크롤의 위치 조절
			
			this.setTrackSize(oH, nTrackWidth, null);
		}

		var bV = this.isNeededScrollBarVertical();		
		//세로 스크롤
		if (bV && oV.elScrollBar) {
			var nTrackHeight = oBoxSize.nHeight;
			
			//가로 스크롤도 있는경우
			var nHorizontalHeight = 0;
			if (this.hasScrollBarHorizontal() && oH.elScrollBar) {
				nHorizontalHeight = parseInt(jindo.$Element(oH.elScrollBar).height(), 10);
				nTrackHeight -= nHorizontalHeight;
			}
			
			if (oV.elButtonUp) {
				nTrackHeight -= parseInt(jindo.$Element(oV.elButtonUp).height(), 10);
			}
			if (oV.elButtonDown) {
				nTrackHeight -= parseInt(jindo.$Element(oV.elButtonDown).height(), 10);
				//jindo.$Element(oV.elButtonDown).css("bottom", nHorizontalHeight +"px");
			}
			
			this.setTrackSize(oV, null, nTrackHeight);
		}
		
	},
	
	/**
		ScrollBar 가 생성되었을 경우의 Box 사이즈를 설정해준다.
	**/
	_adjustBoxSize : function() {
		var oBoxSize = this.getDefaultBoxSize();
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		var bV = this.hasScrollBarVertical();
		var bH = this.hasScrollBarHorizontal();
		
		this.setBoxSize(oBoxSize.nWidth, oBoxSize.nHeight);
		
		if (this.isActivating()) {
			//가로 스크롤
			if (bH && oH.elScrollBar) {
				var nHeight = oBoxSize.nHeight;
				nHeight -= parseInt(jindo.$Element(oH.elScrollBar).height(), 10);
				this.setBoxSize(null, nHeight);
			}
			//세로 스크롤
			if (bV && oV.elScrollBar) {
				var nWidth = oBoxSize.nWidth;
				nWidth -= parseInt(jindo.$Element(oV.elScrollBar).width(), 10);
				this.setBoxSize(nWidth, null);
			}
	
			//가로, 세로스크롤 모두 없는 경우에 Box와 Content사이즈가 같게 설정
	//		//if (!bH && !bV) {
	//			//this.setBoxSize(oBoxSize.nWidth, oBoxSize.nHeight);
	//		//}
		}
	},
	
	_adjustContentSize : function() {
		if (!this.isActivating()) {
			return;
		}
		
		var oBoxSize = this.getBoxSize();
		var bV = this.option("sOverflowY") != "hidden";
		var bH = this.option("sOverflowX") != "hidden";	
		var nWidth, nHeight;
		//가로, 세로스크롤 중 하나만 존재하는 경우에는 Content사이즈를 조절해 줌
		//세로 스크롤
		if (bV && !bH) {
			nWidth = oBoxSize.nWidth;
		}
		//가로 스크롤
		if (bH && !bV) {
			nHeight = oBoxSize.nHeight;
		}
		
		this.setContentSize(nWidth || Infinity, nHeight || Infinity);
	},

	_adjustThumbSize : function() {
		if (!this.isActivating()) {
			return;
		}
		
		if (!this.option("bAdjustThumbSize")) {
			return;
		}
		
		var nMinThumbSize = this.option("nMinThumbSize");
		if(typeof nMinThumbSize == "undefined"){
			nMinThumbSize = 50;
		}
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getBoxSize(); //현재 그려진 box 사이즈
		var nGap;

		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		if (oV.elScrollBar) {
					
			var oTrackSizeV = this.getTrackSize(oV);
			var nThumbHeight = Math.floor(parseInt(oTrackSizeV.nHeight * oBoxSize.nHeight / oContentSize.nHeight, 10));
			if(isNaN(nThumbHeight)){
				nThumbHeight = 0;
			}
			if (nThumbHeight < nMinThumbSize) {
				nThumbHeight = nMinThumbSize;
			}
			if (nThumbHeight >= oTrackSizeV.nHeight) {
				nThumbHeight = oTrackSizeV.nHeight;
			}
			jindo.$Element(oV.elThumb).height(nThumbHeight);
			
			///////thumb-body 크기 조절
			nGap = 0;
			if(oV.elThumbHead) {
				nGap += jindo.$Element(oV.elThumbHead).height();
			}
			if(oV.elThumbFoot) {
				nGap += jindo.$Element(oV.elThumbFoot).height();
			}
			if(oV.elThumbBody) {
				jindo.$Element(oV.elThumbBody).height(nThumbHeight - nGap);
			}
		}
		
		if (oH.elScrollBar) {
			var oTrackSizeH = this.getTrackSize(oH);
			var nThumbWidth = Math.floor(parseInt(oTrackSizeH.nWidth * oBoxSize.nWidth / oContentSize.nWidth, 10));
			if(isNaN(nThumbWidth)){
				nThumbWidth = 0;
			}
			if (nThumbWidth < nMinThumbSize) {
				nThumbWidth = nMinThumbSize;
			}
			//max 값과 같은 경우
			if (nThumbWidth >= oTrackSizeH.nWidth) {
				nThumbWidth = oTrackSizeH.nWidth;
			}
			jindo.$Element(oH.elThumb).width(nThumbWidth);
			
			///////thumb-body 크기 조절
			nGap = 0;
			if(oH.elThumbHead) {
				nGap += jindo.$Element(oH.elThumbHead).width();
			}
			if(oH.elThumbFoot) {
				nGap += jindo.$Element(oH.elThumbFoot).width();
			}
			if(oH.elThumbBody) {
				jindo.$Element(oH.elThumbBody).width(nThumbWidth - nGap);	
			}
		}
	},
	
	_autoToggleAvailability : function(){
		var sClassPrefix = this.option("sClassPrefix");
		var oContentSize = this.getContentSize();
		var oBoxSize = this.getBoxSize(); //현재 그려진 box 사이즈
		var oH = this.getScrollBarHorizontal();
		var oV = this.getScrollBarVertical();
		
		if (oH.elScrollBar) {
			//deactivate
			if (this.option("sOverflowX") == "scroll" && oBoxSize.nWidth >= oContentSize.nWidth) {
				jindo.$Element(oH.elScrollBar).addClass(sClassPrefix + "disabled");
				this.$super._onDeactivate("horizontal");
				if (this.isActivating()) { //활성화일경우에만 scrollbar에서 삽입된 noscript 클래스명을 다시 제거
					jindo.$Element(this._el).removeClass(sClassPrefix + "noscript");
				}	
			} else {
				jindo.$Element(oH.elScrollBar).removeClass(sClassPrefix + "disabled");
				
				if (this.isActivating()) { //활성화일경우에만 scrollbar도 활성화
					this.$super._onActivate("horizontal");
				}
			}	
		}
		
		if (oV.elScrollBar) {
			if (this.option("sOverflowY") == "scroll" && oBoxSize.nHeight >= oContentSize.nHeight) {
				jindo.$Element(oV.elScrollBar).addClass(sClassPrefix + "disabled");
				this.$super._onDeactivate("vertical");
				if (this.isActivating()) { //활성화일경우에만 scrollbar에서 삽입된 noscript 클래스명을 다시 제거
					jindo.$Element(this._el).removeClass(sClassPrefix + "noscript");
				}
			} else {
				jindo.$Element(oV.elScrollBar).removeClass(sClassPrefix + "disabled");
				if (this.isActivating()) { //활성화일경우에만 scrollbar도 활성화
					this.$super._onActivate("vertical");
				}
			}
		}
	}
}).extend(jindo.ScrollBar);