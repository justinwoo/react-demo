/** @jsx React.DOM */
var ShowRow = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.props.title}</td>
        <td>
          <button id="editShow{this.props.id}Button" className="btn btn-default btn-sm">
            <span className="glyphicon glyphicon-pencil"></span>変更
          </button>
        </td>
        <td>{this.props.episode}</td>
        <td>
          <div className="btn-group">
            <button className="btn btn-default btn-sm">
              <span className="glyphicon glyphicon-plus"></span>
            </button>
            <button className="btn btn-default btn-sm">
              <span className="glyphicon glyphicon-minus"></span>
            </button>
          </div>
        </td>
        <td>
          <button className="btn btn-danger btn-sm btn-block">
            <span className="glyphicon glyphicon-trash"></span>消す
          </button>
        </td>
      </tr>
    );
  }
});

var ShowsTableHeader = React.createClass({
  render: function () {
    return (
      <thead>
      <th>id</th>
      <th>名</th>
      <th></th>
      <th>数</th>
      <th></th>
      <th></th>
      </thead>
    );
  }
});

var ShowsTable = React.createClass({
  render: function () {
    var showRows = this.props.shows.map(function (show) {
      return ShowRow({id: show.id, title: show.title, episode: show.episode});
    });
    return (
      <table className="table">
        <ShowsTableHeader />
        <tbody>
          {showRows}
        </tbody>
      </table>
    );
  }
});

var ShowsPanel = React.createClass({
  loadShowsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function (data) {
        this.setState({shows: data.shows});
      }.bind(this),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },
  getInitialState: function () {
    return {shows: []};
  },
  componentWillMount: function () {
    this.loadShowsFromServer();
    setInterval(this.loadShowsFromServer, this.props.pollInterval);
  },
  render: function () {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">今季節の番組</div>
        <ShowsTable shows={this.state.shows} />
      </div>
    );
  }
});

React.renderComponent(
  ShowsPanel({
    url: 'shows.json', 
    pollInterval: 2000
  }),
  document.getElementById("content")
);
