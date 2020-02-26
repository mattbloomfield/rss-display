
const slideRotationInterval = 1000 * 10;
const dataRefreshInterval = 1000 * 60 * 60;

const init = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get('feed');
  await getFeed(source);
  setInterval(() => {
    rearrangeSlides();
  }, slideRotationInterval);
  setInterval(() => {
    getFeed(source);
  }, dataRefreshInterval);
}

function getFeed(source) {
  return new Promise((resolve, reject) => {
    const rssUrl = `/api/?feed=${source}`;
    $.ajax(rssUrl, {
      dataType: "json",
      success: function (data) {
        $('#App').html('');
        data.items.forEach(item => {
          renderSlide(item);
        });
        resolve();
      },
      error: () => {
        reject();
      }
    });
  });
}

function rearrangeSlides() {
  $('.slide:last-child').fadeOut();
  window.setTimeout(() => {
    $('#App').prepend($('.slide:last-child'));
    $('.slide:first-child').show();
  }, slideRotationInterval / 2);
};

function renderSlide(item) {
  const template = buildTemplate(item);
  replaceContent(template);
}

function buildTemplate(item) {
  console.log('item', item);
  let template = `
          <article class="slide" >
            <div class="background-image" data-img-url="${item.metadata.image}"></div>
              <div class="text-overlay">  
              <h1>${item.title}</h1>
              <p class="desc">${item.metadata.description}</p>
              <p class="date">${moment(item.pubDate).fromNow()}</p>
              <p class="source">Source: ${item.metadata.publisher || source}</p>
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