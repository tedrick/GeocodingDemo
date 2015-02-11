//this must be included first, so the browser type is established

clickedButton=false; //used to  thwart the submission of a form via <CR> (requires a bogus submit image.
var isIE4=false 
var isNS6=false 
var isNav4=false 
if (document.all) {
	isIE4=true;
} else if (document.layers)
	isNav4=true;
else if (document.getElementById)
	isNS6=true;

var nav = window.Event ? true : false;
if (nav) {
   window.captureEvents(Event.KEYDOWN);
   window.onkeydown = NetscapeEventHandler_KeyDown;
} else {
   document.onkeydown = MicrosoftEventHandler_KeyDown;
}

var warnTimeoutSeconds = 3000;
//  var warnTimeoutMS = 30000;
var actualTimeoutMS = warnTimeoutSeconds * 1000;
var debug = -1;
var timeoutId = -1;
var url = "jsp/keepAlive.jsp";
var callCenterNum = "1-800-882-9539";


function InitTO(timeoutInSeconds, aurl)
{
  if (timeoutInSeconds != null)
  {
    actualTimeoutMS = timeoutInSeconds * 1000;
  }

    if (actualTimeoutMS < 500000 || isNaN(actualTimeoutMS)) // avoid overflow
         actualTimeoutMS = 500000;

        if (debug == 1)alert("Debug: Setting timeout for " + window.name + " for " + actualTimeoutMS/1000 + " seconds");
        if (aurl != null)url = aurl;
        if (url == null)url = "jsp/keepAlive.jsp";
        //timeoutId = window.setTimeout('displayTOAlert()', actualTimeoutMS);
        //window.onUnload="window.clearTimeout("+timeoutId+");";

}

function displayTOAlert()
{
        alert("Message from DEA online forms and applications: Please see the popup window (You may need to allow popup windows from this site if you are using a popup blocker.)");
        InitTO();
//	toWin = window.open("/webforms/jsp/keepAlive.html","TOwindow",'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=no,resizable=no,width=350,height=290,top=300,left=400');
	toWin = window.open(url,"TOwindow",'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=no,resizable=no,width=350,height=290,top=300,left=400');
        if (debug==1)alert("Window opener = " + toWin.opener.name);
	if (toWin != null)toWin.focus();
}

function UnloadTO()
{
   window.clearTimeout(timeoutId);
}


var pendingSubmit = true;
function submitCheck(elemID, validated)
{
      if(validated == false)return false;
      if(document.getElementById)
      {
        theButton = document.getElementById(elemID);
        if(theButton)
        {
            if(pendingSubmit)
            {
              theButton.disabled = true;   
              theButton.src=""; 
              pendingSubmit=false;
              return true;
            }
            else
            {
                return false;
            }
        }   
        else
        {
            return true;
        }
      }
      return true;
}




function NetscapeEventHandler_KeyDown(e) {
  if (e.which == 13 && e.target.type != 'textarea' && e.target.type != 'submit') { return false; }
  return true;
}

function MicrosoftEventHandler_KeyDown() {
  if (event.keyCode == 13 && event.srcElement.type != 'textarea' && event.srcElement.type != 'submit')
    return false;
  return true;
}


function getDiv(divName) {
	if (isIE4)
		return eval("document.all." + divName + ".style");
	else if (isNav4)
		return eval("document.layers." + divName);
	else if (isNS6) 
        {              
		return document.getElementById(divName).style;
	}
}

function setDivProps(divObject,top,left) {
	if (isIE4) {
		divObject.pixelTop=top;
		divObject.pixelLeft=left;
	} else if (isNav4) {
		//10 pixels are subtracted from the left property
		//due to a default buffer that occurs in netscape
		divObject.top=top;
		divObject.left=left - 10;
	} else if (isNS6) {
		//alert(divObject.name + ":" + top + "," + left)
		divObject.top =(top + "px");
		divObject.left =(left + "px");
	}
}

function paintDiv(divName,content) {	
    if (isNav4) 
    {        
        var leftFrame=getDiv(divName);
        if (leftFrame != null)
        {
          leftFrame.document.open();
          leftFrame.document.write( content + "\n");
          leftFrame.document.close();
        }
    } 
    else 
    {
    	var leftFrame=isIE4 ? eval("document.all." + divName): document.getElementById(divName);
        if (leftFrame != null)
           leftFrame.innerHTML = content + "\n";
    }
}

function showObject(obj) {
	(isIE4 || isNS6) ? obj.visibility="visible" : obj.visibility="show";
}

function updateHelpMessage(offsetTop,offsetLeft,table) {
    return;
	setDivProps(getDiv('divHelpMessage'),offsetTop,offsetLeft);
	paintDiv('divHelpMessage',table);
	showObject(getDiv('divHelpMessage'));
}
function paintFiller(divName, count)
{
  var content = "";
  for(i=0; i < count; i++)
  {
    content += "<br>";
  }
  paintDiv(divName, content);
}

function drawHelpMsgTable(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/app224/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	
	return table;
}
function drawHelpMsgTableRegApps(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/regapps/common/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=850,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	
	return table;
}

function drawHelpMsgTable225(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/app225/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	
	return table;
}

function drawHelpMsgTable510(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/app510/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	
	return table;
}

function drawHelpMsgTable363(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/app363/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	return table;
}

function drawHelpMsgTable363A(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/rnw363a/instructions_inc.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	return table;
}

function drawHelpMsgTable486(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/app486/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	return table;
}
function drawHelpMsgTable224A(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/rnw224a/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	return table;
}

function drawHelpMsgTable225A(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/rnw225a/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	return table;
}

function drawHelpMsgTable510A(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/rnw510a/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	return table;
}

function drawHelpMsgTableUmp(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	return table;
}

function drawHelpMsgTable222(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/order222/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">Instructions.</A>\n";
                

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	return table;
}

function drawHelpMsgTable106(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br><a href='#' target='_blank' onClick=\"MyWindow=window.open('jsp/dtl/instructions.jsp','Window','toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400'); return false;\">General Instructions.</A>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	return table;
}

// If the checkbox is checked, set focus to next and return true
// otherwise return false.
function processCheckboxEntry(checkbox, next)
{
    if(checkbox.checked == true)
    {
        return true;
    }
    else
    {
        return false;
    }

}
function drawHelpMsgTableQ(header, message) {
	var table;
	table = "<table class='helpTable' align='center' width='160' border='1' cellspacing='0' cellpadding='4'>\n";
	table += "\t<tr bgcolor='#ffffff'><td align='center' valign='middle' >";
	table += "<b>" + header + "</b>";
	table += "</td></tr>\n";
	table += "\t<tr><td align='center'>\n";
		table += "\t\t<table width='160' border='1' cellspacing='0' cellpadding='3' bgcolor='#999999'>\n";
		table += "\t\t\t<tr bgcolor='#ffffff'><td  valign='bottom'>";
                table += "\t\t\t<font class='helpText'>\n";
		table += message;
                table += "\t\t\t</font>\n";
                     
                table += "<br><br>\n";

		table += "\t\t\t</td></tr>\n\t\t</table>\n";
        table += "\t</td></tr></table>"
	return table;
}
// If the checkbox is checked, set focus to next and return true
// otherwise return false.
function processCheckboxEntry(checkbox, next)
{
    if(checkbox.checked == true)
    {
        return true;
    }
    else
    {
        return false;
    }

}

function processFeeExemptCheckbox(checkbox, next)
{
    result = processCheckboxEntry(checkbox,next);
    if(result == false)
    {
        checkbox.form.exemptName.value = "";
        checkbox.form.exemptTitle.value = "";
        checkbox.form.exemptYear.value = "";
        checkbox.form.exemptMonth.value = "";
        checkbox.form.exemptDay.value = "";
        checkbox.form.exemptName.disabled=true;
        checkbox.form.exemptTitle.disabled=true;
        checkbox.form.exemptYear.disabled=true;
        checkbox.form.exemptMonth.disabled=true;
        checkbox.form.exemptDay.disabled=true;
//        checkbox.form.ssn.disabled=false;
//        checkbox.form.taxId.disabled=false;        
        
    }
    else
    {
        checkbox.form.exemptName.disabled=false;
        checkbox.form.exemptTitle.disabled=false;
        checkbox.form.exemptYear.disabled=false;
        checkbox.form.exemptMonth.disabled=false;
        checkbox.form.exemptDay.disabled=false;
//        checkbox.form.ssn.disabled=true;
//        checkbox.form.taxId.disabled=true;        
//        checkbox.form.ssn.value = "";
//        checkbox.form.taxId.value = "";        
        next.focus();
    }
}

function showHelpMessage(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable("HELP",message));
        return false;
}
function showHelpMessageRegApps(offsetTop, offsetLeft, message) {         
        return  showHelpMessageRegApps2(offsetTop, offsetLeft, message, 'helpTop')
}
function showHelpMessageRegApps2(offsetTop, offsetLeft, message, location) {         
        theTD = document.getElementById('tdHelpMessage');
        if(theTD)theTD.className=location;         
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTableRegApps("HELP",message));
        return false;
}

function showHelpMessage225(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable225("HELP",message));
        return false;
}
function showHelpMessage510(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable510("HELP",message));
        return false;
}
function showHelpMessage363(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable363("HELP",message));
        return false;
}
function showHelpMessage363A(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable363A("HELP",message));
        return false;
}
function showHelpMessage486(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable486("HELP",message));
        return false;
}
function showHelpMessage224A(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable224A("HELP",message));
        return false;
}
function showHelpMessage225A(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable225A("HELP",message));
        return false;
}
function showHelpMessage510A(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable510A("HELP",message));
        return false;
}
function showHelpMessage106(offsetTop, offsetLeft, message, position) 
{
        if (position != null)
        {
          var helpTd = document.getElementById('tdHelpMessage');
          if (helpTd != null)
          {
              helpTd.className=position; 
          }
        }
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable106("HELP",message));
        return false;
}
function showHelpMessageUmp(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTableUmp("HELP",message));
        return false;
}
function showHelpMessage222(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTable222("HELP",message));
        return false;
}
function showHelpMessageQ(offsetTop, offsetLeft, message) {
	updateHelpMessage(offsetTop,offsetLeft,drawHelpMsgTableQ("HELP",message));
        return false;
}

function clearOtherIfThisNotNull(me, other)
{
    if(me.value != "" )
    {
        other.value="";
    }

}

function noenter() 
{
  if(clickedButton==false)
  {
    //alert("No Enter Is False");
    return false; 
  }
  return !(window.event && window.event.keyCode == 13); 

}

function checkRadio(radioButton, astring)
{
    for(i=0;i<radioButton.length; i++)
    {
        if(radioButton[i].checked)
        {
            if(radioButton[i].value == astring)return true;
            return false;    
        }
    }
    return false;
}

function ifRadioIsFalseEnableOther(radioButton, other)
{
    for(i=0;i<radioButton.length; i++)
    {
        
        if(radioButton[i].checked)
        {
            if(radioButton[i].value == "False")
            {
                for(j=0;j<other.length; j++)
                {
                    other[j].disabled=false;
                }
            }
            else
            {
                for(j=0;j<other.length; j++)
                {
                    other[j].disabled=true;
                    other[j].checked=false;
                }
            }
        }
    }
}

function disableFeeExemptItems()
{

    if(document.app224FeeExemptionForm)
    {
        if ( ! document.app224FeeExemptionForm.feeExempt.checked)
        {   
//            document.app224FeeExemptionForm.exemptName.disabled = true;
//            document.app224FeeExemptionForm.exemptTitle.disabled = true;
 //           document.app224FeeExemptionForm.exemptMonth.disabled = true;
  //          document.app224FeeExemptionForm.exemptDay.disabled = true;
   //         document.app224FeeExemptionForm.exemptYear.disabled = true;
        }
        else
        {
//            document.app224FeeExemptionForm.ssn.disabled = true;
//            document.app224FeeExemptionForm.taxId.disabled = true;
        }
    }

}

function clearCC()
{               
    if(document.paymentCreditCardForm)
    {
        document.paymentCreditCardForm.creditCardNumber.value = "";
        document.paymentCreditCardForm.creditCardNumber.setAttribute('autocomplete','off');
    }
}

function disableBusinessActivityItems()
{
    if(document.app224BusinessActivityForm)
    {
        document.app224BusinessActivityForm.mlpDegree.disabled = true;
        document.app224BusinessActivityForm.practDegree.disabled = true;
        document.app224BusinessActivityForm.pharmType.disabled = true;
        for(i=0; i<document.app224BusinessActivityForm.activity.length; i++)
        {
            if(document.app224BusinessActivityForm.activity[i].checked == true)
            {
               if (document.app224BusinessActivityForm.activity[i].value == "Mid-Level-Practitioner")
               {   
                 document.app224BusinessActivityForm.mlpDegree.disabled = false;
               }
               else if (document.app224BusinessActivityForm.activity[i].value == "Practitioner")
               {
                 document.app224BusinessActivityForm.practDegree.disabled = false;
               }
               else if (document.app224BusinessActivityForm.activity[i].value == "Pharmacy")
               {
                 document.app224BusinessActivityForm.pharmType.disabled = false;
               }
               break;
            }
        }
    }
}

function disableStateLicenseItems()
{
    if(document.app224StateLicensesForm)
    {
        for(i=0; i<document.app224StateLicensesForm.optionState.length; i++)
        {
            if(document.app224StateLicensesForm.optionState[i].value == "Yes")
            {
               if (document.app224StateLicensesForm.optionState[i].checked == false)
               {   
                 document.app224StateLicensesForm.stateLicense.disabled = true;
               }
               break; 
            }
        }
        for(i=0; i<document.app224StateLicensesForm.optControlled.length; i++)
        {
            if(document.app224StateLicensesForm.optControlled[i].value == "Yes")
            {
               if (document.app224StateLicensesForm.optControlled[i].checked == false)
               {   
                 document.app224StateLicensesForm.controlledLicense.disabled = true;
               }
               break; 
            }
        }
    }
}
function disableStateLicenseItems(form)
{
    if(form)
    {
        for(i=0; i<form.optionState.length; i++)
        {
            if(form.optionState[i].value == "Yes")
            {
               if (form.optionState[i].checked == false)
               {   
                 form.stateLicense.disabled = true;
               }
               break; 
            }
        }
        if (form.optControlled)
        {  
            for(i=0; i<form.optControlled.length; i++)
            {
                if(form.optControlled[i].value == "Yes")
                {
                   if (form.optControlled[i].checked == false)
                   {   
                     form.controlledLicense.disabled = true;
                   }
                   break; 
                }
            }
        }
    }
}



function clearDashes(input)
{
    input.value=input.value.replace('-','');
}

function checkTextArea(area, maxlen, whereto)
{
    whereto.value = area.value.length;
}

// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
// -------------------------------------------------------------------
// TabNext()
// Function to auto-tab phone field
// Arguments:
//   obj :  The input object (this)
//   event: Either 'up' or 'down' depending on the keypress event
//   len  : Max length of field - tab when input reaches this length
//   next_field: input object to get focus after this one
// -------------------------------------------------------------------
var phone_field_length=0;
function TabNext(obj,event,len,next_field) 
{
	if (event == "down") 
        {
		phone_field_length=obj.value.length;
	}
	else if (event == "up" && phone_field_length != 0) 
        {
		if (obj.value.length != phone_field_length) 
                {
			phone_field_length=obj.value.length;
			if (phone_field_length == len) 
                        {
				next_field.focus();
			}
		}
	}
}


function newWin(url){
schedWin = window.open(url,'','width=850,height=560,resizable=yes,scrollbars=yes')
}

function schedWin()
{
   window.open('http://www.deadiversion.usdoj.gov/schedules/','scheds','width=850,height=560,resizable=yes,scrollbars=yes')
}
function chemWin()
{
   window.open('http://www.deadiversion.usdoj.gov/chem_prog/34chems.htm','scheds','width=850,height=560,resizable=yes,scrollbars=yes')
}

function computeNetWeight(form)
{
    if(form)
    {

        if (form.numContainers.value != "" &&
            form.containerWeight.value != "" )
        {
            form.netWeight.value = form.numContainers.value * form.containerWeight.value;
            form.grossWeight.value = form.numContainers.value * form.containerWeight.value;
        }
    }
}
function compareNetWeight(form)
{
    if(form)
    {
        if (form.netWeight.value != "" &&
            form.grossWeight.value != "" )
        {
            var netWeightNum = parseFloat(form.netWeight.value);
            var grossWeightNum = parseFloat(form.grossWeight.value);
            if (netWeightNum > grossWeightNum )
            {
                alert("Gross Weight: " + grossWeightNum + " should not be less than Net Weight: " + netWeightNum);
                return false;
            }
            return true;
        }
     }   
}

function submitForm(form, buttonToPress)
{
   if (form)
   {
        for(i=0; i<form.elements.length; i++)
        {
            
//           alert("Checking: " + form.elements[i].name + " == " + buttonToPress);
           if(form.elements[i].name == buttonToPress)
           {
//                alert("About to click: " + form.elements[i]);
                form.elements[i].click();
           }

        }
   }
}

function checkMailAddress(form)
{
    if(form)
    {
        if(form.mailAddressSame.checked == true)
        {
          form.mailtoAddress1.value = form.businessAddress1.value;
          form.mailtoAddress2.value = form.businessAddress2.value;
          form.mailtoAddress3.value = form.businessAddress3.value;
          form.mailtoCity.value = form.city.value;
          form.mailtoState.value = form.state.value;
          form.mailtoZip.value = form.zip.value;
          form.mailtoZip2.value = form.zip2.value;
          form.mailtoAddress1.disabled = true;
          form.mailtoAddress2.disabled = true;
          form.mailtoAddress3.disabled = true;
          form.mailtoCity.disabled = true;
          form.mailtoState.disabled = true;
          form.mailtoZip.disabled = true;
          form.mailtoZip2.disabled = true;
        }
        else
        {
          form.mailtoAddress1.disabled = false;             
          form.mailtoAddress2.disabled = false;
          form.mailtoAddress3.disabled = false;
          form.mailtoCity.disabled = false;
          form.mailtoState.disabled = false;
          form.mailtoZip.disabled = false;
          form.mailtoZip2.disabled = false;
        }
    }
}

function adjustBusActDisplay()
{
    showOrHideElement(document,"busAct224", "hideme");    
    showOrHideElement(document,"busAct225", "hideme");    
    showOrHideElement(document,"busAct510", "hideme");    
    showOrHideElement(document,"busAct363", "hideme");    
    setValue(document, 'busAct224',"");
    setValue(document, 'busAct225',"");
    setValue(document, 'busAct363',"");
    setValue(document, 'busAct510',"");
    var selectedAct = getRadioValue();
    
    if (selectedAct == "224")
    {
      showOrHideElement(document,"busAct224", "showme");    
    }
    else if(selectedAct == "225")
    {
      showOrHideElement(document,"busAct225", "showme");    
    }
    else if(selectedAct == "510")
    {
      showOrHideElement(document,"busAct510", "showme");    
    }
    else if(selectedAct == "363")
    {
      showOrHideElement(document,"busAct363", "showme");    
    }
}
function showOrHideElement(document, elementID, state)
{
  if (document.getElementById)
  {
    document.getElementById(elementID).className = state;   
  }
  else if (document.all)
  {
    document.all(elementID).className = state;
  }
}
function setValue(document, elementID, value)
{
  if (document.getElementById)
  {
    document.getElementById(elementID).value = value;   
  }
  else if (document.all)
  {
    document.all(elementID).value = value;
  }
}
function getRadioValue()
{
   var sel224 = getRadioValueHelper("selected224");
     if (sel224.length > 0 )return sel224;
   var sel225 = getRadioValueHelper("selected225");
     if (sel225.length > 0 )return sel225;
   var sel510 = getRadioValueHelper("selected510");
     if (sel510.length > 0 )return sel510;
   var sel363 = getRadioValueHelper("selected363");
     if (sel363.length > 0 )return sel363;

   return "";

}
function getRadioValueHelper(id)
{
  if (document.getElementById)
  {
    if (document.getElementById(id).checked)
      return document.getElementById(id).value
  }
  else if (document.all)
  {
    if (document.all(id).checked)
      return document.all(id).value;
  }
  return "";
}


function getItem(psId) {
  if (document.getElementById)
  {
//    alert("Getting by ID: " + psId);
    object1 = document.getElementById(psId);
//    alert("object: " + object1);
    return object1;
  }
  else
  {
    if (document.all)
    {
//       alert("Getting by all: " + psId);
      return document.all(psId);
    }
    else
    {
//      alert("Getting by []: " + psId);
      return document[psId];  
    }
  }
}
function viewDiv(psId, pbshow) {
  var theSelDivs = getItem(psId);
  if (theSelDivs != null)
    theSelDivs.style.visibility = pbshow ? 'inherit' : 'hidden';
}

function checkLastName(current, original) {


   if (original == null) return;
   
   if (current.value == original.value)
   {
     viewDiv("newDeanumberCheck",false);
   }
   else
   {
       showHelpMessageRegApps(30,10,helpMessages.newDeaNumber);
       viewDiv("newDeanumberCheck",true);
   }

}

function checkForExtraDetails()
{
 hideAdditionalInfoDiv();

if (getItem("busAct224").value == "A0")
  {
    alert ("You have selected Retail Pharmacy. Please see the additional text below your selection for more information.");
    paintDiv("additionalInfoDiv", '<P class="regularTextBold">Attention:<P class="regularText">Retail Pharmacy applicants should review important information by selecting the following link:            <P class="regularText"><a href="http://www.deadiversion.usdoj.gov/fed_regs/notices/2001/fr0427.htm" target="_blank">Federal Register Notice (Volume 66, Number 82)</a> <P class="regularText"><a href="http://www.deadiversion.usdoj.gov/pubs/manuals/pharm2/" target="_blank">Pharmacy Manual</a></P>');
  }

  if (getItem("busAct224").value == "B0")
  {
    alert ("Hospital/Clinic - This business activity is NOT for Individuals! - A physical location at which any combination of inpatient, outpatient, or emergency medical services are provided, based upon authority granted by the State in which it is located. This includes any school which provides medical services to human patients in the process of teaching medicine. This definition does not include individual practitioners, incorporated or otherwise, licensed to practice medicine in a State.");
    paintDiv("additionalInfoDiv", '<P><font class="regularTextBold">Hospital/Clinic - This business activity is NOT for Individuals! </font><font class="regularText">A physical location at which any combination of inpatient, outpatient, or emergency medical services are provided, based upon authority granted by the State in which it is located.  This includes any school which provides medical services to human patients in the process of teaching medicine.  This definition does not include individual practitioners, incorporated or otherwise, licensed to practice medicine in a State.</font></P>');
  }
  if (getItem("busAct224").value == "B2")
  {
    alert ("Hospital/Clinic - Military: This business activity is NOT for Individuals! - A physical location at which any combination of inpatient, outpatient, or emergency medical services are provided, based upon authority granted by the State in which it is located. This includes any school which provides medical services to human patients in the process of teaching medicine. This definition does not include individual practitioners, incorporated or otherwise, licensed to practice medicine in a State.");
    paintDiv("additionalInfoDiv", '<P><font class="regularTextBold">Hospital/Clinic - Military: This business activity is NOT for Individuals! </font><font class="regularText">A physical location at which any combination of inpatient, outpatient, or emergency medical services are provided, based upon authority granted by the State in which it is located.  This includes any school which provides medical services to human patients in the process of teaching medicine.  This definition does not include individual practitioners, incorporated or otherwise, licensed to practice medicine in a State.</font></P>');
  }
  if (getItem("busAct224").value == "D0")
  {
    alert ("Teaching Institution – This business activity is NOT for Individuals! - A physical location where inpatient, outpatient, or emergency medical services are not provided to human patients, but where medicine is taught under the authority of a State accredited college or university.  This definition does not include individual practitioners, incorporated or otherwise, licensed to practice medicine in a State.");
    paintDiv("additionalInfoDiv", '<P><font class="regularTextBold">Teaching Institution - This business activity is NOT for Individuals! </font><font class="regularText"> A physical location where inpatient, outpatient, or emergency medical services are not provided to human patients, but where medicine is taught under the authority of a State accredited college or university. This definition does not include individual practitioners, incorporated or otherwise, licensed to practice medicine in a State.</font></P>');
  }

}

function hideAdditionalInfoDiv()
{
   paintDiv("additionalInfoDiv", "");
}

function showDiv ( elemID )
{
var elem = getItem( elemID ) ;
//elem.style.position = 'relative' ;
//elem.style.left = '0px' ;
setVisible(elem);
return true ;
}

function hideDiv ( elemID )
{
var elem = getItem ( elemID ) ;
//elem.style.position = 'absolute' ;
//elem.style.left = '-4000px' ;
setHidden(elem);
return true ;
}

function setVisible(elem)
{
  vis = elem.style;
  vis.display='block';
}
function setHidden(elem)
{
  vis = elem.style;
  vis.display='none';
}




    