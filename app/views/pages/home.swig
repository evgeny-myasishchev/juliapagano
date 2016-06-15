{% extends '../layouts/application.swig' %}

{% block title %}{{contentConfig.siteTitle}}{% endblock %}
{% block container_classes %}marketing{% endblock %}
{% block container %}
<div class="jumbotron">
	<h1>
		Julia Pagano Photography
		<small id='slogan'>Real moments. Priceless memories.</small>
	</h1>
	<div data-ride="carousel"  class="carousel slide" id="home-screen-carousel">
		<ol class="carousel-indicators">
			{% for photo in carouselPhotoset.items %}
			<li data-target="#home-screen-carousel" data-slide-to="{{ loop.index }}" class="{% if loop.first %}active{% endif %}"></li>
			{% endfor %}
		</ol>
		<div role="listbox" class="carousel-inner">
			{% for photo in carouselPhotoset.items %}
			<div class="item {% if loop.first %}active{% endif %}">
					<img src="{{photo.sizes['Large'].source}}" alt="{{photo.title}}">
				</div>
			{% endfor %}
		</div>
		<a class="left carousel-control" href="#home-screen-carousel" role="button" data-slide="prev">
			<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
			<span class="sr-only">Previous</span>
		</a>
		<a class="right carousel-control" href="#home-screen-carousel" role="button" data-slide="next">
			<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
			<span class="sr-only">Next</span>
		</a>
	</div>
</div>

<div class="row">
	<div class="col-sm-6">
	<p>Hello! I am Julia.</p>
	<p>I am lifestyle portrait photographer specializing on children and family photography. I am based in  <a href='https://goo.gl/maps/8KZv6'>St Andrews, Fife</a>. Take a look <a href='/portfolio'>around</a> to see more of my work, and if it feels right - <a href="/contacts">do get in touch</a>. I'd be happy to capture your family, children and special moments for you to remember.</p>
	</div>
</div>

{% endblock %}
