/** @jsx React.DOM */
var ShowRow = React.createClass({displayName: 'ShowRow',
  render: function () {
    return (
      React.DOM.tr(null, 
        React.DOM.td(null, this.props.id),
        React.DOM.td(null, this.props.title),
        React.DOM.td(null, 
          React.DOM.button( {id:"editShow{this.props.id}Button", className:"btn btn-default btn-sm"}, 
            React.DOM.span( {className:"glyphicon glyphicon-pencil"}),"変更"
          )
        ),
        React.DOM.td(null, this.props.episode),
        React.DOM.td(null, 
          React.DOM.div( {className:"btn-group"}, 
            React.DOM.button( {className:"btn btn-default btn-sm"}, 
              React.DOM.span( {className:"glyphicon glyphicon-plus"})
            ),
            React.DOM.button( {className:"btn btn-default btn-sm"}, 
              React.DOM.span( {className:"glyphicon glyphicon-minus"})
            )
          )
        ),
        React.DOM.td(null, 
          React.DOM.button( {className:"btn btn-danger btn-sm btn-block"}, 
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
    var showRows = this.props.shows.map(function (show) {
      return ShowRow({id: show.id, title: show.title, episode: show.episode});
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
      React.DOM.div( {className:"panel panel-primary"}, 
        React.DOM.div( {className:"panel-heading"}, "今季節の番組"),
        ShowsTable( {shows:this.state.shows, onShowSubmit:this.handleShowSubmit} )
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
