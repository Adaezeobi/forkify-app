class Searchview {
  #parentEl = document.querySelector('.search');
  getQuery() {
    const query =
      /*this.#parentEl*/ document.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  #clearInput() {
    document.querySelector('.search__field').value = '';
  }

  //in the views you listen for events like button press but you handle the
  //event in the controller thats why you have this add handler search
  //function
  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new Searchview();
