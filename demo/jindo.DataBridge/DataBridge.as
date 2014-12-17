package {
    import flash.display.Sprite;
	import flash.display.MovieClip;
	import flash.net.LocalConnection;
    import flash.net.SharedObject;
    import flash.text.TextField;
	import flash.external.ExternalInterface;
	import flash.events.Event;
	import flash.events.StatusEvent;
	import flash.events.MouseEvent;
	import flash.events.AsyncErrorEvent;
	import SafeExternalInterface;

	public class DataBridge extends Sprite {
		private var _lcController:LocalConnection = new LocalConnection();
		private var _sConnectionId:String;
		private var _sServiceId:String;
		private var _sFlashId:String;
		private var _sReceiveHandlerName:String;
		private var _sLogHandlerName:String;
		private var _iMaxDummyConnectionCount:int = 3;
		private var _bDebugMode:Boolean = false;
		private var _oFunctionStorage:Object = {};
		private var _oLCS:Object = {};
		private var _root:MovieClip;

		public function DataBridge(sServiceId:String="", sFlashId:String="", sReceiveHandlerName:String="", sLogHandlerName:String="", iRetryLimit:int=3, bDebugMode:Boolean=false):void{
			_sConnectionId = sServiceId + "_" + sFlashId;
			_sServiceId = sServiceId;
			_sFlashId = sFlashId;
			_sReceiveHandlerName = sReceiveHandlerName;
			_sLogHandlerName = sLogHandlerName;
			_iMaxDummyConnectionCount = iRetryLimit;
			_bDebugMode = bDebugMode

			if(!getLocalData("aConnectionList")) setLocalData("aConnectionList", []);
			if(!getLocalData("aDummyConnectionList")) setLocalData("aDummyConnectionList", []);

			//addEventListener(Event.ADDED_TO_STAGE, onAddedStage);
			addCallback();
			createConnection();
			//log("create data bridge instance");
		}
/*
		private function onAddedStage(e:Event){
			removeEventListener(Event.ADDED_TO_STAGE, onAddedStage);
			_root = root as MovieClip;


			_root.btnSend.buttonMode = true;
			_root.btnSend.addEventListener(MouseEvent.CLICK, function(){
				sendData("Test Message");
			});
			_root.btnList.buttonMode = true;
			_root.btnList.addEventListener(MouseEvent.CLICK, function(){
				log(getLocalData("aConnectionList").toString()+"\n");
			});
			
			_root.txt.text = "init : "+getConnectionId()+"\n";

			//log("data bridge instance is added to root stage");
			
		}
*/		
		private function addCallback():void{
			ExternalInterface.addCallback("getConnectionId", getConnectionId);
			ExternalInterface.addCallback("send", sendData);
			ExternalInterface.addCallback("close", closeConnection);
			ExternalInterface.addCallback("getLocalData", getLocalData);
			ExternalInterface.addCallback("setLocalData", setLocalData);
			ExternalInterface.addCallback("resetLocalData", resetLocalData);
			ExternalInterface.addCallback("getClientIdList", getClientIdList);
		}
		
		public function getConnectionId():String{
			return _sConnectionId;
		}
		
		public function getClientIdList():String{
			return getLocalData("aConnectionList")
		}
		
		private function setAllowDomain(){
			
		}
		
		private function getAllowDomain(){
			
		}
		
		private function setSecureMode(){
			
		}
		
		private function createConnection(){
			_lcController.allowDomain("*");
			_lcController.addEventListener(AsyncErrorEvent.ASYNC_ERROR, function(e){
				log("Connection creation error (AsyncError) : "+e.toString());
			});

			try{
				_lcController.client = this;
				_lcController.connect(_sConnectionId);
			}catch(e:ArgumentError){
				log("Connection creation error (ArgumentError) : "+e.toString());
			}
			

			addLocalList("aConnectionList", getConnectionId());
			log("Connection created");
			log("Client id list : "+getLocalData("aConnectionList"));
		}
		
		private function closeConnection(){
			try{
				_lcController.close();
			}catch(e:ArgumentError){
				log("Connection close error (ArgumentError) : "+e.toString());
			}
			removeConnection(getConnectionId());
		}
		
		private function sendData(vSendData:*){
			var aConnectionList:Array = getLocalData("aConnectionList");
			if(vSendData && aConnectionList){
				for(var i:int=0; i<aConnectionList.length; i++){
					if(aConnectionList[i] != _sConnectionId){
						_oFunctionStorage[aConnectionList[i]] = bind(onStatus, this, [aConnectionList[i]]);
						_oLCS[aConnectionList[i]] = new LocalConnection();
						_oLCS[aConnectionList[i]].addEventListener(StatusEvent.STATUS, _oFunctionStorage[aConnectionList[i]]);
						_oLCS[aConnectionList[i]].send(aConnectionList[i], "onReceiveData", vSendData, getConnectionId());
						//_lcController.send(aConnectionList[i], "onReceiveData", vSendData, getConnectionId());
						//_lcController.addEventListener(StatusEvent.STATUS, _oFunctionStorage[aConnectionList[i]]);
						log("Send data to "+aConnectionList[i]);
					}
				}
			}
		}
		
		private function onStatus(sConnectionId:String, event:StatusEvent):void {
            switch (event.level) {
                case "status":
                    log("Data sended to "+sConnectionId);
                    break;
                case "error":
					log("Data send error : "+ event.toString());
					if(getDummyConnectionCount(sConnectionId) < _iMaxDummyConnectionCount - 1){
						trace("Add dummy connection list : "+sConnectionId);
						addLocalList("aDummyConnectionList", sConnectionId);
					}else{
						trace("Remove connection list : "+sConnectionId);
						removeConnection(sConnectionId);
					}
                    break;
            }
			_oLCS[sConnectionId].removeEventListener(StatusEvent.STATUS, _oFunctionStorage[sConnectionId]);
			delete _oLCS[sConnectionId];
			delete _oFunctionStorage[sConnectionId];
        }

		private function getDummyConnectionCount(sConnectionId:String):int{
			var aList:Array = getLocalData("aDummyConnectionList");
			var iResult:int = 0;

			for(var i:int=0; i<aList.length; i++){
				if(aList[i] == sConnectionId) iResult++;
			}
			return iResult;
		}
		
		private function removeConnection(sConnectionId:String){
			var aList:Array =  getLocalData("aConnectionList");
			var aResult:Array = [];
			
			for(var i:int=0; i<aList.length; i++){
				if(aList[i] != sConnectionId) aResult.push(aList[i]);
			}
			setLocalData("aConnectionList", aResult);
			
			aList =  getLocalData("aDummyConnectionList");
			aResult = [];
			
			for(i=0; i<aList.length; i++){
				if(aList[i] != sConnectionId) aResult.push(aList[i]);
			}
			setLocalData("aDummyConnectionList", aResult);
		}

		public function onReceiveData(vData:*, sSenderId:String){
			if(_sReceiveHandlerName){
				log("Data received from "+sSenderId);
				try{
					SafeExternalInterface.call(_sReceiveHandlerName, _sFlashId, sSenderId, vData);
				}catch(e){
					log("Data receive error : "+e.toString);
				}
			}
		}
		
		private function addLocalList(sKey:String, sConnectionId:String):void{
			var aList:Array = getLocalData(sKey);
			aList.push(sConnectionId);
			setLocalData(sKey, aList);
		}
		
		private function setLocalData(sKey:String, vValue:*):void{
			if(sKey && vValue){
				var so:SharedObject = SharedObject.getLocal(_sServiceId + "_local_storage")
				so.data[sKey] = vValue;
				so.close();
			}
		}
		
		private function getLocalData(sKey:String=""):*{
			if(sKey){x
				var so:SharedObject = SharedObject.getLocal(_sServiceId + "_local_storage")
				if(sKey){
					var aList:Array = so.data[sKey];
					so.close();
					return aList;
				}else{
					var oData:Object = so.data;
					so.close();
					return oData;
				}
			}
		}
		
		private function resetLocalData():void{
			var oTarget:Object = getLocalData();
			var oResult:Object = {};
			for(var x:String in oTarget){
				if(x != "aConnectionList" || x != "aDummyConnectionList"){
					setLocalData(x, null);
				}
			}
		}
		
		private function bind(fTarget:Function, oTarget:Object, aParam:Array):Function{
			return function() {
				if (aParam.length) arguments = aParam.concat(arguments);
				return fTarget.apply(oTarget, arguments);
			};
		}
		
		private function log(sMessage:String){
			if(_sLogHandlerName){
				SafeExternalInterface.call(_sLogHandlerName, _sFlashId, sMessage);
			}
			//trace(sMessage);
		}
	}
}