/** @jsx React.DOM */
var ShowRow = React.createClass({displayName: 'ShowRow',
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
      React.DOM.tr(null, 
        React.DOM.td(null, id),
        React.DOM.td( {colSpan:"2"}, title),
        React.DOM.td(null, episode),
        React.DOM.td(null, 
          React.DOM.div( {className:"btn-group"}, 
            React.DOM.button( {className:"btn btn-default btn-sm", onClick:this.handleIncrement}, 
              React.DOM.span( {className:"glyphicon glyphicon-plus"})
            ),
            React.DOM.button( {className:"btn btn-default btn-sm", onClick:this.handleDecrement}, 
              React.DOM.span( {className:"glyphicon glyphicon-minus"})
            )
          )
        ),
        React.DOM.td(null, 
          React.DOM.button( {className:"btn btn-danger btn-sm btn-block", onClick:this.handleDelete}, 
            React.DOM.span( {className:"glyphicon glyphicon-trash"}),"消す"
          )
        )
      )
    );
  }
});

var ShowsTableHeader = React.createClass({displayName: 'ShowsTableHeader',
  render: function () {
    return (
      React.DOM.thead(null, 
      React.DOM.th(null, "id"),
      React.DOM.th(null, "名"),
      React.DOM.th(null),
      React.DOM.th(null, "数"),
      React.DOM.th(null),
      React.DOM.th(null)
      )
    );
  }
});

var ShowsTable = React.createClass({displayName: 'ShowsTable',
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
      React.DOM.form( {className:"showForm", onSubmit:this.handleSubmit}, 
        React.DOM.table( {className:"table"}, 
          ShowsTableHeader(null ),
          React.DOM.tbody(null, 
            showRows,
            React.DOM.tr(null, 
              React.DOM.td(null),
              React.DOM.td( {colSpan:"2"}, 
                React.DOM.input( {className:"form-control", type:"text", placeholder:"新しい行を入れる", ref:"title"} )
              ),
              React.DOM.td( {colSpan:"2"}, 
                React.DOM.input( {className:"form-control", type:"episode", defaultValue:"1", type:"number", ref:"episode"} )
              ),
              React.DOM.td(null, 
                React.DOM.input( {type:"submit", value:"入力", className:"btn btn-sm btn-block btn-success"})
              )
            )
          )
        )
      )
    );
  }
});

var ShowsPanel = React.createClass({displayName: 'ShowsPanel',
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
      React.DOM.div( {className:"panel panel-primary"}, 
        React.DOM.div( {className:"panel-heading"}, "今季節の番組"),
        ShowsTable( {shows:this.state.shows, onShowSubmit:this.handleShowSubmit, 
          onShowDelete:this.handleShowDelete, onShowUpdate:this.handleShowUpdate} )
      )
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
