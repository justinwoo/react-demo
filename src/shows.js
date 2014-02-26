/** @jsx React.DOM */
var ShowRow = React.createClass({
  handleDecrement: function () {
    var show = this.props.show;
    var episode = parseInt(show.episode) - 1;
    show.episode = episode
    this.props.handleUpdate(show);
  },
  handleIncrement: function () {
    var show = this.props.show;
    var episode = parseInt(show.episode) + 1;
    show.episode = episode;
    this.props.handleUpdate(show);
  },
  handleDelete: function () {
    this.props.handleDelete(this.props.show);
  },
  render: function () {
    var show = this.props.show;
    var id = show.id;
    var title = show.title;
    var episode = show.episode;
    return (
      <tr>
        <td>{id}</td>
        <td colSpan="2">{title}</td>
        <td>{episode}</td>
        <td>
          <div className="btn-group">
            <button className="btn btn-default btn-sm" onClick={this.handleIncrement}>
              <span className="glyphicon glyphicon-plus"></span>
            </button>
            <button className="btn btn-default btn-sm" onClick={this.handleDecrement}>
              <span className="glyphicon glyphicon-minus"></span>
            </button>
          </div>
        </td>
        <td>
          <button className="btn btn-danger btn-sm btn-block" onClick={this.handleDelete}>
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
  handleDelete: function (show) {
    this.props.onShowDelete(show);
  },
  handleUpdate: function (show) {
    this.props.onShowUpdate(show);
  },
  handleSubmit: function () {
    var title = this.refs.title.getDOMNode().value.trim();
    var episode = this.refs.episode.getDOMNode().value.trim();
    if (!title || !episode) {
      return false;
    }
    this.props.onShowSubmit({title: title, episode: parseInt(episode)});
    this.refs.title.getDOMNode().value = '';
    this.refs.episode.getDOMNode().value = 1;
    return false;
  },
  render: function () {
    var handleDelete = this.handleDelete;
    var handleUpdate = this.handleUpdate;
    var showRows = this.props.shows.map(function (show) {
      return ShowRow({
        show: show, 
        handleDelete: handleDelete,
        handleUpdate: handleUpdate
      });
    });
    return (
      <form className="showForm" onSubmit={this.handleSubmit}>
        <table className="table">
          <ShowsTableHeader />
          <tbody>
            {showRows}
            <tr>
              <td></td>
              <td colSpan="2">
                <input className="form-control" type="text" placeholder="新しい行を入れる" ref="title" />
              </td>
              <td colSpan="2">
                <input className="form-control" type="episode" defaultValue="1" type="number" ref="episode" />
              </td>
              <td>
                <input type="submit" value="入力" className="btn btn-sm btn-block btn-success"/>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
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
  handleShowSubmit: function (show) {
    var shows = this.state.shows;
    var newShows = shows.concat([show]);
    this.setState({shows: newShows});
    $.ajax({
      url: this.props.url,
      contentType: 'application/json', 
      type: 'POST',
      data: JSON.stringify({show: show}),
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },
  handleShowDelete: function (show) {
    var shows = this.state.shows;
    var newShowsState = shows.filter(function (entry) {
      return (entry.id !== show.id)
    });
    this.setState({shows: newShowsState});
    $.ajax({
      url: this.props.url + show.id,
      type: 'DELETE',
      error: function (xhr, status, error) {
        console.error(this.props.url, status, error.toString());
      }.bind(this)
    });
  },
  handleShowUpdate: function (show) {
    $.ajax({
      url: this.props.url + show.id,
      contentType: 'application/json', 
      type: 'PUT',
      data: JSON.stringify({show: show}),
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
        <ShowsTable shows={this.state.shows} onShowSubmit={this.handleShowSubmit} 
          onShowDelete={this.handleShowDelete} onShowUpdate={this.handleShowUpdate} />
      </div>
    );
  }
});

React.renderComponent(
  ShowsPanel({
    url: 'shows/', 
    pollInterval: 2000
  }),
  document.getElementById("content")
);
