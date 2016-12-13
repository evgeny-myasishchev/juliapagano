{% extends '../layouts/application.swig' %}
{% block container %}
  <h1 class='page-header'>{{currentPage.title}}</h1>
  {% for kindWord in currentPage.blocks() %}
  <blockquote>
    <p>{{kindWord.text}}</p>
    <footer><cite>{{kindWord.name}}</cite></footer>
  </blockquote>
  {% endfor %}
{% endblock %}
