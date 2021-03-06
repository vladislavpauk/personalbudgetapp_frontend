// React
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],
  can: function(entry, action) {
    return entry.getIn(['attributes', 'permissions', `can_${action}`]);
  },
  render: function() {
    return <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Kind</th>
          <th colSpan="3"></th>
        </tr>
      </thead>
      <tbody>
        {this.props.items.map(entry =>
          <tr key={entry.get('id')}>
            <td>{entry.getIn(['attributes', 'name'])}</td>
            <td>{entry.getIn(['attributes', 'kind'])}</td>
            <td>Show</td>
            <td>{this.can(entry, 'update') ? 'Edit' : null}</td>
            <td>{this.can(entry, 'destroy') ? 'Destroy' : null}</td>
          </tr>
        )}
      </tbody>
    </table>;
  }
});
