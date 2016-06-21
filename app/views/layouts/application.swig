<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>
		{% block title %}
			{% if currentPage %}
				{{currentPage.name}} - {{contentConfig.siteTitle}}
			{% else %}
				{{contentConfig.siteTitle}}
			{% endif %}
		{% endblock %}
		</title>
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
						</div>
						<div id="navbar" class="navbar-collapse collapse">
							<ul class="nav navbar-nav">
								{% for page in pages %}
									<li {% if page == currentPage %} class="active" {% endif %}>
										<a href="{{ page.path }}">{{ page.name }}</a>
									</li>
								{% endfor %}
							</ul>
						</div>
					</div>
				</nav>
			</div>
		</div>

		<div class="container {% block container_classes %}{%endblock%}">
			{% block container %}<h2>{{currentPage.name}} - Under Construction</h2>{%endblock%}
				<footer class='footer'>
					<p>&copy; Julia Pagano 2016</p>
				</footer>
			</div>
			{{js('vendor')}}
			{{js('application')}}
			{% block bottomScripts %}{%endblock%}
		</body>
	</html>
