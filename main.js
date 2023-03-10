let slideIndex = 0;
let slideTimeoutID;
let carosuelTimer = 6000; // Change image every 6 seconds
let hoverFade = 300; // .3 seconds wait bnefore hover shown
carousel();

function prevSlide() {
  clearTimeout(slideTimeoutID);
  showSlide(slideIndex - 1);
  slideTimeoutID = setTimeout(carousel, carosuelTimer);
}

function nextSlide() {
  clearTimeout(slideTimeoutID);
  showSlide(slideIndex + 1);
  slideTimeoutID = setTimeout(carousel, carosuelTimer);
}

function carousel() {
  showSlide(slideIndex + 1);
  slideTimeoutID = setTimeout(carousel, carosuelTimer);
}

function showSlide(n) {
  let slides = document.getElementsByClassName("main-capsule");
  let thumbs = document.getElementsByClassName("carousel-thumbs")[0].children;
  for (i = 0; i < slides.length; i++) {
    slides[i].className = slides[i].className.replace(" focus", "");
  }
  for (i = 0; i < thumbs.length; i++) {
    thumbs[i].className = thumbs[i].className.replace(" focus", "");
  }

  slideIndex = n;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  } else if (slideIndex < 1) {
    slideIndex = slides.length;
  }

  slides[slideIndex - 1].className += " focus";
  thumbs[slideIndex - 1].className += " focus";
}

function changeMainImage(element, mainImageID) {
  let overlay = document.getElementById(`${mainImageID}-overlay`);
  let mainImage = document.getElementById(mainImageID);
  overlay.src = element.getElementsByTagName("img")[0].src;
  mainImage.style.opacity = 0;
  overlay.style.opacity = 1;
}

function resetMainImage(mainImageID) {
  let overlay = document.getElementById(`${mainImageID}-overlay`);
  let mainImage = document.getElementById(mainImageID);
  mainImage.style.opacity = 1;
  overlay.style.opacity = 0;
}

let globalHoverID;
let globalHoverContent = null;
let globalHover = document.getElementById(`global-hover`);
function showGlobalHover(hoveredElement, hoverTarget = null) {
  // To ensure the hover hide transition works correctly the hover content is kept track of,
  // and sent to display:none just before the  new hover contnet is to be displayed.
  if (globalHoverContent) {
    let pastHover = globalHoverContent;
    // In the css the hover element opacity transition is 300, so adding a timeout here will
    // ensure that the hover is hidden before its content is removed.
    setTimeout(() => {
      pastHover.style.display = "none";
      pastHover = null;
    }, 300);
  }

  if (hoveredElement.id == "main-capsule-container") {
    clearTimeout(slideTimeoutID);
    // slides dont have their own hover target becasue the hover event it triggered
    // on the high level container, so there is some special logic to select the corrent
    // hover content.
    globalHoverContent = document.getElementById("hover-app-slider-" + slideIndex);
  }

  if (hoverTarget != null) {
    globalHoverContent = globalHoverContent = document.getElementById(hoverTarget);
  }

  // this timeout simulates a 'hover for x seconds' effect
  globalHoverID = setTimeout(() => {
    if (globalHoverContent) {
      globalHoverContent.style.display = "block";
      globalHoverContent.style.opacity = 1;
    }
    let originalWindowHeight = window.document.documentElement.scrollHeight;
    let parentBoundingRect = hoveredElement.getBoundingClientRect();
    // calculate the necessary top and left to have the global-hover float direct next to the hovered element
    let hoverFloatTop = parentBoundingRect.top + window.pageYOffset - 12;
    let hoverFloatLeft = parentBoundingRect.left + window.pageXOffset + parentBoundingRect.width + -8;

    let hoverArrow = document.getElementById("hover-arrow");
    // 48px is how far down the hovered element we want the arrow to always display at.
    hoverArrow.style.top = "48px";

    globalHover.style.top = hoverFloatTop + "px";
    globalHover.style.left = hoverFloatLeft + "px";
    if (originalWindowHeight < window.document.documentElement.scrollHeight) {
      let topOffset = originalWindowHeight - window.document.documentElement.scrollHeight;
      globalHover.style.top = topOffset + hoverFloatTop + "px";
      // apply the reverse of the offset to the arrow so that it stays at the same place on the hovered element.
      hoverArrow.style.top = topOffset * -1 + 48 + "px";
    }
    globalHover.style.opacity = 1;
  }, hoverFade);
}

function hideGlobalHover(hoveredElement) {
  // todo: fix the hover transition that swaps the body content when
  // quickly hovering over a new item
  clearTimeout(globalHoverID);
  globalHoverContent.style.opacity = 0;
  globalHover.style.opacity = 0;
  if (hoveredElement.id == "main-capsule-container") {
    slideTimeoutID = setTimeout(carousel, carosuelTimer);
  }
}
