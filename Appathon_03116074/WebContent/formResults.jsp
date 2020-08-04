<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@ page import="java.net.*"
		import="java.io.*"
 %>
<%
	String urlbegin="https://api.openweathermap.org/data/2.5/onecall?";
	String urlmiddle=request.getParameter("stops");
	String urlend="&exclude=current,minutely,daily&appid=46184784e29f107cb3ca5e83142e01cc";
	String url= urlbegin+urlmiddle+urlend;
%>
<html>
<head>
<title>Appathon</title>
<link rel=StyleSheet href="style.css" type="text/css" />
<script src="extract.js" type="text/javascript"></script>
</head>
<body>
<div id=general>
<div class="topnav">
  <a href="index.html">Home</a>
  <a onclick="swap('tool.html')">Tool</a>
  <a class="active" href='form.jsp'>Form</a>
  <a onclick="swap('aboutUs.html')">About Us</a>
</div> 
<div>
<h1>Forecasts</h1>
<script>date(0)</script>
<div id='content'>
<%
	URL oracle = new URL(url);
	HttpURLConnection yc = (HttpURLConnection)oracle.openConnection();
	if(yc.getResponseCode()!=200){
		%>
		OOPS <%=yc.getResponseCode() %> ERROR
		<%
	}else{
		BufferedReader in = new BufferedReader(new InputStreamReader(yc.getInputStream()));
		String outprint=in.readLine();
		String[] strArr = outprint.split("\"main\":");
		%><table id='forecastsTable'> <tr><th>Date</th><th>Forecast</th></tr> <%
		for(int i=1; i<strArr.length;i++){
			String temp = strArr[i].split(",")[0];
			%><tr><td id="<%=i%>"><%=i%></td><td><%=temp%></td></tr><%
			
		}
		%><% } %>
		</table>
		<script>replaceDates()</script>
</div>
</div>
</div>
</body>
</html>