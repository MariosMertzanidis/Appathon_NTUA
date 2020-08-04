<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
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
<h1>Please select a stop</h1>
<div id='content'>
<br>
Data Loading ...
</div>
<script>loadDropDown("http://feed.opendata.imet.gr:23577/itravel/devices.json");</script>
</div>
</div>
</body>
</html>

