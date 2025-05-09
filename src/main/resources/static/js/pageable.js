class Pagination {
  constructor(
    totalPages, 
    currentPage, 
    templateURI,
    loadMoreId,
    spinnerId,
    productListId,
    pageSize,
    extraHeader = "",
    extraFooter = ""
  ) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.templateURI = templateURI;
    this.loadMoreId = loadMoreId;
    this.spinnerId = spinnerId;
    this.productListId = productListId;
    this.pageSize = pageSize;
    this.extraHeader = extraHeader;
    this.extraFooter = extraFooter;
  }

  loadResults(requestRoute) {
    document.getElementById(this.loadMoreId).style.display = "none";

    if (this.currentPage >= this.totalPages) {
      return;
    }

    document.getElementById(this.spinnerId).style.display = "block";
    

    Promise.all([
      fetch(this.templateURI).then((res) => res.text()),
      fetch(requestRoute + `?page=${this.currentPage++}&size=${this.pageSize}`, {
        method: "GET",
        credentials: "include"
      }).then((res) => res.json()),
    ])
      .then(([template, data]) => {
        let rendered = "";
        data["content"].forEach((item) => {
          rendered += Mustache.render(this.extraHeader + template + this.extraFooter, item);
        });

        this.totalPages = data["page"]["totalPages"];

        document
          .getElementById(this.productListId)
          .insertAdjacentHTML("beforeend", rendered);
        if (this.currentPage < this.totalPages) {
          document.getElementById(this.loadMoreId).style.display = "block";
        }
      }).catch ((error) => {
        console.error("Error loading data:", error);
        document.getElementById(this.loadMoreId).style.display = "block";
      })
      .finally(() => {
        document.getElementById(this.spinnerId).style.display = "none";
      }
    );
  }
}

let reviewsPagination = new Pagination(1, 0, "/templates/review_preview_template.html", "loadMoreReviews", "spinnerReviews", "reviewList", 4);
let ordersPagination = new Pagination(1, 0, "/templates/order_preview_template.html", "loadMoreOrders", "spinnerOrders", "orderList", 4);
let productsPagination = new Pagination(1, 0, "/templates/product_preview_template.html", "loadMoreProducts", "spinnerProducts", "productList", 4, '<div class="col-12 col-sm-6 col-md-4 col-lg-3">', '</div>');

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loadMoreReviews").onclick();
  document.getElementById("loadMoreOrders").onclick();
  document.getElementById("loadMoreProducts").onclick();
});