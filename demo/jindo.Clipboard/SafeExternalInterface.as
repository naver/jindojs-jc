package {
import flash.external.ExternalInterface;
import flash.utils.ByteArray;

/**
	XSS 위험의 제거를 위한 ExternalInterface.call 대체 함수
	
	사용방법 :
		ExternalInterface.call 대신에
		SafeExternalInterface.call 를 사용한다.
**/
internal class SafeExternalInterface {
	
	// 객체를 escape 할 때 원본 데이터가 바뀌면 안되기 때문에 사용하는 깊은 복사 함수
	static private function clone(source:Object):* {
		var byteArray:ByteArray = new ByteArray();
		byteArray.writeObject(source);
		byteArray.position = 0;
		return(byteArray.readObject());
	}
	
	// 재귀적으로 배열이나 객체 안에 있는 역슬래쉬 문자를 escape 함
	static private function escape(source:*):* {
		
		switch (typeof source) {
		case 'object':
			for (var k in source) if (source.hasOwnProperty(k)) {
				source[k] = escape(source[k]);
			}
			break;
			
		case 'string':
			source = source.replace(/\\/g, '\\\\');
			break;
		}
		
		return source;

	}
	
	// ExternalInterfacel.call 대신에 쓰는 메서드
	static public function call(...args:Array):* {

		var i:Number, len:Number;
		
		// 두번째 인자부터 안에 역슬래쉬 문자를 escape 하도록 함
		for (i = 1, len = args.length; i < len; i++) {
			args[i] = escape(clone(args[i]));
		}
		
		// 첫번째 인자는 허용된 문자만 남기고 모두 삭제
		args[0] = args[0].replace(/[^\w\$\.]/g, '');
		
		return ExternalInterface.call.apply(ExternalInterface, args);
		
	}
	
}
}