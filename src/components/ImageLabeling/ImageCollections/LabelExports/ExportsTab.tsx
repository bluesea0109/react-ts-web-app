import React, { Component } from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ImageLabelExportsTable from './ImageLabelExportsTable';
import { withRouter } from 'react-router-dom';

const styles = theme => ({

});

class ImageCollectionExportsTab extends Component {
  render() {
    return <ImageLabelExportsTable />;
  }
}

ImageCollectionExportsTab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  withStyles(styles)
)(ImageCollectionExportsTab);

