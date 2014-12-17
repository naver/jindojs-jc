/**
	@fileOverview 다수의 Ajax 요청을 병렬 또는 직렬방식으로 요청하고 응답을 처리하는 컴포넌트 
	@author senxation
	@version #__VERSION__#
**/
/**
	다수의 Ajax 요청을 병렬 또는 직렬방식으로 요청하고 응답을 처리하는 컴포넌트
	
	@class jindo.MultipleAjaxRequest
	@extends jindo.Component
	@keyword multipleajaxrequest, ajax, request, response, 멀티플에이잭스리퀘스트, 에이잭스, 리퀘스트, 요청, 응답, 직렬, 병렬
**/
jindo.MultipleAjaxRequest = jindo.$Class({
	/** @lends jindo.MultipleAjaxRequest.prototype */
	
	_bIsRequesting : false,
	
	/**
		컴포넌트를 생성한다.
		
		@constructor
		@param {Object} [htOption] 옵션 Hash Table
			@param {String} [htOption.sMode="parallel"] 요청 방식. 기본은 병렬로 요청. "serial"일 경우 직렬로 요청
		@example
			var oMultipleAjaxRequest = new jindo.MultipleAjaxRequest({ 
				sMode : "parallel" //요청 방식. 기본은 병렬로 요청. "serial"일 경우 직렬로 요청
			}).attach({
				start: function(oCustomEvent) {
					//요청이 시작될 때 발생
					//전달되는 커스텀 이벤트 객체 oCustomEvent = {
					//	aAjax : (Array) request() 메서드에 전달되었던 aAjax 배열 
					//	htMetaData : (HashTable) request() 메서드에 전달되었던 htMetaData
					//}
				},
				beforeEachRequest: function(oCustomEvent){
					//각각의 요청 이전에 발생
					//전달되는 커스텀 이벤트 객체 oCustomEvent = {
					//	oAjax : (jindo.$Ajax) 해당 요청의 jindo.$Ajax 객체 
					//	nIndex : (Number) 요청 순서
					//}
				},
				afterEachResponse: function(oCustomEvent){
					//각각의 응답 이후에 발생
					//전달되는 커스텀 이벤트 객체 oCustomEvent = {
					//	oAjax : (jindo.$Ajax) 해당 요청의 jindo.$Ajax 객체 
					//	nIndex : (Number) 요청 순서
					//}
				},
				complete: function(oCustomEvent){
					//모든 응답이 완료된 이후에 발생
					//전달되는 커스텀 이벤트 객체 oCustomEvent = {
					//	aResponse : (Array) 모든 요청의 jindo.$Ajax.Response 객체의 배열
					//	htMetaData : (HashTable) request메서드에서 선언한 Hash Table 
					//}
					
				}
			});
	**/
	$init : function(htOption){
		var htDefaultOption = {
			sMode : "parallel" //기본은 병렬로 요청. "serial"일 경우 직렬로 요청
		};
		this.option(htDefaultOption);
		this.option(htOption);
	},
	
	/**
		요청이 진행중인지 여부를 가져온다.
		
		@method isRequesting
		@return {Boolean} 요청 진행 여부
	**/
	isRequesting : function() {
		return this._bIsRequesting;
	},
	
	/**
		요청을 수행한다.
		
		@method request
		@param {Array} aAjax 요청을 위한 정보를 담은 Hash Table의 배열
		@param {Object} complete 커스텀 이벤트에 전달될 Hash Table
		@return {Boolean} 요청이 성공적으로 시작되었는지 여부
		@example
			var oAjax1 = {
				sUrl : "1.js", //요청할 URL
				htOption : { //jindo.$Ajax의 option객체 (jindo.$Ajax 참고)
					type : "xhr",
					method : "get"
				},
				htParameter : null //jindo.$Ajax.request를 수행시 전달할 파라미터 Hash Table 객체
			};
			
			var htAjax2 = {
				sUrl : "22.js",
				htOption : {
					type : "xhr",
					method : "get"
				},
				htParameter : null
			};
			
			var htAjax3 = {
				sUrl : "3.js",
				htOption : {
					type : "xhr",
					method : "get"
				},
				htParameter : null
			};
			
			oMultipleAjaxRequest.request([htAjax1, htAjax2, htAjaxhtAjax sRequestName : "요청이름" });
	**/
	request : function(aAjax, htMetaData) {
		if (this.isRequesting()) { //요청이 진행중이면 중단한다.
			return false;
		}
		if (!(aAjax instanceof Array)) {
			aAjax = [aAjax];
		}
		if (typeof htMetaData == "undefined") {
			htMetaData = {};
		}
		this._htMetaData = htMetaData;
		
		switch (this.option("sMode")) {
			case "parallel" :
				this._parallelRequest(aAjax);
				break;	
			case "serial" :
				this._serialRequest(aAjax);
				break;
			default :
				return false;
		}
		return true;
	},
	
	_fireEventStart : function() {
		this._bIsRequesting = true;
		
		/**
			요청이 시작될 때
			
			@event start
			@param {String} sType 커스텀 이벤트명
			@param {Array} aAjax request() 메서드에 전달되었던 aAjax 배열
			@param {Object} htMetaData request() 메서드에 전달되었던 htMetaData
			@param {Function} stop 수행시 요청을 시작하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("start", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent("start", {
			aAjax : this._aAjax,
			htMetaData : this._htMetaData
		})) {
			return true;
		} else {
			this.abort();
			return false;
		}
	},
	
	_fireEventBeforeEachRequest : function(nIndex) {
		/**
			각각의 요청 이전
			
			@event beforeEachRequest
			@param {String} sType 커스텀 이벤트명
			@param {jindo.$Ajax} oAjax 해당 요청의 jindo.$Ajax 객체
			@param {Number} nIndex 요청 순서
			@param {Function} stop 수행시 요청을 시작하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("beforeEachRequest", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent("beforeEachRequest", {
			oAjax: this._aAjax[nIndex],
			nIndex : nIndex
		})) {
			return true;
		} else {
			this.abort();
			return false;
		}
	},
	
	_fireEventAfterEachResponse : function(nIndex) {
		/**
			각각의 요청 이후
			
			@event afterEachResponse
			@param {String} sType 커스텀 이벤트명
			@param {jindo.$Ajax} oAjax 해당 요청의 jindo.$Ajax 객체
			@param {Number} nIndex 요청 순서
			@param {Function} stop 수행시 더이상 요청이 진행되지 않고 모든 응답이 완료되어도 complete 커스텀 이벤트 발생하지 않음
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("afterEachRequest", function(oCustomEvent) { ... });
		**/
		if (this.fireEvent("afterEachResponse", {
			oAjax: this._aAjax[nIndex],
			nIndex : nIndex
		})) {
			return true;
		} else {
			this.abort();
			return false;
		}
	},
	
	/**
		병렬 요청
		@param {Array} aAjax
		@ignore
	**/
	_parallelRequest : function(aAjax) {
		this._aAjaxData = aAjax;
		
		this._aAjax = []; //Ajax 객체의 배열
		this._aStatus = []; //요청을 보냈는지 여부
		this._aStatus.length = aAjax.length;
		this._aResponse = []; //응답객체
		
		if (this._fireEventStart()) {
			var self = this;
			jindo.$A(this._aAjaxData).forEach(function(htAjax, i){
				var fParallelResponseHandler = function(oResponse){
					oResponse._constructor = self._aAjax[i];
					var nIndex = self._findAjaxObjectIndexOfResponse(oResponse._constructor);
					self._aResponse[nIndex] = oResponse;
					self._aStatus[nIndex] = true;
					
					if (self._fireEventAfterEachResponse(nIndex)) {
						if (self._hasCompletedGotResponsesOfParallelResponses()) {
							self._complete();
						}	
					}
				};
				self._aAjax.push(jindo.$Ajax(htAjax.sUrl, htAjax.htOption));
				htAjax.htOption.onload = fParallelResponseHandler;
				htAjax.htOption.onerror = fParallelResponseHandler;
				htAjax.htOption.ontimeout = fParallelResponseHandler;
				self._aAjax[i].option(htAjax.htOption);
				
				if (self._fireEventBeforeEachRequest(i)){
					self._aAjax[i].request(htAjax.htParameter || {});	
				} else {
					jindo.$A.Break();
				}
			});
		}
		
	},
	
	/**
		병렬 요청시 응답이 몇번째 Ajax 요청에 대한 응답인지 찾는다.
		@param {Object} oAjax
		@return {Number}
	**/
	_findAjaxObjectIndexOfResponse : function(oAjax) {
		return jindo.$A(this._aAjax).indexOf(oAjax);
	},
	
	/**
		병렬 요청의 응답이 모두 완료되었는지 확인한다.
	**/
	_hasCompletedGotResponsesOfParallelResponses : function() {
		var bResult = true;
		jindo.$A(this._aStatus).forEach(function(bStatus){
			if (!bStatus) {
				bResult = false;
				jindo.$A.Break();
			} 
		});
		return bResult;
	},
	
	/**
		직렬 요청
		@param {Array} aAjax
		@ignore
	**/
	_serialRequest : function(aAjax) {
		this._aAjaxData = aAjax;
		
		this._aAjax = []; //Ajax 객체의 배열
		this._aStatus = []; //요청을 보냈는지 여부
		this._aStatus.length = aAjax.length;
		this._aResponse = []; //응답객체
		
		var self = this;
		jindo.$A(this._aAjaxData).forEach(function(htAjax, i){
			var fSerialRequestHandler = function(e){
				e._constructor = self._aAjax[i];
				self._aResponse.push(e);
				self._serialRequestNext();
			};
			self._aAjax.push(jindo.$Ajax(htAjax.sUrl, htAjax.htOption));
			htAjax.htOption.onload = fSerialRequestHandler;
			htAjax.htOption.onerror = fSerialRequestHandler;
			htAjax.htOption.ontimeout = fSerialRequestHandler;
			self._aAjax[i].option(htAjax.htOption);
		});
		
		if (this._fireEventStart()) {
			if (this._fireEventBeforeEachRequest(0)) {
				this._aAjax[0].request(this._aAjaxData[0].htParameter || {});
				this._aStatus[0] = true;
			}
		}
	},
	
	/**
		직렬 요청시 다음 요청을 수행하거나 응답 완료
		@param {Array} aAjax
		@ignore
	**/
	_serialRequestNext : function() {
		var nIndex = -1;
		for (var i = 0; i < this._aStatus.length; i++) {
			if(!this._aStatus[i]) {
				this._aStatus[i] = true;
				nIndex = i;
				break;
			}
		}
		
		if (nIndex > 0) {
			if (this._fireEventAfterEachResponse(nIndex - 1)) {
				if (this._fireEventBeforeEachRequest(nIndex)) {
					this._aAjax[nIndex].request(this._aAjaxData[nIndex].htParameter || {});
				}
			}
		} else if (nIndex == -1) {
			if (this._fireEventAfterEachResponse(this._aStatus.length - 1)) {
				this._complete();
			}
		}
	},
	
	/**
		요청정보들을 초기화한다.
		@ignore
	**/
	_reset : function() {
		this._aAjaxData.length = 0;
		this._aAjax.length = 0;
		this._aStatus.length = 0;
		this._aResponse.length = 0;
		this._htMetaData = null;
		
		delete this._aAjaxData;
		delete this._aAjax;
		delete this._aStatus;
		delete this._aResponse;
		delete this._htMetaData;
		
		this._bIsRequesting = false;
	},
	
	/**
		요청을 중단한다.
		
		@method abort
		@remark 다수의 요청중에 현재까지의 모든 요청이 중단되고, 수행되지 않은 요청은 더 이상 진행되지 않는다.
	**/
	abort : function() {
		jindo.$A(this._aAjax).forEach(function(oAjax){
			oAjax.abort();
		});
		this._reset();
	},
	
	/**
		응답이 완료되었을때 수행되어 완료 이벤트(complete)를 발생
		@ignore
	**/
	_complete : function() {
		var aResponse = this._aResponse.concat(),
			htMetaData = {},
			sProp;
		for (sProp in this._htMetaData) {
			htMetaData[sProp] = this._htMetaData[sProp];
		}
		
		this._reset();
		/**
			모든 응답이 완료된 이후
			
			@event complete
			@param {String} sType 커스텀 이벤트명
			@param {Array} aResponse 모든 요청의 jindo.$Ajax.Response 객체의 배열
			@param {Object} htMetaData request메서드에서 선언한 Hash Table
			@example
				// 커스텀 이벤트 핸들링 예제
				oComponent.attach("complete", function(oCustomEvent) { ... });
		**/
		this.fireEvent("complete", {
			aResponse : aResponse,
			htMetaData : htMetaData
		});	
	}

}).extend(jindo.Component);	