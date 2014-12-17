/**
	HTML5 의 FileAPI 와 Flash 를 사용해서 다중 파일 업로드를 구현하는 컴포넌트

	@author hooriza
	@version #__VERSION__#
	
	@class jindo.UploadQueue
	@extends jindo.UIComponent
	@uses jindo.BrowseButton
	
	@keyword upload, 플래시, flash, 업로드, HTML5, FileAPI
**/

jindo.UploadQueue = jindo.$Class({
	
	// 파일의 각 상태
	_states : {
		NONE : 'NONE',
		WAIT : 'WAIT',
		PROGRESS : 'PROGRESS',
		LOAD : 'LOAD',
		ERROR :  'ERROR'
	},
	
	// 플래시에서 발생하는 이벤트를 잡는 핸들러
	_callbackForFlash : {
		
		'buttonOver' : function() {
			this.fireEvent('buttonOver', { element : this._elCurrentBrowseButton });
		},
		
		'buttonOut' : function() {
			this.fireEvent('buttonOut', { element : this._elCurrentBrowseButton });
		},
		
		'selectFile' : function(aFiles) {

			var self = this;

			/**
				사파리에서 파일선택 직후 alert 띄웠을때 뻗는 문제 회피
				사파리에서는 플래시에서 띄워준 파일 선택창이 닫힌 직후에 사파리로 포커스가
				돌아오지 않는데, 그 상태에서 alert 을 띄워주면 뻗는 문제가 있음

				그래서 강제로 브라우저에 포커스를 준 다음,
				포커스를 가지면 _addQueue 메서드를 호출하도록 분기
			**/
			if (jindo.$Agent().navigator().safari) {

				var wfn = jindo.$Fn(function() {
					wfn.detach(window, 'focus');
					self._addQueue(aFiles);
				});
				wfn.attach(window, 'focus');
				window.blur();
				window.focus();

				return;

			}

			this._addQueue(aFiles);

		},
		
		'selectFileError' : function(sMessage) {
			/**
			 * 잘못 된 파일을 선택 했을 때 발생한다.
			 * 플래시 업로드에서 4기가 이상의 파일의 선택하는 등의 이유로 발생 할 수 있다.  
			 * @event selectError
			 * @param {String} sMessage 에러 메시지
			 */
			this.fireEvent('selectError', { 'sMessage' : sMessage });
		},
		
		'start' : function(oObj) {
			
		},
		
		'progress' : function(oObj) {
			var sKey = oObj.sKey;
			var oFile = this._getFileObj(sKey, oObj.oFile);
			if (oFile.state !== this._states.PROGRESS) { return; }
			this.fireEvent('uploadProgress', { 'oFile' : oFile, 'sKey' : sKey });
		},
		
		'load' : function(oObj) {
			
			var sKey = oObj.sKey;
			var oFile = this._getFileObj(sKey, oObj.oFile);
			var sResponseText = oObj.sResponse;
		
			this._setDoneState(sKey, oFile, 'uploadLoad', oFile.size, 1, this._states.LOAD, sResponseText);
		},
		
		'error' : function(oObj) {
			var sKey = oObj.sKey;
			var oFile = this._getFileObj(sKey, oObj.oFile);
			this._setDoneState(sKey, oFile, 'uploadError', 0, 0, this._states.ERROR);
		}
		
	},
	
	// 투명한 플래시를 버튼 위에 위치해서 덮음
	_showFlashForFlash : function(welButton) {
		
		if (welButton) { // 버튼을 지정하면 덮음
			
			var oOffset = welButton.offset();
			var elFlash = this._getFlash();
			
			this._elDummy.style.left = oOffset.left + 'px'; 
			this._elDummy.style.top = oOffset.top + 'px';
			
			this._elDummy.style.width = elFlash.style.width = welButton.width() + 'px'; 
			this._elDummy.style.height = elFlash.style.height = welButton.height() + 'px'; 
			
		} else { // 버튼을 지정하지 않으면 숨김
			
			this._elDummy.style.left = this._elDummy.style.top = 0;
			this._elDummy.style.width = this._elDummy.style.height = '1px';	
			
		}
		
	},
	
	// 플래시 생성
	_createFlashForFlash : function(sUnique) {
		
		if (this._elDummy) { return; }
		
		var elDummy = this._elDummy = jindo.$('<div>');
		
		var sFlashUID = sUnique;
		var sFlashURL = this.option('sSwfPath');
		var oAgent = jindo.$Agent();
		
		elDummy.style.cssText = 'position:absolute !important; border:0 !important; padding:0 !important; margin:0 !important; overflow:hidden !important; z-index:32001 !important;';
		document.body.insertBefore(elDummy, document.body.firstChild);
		
		if(oAgent.flash().version >= 11 && oAgent.navigator().ie){
			sFlashURL += "?"+Math.floor(Math.random() * 10000);
		}
		
		var oFlashVars = {
			bMultiple : this.option('bMultiple'),
			sJSFunctionName : 'jindo.UploadQueue.__flashCallback.' + sUnique,
			nButtonOpacity : 0,
			sParamName : this.option('sParamName'),
			sURL : this.url() // "upload.php"
		};
		
		var sFlashHtml = this._getFlashHTML('UPLOADQUEUE' + sFlashUID, sFlashURL, 50, 50, {flashVars : oFlashVars, wmode : 'transparent'});
		elDummy.innerHTML = sFlashHtml;
		
		// jindo.$Fn(this._checkFailed, this).attach(elDummy, 'click');
		
		this._showFlashForFlash(false);
		
		this._getFlash = function() {
			return document['UPLOADQUEUE' + sFlashUID] || document.all['UPLOADQUEUE' + sFlashUID];
		};
		
	},

	_destroyFlashForFlash : function(sUnique) {

		this._elDummy.parentNode.removeChild(this._elDummy);
		this._elDummy = null;

	},

	// 플래시 삽입을 위한 HTML 코드 만들기
	_getFlashHTML : function(sId, sSwfPath, width, height, options) {

		var protocol = (location.protocol == "https:")?"https:":"http:";
	    // var classid = (jindo.$Agent().navigator().ie?'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"':'');
	    var classid = 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';

	    options = options || {};
	    options.allowScriptAccess = options.allowScriptAccess || 'always';

	    var params = [], attrs = [], v;
	    for (var k in options) if (options.hasOwnProperty(k)) {
	    	v = options[k];
	    	if (k === 'flashVars') { v = jindo.$H(v).toQueryString(); }
	    	params.push('<param name="' + k + '" value="' + v + '" />');
	    	attrs.push(' ' + k + '="' + v + '"');
	    }

	    return [
	    	'<object tabindex="-1" id="'+sId+'" width="'+width+'" height="'+height+'" '+classid+' codebase="'+protocol+'//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0">',
		    	'<param name="movie" value="'+sSwfPath+'" />',
		    	params.join(''),
	    		'<embed tabindex="-1" name="'+sId+'" src="'+sSwfPath+'"',
	    		' type="application/x-shockwave-flash" pluginspage="'+protocol+'://www.macromedia.com/go/getflashplayer"',
	    		attrs.join(''),
	    		' width="'+width+'" height="'+height+'">',
	    		'</embed>',
	    	'</object>'
	    ].join('');

	},

	// 플래시 내부에 구현된 메서드 호출
	_sendForFlash : function(sFuncName, aArgs) {
		
		if (!this._getFlash) { return; }
		
		var oFlash = this._getFlash();
		oFlash[sFuncName].apply(oFlash, aArgs || []);
		
	},
	
	/**
	 * UploadQueue 컴포넌트를 생성한다.
	 * @constructor
	 * @param {String} sURL 업로드 될 경로
	 * @param {Object} oOptions 옵션 객체
	 * 		@param {Array} oOptions.aButton 찾아보기 버튼으로 사용 할 엘리먼트 
	 * 		@param {Array} oOptions.aDropArea 파일 드랍 영역으로 사용 할 엘리먼트 
	 * 		@param {Element} oOptions.elButton (deprecate) 찾아보기 버튼으로 사용 할 엘리먼트
	 * 		@param {Element} oOptions.elDropArea (deprecate) 파일 드랍 영역으로 사용 할 엘리먼트 
	 * 		@param {Boolean} [oOptions.bMultiple=true] 파일 선택 창에서 여러개의 파일을 선택 할 수 있도록 할지 여부 (true : 가능 / false : 불가능)
	 * 		@param {Number} [oOptions.nParallel=1] 동시에 병렬로 진행 가능한 업로드 갯수
	 *		@param {String} [oOptions.sSwfPath] File API 를 지원하지 않는 브라우저를 위한 플래시 파일 경로
	 * 		@param {String} [oOptions.sParamName="file"] 서버로 파일 데이터를 보낼 때 사용 할 이름
		 	@param {Boolean} [oOptions.bActivateOnload=true] 컴포넌트 로드시 activate 여부
	 */
	$init : function(sURL, oOptions) {
		
		var bSupportHTML5 = typeof FormData !== 'undefined';
		var sAgent = navigator.userAgent; // jindo.$Agent().navigator();

		// 윈도우용 사파리에서는 <input type="file"> 에 multiple 이 버그있어서
		// 플래시 사용하도록 수정
		if (jindo.$Agent().os().win && /Version\/([0-9\.]+)\s+Safari\/([0-9\.]+)/.test(sAgent)) {
			bSupportHTML5 = false;
		}

		if ('bSupportHTML5' in oOptions) {
			bSupportHTML5 = !!oOptions.bSupportHTML5;
		}

		this._methodPostfix = bSupportHTML5 ? 'ForHTML5' : 'ForFlash';
		
		this.getMethod = function() {
			return bSupportHTML5 ? 'HTML5' : 'flash';
		};
		
		this.option({
			bMultiple : true,
			nParallel : 1,
			sParamName : 'file',
			bActivateOnload : true
		});
		
		this.option(oOptions || {});
		
		this.url(sURL);

		if (this.option('bActivateOnload')) {
			this.activate();
		}
		
	},

	_onActivate : function() {

		this._queue = [];
		this._uploading = 0;
		
		this._initialize();
		this._attachEvents();

	},

	_onDeactivate : function() {

		this._detachEvents();

		if (this._browseButtons) {
			var aBrowseButtons = this._browseButtons;
			for (var i = 0, nLen = aBrowseButtons.length; i < nLen; i++) {
				aBrowseButtons[i].deactivate();
			}
		}

		this._browseButtons = null;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////
	_getFileObj : function(sKey, oNewFile) {
		var fp = this['_getFileObj' + this._methodPostfix];
		return (this._getFileObj = fp).apply(this, arguments);
	},
	
		_getFileObjForHTML5 : function(sKey, oNewFile) {
			return oNewFile;
		},
		
		_getFileObjForFlash : function(sKey, oNewFile) {
			
			var oFile = this._flashFiles[sKey];
			if (oFile && oNewFile) {
				for (var k in oNewFile) if (oNewFile.hasOwnProperty(k)) {
					oFile[k] = oNewFile[k];	
				}
			}
			
			return oFile;
			
		},
		
	//------------------------------------------------------------------------------------------------------

	_initialize : function() {
		var fp = this['_initialize' + this._methodPostfix];
		return (this._initialize = fp).apply(this, arguments);
	},
	
		_initializeForHTML5 : function(oOptions) {
			
			this._xhr = {};

			var aButtons = this.option('aButton') || [ this.option('elButton') ];

			this._browseButtons = [];

			var oBrowseButton = null;
			for (var i = 0, nLen = aButtons.length; i < nLen; i++) {
				this._browseButtons.push(oBrowseButton = new jindo.BrowseButton(aButtons[i]));
				oBrowseButton.getFileSelect().multiple = this.option('bMultiple');
			}
			
		},
		
		_initializeForFlash : function() {
			
			this._flashFiles = {};
			
		},

	//------------------------------------------------------------------------------------------------------

	_detachEvents : function() {
		var fp = this['_detachEvents' + this._methodPostfix];
		return (this._detachEvents = fp).apply(this, arguments);
	},

		_detachEventsForHTML5 : function() {

			var i;
			var nLen;

			var aBrowseButtons = this._browseButtons;
			for (i = 0, nLen = aBrowseButtons.length; i < nLen; i++) {
				aBrowseButtons[i].detach(this._browseButtonHandlers), this._browseButtonHandlers = null;
			}

			var aDropAreas = this._aDropAreas;
			for (i = 0, nLen = aDropAreas.length; i < nLen; i++) {
				var elDropArea = aDropAreas[i];

				this._wfOnDragEnter.detach(elDropArea, 'dragenter');
				this._wfOnDragOver.detach(elDropArea, 'dragover');
				this._wfOnDragLeave.detach(elDropArea, 'dragleave');
				this._wfOnDrop.detach(elDropArea, 'drop');

				this._aDropAreas = null;
			}

		},

		_detachEventsForFlash : function() {

			var aButtons = this._aButtons; 

			if (aButtons) {
				for (var i = 0, nLen = aButtons.length; i < nLen; i++) {
					var welButton = jindo.$Element(aButtons[i]);
					this._wfOnMouseMove.detach(welButton, 'mousemove');
				}				
				this._aButtons = null;
				this._elCurrentBrowseButton = null;
			}

			var sUnique = this._sUnique;
			delete jindo.UploadQueue.__flashCallback[sUnique];
			
			this._destroyFlashForFlash(sUnique);

		},

	_attachEvents : function() {
		var fp = this['_attachEvents' + this._methodPostfix];
		return (this._attachEvents = fp).apply(this, arguments);
	},
	
		_attachEventsForHTML5 : function() {
			
			var self = this;
			var i, nLen;

			this._browseButtonHandlers = {
				
				'sourceChange' : function(oCustomEvent) {
					self._addQueue(this.getFileSelect().files);
					this.getFileSelect().value = '';

					var oNav = jindo.$Agent().navigator();
					if (oNav.ie && oNav.version <= 10) {
						this.getFileSelect().type = 'radio'; // IE10 에서 reset 이 되지 않는 문제 회피
						this.getFileSelect().type = 'file';
					}

				},
				
				/**
				 * 파일 찾기 버튼 안으로 마우스가 올라갔을때 발생한다.
				 * @event buttonOver
				 * @param {HTMLElement} element 마우스가 올라간 HTML 엘리먼트
				 */
				'over' : function(oCustomEvent) {
					self.fireEvent('buttonOver', { element : this._el });
				},
				
				/**
				 * 파일 찾기 버튼 밖으로 마우스가 나갔을때 발생한다.
				 * @event buttonOut
				 * @param {HTMLElement} element 마우스가 올라간 HTML 엘리먼트
				 */
				'out' : function() {
					self.fireEvent('buttonOut', { element : this._el });
				}
				
			};
			
			var aBrowseButtons = this._browseButtons;
			for (i = 0, nLen = aBrowseButtons.length; i < nLen; i++) {
				aBrowseButtons[i].attach(this._browseButtonHandlers);
			}
			
			var aDropAreas = this.option('aDropArea') || [ this.option('elDropArea') ];
			var bOver = false;
			
			var fpSetOver = function(oEvent, bFlag) {
				var elEl = oEvent.currentElement;
				oEvent.stopDefault();
				if (bOver !== bFlag) {
					/**
					 * 드래그 영역 안으로 마우스가 올라갔을때 발생한다.
					 * @event dragOver
					 * @param {HTMLElement} element 마우스가 올라간 HTML 엘리먼트
					 */
					/**
					 * 드래그 영역 밖으로 마우스가 나갔을때 발생한다.
					 * @event dragOut
					 * @param {HTMLElement} element 마우스가 빠져나간 HTML 엘리먼트
					 */
					self.fireEvent(bFlag ? 'dragOver' : 'dragOut', {
						element : elEl
					});
					bOver = bFlag;	
				}
			};

			this._aDropAreas = aDropAreas;
			for (i = 0, nLen = aDropAreas.length; i < nLen; i++) {

				var elDropArea = jindo.$(aDropAreas[i]);

				this._wfOnDragEnter = jindo.$Fn(function(oEvent) {
					oEvent.stopDefault();
				}).attach(elDropArea, 'dragenter');
				
				this._wfOnDragOver = jindo.$Fn(function(oEvent) {
					fpSetOver(oEvent, true);
				}).attach(elDropArea, 'dragover');
				
				this._wfOnDragLeave = jindo.$Fn(function(oEvent) {
					fpSetOver(oEvent, false);
				}).attach(elDropArea, 'dragleave');

				this._wfOnDrop = jindo.$Fn(function(oEvent) {
					fpSetOver(oEvent, false);
					self._addQueue(oEvent.$value().dataTransfer.files);
				}).attach(elDropArea, 'drop');
				
	    	}
			
		},
			
		_attachEventsForFlash : function() {
			
			var self = this;
			var sUnique = this._sUnique = 'UQ' + new Date().getTime() + Math.floor(Math.random() * 1000000);
			
			jindo.UploadQueue.__flashCallback[sUnique] = function(sFuncName, aArgs) {
	
				var fpFunc = self._callbackForFlash[sFuncName];
				fpFunc && fpFunc.apply(self, aArgs || []);
	
			};
			
			this._createFlashForFlash(sUnique);
			
			// var welButton = this._welButton = jindo.$Element(this.option('elButton'));

			var aButtons = this._aButtons = this.option('aButton') || [ this.option('elButton') ];

			this._wfOnMouseMove = jindo.$Fn(function(oEvent) {
				self._elCurrentBrowseButton = oEvent.currentElement;
				self._showFlashForFlash(jindo.$Element(self._elCurrentBrowseButton));
			});

			for (var i = 0, nLen = aButtons.length; i < nLen; i++) {
				var welButton = jindo.$Element(aButtons[i]);
				this._wfOnMouseMove.attach(welButton, 'mousemove');
			}
			
		},

	//------------------------------------------------------------------------------------------------------

	_uploadFile : function() {
		var fp = this['_uploadFile' + this._methodPostfix];
		return (this._uploadFile = fp).apply(this, arguments);
	},
	
		_uploadFileForFlash : function(oProp) {
			
			var self = this;
	
			var oFile = oProp.file;
			var sKey = oProp.key;
			
			oFile.state = this._states.PROGRESS;
	
			this._uploading++;
			this._sendForFlash('upload',  [ [sKey] ]);
	
		},
		
		_uploadFileForHTML5 : function(oProp) {
			
			var self = this;
	
			var oFile = oProp.file;
			var sKey = oProp.key;
			
			oFile.state = this._states.PROGRESS;
	
			this._uploading++;
			
			var oXHR = new XMLHttpRequest(),
			oUpload = oXHR.upload;
			
			oUpload.addEventListener("progress", function (oEvent) {
				
				if (!oEvent.lengthComputable) { return; }
				if (!self._xhr[sKey]) { return; }
					
				oFile.loaded = oEvent.loaded;
				oFile.rate = oEvent.loaded && (oEvent.loaded / oFile.size);
				
				/**
				 * 파일의 업로드가 진행 중일 때 발생한다.
				 * 
				 * @event uploadProgress
				 * @param {Object} oFile 파일 정보
				 * 		@param {String} oFile.name 파일 이름
				 * 		@param {String} oFile.ext 파일 확장자
				 * 		@param {Number} oFile.size 파일 크기 (바이트)
				 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
				 * 		@param {Number} oFile.rate 업로드 된 진행률
				 * 		@param {String} oFile.state 현재 파일의 상태 (PROGRESS)
				 * @param {String} sKey 파일 고유키
				 */
				self.fireEvent('uploadProgress', { 'oFile' : oFile, 'sKey' : sKey });
				
			}, false);
			
			/**
			 * 파일의 업로드가 완료 되었을 때 발생한다.
			 * 
			 * @event uploadLoad
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
			 * 		@param {Number} oFile.rate 업로드 된 진행률
			 * 		@param {String} oFile.state 현재 파일의 상태 (LOAD)
			 * @param {String} sKey 파일 고유키
			 */
			oUpload.addEventListener("load", function () {
				
				var that = this;
				var func = arguments.callee;
				
				if (oXHR.readyState !== 4) {
					setTimeout(function() { func.call(that); }, 0);
					return;
				}
				
				if (oXHR.status === 200) {
					self._setDoneState(sKey, oFile, 'uploadLoad', oFile.size, 1, self._states.LOAD, oXHR.responseText);
				} else {
					self._setDoneState(sKey, oFile, 'uploadError', 0, 0, self._states.ERROR);
				}
				
			}, false);
			
			/**
			 * 파일을 업로드 하다가 에러가 났을 때 발생한다.
			 * 
			 * @event uploadError
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
			 * 		@param {Number} oFile.rate 업로드 된 진행률
			 * 		@param {String} oFile.state 현재 파일의 상태 (ERROR)
			 * @param {String} sKey 파일 고유키
			 */
			oUpload.addEventListener("error", function () {
				self._setDoneState(sKey, oFile, 'uploadError', 0, 0, self._states.ERROR);
				
			}, false);
			
			/**
			 * 파일의 업로드를 중단 했을 때 발생한다.
			 * 
			 * @event uploadAbort
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
			 * 		@param {Number} oFile.rate 업로드 된 진행률
			 * 		@param {String} oFile.state 현재 파일의 상태 (NONE)
			 * @param {String} sKey 파일 고유키
			 */
			oUpload.addEventListener("abort", function () {
				self._setDoneState(sKey, oFile, 'uploadAbort', 0, 0, self._states.NONE);
			}, false);
			
			oXHR.open("POST", this.url());
			
			oXHR.setRequestHeader("Cache-Control", "no-cache");
			oXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			
			this._xhr[sKey] = oXHR;
	
			/**
			 * 파일의 업로드가 시작될 때 발생한다.
			 * 
			 * @event uploadStart
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
			 * 		@param {Number} oFile.rate 업로드 된 진행률
			 * 		@param {String} oFile.state 현재 파일의 상태 (PROGRESS)
			 * @param {String} sKey 파일 고유키
			 */
			this.fireEvent('uploadStart', { 'oFile' : oFile, 'sKey' : sKey });
			
			var oFormData = new FormData();
			oFormData.append(this.option('sParamName'), oFile);
			
			oXHR.send(oFormData);
			
			return true;
			
		},
	////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	_addQueue : function(aFiles) {
		
		/**
		 * 파일 선택을 완료 했을 때 발생한다.
		 * 
		 * @event beforeSelect
		 * @param {Array} aFiles 파일 목록
		 */

		var i, nLen;
		
		for (i = 0, nLen = aFiles.length; i < nLen; i++) {
			aFiles[i].ext = (/\.([^\.]+)$/.test(aFiles[i].name) && RegExp.$1) || '';
		}
		
		if (!this.fireEvent('beforeSelect', { aFiles : aFiles })) { return false; }
		
		for (i = 0, nLen = aFiles.length; i < nLen; i++) {
			
			var oFile = aFiles[i];
			var oParam = { 'oFile' : oFile, 'sKey' : 'UQ' + new Date().getTime() + Math.round(Math.random() * 100000) };

			/**
			 * 파일이 목록에 추가되기 직전에 발생한다.
			 * 
			 * @remark 여기서 파일의 고유키를 변경하여 지정 할 수 있다.
			 * 
			 * @event beforeAdd
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 
			 * @example
			 * 	o.attach('beforeAddFile', function(oCustomEvent) {
			 * 		oCustomEvent.sKey = 'UNIQ' + new Date().getTime() + Math.round(Math.random() * 100000);
			 * 	});
			 */
			if (!this.fireEvent('beforeAdd', oParam)) { continue; }
			
			var sKey = oParam.sKey;
			
			this._queue.push({
				'key' : oParam.sKey,
				'file' : oFile
			});
			
			oFile.loaded = 0;
			oFile.rate = 0;
			oFile.state = this._states.NONE;
			
			this._flashFiles && (this._flashFiles[oParam.sKey] = oFile);
			this._sendForFlash('setUniqueKeyAt', [ i, sKey ]);
			
			/**
			 * 파일이 목록에 추가된 직후에 발생한다.
			 * 
			 * @event add
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {String} oFile.state 현재 파일의 상태 (NONE)
			 * @param {String} sKey 파일 고유키
			 */
			this.fireEvent('add', { 'oFile' : oFile, 'sKey' : sKey });
			
		}
		
		return true;
		
	},
	
	_findQueue : function(sKey) {
		
		for (var i = 0, nLen = this._queue.length; i < nLen; i++) {
			if (this._queue[i].key === sKey) { return i; }
		}
		
		return -1;
		
	},
	
	/**
	 * 파일의 전체 상태 정보
	 * @method getInfo
	 * @return {Object} 용량 정보
	 * 		@return {Object} .size 파일 사이즈 정보
	 * 			@return {Number} .size.none 아무 상태도 아닌 파일의 용량 합계
	 * 			@return {Number} .size.wait 업로드 대기 중인 파일의 용량 합계
	 * 			@return {Number} .size.progress 업로드 진행 중인 파일의 용량 합계
	 * 			@return {Number} .size.load 업로드 완료한 파일의 용량 합계
	 * 			@return {Number} .size.error 업로드 에러난 파일의 용량 합계
	 * 			@return {Number} .size.total 전체 파일의 용량 합계
	 * 		@return {Object} .count 파일 갯수 정보
	 * 			@return {Number} .count.none 아무 상태도 아닌 파일의 갯수
	 * 			@return {Number} .count.wait 업로드 대기 중인 파일의 갯수
	 * 			@return {Number} .count.progress 업로드 진행 중인 파일의 갯수
	 * 			@return {Number} .count.load 업로드 완료한 파일의 갯수
	 * 			@return {Number} .count.error 업로드 에러난 파일의 갯수
	 * 			@return {Number} .count.total 전체 파일의 갯수
	 */
	getInfo : function() {
		
		var ret = {
			size : { none : 0, wait : 0, progress : 0, load : 0, error : 0, total : 0 },
			count : { none : 0, wait : 0, progress : 0, load : 0, error : 0, total : 0 }
		};
			
		for (var i = 0, len = this._queue.length; i < len; i++) {
			
			var oFile = this._queue[i].file;
			var sState = oFile.state.toLowerCase();
			
			var nSize = oFile.size;
			
			ret.size[sState] += nSize;
			ret.count[sState]++;

			ret.size.total += nSize;
			ret.count.total++;
			
		}

		return ret;
		
	},
	
	/**
	 * 지정한 파일 또는 전체 파일을 목록에서 삭제
	 * @method remove
	 * 
	 * @syntax
	 * @syntax sKey
	 * @syntax fpCallback
	 * 
	 * @param {String} sKey 파일의 고유키
	 * @param {Function} fpCallback 원하는 파일만 삭제 할 수 있도록 지정하는 필터 함수
	 * 		@param {Object} fpCallback.oFile 파일 정보 
	 *
	 * @return {Boolean} 삭제 성공/실패 여부
	 * 
	 * @example
	 * 	o.remove("UNIQ109378183"); // 해당 고유키를 가진 파일 삭제
	 * 
	 * 	o.remove(function(oFile) { // PNG 확장자의 파일만 삭제 
	 * 		return oFile.ext == 'png';
	 * 	});
	 * 
	 * 	o.remove(); // 모든 파일 삭제
	 */
	remove : function(sKey) {
		
		var sKeyType = typeof sKey;
		
		switch (sKeyType) {
		case 'string':
			var nIndex = this._findQueue(sKey);
			return this._removeFile(nIndex);
		
		case 'function':
		default:
			for (var i = this._queue.length - 1; i >= 0; i--) {
				var oProp = this._queue[i];
				if (sKeyType === 'function' && !sKey.call(this, oProp.key, oProp.file)) { continue; }
				this._removeFile(i);
			}
		}

		return true;
		
	},
	
	_removeFile : function(nIndex) {
		
		var oProp = this._queue[nIndex];
		if (!oProp) { return false; }
		
		var oFile = oProp.file;
		var sKey = oProp.key;
		
		this._abortFile(nIndex);
		this._queue.splice(nIndex, 1);
		
		this._flashFiles && (delete this._flashFiles[sKey]);

		this._sendForFlash('remove', [[sKey]]);
		
		/**
		 * 파일이 목록에서 삭제된 직후에 발생한다.
		 * 
		 * @event remove
		 * @param {Object} oFile 파일 정보
		 * 		@param {String} oFile.name 파일 이름
		 * 		@param {String} oFile.ext 파일 확장자
		 * 		@param {Number} oFile.size 파일 크기 (바이트)
		 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
		 * 		@param {Number} oFile.rate 업로드 된 진행률
		 * 		@param {String} oFile.state 현재 파일의 상태
		 * 			@param {String} oFile.state.NONE 목록에만 추가 된 상태
		 * 			@param {String} oFile.state.WAIT 업로드를 위해 기다리는 상태
		 * 			@param {String} oFile.state.PROGRESS 업로드 중인 상태
		 * 			@param {String} oFile.state.LOAD 업로드 완료 된 상태
		 * 			@param {String} oFile.state.ERROR 업로드 중 에러가 발생 한 상태
		 * @param {Object} sKey 파일 고유키
		 */
		this.fireEvent('remove', { 'oFile' : oFile, 'sKey' : sKey });
		
		return true;
		
	},
	
	/**
	 * 지정한 파일 또는 전체 파일의 업로드 중단
	 * @method abort
	 * 
	 * @syntax
	 * @syntax sKey
	 * @syntax fpCallback
	 * 
	 * @param {String} sKey 파일의 고유키
	 * @param {Function} fpCallback 원하는 파일만 업로드 중단 할 수 있도록 지정하는 필터 함수
	 * 		@param {Object} fpCallback.oFile 파일 정보 
	 *
	 * @return {Boolean} 중단 성공/실패 여부
	 */
	abort : function(sKey) {

		var sKeyType = typeof sKey;
		
		switch (sKeyType) {
		case 'string':
			var nIndex = this._findQueue(sKey);
			return this._abortFile(nIndex);
		
		case 'function':
		default:
			for (var i = this._queue.length - 1; i >= 0; i--) {
				var oProp = this._queue[i];
				if (sKeyType === 'function' && !sKey.call(this, oProp.key, oProp.file)) { continue; }
				this._abortFile(i);
			}
		}
		
		return true;
		
	},
	
	_abortFile : function(nIndex) {
		
		var oProp = this._queue[nIndex];
		if (!oProp) { return false; }
		
		var sKey = oProp.key;
		var oFile = oProp.file;
		
		if (oFile.state !== this._states.WAIT && oFile.state !== this._states.PROGRESS) { return false; }
		
		if (this._xhr && this._xhr[sKey]) {
			this._xhr[sKey].abort();
		}
		
		this._sendForFlash('abort', [[sKey]]);
		this._setDoneState(sKey, oFile, 'abort', 0, 0, this._states.NONE);
		
		return true;
		
	},
		
	/**
	 * 지정한 파일 또는 전체 파일의 초기화
	 * @method reset
	 * 
	 * @syntax
	 * @syntax sKey
	 * @syntax fpCallback
	 * 
	 * @param {String} sKey 파일의 고유키
	 * @param {Function} fpCallback 원하는 파일만 초기화 할 수 있도록 지정하는 필터 함수
	 * 		@param {Object} fpCallback.oFile 파일 정보 
	 *
	 * @return {Boolean} 초기화 성공/실패 여부
	 */
	reset : function(sKey) {

		var sKeyType = typeof sKey;
		
		switch (sKeyType) {
		case 'string':
			var nIndex = this._findQueue(sKey);
			return this._resetFile(nIndex);
		
		case 'function':
		default:
			for (var i = this._queue.length - 1; i >= 0; i--) {
				var oProp = this._queue[i];
				if (sKeyType === 'function' && !sKey.call(this, oProp.key, oProp.file)) { continue; }
				this._resetFile(i);
			}
		}
		
		return true;
		
	},
	
	_resetFile : function(nIndex) {
		
		var oProp = this._queue[nIndex];
		if (!oProp) { return false; }
		
		var sKey = oProp.key;
		var oFile = oProp.file;
		
		if (oFile.state !== this._states.LOAD && oFile.state !== this._states.ERROR) { return false; }
		
		oFile.state = this._states.NONE;
		
		/**
		 * 파일이 초기화 된 직후에 발생한다.
		 * 
		 * @event reset
		 * @param {Object} oFile 파일 정보
		 * 		@param {String} oFile.name 파일 이름
		 * 		@param {String} oFile.ext 파일 확장자
		 * 		@param {Number} oFile.size 파일 크기 (바이트)
		 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
		 * 		@param {Number} oFile.rate 업로드 된 진행률
		 * 		@param {String} oFile.state 현재 파일의 상태 (NONE)
		 * @param {Object} sKey 파일 고유키
		 */
		this.fireEvent('reset', { 'oFile' : oFile, 'sKey' : sKey });
		
		return true;
		
	},
		
	/**
	 * 지정한 파일 또는 전체 파일의 업로드
	 * @method upload
	 * 
	 * @syntax
	 * @syntax sKey
	 * @syntax fpCallback
	 * 
	 * @param {String} sKey 파일의 고유키
	 * @param {Function} fpCallback 원하는 파일만 업로드 할 수 있도록 지정하는 필터 함수
	 * 		@param {Object} fpCallback.oFile 파일 정보 
	 * 			@param {String} fpCallback.oFile.name 파일 이름
	 * 			@param {String} fpCallback.oFile.ext 파일 확장자
	 * 			@param {Number} fpCallback.oFile.size 파일 크기 (바이트)
	 *
	 * @return {Boolean} 항상 true
	 */
	upload : function(sKey) {
		
		var sKeyType = typeof sKey;
		var sOrgKey = sKey;
		
		switch (sKeyType) {
		case 'string':
			sKeyType = 'function';
			sKey = function(_sKey) { return sOrgKey === _sKey; };
			//break;
		
		case 'function':
		default:
			for (var i = this._queue.length - 1; i >= 0; i--) {
				
				var oProp = this._queue[i];
				
				if (
					(sKeyType === 'function' && !sKey.call(this, oProp.key, oProp.file)) ||
					oProp.file.state !== this._states.NONE
				) { continue; }

				oProp.file.state = this._states.WAIT;
				
				/**
				 * 파일이 업로드를 위한 대기를 시작했을 때 발생한다.
				 * 
				 * @event wait
				 * @param {Object} oFile 파일 정보
				 * 		@param {String} oFile.name 파일 이름
				 * 		@param {String} oFile.ext 파일 확장자
				 * 		@param {Number} oFile.size 파일 크기 (바이트)
				 * 		@param {String} oFile.state 현재 파일의 상태 (WAIT)
				 * @param {String} sKey 파일 고유키
				 */
				this.fireEvent('wait', { 'oFile' : oProp.file, 'sKey' : oProp.key });
				
			}
			
			break;
		}
		
		this._startUploadFile();
		return true;
		
	},
	
	_startUploadFile : function() {
		
		var nParallel = this.option('nParallel');
		
		if (this._uploading >= nParallel) { return false; }
		
		var bFinish = true;
		
		for (var i = 0, nLen = this._queue.length; i < nLen; i++) {
			
			var oProp = this._queue[i];
			
			if (oProp.file.state === this._states.WAIT) {
				
				bFinish = false;
				
				if (this._uploading < nParallel) {
					this._uploadFile(oProp);
				}
				
			} else if (oProp.file.state === this._states.PROGRESS) {
				
				bFinish = false;
				
			}

		}
		
		return bFinish;
		
	},
	
	_setDoneState : function(sKey, oFile, sEventName, nLoaded, nRate, sState, sLoadResponseText) {
		
		if (oFile.state === sState) { return; }
		
		if (sEventName === 'uploadLoad') {

			/**
			 * 파일의 업로드가 완료되기 직전에 발생한다.
			 * 
			 * @event beforeUploadLoad
			 * @param {Object} oFile 파일 정보
			 * 		@param {String} oFile.name 파일 이름
			 * 		@param {String} oFile.ext 파일 확장자
			 * 		@param {Number} oFile.size 파일 크기 (바이트)
			 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
			 * 		@param {Number} oFile.rate 업로드 된 진행률
			 * 		@param {String} oFile.state 현재 파일의 상태
			 * @param {String} sKey 파일 고유키
			 * @param {String} sResponseText 서버 응답 문자열
			 * @param {Function} stop 정상적으로 업로드 되지 않았다고 판단 될 때 호출
			 */
			if (!this.fireEvent('beforeUploadLoad', {
				'oFile' : oFile,
				'sKey' : sKey,
				'sResponseText' : sLoadResponseText
			})) {
				return this._setDoneState(sKey, oFile, 'uploadError', 0, 0, this._states.ERROR);
			}
			
		}
			
		var bProgressing = oFile.state === this._states.PROGRESS;

		oFile.loaded = nLoaded;
		oFile.rate = nRate;
		oFile.state = sState;
		
		this._xhr && (delete this._xhr[sKey]);

		this.fireEvent(sEventName, { 'oFile' : oFile, 'sKey' : sKey });
		if (bProgressing) { this._uploading--; }
		
		var bFinish = this._startUploadFile();

		/**
		 * 파일의 업로드가 끝났을 때 발생한다.
		 * 
		 * @remark 어떤 상황(정상적인 업로드, 에러, 중단 모두 포함)으로 끝나던 무조건 발생한다.
		 * 
		 * @event uploadEnd
		 * @param {Object} oFile 파일 정보
		 * 		@param {String} oFile.name 파일 이름
		 * 		@param {String} oFile.ext 파일 확장자
		 * 		@param {Number} oFile.size 파일 크기 (바이트)
		 * 		@param {Number} oFile.loaded 업로드 된 크기 (바이트)
		 * 		@param {Number} oFile.rate 업로드 된 진행률
		 * 		@param {String} oFile.state 현재 파일의 상태
		 * @param {String} sKey 파일 고유키
		 * @param {Boolean} bFinish true 인 경우 더 이상 업로드 할 파일이 없다는 뜻이다.
		 */
		this.fireEvent('uploadEnd', {
			'oFile' : oFile,
			'sKey' : sKey,
			'bFinish' : bFinish
		});

	},

	/**
	 * 업로드 URL 을 변경한다
	 *
	 * @method url
	 * @param {String} sURL 업로드 URL
	 * @return {this}
	 */
	/**
	 * 업로드 URL 을 얻는다
	 *
	 * @method url
	 * @return {String} 업로드 URL
	 */
	url : function(sURL) {

		if (arguments.length) {
			this._url = sURL;
			return this;
		}

		return this._url;

	}
	
}).extend(jindo.UIComponent);

jindo.UploadQueue.__flashCallback = {};
