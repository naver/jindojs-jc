/**
	@fileOverview HTML Element를 Drag할 수 있게 해주는 컴포넌트
	@author hooriza, modified by senxation
	@version #__VERSION__#
**/

/**
	HTML Element를 Drag할 수 있게 해주는 컴포넌트
	DragArea 컴포넌트는 상위 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 모든 엘리먼트를 Drag 가능하게 하는 기능을 한다.
	
	@class jindo.DragArea
	@extends jindo.UIComponent
	
	@keyword drag, area, 드래그&드랍, 드래그, 영역
**/
jindo.DragArea = jindo.$Class({
	/** @lends jindo.DragArea.prototype */
	
	/**
		DragArea 컴포넌트를 생성한다.
		@constructor
		@param {HTMLElement} el Drag될 엘리먼트들의 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
		@param {Object} [htOption] 옵션 객체
			@param {String} [htOption.sClassName="draggable"] 드래그 될 엘리먼트의 클래스명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 드래그가능하게 된다.
			@param {Boolean} [htOption.bFlowOut=true] 드래그될 엘리먼트가 상위 기준 엘리먼트의 영역을 벗어날 수 있는지의 여부. 상위 엘리먼트의 크기가 드래그되는 객체보다 크거나 같아야지만 동작한다. 작은 경우 document사이즈로 제한한다.
			@param {Boolean} [htOption.bSetCapture=true] ie에서 setCapture() 명령 사용여부
			@param {Number} [htOption.nThreshold=0] 드래그가 시작되기 위한 최소 역치 값(px)
		@example
			var oDragArea = new jindo.DragArea(document, {
				"sClassName" : 'dragable', // (String) 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 Drag 가능하게 된다. 
				"bFlowOut" : true, // (Boolean) 드래그될 엘리먼트가 상위 기준 엘리먼트의 영역을 벗어날 수 있는지의 여부. 상위 엘리먼트의 크기가 드래그되는 객체보다 크거나 같아야지만 동작하도록 수정. 작은 경우 document사이즈로 제한한다.
				"bSetCapture" : true, //ie에서 setCapture 사용여부
				"nThreshold" : 0 // (Number) 드래그가 시작되기 위한 최소 역치 값(px) 
			}).attach({
				handleDown : function(oCustomEvent) {
					//드래그될 handle 에 마우스가 클릭되었을 때 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
					//	weEvent : (jindo.$Event) mousedown시 발생되는 jindo.$Event 객체
					//};
					//oCustomEvent.stop(); 이 수행되면 dragStart 이벤트가 발생하지 않고 중단된다.
				},
				dragStart : function(oCustomEvent) {
					//드래그가 시작될 때 발생 (마우스 클릭 후 첫 움직일 때 한 번)
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
					//	htDiff : (HashTable) handledown된 좌표와 dragstart된 좌표의 차이 htDiff.nPageX, htDiff.nPageY
					//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
					//};
					//oCustomEvent.stop(); 이 수행되면 뒤따르는 beforedrag 이벤트가 발생하지 않고 중단된다.
				},
				beforeDrag : function(oCustomEvent) {
					//드래그가 시작되고 엘리먼트가 이동되기 직전에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elFlowOut : (HTMLElement) bFlowOut 옵션이 적용될 상위 기준 엘리먼트 (변경가능)
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트
					//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
					//	nX : (Number) 드래그 될 x좌표. 이 좌표로 엘리먼트가 이동 된다.
					//	nY : (Number) 드래그 될 y좌표. 이 좌표로 엘리먼트가 이동 된다.
					//	nGapX : (Number) 드래그가 시작된 x좌표와의 차이
					//	nGapY : (Number) 드래그가 시작된 y좌표와의 차이
					//};
					//oCustomEvent.stop(); 이 수행되면 뒤따르는 drag 이벤트가 발생하지 않고 중단된다.
					//oCustomEvent.nX = null; // 가로로는 안 움직이게
					//oCustomEvent.nX = Math.round(oCustomEvent.nX / 20) * 20;
					//oCustomEvent.nY = Math.round(oCustomEvent.nY / 20) * 20;
					//if (oCustomEvent.nX < 0) oCustomEvent.nX = 0;
					//if (oCustomEvent.nY < 0) oCustomEvent.nY = 0;
				},
				drag : function(oCustomEvent) {
					//드래그 엘리먼트가 이동하는 중에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트
					//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
					//	nX : (Number) 드래그 된 x좌표. 이 좌표로 엘리먼트가 이동 된다.
					//	nY : (Number) 드래그 된 y좌표. 이 좌표로 엘리먼트가 이동 된다.
					//	nGapX : (Number) 드래그가 시작된 x좌표와의 차이
					//	nGapY : (Number) 드래그가 시작된 y좌표와의 차이
					//};
				},
				dragEnd : function(oCustomEvent) {
					//드래그(엘리먼트 이동)가 완료된 후에 발생 (mouseup시 1회 발생. 뒤이어 handleup 발생)
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
					//	bInterupted : (Boolean) 드래그중 stopDragging() 호출로 강제적으로 드래그가 종료되었는지의 여부
					//	nX : (Number) 드래그 된 x좌표.
					//	nY : (Number) 드래그 된 y좌표.
					//}
				},
				handleUp : function(oCustomEvent) {
					//드래그된 handle에 마우스 클릭이 해제됬을 때 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 된 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
					//	weEvent : (jindo.$Event) mouseup시 발생되는 jindo.$Event 객체 
					//};
				}
			});
	**/
	$init : function(el, htOption) {
		this.option({
			sClassName : 'draggable',
			bFlowOut : true,
			bSetCapture : true, //ie에서 bSetCapture 사용여부
			nThreshold : 0
		});
		
		this.option(htOption || {});
		
		this._el = el;
		
		this._bIE = jindo.$Agent().navigator().ie;
		
		this._htDragInfo = {
			"bIsDragging" : false, // 드래그 중인 상태인지 여부
			"bPrepared" : false, // mousedown이 되었을때 true, threshold 를 넘겨서 이동중엔 false
			"bHandleDown" : false, // handle 을 마우스로 클릭하고 있는 상태인지 여부
			"bForceDrag" : false // startDragging 메서드를 통해서 강제로 드래그 하는 건지 여부
		};

		this._wfOnMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfOnMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfOnMouseUp = jindo.$Fn(this._onMouseUp, this);
		
		this._wfOnDragStart = jindo.$Fn(this._onDragStart, this);
		this._wfOnSelectStart = jindo.$Fn(this._onSelectStart, this);
		
		this.activate();
	},
	
	// 드래그 가능한 엘리먼트 찾기
	_findDraggableElement : function(el) {
		// 입력폼을 잡고는 드래그 할 수 없게
		if (el.nodeType === 1 && jindo.$$.test(el, "input[type=text], textarea, select")){
			return null;
		} 
		
		var self = this;
		var sClass = '.' + this.option('sClassName');
		
		var isChildOfDragArea = function(el) {
			if (el === null) {
				return false;
			}
			if (self._el === document || self._el === el) {
				return true;
			} 
			return jindo.$Element(self._el).isParentOf(el);
		};
		
		// 지정한 클래스명을 포함하고 있는 엘리먼트를 찾음
		var elReturn = jindo.$$.test(el, sClass) ? el : jindo.$$.getSingle('! ' + sClass, el);
		
		// 찾아낸 엘리먼트가 DragArea 영역 바깥에 있으면 그만둠
		if (!isChildOfDragArea(elReturn)) {
			elReturn = null;
		}
		return elReturn;
	},
	
	/**
		레이어가 현재 드래그 되고 있는지 여부를 가져온다.
		
		@method isDragging
		@return {Boolean} 레이어가 현재 드래그 되고 있는지 여부
	**/
	isDragging : function() {
		var htDragInfo = this._htDragInfo; 
		return htDragInfo.bIsDragging && !htDragInfo.bPrepared;
	},
	
	/**
		드래그를 강제 종료시킨다.
		
		@method stopDragging
		@return {this}
	**/
	stopDragging : function() {
		this._stopDragging(true);
		return this;
	},
	
	// 드래그 중단시키기
	_stopDragging : function(bInterupted) {
		this._wfOnMouseMove.detach(document, 'mousemove');
		this._wfOnMouseUp.detach(document, 'mouseup');
		
		if (!this.isDragging()) { return; }

		var htDragInfo = this._htDragInfo,
			welDrag = jindo.$Element(htDragInfo.elDrag);
		
		htDragInfo.bIsDragging = false;
		htDragInfo.bForceDrag = false;
		htDragInfo.bPrepared = false;
		
		if(this._bIE && this._elSetCapture) {
			this._elSetCapture.releaseCapture();
			this._elSetCapture = null;
		}
		
		/**
			드래그(엘리먼트 이동)가 완료된 후에 발생 (mouseup시 1회 발생. 뒤이어 handleup 발생)
			
			@event dragEnd
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elArea 기준 엘리먼트
			@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
			@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
			@param {Boolean} bInterupted 드래그중 stopDragging() 호출로 강제적으로 드래그가 종료되었는지의 여부
			@param {Number} nX 드래그 된 x좌표.
			@param {Number} nY 드래그 된 y좌표.
			@example
				// 커스텀 이벤트 핸들링 예제
				oDragArea.attach("dragEnd", function(oCustomEvent) {
					//~~
				});
		**/
		this.fireEvent('dragEnd', {
			"elArea" : this._el,
			"elHandle" : htDragInfo.elHandle,
			"elDrag" : htDragInfo.elDrag,
			"nX" : parseInt(welDrag.css("left"), 10) || 0,
			"nY" : parseInt(welDrag.css("top"), 10) || 0,
			"bInterupted" : bInterupted
		});

	},
	
	/**
		DragArea 동작을 위한 mousedown, dragstart, selectstart 이벤트를 attach 한다. 
	**/
	_onActivate : function() {
		this._wfOnMouseDown.attach(this._el, 'mousedown');
		this._wfOnDragStart.attach(this._el, 'dragstart'); // for IE
		this._wfOnSelectStart.attach(this._el, 'selectstart'); // for IE	
	},
	
	/**
		DragArea 동작을 위한 mousedown, dragstart, selectstart 이벤트를 detach 한다. 
	**/
	_onDeactivate : function() {
	    this.stopDragging();
		this._wfOnMouseDown.detach(this._el, 'mousedown');
		this._wfOnDragStart.detach(this._el, 'dragstart'); // for IE
		this._wfOnSelectStart.detach(this._el, 'selectstart'); // for IE
	},
	
	/**
		이벤트를 attach한다.
		
		@method attachEvent
		@deprecated activate() 사용권장
	**/
	attachEvent : function() {
		this.activate();
	},
	
	/**
		이벤트를 detach한다.
		
		@method detachEvent
		@deprecated deactivate() 사용권장
	**/
	detachEvent : function() {
		this.deactivate();
	},
	
	/**
		이벤트의 attach 여부를 가져온다.
		
		@method isEventAttached
		@deprecated isActivating() 사용권장
	**/
	isEventAttached : function() {
		return this.isActivating();
	},
	
	/**
		마우스다운이벤트와 관계없이 지정된 엘리먼트를 드래그 시작한다.
		
		@method startDragging
		@param {HTMLElement} el 드래그할 엘리먼트
		@return {Boolean} 드래그시작여부
	**/
	startDragging : function(el) {
		var elDrag = this._findDraggableElement(el);
		if (elDrag) {
			this._htDragInfo.bForceDrag = true;
			this._htDragInfo.bPrepared = true;
			this._htDragInfo.elHandle = elDrag;
			this._htDragInfo.elDrag = elDrag;
			
			this._wfOnMouseMove.attach(document, 'mousemove');
			this._wfOnMouseUp.attach(document, 'mouseup');
			return true;
		}
		return false;
	},
	
	_onMouseDown : function(we) {
		
		var mouse = we.mouse(true);
        /* 
         * IE에서 네이버 툴바의 마우스제스처 기능 사용시 우클릭하면
         * e.mouse().right가 false로 들어오므로 left 값으로만 처리하도록 수정
         * [추가] 모바일에서 동작하지 않아 이벤트 타입이 mouse인 것만 확인. 
         */ 
        if (/^mouse/.test(we.type)&&(!mouse.left || mouse.right || mouse.scrollbar)) {
            this._stopDragging(true);
            return;
        }
		
		// 드래그 할 객체 찾기
		var el = this._findDraggableElement(we.element);
		if (el) {
			var oPos = we.pos(),
				htDragInfo = this._htDragInfo;
			
			htDragInfo.bHandleDown = true;
			htDragInfo.bPrepared = true;
			htDragInfo.nButton = we._event.button;
			htDragInfo.elHandle = el;
			htDragInfo.elDrag = el;
			htDragInfo.nPageX = oPos.pageX;
			htDragInfo.nPageY = oPos.pageY;
			/**
				드래그될 handle 에 마우스가 클릭되었을 때 발생
				
				@event handleDown
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
				@param {Function} stop dragStart 이벤트를 발생시키지 않고 중단시킬때 호출
				@example
					// 커스텀 이벤트 핸들링 예제
					oDragArea.attach("handleDown", function(oCustomEvent){
						// 뒤따르는 dragStart 이벤트가 발생하지 않고 중단하고 싶은 경우
						oCustomEvent.stop();
					});
			**/
			if (this.fireEvent('handleDown', { 
				elHandle : el, 
				elDrag : el, 
				weEvent : we 
			})) {
				this._wfOnMouseMove.attach(document, 'mousemove');
			} 
			this._wfOnMouseUp.attach(document, 'mouseup');
			
			we.stop(jindo.$Event.CANCEL_DEFAULT);			
		}
	},
	
	_onMouseMove : function(we) {
		var htDragInfo = this._htDragInfo,
			htParam, htRect,
			oPos = we.pos(), 
			htGap = {
				"nX" : oPos.pageX - htDragInfo.nPageX,
				"nY" : oPos.pageY - htDragInfo.nPageY
			};

		// 아직 threshold 을 넘겨서 드래그하지 못한 상태면
		if (htDragInfo.bPrepared) {
			var nThreshold = this.option('nThreshold'),
				htDiff = {};
			
			// 강제로 드래그하는게 아니고 threshold 옵션이 지정되어 있으면
			if (!htDragInfo.bForceDrag && nThreshold) {
				htDiff.nPageX = oPos.pageX - htDragInfo.nPageX;
				htDiff.nPageY = oPos.pageY - htDragInfo.nPageY;
				var nDistance = Math.sqrt(htDiff.nPageX * htDiff.nPageX + htDiff.nPageY * htDiff.nPageY);
				if (nThreshold > nDistance){ // threshold 를 못 넘겼으면 그만둠
					return;
				} 
			}

			if (this._bIE && this.option("bSetCapture")) {
				this._elSetCapture = (this._el === document) ? document.body : this._findDraggableElement(we.element);
				if (this._elSetCapture) {
					this._elSetCapture.setCapture(false);
				}
			}
			 
			htParam = {
				elArea : this._el,
				elHandle : htDragInfo.elHandle,
				elDrag : htDragInfo.elDrag,
				htDiff : htDiff, //nThreshold가 있는경우 htDiff필요
				weEvent : we //jindo.$Event
			};
			
			htDragInfo.bIsDragging = true; // 드래그 중이고
			htDragInfo.bPrepared = false; // threshold 을 넘겼다고 flag 변경

			/**
				드래그가 시작될 때 발생 (마우스 클릭 후 첫 움직일 때 한 번)
				
				@event dragStart
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elArea 기준 엘리먼트
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {Object} htDiff handledown된 좌표와 dragstart된 좌표의 차이
				@param {Number} htDiff.nPageX 가로 좌표
				@param {Number} htDiff.nPageY 세로 좌표
				@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
				@param {Function} stop beforedrag 이벤트를 발생시키지 않고 중단시킬때 호출
				@example
					// 커스텀 이벤트 핸들링 예제
					oDragArea.attach("dragStart", function(oCustomEvent){
						// 뒤따르는 beforedrag 이벤트가 발생하지 않고 중단하고 싶은 경우
						oCustomEvent.stop();
					});
			**/
			if (this.fireEvent('dragStart', htParam)) {
				var welDrag = jindo.$Element(htParam.elDrag),
					htOffset = welDrag.offset();
				
				htDragInfo.elHandle = htParam.elHandle;
				htDragInfo.elDrag = htParam.elDrag;
				htDragInfo.nX = parseInt(welDrag.css('left'), 10) || 0;
				htDragInfo.nY = parseInt(welDrag.css('top'), 10) || 0;
				htDragInfo.nClientX = htOffset.left + welDrag.width() / 2;
				htDragInfo.nClientY = htOffset.top + welDrag.height() / 2;
			} else {
				htDragInfo.bPrepared = true;
				return;
			}
		} 
				
		if (htDragInfo.bForceDrag) {
			htGap.nX = oPos.clientX - htDragInfo.nClientX;
			htGap.nY = oPos.clientY - htDragInfo.nClientY;
		}
		
		htParam = {
			"elArea" : this._el,
			"elFlowOut" : htDragInfo.elDrag.parentNode, 
			"elHandle" : htDragInfo.elHandle,
			"elDrag" : htDragInfo.elDrag,
			"weEvent" : we, 		 //jindo.$Event
			"nX" : htDragInfo.nX + htGap.nX,
			"nY" : htDragInfo.nY + htGap.nY,
			"nGapX" : htGap.nX,
			"nGapY" : htGap.nY
		};
		
		/**
			드래그가 시작되고 엘리먼트가 이동되기 직전에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
			
			@event beforeDrag
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elArea 기준 엘리먼트
			@param {HTMLElement} elFlowOut bFlowOut 옵션이 적용될 상위 기준 엘리먼트 (변경가능)
			@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
			@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
			@param {Number} nX 드래그 될 x좌표. 이 좌표로 엘리먼트가 이동 된다.
			@param {Number} nY 드래그 될 y좌표. 이 좌표로 엘리먼트가 이동 된다.
			@param {Number} nGapX 드래그가 시작된 x좌표와의 차이
			@param {Number} nGapY 드래그가 시작된 y좌표와의 차이
			@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
			@param {Function} stop drag 이벤트를 발생시키지 않고 중단시킬때 호출
			@example
				// 커스텀 이벤트 핸들링 예제
				oDragArea.attach("beforeDrag", function(oCustomEvent) {
					// 뒤따르는 drag 이벤트가 발생하지 않고 중단하고 싶은 경우
					oCustomEvent.stop();
					
					// 가로로는 안 움직이게 않게 할 경우
					oCustomEvent.nX = null;
					
					// Grid 좌표로 이동하게 할 경우
					oCustomEvent.nX = Math.round(oCustomEvent.nX / 20) * 20;
					oCustomEvent.nY = Math.round(oCustomEvent.nY / 20) * 20;
					
					if(oCustomEvent.nX < 0){
						oCustomEvent.nX = 0;
					}
					
					if(oCustomEvent.nY < 0){
						oCustomEvent.nY = 0;
					}
				});
		**/
		if (this.fireEvent('beforeDrag', htParam)) {
			var elDrag = htDragInfo.elDrag;

			// 드래그 객체가 영역 밖으로 넘어가면 안되는 상황이면 계산을 통해 위치(nX, nY)를 제한
			if (this.option('bFlowOut') === false) {
				var elParent = htParam.elFlowOut,
					aSize = [ elDrag.offsetWidth, elDrag.offsetHeight ],
					nScrollLeft = 0, nScrollTop = 0;
					
				if (elParent == document.body) {
					nScrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
					nScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
					elParent = null;
				}
				
				var elParentSize = elParent && {
					w : Math.max(elParent.offsetWidth, elParent.scrollWidth),
					h : Math.max(elParent.offsetHeight, elParent.scrollHeight)
				};
				
				if (elParent && aSize[0] <= elParentSize.w && aSize[1] <= elParentSize.h) {
					
					htRect = { 
						nWidth : elParent.clientWidth, 
						nHeight : elParent.clientHeight
					};	
					nScrollLeft = elParent.scrollLeft;
					nScrollTop = elParent.scrollTop;
				} else {
					var	htClientSize = jindo.$Document().clientSize();
						
					htRect = {
						nWidth : htClientSize.width, 
						nHeight : htClientSize.height
					};
				}
	
				if (htParam.nX !== null) {
					htParam.nX = Math.max(htParam.nX, nScrollLeft);
					htParam.nX = Math.min(htParam.nX, htRect.nWidth - aSize[0] + nScrollLeft);
				}
				
				if (htParam.nY !== null) {
					htParam.nY = Math.max(htParam.nY, nScrollTop);
					htParam.nY = Math.min(htParam.nY, htRect.nHeight - aSize[1] + nScrollTop);
				}
			}

			if (htParam.nX !== null) { // nX 가 null 이면 변경 안함
				elDrag.style.left = htParam.nX + 'px';
			}

			if (htParam.nY !== null) { // nY 가 null 이면 변경 안함
				elDrag.style.top = htParam.nY + 'px';
			}
			
			/**
				드래그 엘리먼트가 이동하는 중에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
				
				@event drag
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elArea 기준 엘리먼트
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {Number} nX 드래그 된 x좌표.
				@param {Number} nY 드래그 된 y좌표.
				@param {Number} nGapX 드래그가 시작된 x좌표와의 차이
				@param {Number} nGapY 드래그가 시작된 y좌표와의 차이
				@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
				@example
					//커스텀 이벤트 핸들링 예제
					oDragArea.attach("drag", function(oCustomEvent) {
						//~~
					});
			**/
			this.fireEvent('drag', htParam);
		}else{
			htDragInfo.bIsDragging = false;
		}
	},
	
	_onMouseUp : function(we) {
		this._stopDragging(false);
		
		var htDragInfo = this._htDragInfo;
		htDragInfo.bHandleDown = false;
		/**
			드래그된 handle에 마우스 클릭이 해제됬을 때 발생
			
			@event handleUp
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
			@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
			@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
			@example
				// 커스텀 이벤트 핸들링 예제
				oDragArea.attach("handleUp", function(oCustomEvent) {
					//~~
				});
		**/
		this.fireEvent("handleUp", {
			weEvent : we,
			elHandle : htDragInfo.elHandle,
			elDrag : htDragInfo.elDrag 
		});
	},
	
	_onDragStart : function(we) {
		if (this._findDraggableElement(we.element)) { 
			we.stop(jindo.$Event.CANCEL_DEFAULT); 
		}
	},
	
	_onSelectStart : function(we) {
		if (this.isDragging() || this._findDraggableElement(we.element)) {
			we.stop(jindo.$Event.CANCEL_DEFAULT);	
		}
	}
	
}).extend(jindo.UIComponent);