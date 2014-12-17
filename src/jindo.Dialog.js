/**
	@fileOverview 다이얼로그 레이어
	@author senxation
	@version #__VERSION__#
**/

/**
	사용자 대화창을 생성하는 컴포넌트
	
	@class jindo.Dialog
	@extends jindo.Component
	@uses jindo.LayerPosition
	
	@keyword dialog, 다이얼로그, 대화상자
**/
jindo.Dialog = jindo.$Class({
	/** @lends jindo.Dialog.prototype */
		
	/**
		Dialog 컴포넌트를 생성한다.

		@constructor
		@param {Object} [htOption] 옵션 해시테이블
			@param {String} [htOption.sClassPrefix="dialog-"] Dialog에 적용될 Class의 prefix명. ( layer와 각 버튼에 prefix+"명칭" 으로 클래스가 구성된다. )
			@param {Object} [htOption.LayerPosition] 다이얼로그의 위치 정보, jindo.LayerPosition 컴포넌트의 옵션이 그대로 적용됨
		@example
			var oDialog = new jindo.Dialog({
				sClassPrefix : 'dialog-', //Default Class Prefix
				LayerPosition : { //LayerPosition에 적용될 옵션
					sPosition : "inside-center",
					bAuto : true
				}
			}).attach({
				beforeShow : function(oCustomEvent) {
					//다이얼로그 레이어가 보여지기 전에 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
					//oCustomEvent.stop(); 수행시 보여지지 않음
				},
				show : function(oCustomEvent) {
					//다이얼로그 레이어가 보여진 후 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
				},
				beforeHide : function(oCustomEvent) {
					//다이얼로그 레이어가 숨겨지기 전에 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
					//oCustomEvent.stop(); 수행시 숨겨지지 않음
				},
				hide : function(oCustomEvent) {
					//다이얼로그 레이어가 숨겨진 후 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
				}
			});
	**/
	$init : function(htOption) {
		//옵션 초기화
		var htDefaultOption = {
			sClassPrefix : 'dialog-', //Default Class Prefix
			LayerPosition : {
				sPosition : "inside-center",
				bAuto : true
			}
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._bIsEventAttached = false;
		this._bIsShown = false;
		
		//컴포넌트에서 사용되는 HTMLElement들을 선언하는 메서드
		this._assignHTMLElements();
		this._initLayerPosition();
	},
	
	/**
		HTMLElement들을 선언한다.
		
		@method _assignHTMLElements
		@ignore
	**/
	_assignHTMLElements : function() {
		this._elLayer = jindo.$('<div class="' + this.option("sClassPrefix") + 'layer"></div>');
		this._welLayer = jindo.$Element(this._elLayer);
		this._wfClick = jindo.$Fn(this._onClick, this);
		
		jindo.$Element.prototype.preventTapHighlight && this._welLayer.preventTapHighlight(true);
	},
	
	/**
		LayerPosition 컴포넌트를 초기화한다.
		
		@method _initLayerPosition
		@ignore
	**/
	_initLayerPosition : function() {
		this._oLayerPosition = new jindo.LayerPosition(document.body, this._elLayer, this.option("LayerPosition"));
	},
	
	/**
		다이얼로그 레이어 엘리먼트를 가져온다.
		
		@method getLayer
		@return {HTMLElement} 레이어 엘리먼트
	**/
	getLayer : function() {
		return this._elLayer;
	},
	
	/**
		생성된 LayerPosition 컴포넌트의 인스턴스를 가져온다.
		
		@method getLayerPosition
		@return {jindo.LayerPosition} LayerPosition 컴포넌트의 인스턴스
	**/
	getLayerPosition : function() {
		return this._oLayerPosition;
	},
	
	/**
		다이얼로그 레이어에 대한 템플릿을 설정한다.
		다이얼로그 레이어의 내용을 동적으로 설정하기 위해 템플릿 형태로 설정한다.
		
		@method setLayerTemplate
		@param {String} sTemplate 템플릿 문자열
		@remark Jindo의 jindo.$Template 참고
		@example
			oDialog.setLayerTemplate('<div><a href="#" class="dialog-close"><img width="15" height="14" alt="레이어닫기" src="http://static.naver.com/common/btn/btn_close2.gif"/></a></div><div style="position:absolute;top:30px;left:10px;">{=text}</div><div style="position:absolute;bottom:10px;right:10px;"><button type="button" class="dialog-confirm">확인</button><button type="button" class="dialog-cancel">취소</button></div></div>');
	**/
	setLayerTemplate : function(sTemplate) {
		this._sTemplate = sTemplate;
		this._template = jindo.$Template(this._sTemplate);
	},
	
	/**
		설정된 다이얼로그 레이어의 템플릿을 가져온다.
		
		@method getLayerTemplate
		@return {String} 설정된 템플릿
	**/
	getLayerTemplate : function() {
		return this._sTemplate;
	},
	
	/**
		다이얼로그 레이어를 보여준다.
		
		@method show
		@remark 다이얼로그 레이어는 설정된 레이어의 템플릿으로부터 만들어져 document.body에 append된다.
		@param {Object} htTemplateProcess 템플릿에 대체하기 위한 데이터를 가지는 Hash Table
		@param {Object} htEventHandler 다이얼로그 내부에서 발생하는 이벤트를 처리하는 핸들러들
		@example
			//다이얼로그 레이어에 닫기, 취소, 확인 버튼이 모두 존재하는경우 각각의 버튼에 대한 핸들러를 함께 등록한다. 
			var oDialog = new jindo.Dialog();
			
			oDialog.setLayerTemplate('<div><a href="#" class="dialog-close"><img width="15" height="14" alt="레이어닫기" src="http://static.naver.com/common/btn/btn_close2.gif"/></a></div><div style="position:absolute;top:30px;left:10px;">{=text}</div><div style="position:absolute;bottom:10px;right:10px;"><button type="button" class="dialog-confirm">확인</button><button type="button" class="dialog-cancel">취소</button></div></div>');
			
			oDialog.show({ text : "<strong>확인하시겠습니까?</strong>" }, {
				close : function(oCustomEvent) {
					jindo.$Element("status").text("oDialog의 레이어에서 닫기 버튼이 클릭되었습니다.");
					//oCustomEvent.stop() 수행시 레이어가 닫히지 않는다.
				},
				cancel : function(oCustomEvent) {
					jindo.$Element("status").text("oDialog의 레이어에서 취소 버튼이 클릭되었습니다.");
					//oCustomEvent.stop() 수행시 레이어가 닫히지 않는다.
				},
				confirm : function(oCustomEvent) {
					jindo.$Element("status").text("oDialog의 레이어에서 확인 버튼이 클릭되었습니다.");
					//oCustomEvent.stop() 수행시 레이어가 닫히지 않는다.
				}
			});	
	**/
	show : function(htTemplateProcess, htEventHandler) {
		if (!this.isShown()) {
			this.attach(htEventHandler);
			
			document.body.appendChild(this._elLayer);
			this._welLayer.html(this._template.process(htTemplateProcess));
			
			var htCustomEvent = {
				"elLayer": this._elLayer
			};
			
			/**
				다이얼로그가 화면에 보여지기 전에 발생
				
				@event beforeShow
				@param {String} sType 발생한 이벤트명
				@param {HTMLElement} elLayer 다이얼로그 Element
				@param {Function} stop 레이어가 보여지지않도록 수행종료
				@example
					// 커스텀 이벤트 핸들링 예제
					oDialog.attach("beforeShow", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent("beforeShow", htCustomEvent)) {
				this._welLayer.show();
				this._attachEvents();
				this.getLayerPosition().setPosition();
				this._bIsShown = true;
				/**
					다이얼로그 레이어가 화면에 보여지면 발생
					
					@event show
					@param {String} sType 발생한 이벤트명
					@param {HTMLElement} elLayer 다이얼로그 Element
					@example
						// 커스텀 이벤트 핸들링 예제
						oDialog.attach("show", function(oCustomEvent) { ... });
				**/
				this.fireEvent("show", htCustomEvent);
			}
		}
	},
	
	/**
		다이얼로그 레이어를 숨긴다.
		
		@method hide
		@remark 다이얼로그 레이어가 숨겨지는 동시에 모든 이벤트가 제거되고 document.body에서 제거된다.
	**/
	hide : function() {
		if (this.isShown()) {
			var htCustomEvent = {"elLayer" : this._elLayer }; 
			
			/**
				다이얼로그가 숨겨지기 전 발생
				
				@event beforeHide
				@param {String} sType 발생한 이벤트명
				@param {HTMLElement} elLayer 다이얼로그 Element
				@param {Function} stop 레이어를 숨기지 않음
				@example
					// 커스텀 이벤트 핸들링 예제
					oDialog.attach("beforeHide", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent("beforeHide", htCustomEvent)) {
				this.detachAll("close").detachAll("confirm").detachAll("cancel");
				this._detachEvents();
				this._welLayer.hide();
				this._welLayer.leave();
				this._bIsShown = false;
				/**
					다이얼로그가 닫힌후에 발생
					
					@event hide
					@param {String} sType 발생한 이벤트명
					@param {HTMLElement} elLayer 다이얼로그 Element
					@example
						// 커스텀 이벤트 핸들링 예제
						oDialog.attach("hide", function(oCustomEvent) { ... });
				**/
				this.fireEvent("hide", htCustomEvent); 
			} 
		}
	},
	
	/**
		다이얼로그 레이어가 보여지고 있는지 가져온다.
		
		@method isShown
		@return {Boolean} 다이얼로그 레이어의 노출여부
	**/
	isShown : function() {
		return this._bIsShown;
	},
	
	/**
		이벤트 등록 여부를 가져온다.
		@return {Boolean}
		@ignore
	**/
	_isEventAttached : function() {
		return this._bIsEventAttached;
	},

	/**
		이벤트를 등록한다.
		@return {this}
		@ignore
	**/
	_attachEvents : function() {
		if (!this._isEventAttached()) {
			//활성화 로직 ex)event binding
			this._wfClick.attach(this._elLayer, "click");
			this._bIsEventAttached = true;
		}
		return this;
	},
	
	/**
		이벤트를 해제한다.
		@return {this}
		@ignore
	**/
	_detachEvents : function() {
		if (this._isEventAttached()) {
			//비활성화 로직 ex)event unbinding
			this._wfClick.detach(this._elLayer, "click");
			this._bIsEventAttached = false;
		}
		return this;
	},
	
	/**
		다이얼로그 레이어 내부에서 닫기, 확인, 취소 버튼을 처리하기 위한 핸들러
		@param {jindo.$Event} we
		@ignore
	**/
	_onClick : function(we) {
		var sClassPrefix = this.option("sClassPrefix");
		var elClosestClose, elClosestConfirm, elClosestCancel;
		if ((elClosestClose = this._getClosest(("." + sClassPrefix + "close"), we.element))) {
			if(this.fireEvent("close")) {
				this.hide();
			} 
		} else if ((elClosestConfirm = this._getClosest(("." + sClassPrefix + "confirm"), we.element))) {
			if(this.fireEvent("confirm")) {
				this.hide();
			}
		} else if ((elClosestCancel = this._getClosest(("." + sClassPrefix + "cancel"), we.element))) {
			if (this.fireEvent("cancel")) {
				this.hide();
			}
		}
	},
	
	/**
		자신을 포함하여 부모노드중에 셀렉터에 해당하는 가장 가까운 엘리먼트를 구함
		@param {String} sSelector CSS셀렉터
		@param {HTMLElement} elBaseElement 기준이 되는 엘리먼트
		@return {HTMLElement} 구해진 HTMLElement
		@ignore
	**/
	_getClosest : function(sSelector, elBaseElement) {
		if (jindo.$$.test(elBaseElement, sSelector)) {
			return elBaseElement;
		}
		return jindo.$$.getSingle("! " + sSelector, elBaseElement);
	}
}).extend(jindo.Component);	