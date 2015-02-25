{% extends '../layouts/application.swig' %}

{% block title %}{{currentPage.title}}{% endblock %}
{% block container_classes %}marketing{% endblock %}
{% block container %}
<div class="jumbotron">
	<h1>Children and family photographer</h1>
	<p>I am Julia, I am a mum and a child photographer based in <a href='https://goo.gl/maps/8KZv6'><strong>St Andrews, Scotland</strong></a>. Thanks for stopping by.</p>
	<div data-ride="carousel"  class="carousel slide" id="home-screen-carousel">
		<ol class="carousel-indicators">
			<li data-target="#home-screen-carousel" data-slide-to="0" class="active"></li>
			<li data-target="#home-screen-carousel" data-slide-to="1"></li>
			<li data-target="#home-screen-carousel" data-slide-to="2"></li>
		</ol>
		<div role="listbox" class="carousel-inner">
			<div class="item active">
				<img src="https://lh5.googleusercontent.com/-VVhnisa87Rg/VMEuMkoayHI/AAAAAAAAAFU/FmdTYG1SmiE/w1818-h1416-no/IMG_6750.jpg">
			</div>
			<div class="item">
				<img src="https://lh3.googleusercontent.com/-TTgLZBJXGjI/VMD_dZrd91I/AAAAAAAAAAw/DolugwQ7K8s/w2124-h1416-no/242.JPG">
			</div>
			<div class="item">
				<img src="https://lh3.googleusercontent.com/-Nla6pryxadg/VMYTlaeGHOI/AAAAAAAAAO0/5hkStXXVLbk/w1984-h1416-no/IMG_9453.jpg">
			</div>
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
	<div class="col-md-4">
		<h2>Portrait session - <sup>£</sup> <strong>20</strong></h2>
		<p>What is included: pre-session consultation, 30 min shoot at your home or location of your choice, editing your images and providing private online gallery with 10-15 portraits to chose from.</p>
		<p><a role="button" href="#" class="btn btn-primary">View samples &raquo;</a></p>
	</div>
	<div class="col-md-4">
		<h2>Lifestyle session - <sup>£</sup> <strong>50</strong></h2>
		<p>What is included: pre-session consultation, 2 hour shoot at your home or location of your choice, editing your images and providing private online gallery with 30-50 pictures to chose from.</p>
		<p><a role="button" href="#" class="btn btn-primary">View samples &raquo;</a></p>
	</div>
	<div class="col-md-4">
		<h2>Additional services</h2>
		<p>Prints prices - from £5, digital images from £10, digital collections from £50.</p>
		<p>I also make story boards and photo books.</p>
		<p><a role="button" href="#" class="btn btn-primary">View samples &raquo;</a></p>
	</div>
</div>

{% endblock %}