/**
	@fileOverview 특정 영역안의 지정된 객체를 단일/다중 선택가능하게 하는 컴포넌트 
	@author senxation
	@version #__VERSION__#
**/
/**
	특정 영역안의 지정된 객체를 단일/다중 선택가능하게 하는 컴포넌트
	 
	@class jindo.SelectArea
	@extends jindo.UIComponent
	@keyword selectearea, 셀렉트에어리어, 선택, 단일, 다중, 영역
**/
jindo.SelectArea = jindo.$Class({
	/** @lends jindo.SelectArea.prototype */
	
	_waToggleCandidate : null,
	_waSelected : null,
	_aSizeInfo : null,
	
	/**
		@constructor
		@param {HTMLElement} el 기준 엘리먼트
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassName="selectable"]
			@param {Object} [htOption.htStatus={sSelected:"sSelected"//선택되었을때}] 엘리먼트의 상태에 따라 추가되는 클래스명
			@param {Boolean} [htOption.bMultiSelection=true] 다중 선택 가능 여부
			@param {Boolean} [htOption.bDragSelect=true] 다중 선택 가능한 경우, 드래그하여 선택 가능 여부. (bMultiSelection 옵션 값이 true일때만 사용가능)
			@param {Number} [htOption.nThreshold=5] 드래스 선택이 시작되기위한 최소 마우스이동거리
			@param {Boolean} [htOption.bDeselectAllOutside=true] 다중 선택 가능한 경우, 셀렉트가능한 객체가 아닌 곳을 클릭하면 모두 선택해제 할지 여부 (bMultiSelection 옵션 값이 true일때만 true로 지정가능)
			@param {Boolean} [htOption.bRemainOne=false] 단일 선택만 가능한 경우, 최소 하나는 선택이 되어있도록 함. (bMultiSelection 옵션 값이 false일때만 true로 지정가능)
			@param {Boolean} [htOption.bToggleSelected=false] 단일 선택만 가능하고, 전체 선택해제가능할경우, 선택된 객체를 다시 클릭했을때 선택해제 할지 여부. (bMultiSelection 옵션 값이 false, bRemainOne이 false인 경우에만 true로 지정가능)
			@param {Boolean} [htOption.bActivateOnload=true] 초기화시 activate() 수행여부
		@example
			var oSelectArea = new jindo.SelectArea(jindo.$("select"), {
				bActivateOnload : true, //(Boolean) 초기화시 활성여부
				sClassName : "selectable", //(String) 셀렉트 가능한 엘리먼트에 지정된 클래스명
				htStatus : {
					sSelected : "selected" //(String) 셀렉트된 엘리먼트에 추가되는 클래스명
				},
				bMultiSelection : true, //다중 선택 가능 여부
				bDragSelect : true, //다중 선택 가능한 경우, 드래그하여 선택 가능 여부. (bMultiSelection 옵션 값이 true일때만 사용가능)
				nThreshold : 5,
				bDeselectAllOutside : true, //다중 선택 가능한 경우, 셀렉트가능한 객체가 아닌 곳을 클릭하면 모두 선택해제 할지 여부 (bMultiSelection 옵션 값이 true일때만 true로 지정가능)
				bRemainOne : false, //단일 선택만 가능한 경우, 최소 하나는 선택이 되어있도록 함. (bMultiSelection 옵션 값이 false일때만 true로 지정가능)
				bToggleSelected : false // 단일 선택만 가능하고, 전체 선택해제가능할경우, 선택된 객체를 다시 클릭했을때 선택해제 할지 여부. (bMultiSelection 옵션 값이 false, bRemainOne이 false인 경우에만 true로 지정가능)
			}).attach({
				selectStart : function(oCustomEvent) {
					//선택가능한 객체 위에서 마우스다운되었을때 발생
					//oCustomEvent = {
					//	vLastSelected : (Array || HTMLElement) 이전에 선택된 객체,
					//	elSelectable : (HTMLElement) 마우스다운된 선택가능한 객체,
					//	bWithinSelected : (Boolean) 이전에 선택된 객체들 중에서 선택이 시작되었는지 여부,
					//	weEvent : (jindo.$Event) mousedown 이벤트
					//}
				},
				beforeSelect : function(oCustomEvent) {
					//객체가 선택되기 전 발생
					//oCustomEvent = { 
					//	elSelectable : (HTMLElement) 선택될 객체,
					//	nIndex : (Number) 선택될 객체의 인덱스,
					//	bSelectedAgain : (Boolean) 이전 선택된 객체가 선택하려는 객체와 동일한지 여부 (이전선택된 객체가 하나일때)
					//}
				},
				select : function(oCustomEvent) {
					//객체가 선택된 후 발생
					//oCustomEvent = { 
					//	elSelectable : (HTMLElement) 선택된 객체,
					//	nIndex : (Number) 선택된 객체의 인덱스,
					//	bSelectedAgain : (Boolean) 이전 선택된 객체가 선택된 객체와 동일한지 여부 (이전선택된 객체가 하나일때)
					//}
				},
				beforeDeselect : function(oCustomEvent) {
					//객체가 선택해제되기 전 발생
					//oCustomEvent = { 
					//	elSelectable : (HTMLElement) 선택해제될 객체,
					//	nIndex : (Number) 선택해제될 객체의 인덱스
					//}
				},
				deselect : function(oCustomEvent) {
					//객체가 선택해제된 후 발생
					//oCustomEvent = { 
					//	elSelectable : (HTMLElement) 선택해제된 객체,
					//	nIndex : (Number) 선택해제된 객체의 인덱스
					//}
				},
				change : function(oCustomEvent) {
					//선택된 값이 이전 선택 값과 달라졌을 때 발생
				},
				selectEnd : function(oCustomEvent) {
					//선택이 종료되었을 때 발생
					//oCustomEvent = {
					//	vSelected : (Array || HTMLElement) 선택된 객체
					//}
				},
				dragStart : function(oCustomEvent) {
					//다중선택시 drag를 시작할 때 발생
				},
				dragSelecting : function(oCustomEvent) {
					//drag되어 설정된 선택영역안에 선택가능한 객체가 변경될때 발생 
					//oCustomEvent = { 
					//	aSelectable : (Array) 선택영역안에 포함된 객체
					//}
				},
				dragEnd : function(oCustomEvent) {
					//다중선택시 drag가 끝났을 때 발생
				}
			});
	**/
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(this._el); 
		var htDefaultOption = {
			bActivateOnload : true, //(Boolean) 초기화시 활성여부
			sClassName : "selectable", //(String) 셀렉트 가능한 엘리먼트에 지정된 클래스명
			htStatus : {
				sSelected : "selected" //(String) 셀렉트된 엘리먼트에 추가되는 클래스명
			},
			bMultiSelection : true, //다중 선택 가능 여부
			bDragSelect : true, //다중 선택 가능한 경우, 드래그하여 선택 가능 여부. (bMultiSelection 옵션 값이 true일때만 사용가능)
			nThreshold : 5,
			bDeselectAllOutside : true, //다중 선택 가능한 경우, 셀렉트가능한 객체가 아닌 곳을 클릭하면 모두 선택해제 할지 여부 (bMultiSelection 옵션 값이 true일때만 true로 지정가능)
			bRemainOne : false, //단일 선택만 가능한 경우, 최소 하나는 선택이 되어있도록 함. (bMultiSelection 옵션 값이 false일때만 true로 지정가능)
			bToggleSelected : false // 단일 선택만 가능하고, 전체 선택해제가능할경우, 선택된 객체를 다시 클릭했을때 선택해제 할지 여부. (bMultiSelection 옵션 값이 false, bRemainOne이 false인 경우에만 true로 지정가능)   
		};
		this.option(htDefaultOption);
		this.option(htOption || {});
		
		this._waToggleCandidate = jindo.$A([]);
		this._waSelected = jindo.$A([]);
		this._sCtrl = (jindo.$Agent().os().mac) ? "meta" : "ctrl";
		this._welRectIndicator = null;
		this._wfDragStart = jindo.$Fn(this._onDragSelectStart, this);
		this._wfSelectStart = jindo.$Fn(this._onDragSelectStart, this);
		this._wfMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfMouseUp = jindo.$Fn(this._onMouseUp, this);
		this._wfMouseUpWithinSelected = jindo.$Fn(this._onMouseUpWithinSelected, this);
		this._wfCompute = jindo.$Fn(this._computeSizeAndPos, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	/**
		기준 엘리먼트의 모든 셀렉트가능한 엘리먼트를 가져온다.
		
		@method getSelectableElement
		@return {Array}
	**/
	getSelectableElement : function() {
		return jindo.$$("." + this.option("sClassName"), this._el);
	},
	
	isSelectable : function(el) {
		return jindo.$Element(el).isChildOf(this._el) && jindo.$$.test(el, "." + this.option("sClassName"));
	},
	
	/**
		지정된 셀렉트가능한 엘리먼트가 전체 셀렉트가능한 엘리먼트중 몇번째 엘리먼트인지 가져온다.
		
		@method getIndex
		@param {HTMLElement} el 순서를 얻고자 하는 엘리먼트
		@return {Number} n
	**/
	getIndex : function(el) {
		return jindo.$A(this.getSelectableElement()).indexOf(el);
	},
	
	/**
		지정된 엘리먼트를 선택한다.
		
		@method select
		@param {Array || HTMLElement} a 선택할 엘리먼트 또는 배열
		@param {Boolean} bRemainSelected 이미 선택된 엘리먼트를 선택해제하지 않고 남겨둘지 여부 (디폴트는 단독으로 선택됨)
		@param {Boolean} bFireChangeEvent 기존 선택 값과 달라진 경우 change 커스텀 이벤트를 발생할지 여부 (디폴트 true)
		@return {this} 
		@remark bMultiSelection 옵션이 false이면 bRemainSelected를 true로 지정하여도 기존 선택이 모두 해제된다.
	**/
	select : function(a, bRemainSelected, bFireChangeEvent) {
		a = this._convertArray(a);
		if (typeof bRemainSelected == "undefined") {
			bRemainSelected = false;
		}
		if (typeof bFireChangeEvent == "undefined") {
			bFireChangeEvent = true;
		}
		
		if (!bRemainSelected || !this.option("bMultiSelection")) {
			this.deselectAll(false);
		}
		
		var aLastSelected = this._convertArray(this.getSelected()).concat();
		
		var htStatus = this.option("htStatus");
		
		for (var i = 0; i < a.length; i++) {
			var el = a[i];
			var wel = jindo.$Element(el);
			
			var htCustomEvent = { 
				elSelectable : el,
				nIndex : this.getIndex(el),
				bSelectedAgain : (a.length === 1 && this._vLastSelected === a[0])
			};
			
			/**
				객체가 선택되기 전
				
				@event beforeSelect
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elSelectable 선택될 객체
				@param {Number} nIndex 선택될 객체의 인덱스
				@param {Boolean} bSelectedAgain 이전 선택된 객체가 선택하려는 객체와 동일한지 여부 (이전선택된 객체가 하나일때)
				@param {Function} stop 수행시 객체가 선택되지 않음
				@example
					커스텀 이벤트 핸들링 예제
					oSelectArea.attach("beforeSelect", function(oCustomEvent) { ... });
			**/
			if (this.isSelectable(el) && !this.isSelected(el) && this.fireEvent("beforeSelect", htCustomEvent)) {
				
				htCustomEvent = { 
					elSelectable : el,
					nIndex : this.getIndex(el),
					bSelectedAgain : (a.length === 1 && this._vLastSelected === a[0])
				};
				
				wel.addClass(htStatus.sSelected);
				this._waSelected.push(el);
				/**
					객체가 선택된 후
					
					@event select
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} elSelectable 선택된 객체
					@param {Number} nIndex 선택된 객체의 인덱스
					@param {Boolean} bSelectedAgain 이전 선택된 객체가 선택된 객체와 동일한지 여부 (이전선택된 객체가 하나일때)
					@example
						// 커스텀 이벤트 핸들링 예제
						oSelectArea.attach("select", function(oCustomEvent) { ... });
				**/
				this.fireEvent("select", htCustomEvent);
			}
		}
		
		if (bFireChangeEvent) {
			this._fireChangeEvent(aLastSelected);
		}
		
		return this;
	},
	
	/**
		지정된 엘리먼트를 선택해제한다.
		
		@method deselect
		@param {Array || HTMLElement} a 선택해제할 엘리먼트 또는 배열
		@param {Boolean} bFireChangeEvent 기존 선택 값과 달라진 경우 change 커스텀 이벤트를 발생할지 여부 (디폴트 true)
		@return {this} 
	**/
	deselect : function(a, bFireChangeEvent) {
		a = this._convertArray(a);
		if (typeof bFireChangeEvent == "undefined") {
			bFireChangeEvent = true;
		}
		
		var aLastSelected = this._convertArray(this.getSelected()).concat();
		
		var htStatus = this.option("htStatus");
		for (var i = 0; i < a.length; i++) {
			var el = a[i];
			var wel = jindo.$Element(el);
			var htParam = { 
				elSelectable : el, 
				nIndex : this.getIndex(el) 
			};
			
			/**
				객체가 선택해제되기 전
				
				@event beforeDeselect
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elSelectable 선택해제될 객체
				@param {Number} nIndex 선택해제될 객체의 인덱스
				@param {Function} stop 수행시 객체가 선택해제되지 않음
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("beforeDeselect", function(oCustomEvent) { ... });
			**/
			if (this.isSelectable(el) && this.isSelected(el) && this.fireEvent("beforeDeselect", htParam)) {
				wel.removeClass(htStatus.sSelected);
				this._waSelected = this._waSelected.refuse(el);
				/**
					객체가 선택해제된 후
					
					@event deselect
					@param {String} sType 커스텀 이벤트명
					@param {HTMLElement} elSelectable 선택해제된 객체
					@param {Number} nIndex 선택해제된 객체의 인덱스
					@example
						// 커스텀 이벤트 핸들링 예제
						oSelectArea.attach("deselect", function(oCustomEvent) { ... });
				**/
				this.fireEvent("deselect", htParam);
			}
		}
		
		if (bFireChangeEvent) {
			this._fireChangeEvent(aLastSelected);
		}
		
		return this;
	},
	
	/**
		모든 선택된 엘리먼트를 선택해제한다.
		
		@method deselectAll
		@param {Boolean} bFireChangeEvent 기존 선택 값과 달라진 경우 change 커스텀 이벤트를 발생할지 여부 (디폴트 true)
		@return {this}
	**/
	deselectAll : function(bFireChangeEvent) {
		if (typeof bFireChangeEvent == "undefined") {
			bFireChangeEvent = true;
		}
		this.deselect(this.getSelected(), bFireChangeEvent);
		return this;
	},
	
	/**
		지정된 엘리먼트를 선택반전한다.
		
		@method toggle
		@param {Array || HTMLElement} a 선택해제할 엘리먼트 또는 배열
		@param {Boolean} bFireChangeEvent 기존 선택 값과 달라진 경우 change 커스텀 이벤트를 발생할지 여부 (디폴트 true)
		@return {this} 
	**/
	toggle : function(a, bFireChangeEvent) {
		a = this._convertArray(a);
		if (typeof bFireChangeEvent == "undefined") {
			bFireChangeEvent = true;
		}
		for (var i = 0; i < a.length; i++) {
			var el = a[i];
			if (!this.isSelected(el)) {
				this.select(el, true, bFireChangeEvent);
			} else {
				this.deselect(el, bFireChangeEvent);
			}
		}
		return this;
	},
	
	/**
		선택된 엘리먼트를 가져온다.
		
		@method getSelected
		@return {Array || HTMLElement}
		@remark 다중 선택된 경우 리턴되는 배열은 선택된 순서정보를 포함한다.
	**/
	getSelected : function() {
		if (this._waSelected.length() > 0) {
			return (this._waSelected.length() === 1) ? this._waSelected.get(0) : this._waSelected.$value();
		}
		return null;
	},
	
	/**
		지정된 엘리먼트의 선택여부를 리턴한다.
		
		@method isSelected
		@param {HTMLElement} el 선택 여부를 알고자 하는 엘리먼트
		@return {Boolean}
	**/
	isSelected : function(el) {
		return this._waSelected.has(el);
	},
	
	_getSelectableUntil : function(el) {
		var aReturn = el;
		var elFrom = this._elStartPoint;
		if (elFrom && this.isSelected(elFrom)) {
			var wa = jindo.$A(this.getSelectableElement());
			var nFrom = wa.indexOf(elFrom);
			var nTo = wa.indexOf(el);
			aReturn = wa.slice(Math.min(nFrom, nTo), Math.min(nFrom, nTo) + Math.abs(nFrom - nTo) + 1).$value();
		} 
		return aReturn;
	},
	
	_findSelectableElement : function(el) {
		var sClassName = this.option("sClassName");
		return (jindo.$$.test(el, "." + sClassName)) ? el : jindo.$$.getSingle("! ." +sClassName, el); 
	},
	
	_isChanged : function(aLastSelected) {
		var waLast = jindo.$A(aLastSelected),
			a = this._convertArray(this.getSelected());
			
		if (aLastSelected.length != a.length) {
			return true;
		}
		
		for (var i = 0; i < a.length; i++) {
			if (!waLast.has(a[i])) {
				return true;
			}
		}
		
		return false;
	},
	
	_fireChangeEvent : function(aLastSelected) {
		if (this._isChanged(aLastSelected)) {
			/**
				선택된 값이 이전 선택 값과 달라졌을 때 발생
				
				@event change
				@param {String} sType 커스텀 이벤트명
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("change", function(oCustomEvent) { ... });
			**/
			this.fireEvent("change");
		}
	},
	
	_convertArray : function(a) {
		if (!(a instanceof Array)) {
			if (a) {
				a = [a];
			} else {
				a = [];
			}
		}
		return a;
	},
	
	_onMouseDown : function(we) {
		var htKey = we.key();
		var htMouse = we.mouse(true);
		
		if (htMouse.scrollbar) { return; }
		
		var elSelectable = this._findSelectableElement(we.element);
		var aLastSelected = this._convertArray(this.getSelected()).concat();
		this._vLastSelected = this.getSelected();
		this._waSelectable = jindo.$A(this.getSelectableElement());
		this._waLastSelected = jindo.$A(this._convertArray(this._vLastSelected));
		
		if (elSelectable) { //select
			var bWithinSelected = jindo.$A(this._convertArray(this._vLastSelected)).has(elSelectable);
			
			/**
				선택가능한 객체 위에서 마우스다운되었을때
				
				@event selectStart
				@param {String} sType 커스텀 이벤트명
				@param {Array || HTMLElement} vLastSelected 이전에 선택된 객체
				@param {HTMLElement} elSelectable 마우스다운된 선택가능한 객체
				@param {Boolean} bWithinSelected 이전에 선택된 객체들 중에서 선택이 시작되었는지 여부
				@param {jindo.$Event} weEvent mousedown 이벤트
				@param {Function} stop 수행시 선택이 시작되지 않음
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("selectStart", function(oCustomEvent) { ... });
			**/
			if (this.fireEvent("selectStart", {
				vLastSelected : this._vLastSelected,
				elSelectable : elSelectable,
				bWithinSelected : bWithinSelected,
				weEvent : we
			})) {
				if (bWithinSelected && !htKey.shift && !htKey[this._sCtrl]) {
					this._elWaitMouseUp = elSelectable;
					this._wfMouseUpWithinSelected.attach(this._elWaitMouseUp, "mouseup");
				} else {
					var bRemainSelected = false;
					if (this.option("bMultiSelection")) {
						if (htKey.shift) {
							if (htKey[this._sCtrl]) {
								bRemainSelected = true;
							}
							var aSelectable = this._getSelectableUntil(elSelectable);
							if (aSelectable == elSelectable) {
								this._elStartPoint = elSelectable;	
							}
							this.select(aSelectable, bRemainSelected, false);
						} else {
							this._elStartPoint = elSelectable;
							if (htKey[this._sCtrl]) {
								this.toggle(elSelectable, false);
							} else {
								this.select(elSelectable, bRemainSelected, false);
							}
						} 
					} else {
						if (!this.option("bRemainOne") && this.option("bToggleSelected") && this.getSelected() == elSelectable) { //when trying select selected by itself
							this.deselect(elSelectable, false);
						} else {
							this.select(elSelectable, bRemainSelected, false);
						}
					}
					
					this._fireChangeEvent(aLastSelected);
					/**
						선택이 종료되었을 때
						
						@event selectEnd
						@param {String} sType 커스텀 이벤트명
						@param {Array || HTMLElement} vSelected 선택된 객체
						@example
							// 커스텀 이벤트 핸들링 예제
							oSelectArea.attach("selectEnd", function(oCustomEvent) { ... });
					**/
					this.fireEvent("selectEnd", {
						vSelected : this.getSelected()
					});
				}
			}
		} else { //drag
			this._wfMouseUp.attach(document, "mouseup");
			this._wfCompute.attach(window, "resize").attach(this._el, "scroll");
			
			if (this.option("bMultiSelection") && this.option("bDragSelect")) {
				this._bOverThreshold = null;
				this._htDragStartPos = we.pos(true);
				this._htDragStartPos.scrollTop = this._el.scrollTop;
				this._htDragStartPos.scrollLeft = this._el.scrollLeft;
				this._wfMouseMove.attach(document, "mousemove");
			}
		}
	},
	
	_onDragSelectStart : function(we) {
		we.stop(jindo.$Event.CANCEL_DEFAULT);
	},
	
	_getRectangleElement : function() {
		if (!this._welRectIndicator && this.option("bMultiSelection") && this.option("bDragSelect")) {
			this._welRectIndicator = jindo.$Element(jindo.$('<div style="position:absolute;left:-10px;top:-10px;width:1px;height:1px;margin:0;padding:0;border:1px dotted black;z-index:99999;">'));
			this._welRectIndicator.appendTo(this._el);
		} 
		return this._welRectIndicator;
	},
	
	/**
		드래그 선택시 보여지는 사각 선택영역 엘리먼트를 가져온다.
		
		@method getRectangleElement
		@return {HTMLElement} 
	**/
	getRectangleElement : function() {
		return this._getRectangleElement().$value();
	},
	
	_computeSizeAndPos : function() {
		var aSizeInfo = this._aSizeInfo = [];
			
		jindo.$A(this.getSelectableElement()).forEach(function(el){
			aSizeInfo.push([
				el, el.offsetLeft, el.offsetTop, el.offsetLeft + el.offsetWidth, el.offsetTop + el.offsetHeight
			]);
		});
	},
	
	_onMouseMove : function(we) {
		this._htDragEndPos = we.pos();
		var welRect = this._getRectangleElement(), elRect = welRect.$value();
		var nGapX = this._htDragEndPos.pageX - this._htDragStartPos.pageX;
		var nGapY = this._htDragEndPos.pageY - this._htDragStartPos.pageY;
		var nX = this._htDragStartPos.layerX || this._htDragStartPos.offsetX || 0;
		var nY = this._htDragStartPos.layerY || this._htDragStartPos.offsetY || 0;

		var nThreshold = this.option("nThreshold");
		if (nThreshold && !this._bOverThreshold) {
			var nDistance = Math.sqrt(nGapX * nGapX + nGapY * nGapY);
			
			if (nThreshold > nDistance){
				return;
			}
			
			/**
				다중선택시 drag를 시작할 때
				
				@event dragStart
				@param {String} sType 커스텀 이벤트명
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("dragStart", function(oCustomEvent) { ... });
			**/
			this.fireEvent("dragStart");
			this._bOverThreshold = true;
			this._computeSizeAndPos();
			this._nRectX = nX;
			this._nRectY = nY;
			this._nDragDirectionX = 1;
			this._nDragDirectionY = 1;
			welRect.offset(nY, nX);
			
			if (!we.key()[this._sCtrl]) {
				this.deselectAll(false);
			} 
		}
		var nWidth = nGapX;
		var nHeight = nGapY;
		this._placeRect(nX, nY, nWidth, nHeight);
		
		this._setToggleCandidate(this._getSelectableByRect([elRect, elRect.offsetLeft, elRect.offsetTop, elRect.offsetLeft + elRect.offsetWidth, elRect.offsetTop + elRect.offsetHeight]));
	},
	
	_placeRect : function(nX, nY, nWidth, nHeight) {
		var welRect = this._getRectangleElement();
		welRect.show();
		this._nDragDirectionX = (nX > this._nRectX ) ? 1 : -1;
		this._nDragDirectionY = (nY > this._nRectY ) ? 1 : -1;
	
		nWidth -= ((this._el.scrollLeft - this._htDragStartPos.scrollLeft) * this._nDragDirectionX);
		nHeight -= ((this._el.scrollTop - this._htDragStartPos.scrollTop) * this._nDragDirectionY);

		welRect.width(Math.max(Math.abs(nWidth), 2)).height(Math.max(Math.abs(nHeight), 2));
		
		nX += Math.min(nWidth, 0);
		nY += Math.min(nHeight, 0);
		welRect.css("left", nX + "px").css("top", nY + "px");
	},
	
	_getSelectableByRect : function(aRect) { //[welRect.$value(), nX, nY, nX + nWidth, nY + nHeight]
		var aReturn = [];
		
		jindo.$A(this._aSizeInfo).forEach(function(aSelectable){
			if (aSelectable[1] < aRect[3] && aSelectable[3] > aRect[1] && aSelectable[2] < aRect[4] && aSelectable[4] > aRect[2]) {
				aReturn.push(aSelectable[0]);
				jindo.$A.Continue();
			}
		});
		
		return aReturn;
	},
	
	_setToggleCandidate : function(a) {
		a = this._convertArray(a);

		var bChanged = false;
		if (this._waToggleCandidate.length() != a.length) {
			bChanged = true;
		}
		
		var htStatus = this.option("htStatus");
		
		//clear
		var wa = jindo.$A(a);
		var waRemove = jindo.$A([]);
		this._waToggleCandidate.forEach(function(el, i){
			if (!wa.has(el)) {
				waRemove.push(el);
				bChanged = true;
			}
		});
		
		//dragSelecting
		if (bChanged) {
			waRemove.forEach(function(el){
				this._waToggleCandidate = this._waToggleCandidate.refuse(el);
				jindo.$Element(el).toggleClass(htStatus.sSelected);
			}, this);
			
			wa.forEach(function(el){
				if (this.isSelected(el)) {
					jindo.$Element(el).removeClass(htStatus.sSelected);
				} else {
					jindo.$Element(el).addClass(htStatus.sSelected);	
				}
			}, this);
			
			this._waToggleCandidate = jindo.$A(this._waToggleCandidate.$value().concat(a)).unique();
			/**
				drag되어 설정된 선택영역안에 선택가능한 객체가 변경될때 발생
				
				@event dragSelecting
				@param {String} sType 커스텀 이벤트명
				@param {Array} aSelectable 선택영역안에 포함된 객체
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("dragSelecting", function(oCustomEvent) { ... });
			**/
			this.fireEvent("dragSelecting", { aSelectable : this._waToggleCandidate.$value() });
		}
	},
	
	_onMouseUp : function(we) {
		var bDeselectAll = (!this.isDragging() && !we.key()[this._sCtrl] && (!this.option("bRemainOne") && this.option("bDeselectAllOutside"))),
			bHasCandidate = this._waToggleCandidate.length(),
			aLastSelected = this._convertArray(this.getSelected()).concat();
		
		if (bDeselectAll) {
			this.deselectAll(false);
		}
		if (bHasCandidate) {
			this._elStartPoint = this._waToggleCandidate.$value()[0];
			this.toggle(this._waToggleCandidate.$value());
		}
		this._fireChangeEvent(aLastSelected);
		
		this._stopDragging();
	},
	
	/**
		이미 선택된 엘리먼트내에서 클릭하여 선택하려고할때 mouseup이전에 이 메서드가 호출되면 선택되지 않는다.
		
		@method stopSelecting
		@remark 다중선택시 이미 선택된 엘리먼트내에서 선택하려고하는 경우에는 mouseup시에 선택이 되게 된다.
		@return {this}
	**/
	stopSelecting : function() {
		this._wfMouseUpWithinSelected.detach(this._elWaitMouseUp, "mouseup");
		return this;
	},
	
	/**
		셀렉트를 위해 드래그되고 있는지 여부를 가져온다.
		
		@method isDragging
		@return {Boolean}
	**/
	isDragging : function() {
		return this._bOverThreshold;
	},
	
	_restore : function() {
		jindo.$ElementList(this._waToggleCandidate.$value()).removeClass(this.option("htStatus").sSelected);
		this.deselectAll(false);
		if (this._waLastSelected.$value().length) {
			this.select(this._waLastSelected.$value(), false, false);
		}
	},
	
	_stopDragging : function() {
		this._waToggleCandidate.empty();
		this._htDragStartPos = null;
		this._htDragEndPos = null;
		this._wfMouseMove.detach(document, "mousemove");
		this._wfMouseUp.detach(document, "mouseup");
		this._wfCompute.detach(window, "resize").detach(this._el, "scroll");
		
		if (this.isDragging()) {
			this._bOverThreshold = null;
			this._getRectangleElement().hide();
			/**
				다중선택시 drag가 끝났을 때
				
				@event dragEnd
				@param {String} sType 커스텀 이벤트명
				@example
					// 커스텀 이벤트 핸들링 예제
					oSelectArea.attach("dragEnd", function(oCustomEvent) { ... });
			**/
			this.fireEvent("dragEnd");
		}
	},
	
	/**
		셀렉트를 위한 drag를 중단한다.
		드래그 이전에 선택되어있던 상태로 복귀된다.
		
		@method stopDragging
		@return {this}
	**/
	stopDragging : function() {
		if (this.isDragging()) {
			this._restore();
			this._stopDragging();
		}
		return this;
	},
	
	_onMouseUpWithinSelected : function(we) {
		this.stopSelecting();
		
		var elSelectable = this._findSelectableElement(we.element);
		if (elSelectable && elSelectable == we.currentElement) {
			this.deselectAll(false);
			this.select(elSelectable, false, true);
		}
	},
	
	_onActivate : function() {
		this._sMozUserSelect = this._wel.css("MozUserSelect");
		this._wel.css("MozUserSelect", "none");
		
		jindo.$Element.prototype.preventTapHighlight && this._wel.preventTapHighlight(true);
		this._wfMouseDown.attach(this._el, "mousedown");
		this._wfDragStart.attach(this._el, "dragstart");
		this._wfSelectStart.attach(this._el, 'selectstart');
	},
	
	_onDeactivate : function() {
		this._wel.css("MozUserSelect", this._sMozUserSelect || '');
		
		jindo.$Element.prototype.preventTapHighlight && this._wel.preventTapHighlight(false);
		this._wfMouseDown.detach(this._el, "mousedown");
		this._wfDragStart.detach(this._el, "dragstart");
		this._wfSelectStart.detach(this._el, 'selectstart');
	}
	
}).extend(jindo.UIComponent);
