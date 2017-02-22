<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>
      {% block title %}
        {% if currentPage %}
          {{currentPage.title}} - {{contentConfig.siteTitle}}
        {% else %}
          {{contentConfig.siteTitle}}
        {% endif %}
      {% endblock %}
    </title>
    <script src="https://use.fontawesome.com/f8487f88dd.js"></script>
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
                  <li {% if page.id == currentPage.id %} class="active" {% endif %}>
                    <a href="{{ page.path }}" {% if page.external %} title="{{page.externalHint}}" {% endif %}>
                      {{ page.title }}
                      <small>{% if page.external %}<i class="glyphicon glyphicon-new-window"></i>{% endif %}</small>
                    </a>
                  </li>
                {% endfor %}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div class="container {% block container_classes %}{%endblock%}">
    {% block container %}<h2>{{currentPage.title}} - Under Construction</h2>{%endblock%}
      <footer class='footer'>
        <p>&copy; Julia Pagano {{dateTime.getFullYear()}}</p>
      </footer>
    </div>
    {{js('vendor')}}
    {{js('application')}}
    {% block bottomScripts %}{%endblock%}
    {% if goggleAnalytics.enabled %}
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', '{{goggleAnalytics.trackingId}}', 'auto');
        ga('send', 'pageview');

      </script>
    {% endif %}
  </body>
</html>
