module("", {
	setup : function() {

		this.oInst = new jindo.DatePicker(jindo.$("calendar_layer"), {
			Calendar : {
				sTitleFormat : "yyyy/mm"
			}
		});
		
		this.oInst.addDatePickerSet({
			elInput : jindo.$("date_input"),
			htOption : {
				bDefaultSet : false,
				sDateFormat : "yyyy-mm-dd"
			}
		});
		
	},
	teardown : function() {

	}
});

test("", function(){
	ok(true);
});
