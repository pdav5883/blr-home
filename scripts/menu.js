$(document).ready(function() {

  // Variables
  var $nav = $('.navbar'),
      $popoverLink = $('[data-popover]'),
      $document = $(document)

  function init() {
    $popoverLink.on('click', openPopover)
    $document.on('click', closePopover)
  }

  function openPopover(e) {
    e.preventDefault()
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open')
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if($('.popover.open').length > 0) {
      $('.popover').removeClass('open')
    }
  }

  init();
});

var navmenu =
'<ul class="navbar-list">' +
  '<li class="navbar-item"><a class="navbar-link" href="/">Home</a></li>' +
  '<li class="navbar-item">' +
    '<a class="navbar-link" href="#" data-popover="#projectsPopover">Projects</a>' +
    '<div id="projectsPopover" class="popover">' +
      '<ul class="popover-list">' +
        '<li class="popover-item">' +
          '<a class="popover-link" href="https://sats.bearloves.rocks">sat-finder</a>' +
        '</li>' +
        '<li class="popover-item">' +
          '<a class="popover-link" href="https://salad.bearloves.rocks">web-salad</a>' +
        '</li>' +
        '<li class="popover-item">' +
          '<a class="popover-link" href="https://bowls.bearloves.rocks">bowl-pickem</a>' +
        '</li>' +
        '<li class="popover-item">' +
          '<a class="popover-link" href="https://budget.bearloves.rocks">budget-tracker</a>' +
        '</li>' +
        '<li class="popover-item">' +
          '<a class="popover-link" href="/blog.html">Blog</a>' +
        '</li>' +
      '</ul>' +
    '</div>' +
  '</li>' +
  '<li class="navbar-item">' +
    '<a class="navbar-link" href="#" data-popover="#aboutPopover">About</a>' +
    '<div id="aboutPopover" class="popover">' +
      '<ul class="popover-list">' +
        '<li class="popover-item">' +
          '<a class="popover-link" href="/name.html">The Name</a>' +
        '</li>' +
        '<li class="popover-item">' +
          '<a class="popover-link" href="/projects.html">The Projects</a>' +
        '</li>' +
        '<li class="popover-item">' +
          '<a class="popover-link" href="/author.html">The Author</a>' +
        '</li>' +
      '</ul>' +
    '</div>' +
  '</li>' +
'</ul>';
