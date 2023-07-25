(function () {
  // Available demos.
  var DEMOS = {
    Attraction: AttractionDemo,
  };

  var list;
  var demo;
  var items;
  var playing;
  var demoName;
  var renderer;
  var container;

  var $renderer;

  // Initialises the testbed and starts the default demo.
  function init() {
    items = {};
    list = $("#demo-select");
    playing = true;
    renderer = "WebGLRenderer";
    container = $("#container");
    $renderer = $("#renderer-select a");

    var item;

    for (var name in DEMOS) {
      item = $('<a href="#"/>')
        .click(generateClick(name))
        .data("demo", name)
        .text(name);

      items[name] = item;
      list.append(item);
    }

    $renderer.click(onRendererSelected);
    $(window).bind("keydown", onKeyDown);

    // Set default demo and start updating.
    setDemo("Attraction");
    update();

    // Highlight current renderer.
    $renderer.each(function (index, el) {
      var $el = $(el);
      var type = self[$el.data("renderer")];
      if (demo.renderer instanceof type) {
        $el.addClass("active");
      }
    });
  }

  // Generates a click handler.
  function generateClick(name) {
    return function () {
      setDemo(name);
      return false;
    };
  }

  // Updates current demo.
  function update() {
    requestAnimationFrame(update);

    if (playing && demo) {
      demo.step();
    }
  }

  // Sets the current demo.
  function setDemo(name) {
    demoName = name;

    // Kill any running demo.
    if (demo) {
      demo.destroy();
      demo = null;
    }

    // Initialise new demo.
    demo = new DEMOS[name]();
    demo.init(container.get(0), new self[renderer]());

    // Activate / deactivate links.
    for (var id in items) {
      if (id === name) {
        items[id].addClass("active");
      } else {
        items[id].removeClass("active");
      }
    }

    // Provide access from console for debugging.
    self.__demo = demo;
  }

  function onRendererSelected(event) {
    var $selected = $(event.currentTarget);

    renderer = $selected.data("renderer");
    setDemo(demoName);

    $renderer.removeClass("active");
    $selected.addClass("active");

    return false;
  }

  function onKeyDown(event) {
    if (event.which === 32) {
      event.preventDefault();

      playing = !playing;

      if (playing && demo) {
        demo.physics._clock = new Date().getTime();
      }
    }
  }

  init();
})();
