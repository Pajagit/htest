import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { getProjects } from "../../actions/projectActions";
import { getTestcases } from "../../actions/testcaseActions";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCount: this.props.pageCount,
      projectId: this.props.projectId,
      settings: this.props.settings,
      page: this.props.page
    };
    this.newPagePredefined = this.newPagePredefined.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {};

    if (nextProps.pageCount !== prevState.pageCount) {
      update.pageCount = nextProps.pageCount;
    }
    if (nextProps.projectId !== prevState.projectId) {
      update.projectId = nextProps.projectId;
    }

    if (nextProps.page !== prevState.page) {
      update.page = nextProps.page;
    }

    return Object.keys(update).length ? update : null;
  }
  newPage(e) {
    var page = 1;
    var currentPage = this.props.page;
    if (e === 0) {
      page = 1;
    } else if (e === 1) {
      page = currentPage - 1;
    } else if (e === 2) {
      if (!isNaN(this.props.pageCount)) {
        page = currentPage + 1;
      }
    } else if (e === 3) {
      page = parseInt(this.props.pageCount);
    }
    if (this.props.match.url === "/Projects") {
      this.props.getProjects(this.props.searchTerm, page);
    } else if (this.props.match.url === `/${this.state.projectId}/TestCases`) {
      this.props.getTestcases(this.state.projectId, this.props.settings.settings, page);
    }
  }
  newPagePredefined(e) {
    var page = 1;
    if (!isNaN(e.target.textContent)) {
      page = parseInt(e.target.textContent);
    }
    if (this.props.match.url === "/Projects") {
      this.props.getProjects(this.props.searchTerm, page);
    } else if (this.props.match.url === `/${this.state.projectId}/TestCases`) {
      this.props.getTestcases(this.state.projectId, this.props.settings.settings, page);
    }
  }

  render() {
    var currentPage = 1;
    var pageCount = 1;
    if (!isNaN(this.props.page)) {
      currentPage = parseInt(this.props.page);
    }
    if (!isNaN(this.state.pageCount)) {
      pageCount = parseInt(this.state.pageCount);
    }
    var backPageBtnClass = "";
    var forwardPageBtnClass = "";
    var firstPageBtnClass = "";
    var lastPageBtnClass = "";

    if (currentPage <= 1) {
      firstPageBtnClass = "disabled-page";
      backPageBtnClass = "disabled-page";
    }

    if (currentPage >= pageCount) {
      forwardPageBtnClass = "disabled-page";
      lastPageBtnClass = "disabled-page";
    }

    var counter = 1;
    var content = [];
    var totalPagesReturnedFromBe = this.state.pageCount;

    var calculatedNumberOfPagesThatCanBeShown = pageBtnWidth => {
      return Math.round(pageBtnWidth / 55) - 5;
    };

    var pagesToShowOneDirection = numberOfPagesThatCanBeShown => {
      return Math.round(numberOfPagesThatCanBeShown / 2);
    };

    var numberOfPagesThatCanBeShown = calculatedNumberOfPagesThatCanBeShown(this.props.width);

    if (numberOfPagesThatCanBeShown >= totalPagesReturnedFromBe) {
      numberOfPagesThatCanBeShown = totalPagesReturnedFromBe;
    }
    var firstPageToShow =
      currentPage - pagesToShowOneDirection(numberOfPagesThatCanBeShown) > 1
        ? currentPage - pagesToShowOneDirection(numberOfPagesThatCanBeShown)
        : 1;

    var lastPageToShow =
      currentPage + pagesToShowOneDirection(numberOfPagesThatCanBeShown) <= totalPagesReturnedFromBe
        ? currentPage + pagesToShowOneDirection(numberOfPagesThatCanBeShown)
        : totalPagesReturnedFromBe;
    if (lastPageToShow < numberOfPagesThatCanBeShown) {
      lastPageToShow = numberOfPagesThatCanBeShown;
    }
    console.log(`Can be shown: ${numberOfPagesThatCanBeShown}`);
    console.log(`FROM BE: ${totalPagesReturnedFromBe}`);
    console.log(`First page to show: ${firstPageToShow}`);
    console.log(`Current page: ${currentPage}`);
    console.log(`Last page to show: ${lastPageToShow}`);
    console.log(`Pages from current one direction ${pagesToShowOneDirection(numberOfPagesThatCanBeShown)}`);
    console.log(`-------------------------`);

    counter = firstPageToShow;
    var leftReduced = false;
    if (firstPageToShow > 1) {
      if (currentPage + pagesToShowOneDirection(numberOfPagesThatCanBeShown) >= totalPagesReturnedFromBe) {
        counter = totalPagesReturnedFromBe - numberOfPagesThatCanBeShown;
        if (counter < 0) {
          counter = 0;
        }
      } else {
        counter = firstPageToShow + 1;
      }
      content.push(
        <span key="first" className={`pagination-items--item disabled`}>
          ...
        </span>
      );
      leftReduced = true;
    }
    if (lastPageToShow <= totalPagesReturnedFromBe) {
      if (currentPage + pagesToShowOneDirection(numberOfPagesThatCanBeShown) >= totalPagesReturnedFromBe) {
        lastPageToShow = totalPagesReturnedFromBe;
      } else {
        lastPageToShow = counter + numberOfPagesThatCanBeShown - 1;
      }
    }
    if (leftReduced) {
      lastPageToShow = lastPageToShow - 1;
    }
    while (counter <= lastPageToShow) {
      content.push(
        <div
          key={counter}
          className={`pagination-items--item ${currentPage === counter ? "active-page" : ""}`}
          onClick={this.newPagePredefined}
        >
          {counter}
        </div>
      );
      counter++;
    }
    var lastPageThatCanBeShown = currentPage + pagesToShowOneDirection(numberOfPagesThatCanBeShown);

    if (lastPageThatCanBeShown < totalPagesReturnedFromBe && numberOfPagesThatCanBeShown < totalPagesReturnedFromBe) {
      content.push(
        <span key="last" className={`pagination-items--item disabled`}>
          ...
        </span>
      );
    }

    return (
      <div className="pagination">
        <div className="pagination-items">
          <div className={`pagination-items--item ${firstPageBtnClass}`} onClick={e => this.newPage(0)}>
            <i className="fas fa-backward"></i>
          </div>

          <div className={`pagination-items--item ${backPageBtnClass}`} onClick={e => this.newPage(1)}>
            <i className="fas fa-step-backward"></i>
          </div>
          {content}
          <div className={`pagination-items--item ${forwardPageBtnClass}`} onClick={e => this.newPage(2)}>
            <i className="fas fa-step-forward"></i>
          </div>
          <div className={`pagination-items--item ${lastPageBtnClass}`} onClick={e => this.newPage(3)}>
            <i className="fas fa-forward"></i>
          </div>
        </div>
      </div>
    );
  }
}
Pagination.propTypes = {
  testcases: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  testcases: state.testcases,
  settings: state.settings
});

export default connect(
  mapStateToProps,
  { getTestcases, getProjects }
)(withRouter(Pagination));
