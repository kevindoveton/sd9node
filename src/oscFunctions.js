const osc = require("./osc");

exports.requestInputNameUpdate = function(inputRangeLow, inputRangeHigh) {
	for (i = inputRangeLow; i <= inputRangeHigh; i++) {
		osc.sendMessage("/Input_Channels/"+i+"/Channel_Input/name/?", "");
	}
}

exports.requestAuxNameUpdate = function(inputRangeLow, inputRangeHigh) {
	for (i = inputRangeLow; i <= inputRangeHigh; i++) {
		osc.sendMessage("/Aux_Outputs/"+i+"/Buss_Trim/name/?", "")
	}
}

exports.requestInputLevelUpdate = function(auxnumber, inputRangeLow, inputRangeHigh) {
	for (i = inputRangeLow; i <= inputRangeHigh; i++) {
		osc.sendMessage("/Input_Channels/"+i+"/Aux_Send/"+auxnumber+"/send_level/?", "");
	}
}

exports.requestInputMuteUpdate = function(auxnumber, inputRangeLow, inputRangeHigh) {
	for (i = inputRangeLow; i <= inputRangeHigh; i++) {
		osc.sendMessage("/Input_Channels/"+i+"/mute/?", "");
	}
}

exports.requestConsoleUpdate = function() {
	osc.sendMessage("/Console/Input_Channels/?", "");
	osc.sendMessage("/Console/Aux_Outputs/?", "");
}
