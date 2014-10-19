if (!String.prototype.format) {
//more credit: http://bit.ly/1gePhqy
    String.prototype.format = function() {
        var str = this.toString();
        if (!arguments.length)
            return str;
        var args = typeof arguments[0],
            args = (("string" == args || "number" == args) ? arguments : arguments[0]);
        for (arg in args)
            str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
        return str;
    }
}		
	
function logAdd(txt)
{


$.ajax({
  type: "POST",
  url: "inc/log.php",
  data: "d=" + txt + "\n\r",
  async: false,
  success: function() {
  }
});

}
logAdd("Loaded log.js");