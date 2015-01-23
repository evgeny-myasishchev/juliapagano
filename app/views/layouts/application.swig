<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{% block title %}My Site{% endblock %}</title>
  
  {{js('application.js')}}
  {{js('vendor.js')}}
</head>
<body>
  {% block content %}{% endblock %}
</body>