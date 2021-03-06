import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { fetchRecruitmentRequest, changeActiveItemRequest, filterRecruitment, sortRecruitment } from '../../actions/recruitment';
import Recruitment from '../../components/Recruitment';
import Loader from '../../components/Loader';
import { getVisibleRecruitment } from '../../selectors/recruitment';

const RecruitmentPage = ({ isFetching, activeItem, changeActiveItem, data, onSearchChange, sortKey, sortByKey, direction }) => {
  const handleSort = (key) => {
    if (sortKey !== key) {
      sortByKey(key, 'ascending');
    }
    else {
      sortByKey(key, direction === 'ascending' ? 'descending' : 'ascending');
    }
  };
  return (
    <div>
      {isFetching ? <Loader /> : <Recruitment
        activeItem={activeItem}
        changeActiveItem={changeActiveItem}
        data={data}
        onSearchChange={onSearchChange}
        sortKey={sortKey}
        direction={direction}
        handleSort={handleSort}
      />
      }
    </div>
  );
};

RecruitmentPage.defaultProps = {
  isFetching: true,
  activeItem: 'all',
  data: [],
};

RecruitmentPage.propTypes = {
  isFetching: PropTypes.bool,
  activeItem: PropTypes.string,
  changeActiveItem: PropTypes.func.isRequired,
  data: PropTypes.array,
  onSearchChange: PropTypes.func.isRequired,
  sortKey: PropTypes.string.isRequired,
  sortByKey: PropTypes.func.isRequired,
  direction: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  isFetching: state.recruitment.isFetching,
  activeItem: state.recruitment.activeItem,
  tableHeader: state.recruitment.tableHeader,
  data: getVisibleRecruitment(state),
  sortKey: state.recruitment.sortKey,
  direction: state.recruitment.direction,
});

const mapDispatchToProps = dispatch => ({
  fetchRecruitment: () => dispatch(fetchRecruitmentRequest()),
  changeActiveItem: activeItem => dispatch(changeActiveItemRequest(activeItem)),
  onSearchChange: e => dispatch(filterRecruitment(e.target.value)),
  sortByKey: (key, direction) => dispatch(sortRecruitment(key, direction)),
});

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      const { fetchRecruitment } = this.props;
      fetchRecruitment();
    }
  })
);

export default enhance(RecruitmentPage);
