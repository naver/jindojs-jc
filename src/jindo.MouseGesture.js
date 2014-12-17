/**
	@fileOverview 마우스 제스쳐 컴포넌트
	@author TarauS
	@version #__VERSION__#
**/
/**
	마우스 제스쳐 컴포넌트
	
	@class jindo.MouseGesture
	@extends jindo.Component
	@keyword mousegesture, gesture, 마우스제스쳐, 제스쳐
**/
jindo.MouseGesture = jindo.$Class({
	/**
		@lends jindo.MouseGesture.prototype
	**/

	/**
		라인이 그려질 캔버스 객체
		@type {Element}
	**/
	_elCanvas : null,
	/**
		Canvas Element의 Drawing Context
		@type {Object}
	**/
	_oDC : null,
	/**
		이벤트 핸들러 저장 객체
		@type {HashTable}
	**/
	_htEventHandler : {},
	/**
		사용자의 마우스가 움직인 점의 목록
		@type {Array}
	**/
	_aPointList : [],
	/**
		저장된 점의 개수
		@type {Number}
	**/
	_nPointCount : 0,
	/**
		라인을 그리는 방법 (vml, canvas)
		@type {String}
	**/
	_sDrawingType : "",
	/**
		모바일 사파리인지를 저장하는 변수
		@type {Boolean}
	**/
	_bMobileSafari : false,

	/**
		@constructor
		@param {Object} [htOption] 초기화 옵션 객체
			@param {String} [htOption.sLineColor="#FF0000"] 선 색상
			@param {Number} [htOption.nLineThickness=5] 선 두께
			@param {Number} [htOption.nFilteringDistance=10] 유효 분석 거리 (두 점 사이의 간격이, 이 값 이상일 때만 분석 데이터로 사용)
			@param {Window} [htOption.elTargetWindow=window] 선이 그려질 윈도우 객체
		@example
			var oMouseGestureInstance = new jindo.MouseGesture({
			    "sLineColor" : "#FF0000",   // 라인 컬러
			    "nLineThickness" : 5,       // 라인 두께
			    "nFilteringDistance" : 10,  // 유효 분석 거리 (두 점 사이의 간격이, 이 값 이상일 때만 분석 데이터로 사용)
			    "elTargetWindow" : window   // 라인이 그려질 윈도우 객체
			});
	 *	
			oMouseGestureInstance.attach("gesture", function(oGestureEvent){
			    console.log(oGestureEvent.sCode, oGestureEvent.aCodeList);
			    for(var i=0; i<eGesture.aCodeList.length; i++){
			        switch(eGesture.aCodeList[i]){
			        case 1: sCode += "↗";break;
			        case 2: sCode += "→";break;
			        case 3: sCode += "↘";break;
			        case 4: sCode += "↓";break;
			        case 5: sCode += "↙";break;
			        case 6: sCode += "←";break;
			        case 7: sCode += "↖";break;
			        case 8: sCode += "↑";break;
			        }
			    }
			    console.log("result" : sCode);
			}
	**/
	$init : function(htOption){

		var self = this;

		// 기본 옵션 설정
		this.option({
			"sLineColor" : "#FF0000",
			"nLineThickness" : 5,
			"nFilteringDistance" : 10,
			"elTargetWindow" : window
		});
		// 사용자 옵션 설정
		this.option(htOption);

		// 마우스 다운 이벤트 핸들러 등록 (모바일 사파리는 터치 이벤트 등록)
		var sUserAgent = window.navigator.userAgent.toLowerCase();
		this._bMobileSafari = (/mobile/.test(sUserAgent) && /safari/.test(sUserAgent)) || /iphone/.test(sUserAgent);

		var oDoc = this.option("elTargetWindow").document;

		oDoc.addEventListener && oDoc.addEventListener('mousedown', function() {
			self._htEventHandler["setted_context_menu"] = oDoc.oncontextmenu;
			oDoc.oncontextmenu = function(){return false;};
		}, true);

		this._htEventHandler["mouse_down"] = jindo.$Fn(this._onMouseDown, this).attach(oDoc, this._bMobileSafari ? "touchstart" : "mousedown", true);

		// 캔버스 생성
		this._createCanvas();
	},

	/**
		캔버스 생성 함수
		- IE의 경우에는 VML을 위한 네임 스페이스를 정의하고, VML Element들을 위치시킬 DIV Element를 생성
		- IE 외의 CanvasAPI를 지원하는 경우에는, Canvas Element를 생성
	**/
	_createCanvas : function(){

		var elCanvas = jindo.$("<canvas>");

		if(elCanvas.getContext) { // jindo.$Agent().navigator().ie){
			// Canvas Element 생성
			this._elCanvas = elCanvas;
			this._oDC = this._elCanvas.getContext("2d");
			this._sDrawingType = "canvas";
			this._oDC.globalCompositeOperation = "destination-over";
		} else {
			// 네임 스페이스 생성
			if(!this.option("elTargetWindow").document.namespaces["vml_nhn"]){
				this.option("elTargetWindow").document.namespaces.add("vml_nhn", "urn:schemas-microsoft-com:vml");
			}
			// VML을 위한 스타일 정의
			var elStyle = this.option("elTargetWindow").document.createStyleSheet();
			elStyle.cssText = "vml_nhn\\:shape, vml_nhn\\:stroke {behavior:url(#default#VML); display:inline-block; position:absolute;width:1px;height:1px;};";
			this._elCanvas = jindo.$("<div>");
			this._sDrawingType = "vml";
		}
		
		jindo.$Element(this._elCanvas).css({"position":"absolute", "top" : "0px", "left" : "0px"}).hide().prependTo(this.option("elTargetWindow").document.body);
	},

	/**
		생성된 캔버스 엘리먼트를 화면에 표시하는 함수
	**/
	_showCanvas : function(){
		var htDocumentSize = jindo.$Document(this.option("elTargetWindow").document).clientSize();
		var htScrollPosition = jindo.$Document(this.option("elTargetWindow").document).scrollPosition();
		
		if(this._sDrawingType == "canvas"){
			this._elCanvas.width = htDocumentSize.width;
			this._elCanvas.height = htDocumentSize.height;
		}

		// 캔버스의 크기를 브라우저의 크기게 맞게 조정
		jindo.$Element(this._elCanvas).css({"top" : htScrollPosition.top +"px", "width" : htDocumentSize.width+"px", "height" : htDocumentSize.height+"px", "zIndex" : 999999}).show();
	},

	// 화면에 표시된 캔버스 엘리먼트를 감추고, 그려진 내용을 초기화하는 함수
	_hideCanvas : function(){
		if(this._elCanvas){
			if(this._sDrawingType == "vml"){
				this._elCanvas.innerHTML = "";
			}else if(this._sDrawingType == "canvas"){
				this._oDC.beginPath();
				this._oDC.clearRect(0, 0, this._elCanvas.offsetWidth, this._elCanvas.offsetHeight);
				this._oDC.closePath();
			}
			jindo.$Element(this._elCanvas).hide();
		}
	},

	/**
		캔버스 엘리먼트에 두 점의 좌표를 이용하여 라인을 그리는 함수
	 *
		@param {Object} htStartPosition 시작 점의 좌표 정보를 가진 객체 ({nX : 123, nY:123})
		@param {Object} htEndPosition 끝 점의 좌표 정보를 가진 객체 ({nX : 456, nY:456})
	**/
	_drawLine : function(htStartPosition, htEndPosition){
		// VML을 이용하여 라인을 그림
		if(this._sDrawingType == "vml"){
			var sPath = " m "+(htStartPosition.nX*1-5)+","+(htStartPosition.nY*1-5)+" l "+(htEndPosition.nX*1-5)+","+(htEndPosition.nY*1-5);
			var sHTML = '<vml_nhn:shape coordsize="1 1" strokeweight="'+this.option("nLineThickness")+'pt" strokecolor="'+this.option("sLineColor")+'" path="'+sPath+'"><vml_nhn:stroke endcap="round" /></vml_nhn:shape>';
			this._elCanvas.insertAdjacentHTML("BeforeEnd",sHTML);
		// 캔버스 API를 이용하여 라인을 그림
		}else if(this._sDrawingType == "canvas"){
			this._oDC.save();
			this._oDC.beginPath();
			this._oDC.lineCap = "round";
			this._oDC.lineWidth = this.option("nLineThickness") + 2;
			this._oDC.strokeStyle = this.option("sLineColor");
			this._oDC.moveTo(htStartPosition.nX,htStartPosition.nY);
			this._oDC.lineTo(htEndPosition.nX,htEndPosition.nY);
			this._oDC.stroke();
			this._oDC.closePath();
			this._oDC.restore();
		}
	},

	/**
		이벤트 객체로부터 이벤트가 발생한 좌표 정보를 계산하여, 좌표 목록 배열에 저장하고, 계산된 좌표를 리턴하는 함수
		- 모바일 버전의 사파리의 경우에는, 터치 이벤트에 대한 좌표 정보를 계산
		- 위의 경우가 아닌 경우에는 pos() 함수를 이용하여 계산
	 *
		@param {WrappingEvent} weTarget 좌표를 계산할 이벤트 객체
		@return {Object} 좌표 정보를 저장하고 있는 객체
	**/
	_addPointList : function(weTarget){
		// 좌표 정보를 계산
		var htPosition;
		if(this._bMobileSafari){
			htPosition = {
				"pageX": weTarget._event.targetTouches[0].clientX,
				"pageY": weTarget._event.targetTouches[0].clientY
			};
		}else{
			htPosition = weTarget.pos();
		}

		// 결과 객체 생성
		var htResult = {
			"nX": htPosition.clientX,
			"nY": htPosition.clientY
		};

		// 좌표 정보 저장 배열에 추가
		this._aPointList.push(htResult);
		this._nPointCount++;

		return htResult;
	},

	/**
		MouseDown 이벤트 핸들러
		- MouseMove 및 MouseUp 이벤트 핸들러 등록
		- MouseDown 이벤트가 발생한 좌표 저장
	 *
		@param {WrappingEvent} weMouseDown 마우스 다운 이벤트 객체
	**/
	_onMouseDown : function(weMouseDown){
		if(weMouseDown.mouse().right || this._bMobileSafari){
			weMouseDown.stop();
			// 이벤트가 발생한 좌표 정보를 저장
			this._addPointList(weMouseDown);
			// 이벤트 핸들러 등록
			this._htEventHandler["mouse_move"] = jindo.$Fn(this._onMouseMove, this).attach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchmove" : "mousemove");
			this._htEventHandler["mouse_up"] = jindo.$Fn(this._onMouseUp, this).attach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchend" : "mouseup");
			// setCapture() 수행 (IE에서 로딩된 플래시 객체 위에서 이벤트 처리를 하기 위한 목적)
			if(this._sDrawingType == "vml"){
				this.option("elTargetWindow").document.body.setCapture();
			}
		}
	},

	/**
		MouseMove 이벤트 핸들러
		- 첫 이동일 경우, 감춰진 캔버스를 보여지도록 설정
		- MouseMove 이벤트가 발생한 좌표와, 바로 전에 저장된 좌표를 이용하여 라인을 그림
	 *
		@param {WrappingEvent} weMouseMove 마우스 무브 이벤트 겍체
	**/
	_onMouseMove : function(weMouseMove){
		// 이벤트가 발생한 좌표 정보를 저장
		var htPosition = this._addPointList(weMouseMove);

		if(this._nPointCount === 2){
			this._showCanvas();
		}

		// 두 점을 이용하여 라인을 그림
		if(this._nPointCount % 2){ // VML로 그릴 때, 느려지는 현상이 있어 2번에 1번 꼴로 라인을 그리도록 함
			this._drawLine({
				"nX": this._aPointList[this._nPointCount - 3]["nX"],
				"nY": this._aPointList[this._nPointCount - 3]["nY"]
			}, htPosition);
		}
	},

	/**
		저장된 좌표 정보를 바탕으로 사용자의 마우스 이동 방향을 계산하여 리턴하는 함수
		- 두 점의 거리가 옵션의 nFilteringDistance보다 작은 경우에는 계산에서 제외 시킴
		- 두 점의 기울기를 바탕으로 방향을 결정
		- 중복된 방향 값을 제거
	 *
		@return {Object} 최종 계산된 방향 정보 객체
	**/
	_recognitionGesture : function(){
		var nX, nY, nBeforeX, nBeforeY, nGradient, nAbsGradient, nResult, nDistance;
		var aFilteredList = [], aResult = [];
		var nBaseGradient1 = Math.tan(22.5 * Math.PI / 180);
		var nBaseGradient2 = Math.tan(67.5 * Math.PI / 180);

		// 저장된 좌표들을 루프를 돔
		for(var i=1; i<this._aPointList.length; i++){
			nX = this._aPointList[i]["nX"];
			nY = this._aPointList[i]["nY"];
			nBeforeX = this._aPointList[i-1]["nX"];
			nBeforeY = this._aPointList[i-1]["nY"];
			nDistance = Math.sqrt(Math.pow(nY - nBeforeY, 2) + Math.pow(nX - nBeforeX, 2));

			// 두 점의 거리(nDistance)가 옵션에 정의된 nFilteringDistance 보다 큰 경우에만 기울기를 계산
			if(nDistance > this.option("nFilteringDistance")){// || aResultList[aResultList.length-1] != nResult){
				// 두 점의 기본 기울기를 계산
				nGradient = -(nY - nBeforeY) / (nX - nBeforeX);
				nAbsGradient = Math.abs(nGradient);

				// 두 점의 기울기와 좌표 정보를 이용하여, 두 점의 방향을 계산 함
				if(nAbsGradient >= nBaseGradient2){
					if(nY < nBeforeY){
						nResult = 8;
					}else{
						nResult = 4;
					}
				}else if(nAbsGradient < nBaseGradient1){
					if(nX < nBeforeX){
						nResult = 6;
					}else{
						nResult = 2;
					}
				}else if(nAbsGradient >= nBaseGradient1 && nAbsGradient < nBaseGradient2){
					if(nGradient > 0){
						nResult = 1;
					}else{
						nResult = 3;
					}
					if(nX < nBeforeX){
						nResult += 4;
					}
				}
				aFilteredList.push(nResult);
			}
		}
		
		// 필터링 및 기본 방향 계산이 끝난 데이터를 루프를 돌며, 중복된 값을 제거
		for(i=1; i<aFilteredList.length; i++){
			if(aResult.length === 0){
				aResult.push(aFilteredList[i]);
			}else{
				if(aResult[aResult.length-1] != aFilteredList[i]){
					aResult.push(aFilteredList[i]);
				}
			}
		}
		
		// 최종 계산된 결과를 리턴
		return {
			"aCodeList" : aResult,
			"sCode" : aResult.join("")
		};
	},

	/**
		MouseUp 이벤트 핸들러
		- 등록된 이벤트 핸들러 해제
		- 컨텍스트 메뉴에 대한 이벤트 핸들러 복원
		- 저장된 좌표 정보를 바탕으로, 점들의 방향 값들을 구하여, gesture 이벤트 발생
		- 변수 초기화 및 캔버스 감추기
	 *
		@param {WrappingEvent} weMouseUp 마우스 업 이벤트 객체
	**/
	_onMouseUp : function(weEvent){
		if(weEvent.mouse().right || this._bMobileSafari){
			weEvent.stop();

			// 등록된 이벤트 핸들러 해제
			if(this._htEventHandler["mouse_move"]){
				this._htEventHandler["mouse_move"].detach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchmove" : "mousemove");
			}
			
			if(this._htEventHandler["mouse_up"]){
				this._htEventHandler["mouse_up"].detach(this.option("elTargetWindow").document, this._bMobileSafari ? "touchend" : "mouseup");
			}
			
			// 컨텍스트 메뉴에 대한 이벤트 핸들러 복원
			if((this._aPointList.length && !this._bMobileSafari) || 'setted_context_menu' in this._htEventHandler){

				if (!('setted_context_menu' in this._htEventHandler)) {
					this._htEventHandler["setted_context_menu"] = this.option("elTargetWindow").document.oncontextmenu;
					this.option("elTargetWindow").document.oncontextmenu = function(){return false;};
				}

				setTimeout(jindo.$Fn(function(){
					this.option("elTargetWindow").document.oncontextmenu = this._htEventHandler["setted_context_menu"];
					delete this._htEventHandler["setted_context_menu"];
				}, this).bind(), 1);
			}
			
			// releaseCapture() 수행
			if(this._sDrawingType == "vml"){
				this.option("elTargetWindow").document.body.releaseCapture();
			}
			
			// 저장된 좌표 정보를 바탕으로 방향 값을 계산하여 커스텀 이벤트 발생
			var htResult = this._recognitionGesture();
			if(htResult.sCode){
				/**
					사용자가 오른쪽 마우스를 누른 후, 드래그 후
					
					@event gesture
					@param {String} sType 커스텀 이벤트명
					@param {Array} aCodeList 제스처 코드 목록
					@param {String} sCode 코드명
					@example
						// 커스텀 이벤트 핸들링 예제
						// 사용자가 오른쪽 마우스를 누른 후, 드래그 후에 발생하는 이벤트
						oMouseGesture.attach("gesture", function(eGestureEvent){
						    // 사용자가 취한 제스쳐에 대한 정보를 담고 있는 oGestureEvent 객체를 파라미터로 받음
						    // oGestureEvent 객체에 있는 sCode와 aCodeList 값에 맵핑된 기능을 수행 함
						    var sCode = eGesture.sCode+" : ";
						    for(var i=0; i<eGesture.aCodeList.length; i++){
						        switch(eGesture.aCodeList[i]){
						        case 1: sCode += "↗";break;
						        case 2: sCode += "→";break;
						        case 3: sCode += "↘";break;
						        case 4: sCode += "↓";break;
						        case 5: sCode += "↙";break;
						        case 6: sCode += "←";break;
						        case 7: sCode += "↖";break;
						        case 8: sCode += "↑";break;
						        }
						    }
						     
						    if(eGesture.sCode == "8")jindo.$Element("elLayer").show();
						    else if(eGesture.sCode == "4") jindo.$Element("elLayer").hide();
						    else if(eGesture.sCode == "2") jindo.$("elLayer").style.background = "green";
						    else if(eGesture.sCode == "6") jindo.$("elLayer").style.background = "blue";
						    jindo.$("elDebug").value = sCode;
						});
				**/
				this.fireEvent("gesture", htResult);
			}
	
			// 초기화
			this._nPointCount = 0;
			this._aPointList = [];
			this._hideCanvas();
		}
	},

	/**
		컴포넌트 소멸자
		
		@method destroy
	**/
	destroy : function(){
		jindo.$Element(this._elCanvas).leave();
		this._elCanvas = null;
		this._oDC = null;
		this._htEventHandler = null;
		this._nPointcount = null;
		this._aPointList = null;
		this._sDrawingType = null;
		this._bMobileSafari = null;
	}
}).extend(jindo.Component);