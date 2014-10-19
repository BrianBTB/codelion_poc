// global vars  

var _log0, _log, _dview;
var verbose = 1;
function overflow(d) { 
return function(x,y) {  	
	if (y == d[d.length-2] && x == d[d.length-1] ) {
	d.shift();
	//testing: add more shifts, other fudgy code
    } 
return 0
}
}
String.prototype.padLeft = function (pad) {
  if (this.toString() == undefined) return pad;
  return (pad + this.toString()).slice(-pad.length);
}
// prints environment info
function writeEnvInfo()
{
	document.write(new Date().toTimeString() + "<br/>");
	document.write(navigator.userAgent + "<br/>");
	document.write(navigator.appName + " (" + navigator.platform + ")<br/><br/>");
}

// returns WebKit major version number
function getWebKitVersion(tmpl)
{
	var str = navigator.userAgent;
	if (!tmpl) tmpl = "WebKit/";
	var i = str.indexOf(tmpl);
	if (i >= 0) {
		i += tmpl.length;
		i = +str.substring(i,i+3);
		return isNaN(i) ? 0 : i;
	}
	return 0;
}

// creates new Uint32Array from Uint8Array's data
function U8toU32(u8)
{
	var len = u8.length;
	var u32 = new Uint32Array((len >>> 2) + (len % 4 ? 1:0));
	if (len > 1) {
		len--;
		for(var i=0; i <= len; i++){		
			u32[i >>> 2] += u8[i] << ((i%4)*8);		
		}
	}else{
		if (len) u32[0]	= u8[0];
	}
	return u32;
}	

// writes one array into another, and saves the old content
function exchangeArrays(aFrom, aTo, offs)
{
	var u, len = aFrom.length;
	for(var i=0; i < len; i++, offs++){
		u = aTo[offs];
		aTo[offs] = aFrom[i];
		aFrom[i] = u;
	}
}

// outputs uint32 as a comma-separated list of bytes
function getU8str(u)
{
	var str = "", s;
	for(var i=0; i < 4; i++, u >>>= 8) {
		s = (u & 0xff).toString(16);
		if (s.length < 2) s = "0" + s;
		str += s + (i < 3 ? ",":"");
	}
	
	return str;
}

// outputs the content of array object
function ArrayToU8String(arr, offs, len)
{
	var str = "["; 
	len += offs-1;	
	for(var i=offs; i <= len; i++){
	  	str += getU8str(arr[i]);
	  	str += i < len ? ", &nbsp;" + (i % 4 == 3 ? "<br/>":"") : "]";
	}
	return str;
}


// outputs the content of array object
function ArrayToString(arr, offs, len)
{
	var str = ""; 
	len += offs-1;	
	for(var i=offs; i <= len; i++){
	  	str+=arr[i].toString(16).padLeft("0000").toUpperCase();
	  	str += (i < len) ? ", " : ", ";
	}
	return str;
}


// wraps two uint32s into double precision
function u2d(low,hi)
{
	if (!_dview) _dview = new DataView(new ArrayBuffer(16));
	_dview.setUint32(0,hi);
	_dview.setUint32(4,low);
	return _dview.getFloat64(0);	
}

// unwraps uints from double 
function d2u(d)
{
	if (!_dview) _dview = new DataView(new ArrayBuffer(16));
	_dview.setFloat64(0,d);
	return { low: _dview.getUint32(4), 
	         hi:  _dview.getUint32(0) };    
}

logAdd("Loaded utils.js");
