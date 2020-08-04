/*******************************************************************************
 * 
 * Javascript code file!
 * 
 ******************************************************************************/
var num = 228;
var apiKey = "46184784e29f107cb3ca5e83142e01cc";

function writeContentId(data,Id) {
	document.getElementById(Id).innerHTML = data;
}

function date(num){
	var dateNow = new Date();
	var date = new Date(dateNow.getTime()+num*3600000)
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var day = date.getDate();
	var hour = date.getHours();
	var out = "";
	return out+year+"/"+month+"/"+day+" "+hour+".00";
}

function replaceDates(){
	for(var i=0;i<48;i++){
		writeContentId(date(i),i+1);
	}
}
function loadDropDown(url) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = onCompleteDropDown(xmlhttp);
	xmlhttp.open("GET", url, true);
	xmlhttp.send(null);
}

function onCompleteDropDown(event) {
	return function(){
		if (event.readyState == 4 && this.status == 200){
			writeDropDown(event.responseText);
		}else if(event.readyState == 4 && this.status != 200){
			writeContent("OOPS "+this.status.toString()+" ERROR <br>");
		}
	}	
}

function writeDropDown(data){
	out="<form method='post' action='formResults.jsp'><label for='stops'>Choose a Stop:</label><select name=stops id='stops>";
	var json =JSON.parse(data);
	var i;
	for(i=0;i<json.length;i++){
		var deviceName = json[i]["device_Name"].split("-");
		if (deviceName.length==3){
			deviceName = deviceName[2]+"-"+deviceName[1];
		}else{
			deviceName = deviceName[0];
		}
		//writeContent(json[0]["Path_destination_device_id"]);
		var deviceLat =json[i]["lat"];
		var deviceLon =json[i]["lon"];
		out+="<option value='lat="+deviceLat+"&lon="+deviceLon+"'>"+deviceName+"</option>";
	}
	out+="</select><br><br><input type='submit' value='Submit'></form>";
	writeContent(out);
}

function loadDoc(url) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = onComplete(xmlhttp);
	xmlhttp.open("GET", url, true);
	xmlhttp.send(null);
}

function onComplete(event) {
	return function(){
		if (xmlhttp.readyState == 4)
			writeContentGeneral(xmlhttp.responseText);
	}	
}

function writeContentGeneral(data) {
	document.getElementById("general").innerHTML = data;
}

function swap(url) {
	loadDoc(url);
}


function loadDocWeather(url3, num) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = onCompleteWeather(xmlhttp, num);
	xmlhttp.open("GET", url3, true);
	xmlhttp.send(null);
}


function onCompleteWeather(event, num) {
	return function(){
		if (event.readyState == 4 && this.status == 200){
			saveWeatherContent(event.responseText, num);
		}else if(event.readyState == 4 && this.status != 200){
			writeContent("OOPS "+this.status.toString()+" ERROR <br>");
		}
	}
}


function saveWeatherContent(data, num){
	var json = JSON.parse(data);
	var dictWeather = JSON.parse(localStorage.getItem("Weather"));
	dictWeather[num] = json["weather"][0]["main"];
	localStorage.setItem("Weather",JSON.stringify(dictWeather));
	var temp = parseInt(localStorage.getItem("temp"))-1;
	if(temp==0){
		writeContent("Ready to Go<br>");
		createTable();
	}
	localStorage.setItem("temp",temp);
} 

function loadDocPaths(url1,url3) { 
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = onCompletePaths(xmlhttp,url3);
	xmlhttp.open("GET", url1, true);
	xmlhttp.send(null);
}

function onCompletePaths(event, url3) {
	return function(){
		if (event.readyState == 4 && this.status == 200){
			writeContent("Got Data P <br>");
			savePathContent(event.responseText, url3);
		}else if(event.readyState == 4 && this.status != 200){
			writeContent("OOPS "+this.status.toString()+" ERROR <br>");
		}
	}
}

function savePathContent(data,url3){
	var json =JSON.parse(data);
	writeContent("Im in Paths <br>");
	var count = 0;
	var i;
	var dictPaths = {};
	for(i=0;i<num;i++){
		writeContent("Got Datal "+i.toString()+"<br>");
		var pathName = json[i]["Path_Name"];
		//writeContent(json[0]["Path_destination_device_id"]);
		var pathOrigin =json[i]["Path_origin_device_id"];
		var pathDest =json[i]["Path_destination_device_id"];
		if(pathOrigin in dictPaths){
			dictPaths[pathOrigin].push([pathName,pathDest]);
		}else{
			count += 1;
			dictPaths[pathOrigin] = [[pathName,pathDest]];
		}
	}
	localStorage.setItem("Paths",JSON.stringify(dictPaths));
	var dictDevices = JSON.parse(localStorage.getItem("Devices"));
	writeContent("Please Wait<br/>Loading...");
	localStorage.setItem("temp",count);
	localStorage.setItem("Weather","{}");
	for(var key in dictPaths){
		var lat = dictDevices[key][0];
		var lon = dictDevices[key][1];
		loadDocWeather(url3+"lat="+lat+"&lon="+lon+"&appid="+apiKey,key);
	}
}

function loadDocDevices(url2,url1,url3) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = onCompleteDevices(xmlhttp,url1,url3);
	xmlhttp.open("GET", url2, true);
	xmlhttp.send(null);
}

function onCompleteDevices(event, url1, url3) {
	return function(){
		if (event.readyState == 4 && this.status == 200){
			writeContent("Got Data <br>");
			saveDeviceContent(event.responseText,url1,url3);
		}else if(event.readyState == 4 && this.status != 200){
			writeContent("OOPS "+this.status+" ERRORΡ <br>");
		}
	}
}

function saveDeviceContent(data,url1,url3){
	var json =JSON.parse(data);
	var i;
	var dictDevices = {};
	for(i=0;i<json.length;i++){
		writeContent("Got Data "+i.toString()+"<br>");
		var deviceId = json[i]["device_id"];
		var deviceName = json[i]["device_Name"].split("-");
		if (deviceName.length==3){
			deviceName = deviceName[2]+"-"+deviceName[1];
		}else{
			deviceName = deviceName[0];
		}
		//writeContent(json[0]["Path_destination_device_id"]);
		var deviceLat =json[i]["lat"];
		var deviceLon =json[i]["lon"];
		dictDevices[deviceId]=[deviceLat,deviceLon,deviceName];
	}
	localStorage.setItem("Devices",JSON.stringify(dictDevices));
	writeContent("Please Wait<br/>Loading..");
	loadDocPaths(url1,url3);
}

function createTable(){
	var dictPaths = JSON.parse(localStorage.getItem("Paths"));
	var dictDevices = JSON.parse(localStorage.getItem("Devices"));
	var dictWeather = JSON.parse(localStorage.getItem("Weather"));
	//writeContent(localStorage.getItem("Paths")+"<br>"+localStorage.getItem("Devices"));
	var out="Enter an Origin:<input type='text' id='myInput' onkeyup='filter()' placeholder='...'><br><br><table id='stopsTable'> <tr><th>Origin</th><th>Paths</th><th>Weather</th></tr>";
	for(var key in dictPaths){
		if(dictWeather[key]!="Rain"){
			out+="<tr><td>"+dictDevices[key][2]+"</td><td>"
			var i;
			for(i=0; i<dictPaths[key].length; i++){
				out += dictDevices[dictPaths[key][i][1]][2];
				if(i!=dictPaths[key].length-1){
					out+="/"
				}
			}
		out += "</td><td>"+dictWeather[key]+"<td></tr>";
		}
	}

	out += "</table>"
	document.getElementById("content").innerHTML = out;
}

function writeContent(data) {
	document.getElementById("content").innerHTML = data;
}

function asyncLoadContent(url1,url2,url3) {
	writeContent("Please Wait<br/>Loading.");
	localStorage.removeItem("Devices");
	localStorage.removeItem("Paths");
	localStorage.removeItem("Weather");
	localStorage.removeItem("temp");
	loadDocDevices(url2,url1,url3);
}

function filter() {
	  var input, filter, table, tr, td, i, txtValue;
	  input = document.getElementById("myInput");
	  filter = input.value.toUpperCase();
	  table = document.getElementById("stopsTable");
	  tr = table.getElementsByTagName("tr");

	  for (i = 0; i < tr.length; i++) {
	    td = tr[i].getElementsByTagName("td")[0];
	    if (td) {
	      txtValue = td.textContent || td.innerText;
	      if (txtValue.toUpperCase().indexOf(filter) > -1) {
	        tr[i].style.display = "";
	      } else {
	        tr[i].style.display = "none";
	      }
	    }
	  }
	}