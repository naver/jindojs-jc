/**
	@fileOverview HTMLElement를 Drop할 수 있게 해주는 컴포넌트
	@author hooriza, modified by senxation
	@version #__VERSION__#
**/

/**
	HTMLElement를 Drop할 수 있게 해주는 컴포넌트
	DragArea 컴포넌트는 상위 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 모든 엘리먼트에 Drag된 엘리먼트를 Drop 가능하게 한다.
	
	@class jindo.DropArea
	@extends jindo.Component
	@uses jindo.DragArea
	
	@keyword drop, area, 드래그&드랍, 드랍, 영역
**/
jindo.DropArea = jindo.$Class({
	/** @lends jindo.DropArea.prototype */
	
	/**
		DropArea 컴포넌트를 생성한다.
		@constructor
		@param {HTMLElement || document} el Drop될 엘리먼트들의 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
		@param {Object} [htOption] 옵션 객체
			@param {jindo.DragArea} htOption.oDragInstance Drop이 될 대상인 DragArea 컴포넌트의 인스턴스 (필수지정)
			@param {String} [htOption.sClassName="droppable"] 드랍가능한 엘리먼트의 클래스명. 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 드랍가능하게 된다.
		@example
			var oDropArea = new jindo.DropArea(document, { 
				sClassName : 'dropable', // (String) 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 Drop 가능하게 된다. 
				oDragInstance : oDragArea // (jindo.DragArea) Drop이 될 대상인 DragArea 컴포넌트의 인스턴스
			}).attach({
				dragStart : function(oCustomEvent) {
					//oDragInstance의 dragStart 이벤트에 연이어 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
					//	htDiff : (HashTable) handledown된 좌표와 dragstart된 좌표의 차이 htDiff.nPageX, htDiff.nPageY
					//	weEvent : (jindo.$Event) 마우스 이동 중 발생되는 jindo.$Event 객체
					//};
				},
				over : function(oCustomEvent) {
					//Drag된 채 Drop 가능한 엘리먼트에 마우스 커서가 올라갈 경우 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
					//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
					//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
					//}
				},
				move : function(oCustomEvent) {
					//Drag된 채 Drop 가능한 엘리먼트위에서 마우스 커서가 움직일 경우 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	weEvent : (jindo.$Event) 마우스 이동시 발생하는 jindo의 jindo.$Event 객체
					//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
					//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
					//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
					//	nRatioX : (Number) 드랍될 엘리먼트 내부의 좌우비율
					//	nRatioY : (Number) 드랍될 엘리먼트 내부의 상하비율
					//}
				},
				out : function(oCustomEvent) {
					//Drag된 채 Drop 가능한 엘리먼트에서 마우스 커서가 벗어날 경우 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
					//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
					//	elDrop : (HTMLElement) Drop 될 엘리먼트
					//}
				}, 
				drop : function(oCustomEvent) {
					//Drop 가능한 엘리먼트에 성공적으로 드랍 될 경우 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
					//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
					//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
					//	weEvent : (jindo.$Event) mouseup시 발생되는 jindo.$Event 객체 
					//}
				},
				dragEnd : function(oCustomEvent) {
					//oDragInstance의 dragEnd 이벤트에 연이어 발생
					//전달되는 이벤트 객체 oCustomEvent = {
					//	elArea : (HTMLElement) 기준 엘리먼트
					//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
					//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
					//  aDrop : (Array) Drop 될 대상 엘리먼트의 배열
					//	nX : (Number) 드래그 된 x좌표.
					//	nY : (Number) 드래그 된 y좌표.
					//}
				}
			});
	**/
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(this._el);
		
		this.option({ 
			sClassName : 'droppable', 
			oDragInstance : null 
		});
		this.option(htOption || {});
		
		this._waOveredDroppableElement = jindo.$A([]);
		
		this._elHandle = null;
		this._elDragging = null;
				
		this._wfMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfMouseOver = jindo.$Fn(this._onMouseOver, this);
		this._wfMouseOut = jindo.$Fn(this._onMouseOut, this);
		var oDrag = this.option('oDragInstance');
		if (oDrag) {
			var self = this;
			oDrag.attach({
				handleDown : function(oCustomEvent) {
					self._elHandle = oCustomEvent.elHandle;
					self._waOveredDroppableElement.empty(); 
				},
				dragStart : function(oCustomEvent) {
					self._reCalculate();
					/**
						oDragInstance의 dragStart 이벤트에 연이어 발생
						
						@event dragStart
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} elArea 기준 엘리먼트
						@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
						@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
						@param {Object} htDiff handledown된 좌표와 dragstart된 좌표의 차이
							@param {Number} htDiff.nPageX 가로 좌표
							@param {Number} htDiff.nPageY 세로 좌표
						@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
						@example
							// 커스텀 이벤트 핸들링 예제
							oDropArea.attach("dragStart", function(oCustomEvent) { ... });
					**/
					self.fireEvent(oCustomEvent.sType, oCustomEvent); //dragStart
					
					self._wfMouseMove.attach(document, 'mousemove'); //move
					//self._wfMouseOver.attach(self._el, 'mouseover'); //over
					//self._wfMouseOut.attach(self._el, 'mouseout');  //out
				},
				drag : function(oCustomEvent) {
					self._elDragging = oCustomEvent.elDrag; 
				},
				dragEnd : function(oCustomEvent) {
					var o = {};
					for (var sKey in oCustomEvent) {
						o[sKey] = oCustomEvent[sKey];
					}
					o.aDrop = self.getOveredLists().concat();
					
					self._clearOveredDroppableElement(oCustomEvent.weEvent, oCustomEvent.bInterupted); //drop
					/**
						oDragInstance의 dragEnd 이벤트에 연이어 발생
						
						@event dragEnd
						@param {String} sType 커스텀 이벤트명
						@param {HTMLElement} elArea 기준 엘리먼트
						@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
						@param {HTMLElement} elDrag 실제로 드래그 된 엘리먼트커스텀 
						@param {Array} aDrop Drop 될 대상 엘리먼트의 배열
						@param {Number} nX 드래그 된 x좌표
						@param {Number} nY 드래그 된 y좌표
						@example
							// 커스텀 이벤트 핸들링 예제
							oDropArea.attach("dragEnd", function(oCustomEvent) { ... });
					**/
					self.fireEvent(oCustomEvent.sType, o); //dragEnd
					
					self._wfMouseMove.detach(document, 'mousemove');
					//self._wfMouseOver.detach(self._el, 'mouseover');
					//self._wfMouseOut.detach(self._el, 'mouseout'); 
				},
				handleUp : function(oCustomEvent) {
					self._elDragging = null;
					self._elHandle = null;
				}
			});
		} 
	},
	
	_addOveredDroppableElement : function(elDroppable) {
		if (this._waOveredDroppableElement.indexOf(elDroppable) == -1) {
			this._waOveredDroppableElement.push(elDroppable);
			/**
				Drag된 채 Drop 가능한 엘리먼트에 마우스 커서가 올라갈 경우 발생
				
				@event over
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {HTMLElement} elDrop Drop 될 대상 엘리먼트
				@example
					// 커스텀 이벤트 핸들링 예제
					oDropArea.attach("over", function(oCustomEvent) { ... });
			**/
			this.fireEvent('over', { 
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable  
			});
		}
	},
	
	_fireMoveEvent : function(elDroppable, oRect, oPos, we) {
		var nRatioX = (oPos.pageX - oRect.nLeft) / (oRect.nRight - oRect.nLeft);
		var nRatioY = (oPos.pageY - oRect.nTop) / (oRect.nBottom - oRect.nTop);
		/**
			Drag된 채 Drop 가능한 엘리먼트위에서 마우스 커서가 움직일 경우 발생
			
			@event move
			@param {String} sType 커스텀 이벤트명
			@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
			@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
			@param {HTMLElement} elDrop Drop 될 대상 엘리먼트
			@param {Number} nRatioX 드랍될 엘리먼트 내부의 좌우비율
			@param {Number} nRatioY 드랍될 엘리먼트 내부의 상하비율
			@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
			@example
				// 커스텀 이벤트 핸들링 예제
				oDropArea.attach("move", function(oCustomEvent) { ... });
		**/
		this.fireEvent('move', {
			weEvent : we,
			elHandle : this._elHandle,
			elDrag : this._elDragging, 
			elDrop : elDroppable, 
			nRatioX : nRatioX,
			nRatioY : nRatioY
		});
	},

	_removeOveredDroppableElement : function(elDroppable) {
		var nIndex = this._waOveredDroppableElement.indexOf(elDroppable);
		if (nIndex != -1) {
			this._waOveredDroppableElement.splice(nIndex, 1);
			/**
				Drag된 채 Drop 가능한 엘리먼트에서 마우스 커서가 벗어날 경우 발생
				
				@event out
				@param {String} sType 커스텀 이벤트명
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {HTMLElement} elDrop Drop 될 대상 엘리먼트
				@param {jindo.$Event} weEvent mousedown시 발생되는 jindo.$Event 객체
				@example
					// 커스텀 이벤트 핸들링 예제
					oDropArea.attach("out", function(oCustomEvent) { ... });
			**/
			this.fireEvent('out', { 
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable  
			});
		}
	},

	_clearOveredDroppableElement : function(weEvent, bInterupted) {
		if (bInterupted) {
			this._waOveredDroppableElement.empty();
			return;
		}
		for (var elDroppable; (elDroppable = this._waOveredDroppableElement.$value()[0]); ) {
			this._waOveredDroppableElement.splice(0, 1);
			/**
				Drop 가능한 엘리먼트에 성공적으로 드랍 될 경우 발생
				
				@event drop
				@param {String} sType  커스텀 이벤트명
				@param {HTMLElement} elHandle 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트
				@param {HTMLElement} elDrag 실제로 드래그 될 엘리먼트
				@param {HTMLElement} elDrop Drop 될 대상 엘리먼트
				@example
					// 커스텀 이벤트 핸들링 예제
					oDropArea.attach("drop", function(oCustomEvent) { ... });
			**/
			this.fireEvent('drop', {
				weEvent : weEvent,
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable 
			});
		}
	},
	
	/**
		Drag되고 있는 채, 마우스가 올라간 엘리먼트의 리스트를 구함
		
		@method getOveredLists
		@return {Array} 겹쳐진 엘리먼트 
	**/
	getOveredLists : function() {
		return this._waOveredDroppableElement ? this._waOveredDroppableElement.$value() : [];
	},
	
	_isChildOfDropArea : function(el) {
		if (this._el === document || this._el === el){
			return true;
		} 
		return this._wel.isParentOf(el);
	},
	
	_findDroppableElement : function(el) {
		if(!el) return null;
		var sClass = '.' + this.option('sClassName');		
		var elDroppable = jindo.$$.test(el, sClass) ? el : jindo.$$.getSingle('! ' + sClass, el);
		if (!this._isChildOfDropArea(el)) { //기준 엘리먼트가 document인 경우 Magnetic일때 문서밖으로 커서이동시 event 발생!
			elDroppable = null;
		}
		return elDroppable;
	},
	
	_isDragging : function() {
		var oDrag = this.option('oDragInstance');
		return (oDrag && oDrag.isDragging());
	},
	
	_onMouseMove : function(we) {		
		if (this._isDragging()) {
			
			var oPos = we.pos();

			if (we.element == this._elDragging || jindo.$Element(this._elDragging).isParentOf(we.element)) { //Magnetic
				var aItem = this._aItem;
				var aItemRect = this._aItemRect;
				
				for (var i = 0, htRect, el; ((htRect = aItemRect[i]) && (el = aItem[i])); i++) {
					if ( htRect.nLeft <= oPos.pageX && oPos.pageX <= htRect.nRight && htRect.nTop <= oPos.pageY && oPos.pageY <= htRect.nBottom ) {
						this._addOveredDroppableElement(el);
						this._fireMoveEvent(el, htRect, oPos, we);
					} else {
						this._removeOveredDroppableElement(el);
					}
				}
			} else { //Pointing

				var elDroppable = this._findDroppableElement(we.element);
				if(this.elPrevMove && this.elPrevMove != elDroppable){
					this._removeOveredDroppableElement(this.elPrevMove);
					this.elPrevMove = null;
				}
				
				// IE9에서 mousemove event의 element가 dragarea를 반환하기 때문에 droppable을 정상적으로 찾지 못함. 이 경우는 mouse pointer 위치의 element를 이용하여 droppable 탐색
				if( elDroppable==we.element || (!elDroppable && document.elementFromPoint)){
					var aScr = [
						document.documentElement.scrollLeft || document.body.scrollLeft,
						document.documentElement.scrollTop || document.body.scrollTop
					];
				 	elDroppable = this._findDroppableElement(document.elementFromPoint(oPos.pageX - aScr[0], oPos.pageY - aScr[1]));
				}
				if (!elDroppable) {
					return;
				}
				
				this.elPrevMove = elDroppable;
			
				this._addOveredDroppableElement(elDroppable);
			
				var htOffset = jindo.$Element(elDroppable).offset();
				var htArea = {
					"nLeft" : htOffset.left,
					"nTop" : htOffset.top,
					"nRight" : htOffset.left + elDroppable.offsetWidth,
					"nBottom" : htOffset.top + elDroppable.offsetHeight
				};
		
				if ( htArea.nLeft <= oPos.pageX && oPos.pageX <= htArea.nRight && htArea.nTop <= oPos.pageY && oPos.pageY <= htArea.nBottom ) {
					this._fireMoveEvent(elDroppable, htArea, oPos, we);
				}
			}
			
		}
	},
	
	_onMouseOver : function(we) {
		if (this._isDragging()) {
			var elDroppable = this._findDroppableElement(we.element);
			if (elDroppable) {
				this._addOveredDroppableElement(elDroppable);
			}
		}
	},
	
	_onMouseOut : function(we) {
		if (this._isDragging()) {
			var elDroppable = this._findDroppableElement(we.element);
			if (elDroppable && we.relatedElement && !jindo.$Element(we.relatedElement).isChildOf(we.element)) {
				this._removeOveredDroppableElement(elDroppable);
			}
		}
	},
	
	_getRectInfo : function(el) {
		var htOffset = jindo.$Element(el).offset();	
		return {
			nLeft : htOffset.left,
			nTop : htOffset.top,
			nRight : htOffset.left + el.offsetWidth,
			nBottom : htOffset.top + el.offsetHeight
		};
	},
	
	_reCalculate : function() {
		var aItem = jindo.$$('.' + this.option('sClassName'), this._el);
			
		if (this._el.tagName && jindo.$$.test(this._el, '.' + this.option('sClassName'))) {
			aItem.push(this._el);
		}
		
		this._aItem = aItem;
		this._aItemRect = [];
		
		for (var i = 0, el; (el = aItem[i]); i++) {
			this._aItemRect.push(this._getRectInfo(el));
		}
	},

	/**
		Drop 영역의 캐싱된 위치정보를 갱신함
		드래그 도중에 Drop 영역의 위치가 바뀌는 경우 사용 할 수 있음.
		
		@method refresh
		@return {this}
	**/
	refresh : function() {
		this._reCalculate();
		return this;
	}
}).extend(jindo.Component);
