// $(document).ready(function () {
  const pageElement = document.getElementById('page');
  const pagePrevious = parseInt(pageElement.textContent) - 1;
  const previous = document.getElementsByClassName('previous');

  if (pagePrevious === 0) {
    for (let i = 0; i < previous.length; i++) {
      previous[i].classList.add('disabled');
    }
  }

// });

