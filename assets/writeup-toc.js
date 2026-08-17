// Builds the "On this page" sidebar of a CTF writeup from its own headings,
// and highlights the section currently in view.
//
// Expects the markup convention used by _writeups/: `##` for a challenge
// category, `###` for a challenge. Kramdown gives every heading an id, which
// is what the sidebar links to.
//
// Progressive enhancement: the sidebar starts hidden and is only revealed once
// it has been filled in.

(function () {
  "use strict";

  var article = document.querySelector("[data-toc-source]");
  var sidebar = document.querySelector("[data-toc]");
  if (!article || !sidebar) return;

  var headings = article.querySelectorAll("h2[id], h3[id]");
  if (!headings.length) return;

  var links = {}; // heading id -> its link in the sidebar
  var categoryOf = {}; // challenge id -> the id of the category it sits under
  var currentCategory = null;
  var currentSublist = null;

  var list = document.createElement("ul");

  Array.prototype.forEach.call(headings, function (heading) {
    var item = document.createElement("li");
    var link = document.createElement("a");

    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    item.appendChild(link);
    links[heading.id] = link;

    if (heading.tagName === "H2") {
      item.className = "toc__category";
      list.appendChild(item);

      // Challenges found from here on are nested under this category
      currentCategory = heading.id;
      currentSublist = document.createElement("ul");
      item.appendChild(currentSublist);
    } else if (currentSublist) {
      item.className = "toc__challenge";
      categoryOf[heading.id] = currentCategory;
      currentSublist.appendChild(item);
    } else {
      // A challenge before any category heading; keep it at the top level
      item.className = "toc__challenge";
      list.appendChild(item);
    }
  });

  sidebar.querySelector(".toc__nav").appendChild(list);
  sidebar.hidden = false;

  // Below $tocBreakpoint the list is a popover opened by a floating button.
  // On wider screens the button is hidden and `is-open` has no effect.
  var toggle = sidebar.querySelector("[data-toc-toggle]");
  if (toggle) {
    setUpPopover(toggle);
  }

  function setUpPopover(button) {
    function setOpen(open) {
      sidebar.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    }

    button.addEventListener("click", function () {
      setOpen(!sidebar.classList.contains("is-open"));
    });

    // Dismiss on tap outside, including on the backdrop — which is a pseudo
    // element of the sidebar, so it reports the sidebar itself as the target.
    document.addEventListener("click", function (event) {
      if (!sidebar.contains(event.target) || event.target === sidebar) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
        setOpen(false);
        button.focus();
      }
    });

    // Closing on link tap gets the popover out of the way once navigated.
    list.addEventListener("click", function (event) {
      if (event.target.tagName === "A") setOpen(false);
    });
  }

  // Highlight the heading nearest the top of the viewport, plus its category.
  if (!("IntersectionObserver" in window)) return;

  function setActive(id) {
    Object.keys(links).forEach(function (key) {
      links[key].classList.remove("is-active");
    });

    if (!links[id]) return;
    links[id].classList.add("is-active");

    var category = categoryOf[id];
    if (category && links[category]) {
      links[category].classList.add("is-active");
    }
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    // Only count a heading as current once it reaches the top quarter of the screen
    { rootMargin: "0px 0px -75% 0px" }
  );

  Array.prototype.forEach.call(headings, function (heading) {
    observer.observe(heading);
  });
})();
