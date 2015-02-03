{% extends '../layouts/application.swig' %}

{% block title %}{{currentPage.title}}{% endblock %}

{% block container %}
<div class='row'>{{currentPage.title}}</div>
{% endblock %}