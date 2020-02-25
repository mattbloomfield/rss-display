// const RSS_URL = `https://codepen.io/picks/feed/`;

const init = () => {
  getFeed();
  const slideInterval = setInterval(() => {
    rearrangeSlides();
  }, 10500);
  const feedInterval = setInterval(() => {
    getFeed();
  }, 1000 * 60 * 60);
}

function getFeed() {
  const RSS_URL = `http://localhost:2482`;
  $.ajax(RSS_URL, {
    dataType: "json",
    success: function (data) {
      $('#App').html('');
      data.items.forEach(item => {
        renderSlide(item);
      });
    }
  });
}

function rearrangeSlides() {
  console.log('rearranging...');
  $('#App').append($('.slide:first-child'));
};

function renderSlide(item) {
  const template = buildTemplate(item);
  replaceContent(template);
}

function buildTemplate(item) {
  console.log('item', item);
  let template = `
          <article class="slide" >
          `
  if (item.media && item.media.thumbnail.length) {
    template += `<div class="background-image" data-img-url="${item.media.thumbnail[0].url[0]}"></div>`;
  } else {
    template += `<div class="background-image generic-background-image"></div>`;
  }
  template += `<div class="text-overlay">  
              <h1>${item.title}</h1>
              <p class="desc">${item.description}
              <p class="date">${moment(item.pubDate).fromNow()}
            </div>
          </article>
        `;
  return template;
}

function replaceContent(template) {
  $('#App').append(template);
  $('.background-image').each(function (index, el) {
    el.style.backgroundImage = `url('${el.getAttribute('data-img-url')}')`;
  });
}

init();