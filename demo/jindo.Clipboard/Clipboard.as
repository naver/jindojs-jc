package
{
	import flash.display.Graphics;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import flash.system.System;
	import SafeExternalInterface;
	
	public class Clipboard extends Sprite {
		
		private var btn:Sprite;
		
		private var clipboardData:String;
		
		private var jsNamespace:String;
		private var jsUniqID:String;
		
		public function Clipboard()
		{
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			stage.showDefaultContextMenu = false;
			
			jsNamespace = stage.loaderInfo.parameters["sNamespace"] || "jindo";
			jsUniqID = stage.loaderInfo.parameters["sUniq"] || "";
			
			btn = makeButton();
			
			addChild(btn);
			addEventListener(Event.ADDED_TO_STAGE, addToStageHandler);
		}
		
		private function fireJSEvent(eventName:String, param:String = null):void
		{
			var funcName = "";
			funcName += jsNamespace;
			funcName += ".Clipboard._callbacks.";
			funcName += jsUniqID;
			funcName += ".";
			funcName += eventName;
				
			SafeExternalInterface.call(funcName, param);
		}
		
		private function addEventListeners():void
		{
			stage.addEventListener(Event.RESIZE, stageResizeHandler);
			
			btn.addEventListener(MouseEvent.CLICK, btnClickHandler);
			btn.addEventListener(MouseEvent.ROLL_OVER, btnOverHandler);
			btn.addEventListener(MouseEvent.ROLL_OUT, btnOutHandler);
			btn.addEventListener(MouseEvent.MOUSE_DOWN, btnDownHandler);
			btn.addEventListener(MouseEvent.MOUSE_UP, btnUpHandler);
		}
		
		private function addJSCallback():void
		{
			ExternalInterface.addCallback("setClipboardData", jsCallback_setClipboardData);
			ExternalInterface.addCallback("setClipboardOptions", jsCallback_setClipboardOptions);
		}
		
		private function jsCallback_setClipboardData(sendData:String):void
		{
			clipboardData = sendData;
		}
		
		private function jsCallback_setClipboardOptions(option:Object):void
		{
			if(option && option.hasOwnProperty("cursor")){
				btn.buttonMode = (option.cursor == "pointer" || option.cursor == "hand") ? true : false;
			}
		}
		
		private function makeButton():Sprite
		{
			var btn:Sprite = new Sprite();
			var g:Graphics = btn.graphics;
			
			g.beginFill(0xFF0000);
			g.drawRect(0,0,100,100);
			g.endFill();
			
			btn.alpha = 0;
			btn.buttonMode = true;
			
			return btn;
		}
		
		private function fitBtn():void
		{
			btn.x = 0;
			btn.y = 0;
			btn.width = stage.stageWidth;
			btn.height = stage.stageHeight;
		}
		
		private function addToStageHandler(event:Event):void{
			fitBtn();
			
			addEventListeners();
			addJSCallback();
			
			fireJSEvent("load");
		}
		
		private function stageResizeHandler(event:Event):void
		{
			fitBtn();
		}
		
		private function btnClickHandler(event:MouseEvent):void
		{
			if(clipboardData != null){
				System.setClipboard(clipboardData);
				fireJSEvent("click", clipboardData);
			}
		}
		
		private function btnOverHandler(event:MouseEvent):void
		{
			fireJSEvent("mouseover");
		}
		
		private function btnOutHandler(event:MouseEvent):void
		{
			fireJSEvent("mouseout");
		}
		
		private function btnDownHandler(event:MouseEvent):void
		{
			fireJSEvent("mousedown");
		}
		
		private function btnUpHandler(event:MouseEvent):void
		{
			fireJSEvent("mouseup");
		}
	}
}