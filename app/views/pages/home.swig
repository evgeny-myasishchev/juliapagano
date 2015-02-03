{% extends '../layouts/application.swig' %}

{% block title %}{{currentPage.title}}{% endblock %}

{% block content %}
<p>{{currentPage.content}}</p>
{% endblock %}