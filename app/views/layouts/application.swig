<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>{% block title %}Julia Pagano{% endblock %}</title>
	{{css('vendor')}}
	{{css('application')}}
</head>
 <body>
	 <div class="navbar-wrapper">
		 <div class="container">
			 <nav class="navbar navbar-inverse navbar-static-top">
				 <div class="container">
					 <div class="navbar-header">
						 <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
							 <span class="sr-only">Toggle navigation</span>
							 <span class="icon-bar"></span>
							 <span class="icon-bar"></span>
							 <span class="icon-bar"></span>
						 </button>
						 <a class="navbar-brand" href="#">Project name</a>
					 </div>
					 <div id="navbar" class="navbar-collapse collapse">
						 <ul class="nav navbar-nav">
							 {% for page in pages %}
							 <li {% if page == currentPage %}class="active"{% endif %}>
								 <a href="{{ page.path }}">{{ page.title }}</a>
							 </li>
							 {% endfor %}
						 </ul>
					 </div>
				 </div>
			 </nav>
		 </div>
	 </div>
	
	{%block page_heading %}{%endblock%}
	<div class="container {% block container_classes %}{%endblock%}">
		{% block container %}{%endblock%}
		<footer>
			<p class="pull-right"><a href="#">Back to top</a></p>
			<p>&copy; 2014 Company, Inc. &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
		</footer>
	</div>
	{{js('vendor')}}
	{{js('application')}}
  </body>
</html>