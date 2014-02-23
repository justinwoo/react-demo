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
  render: function () {
    var showRows = this.props.shows.map(function (show) {
      return ShowRow({id: show.id, title: show.title, episode: show.episode});
    });
    return (
      React.DOM.table( {className:"table"}, 
        ShowsTableHeader(null ),
        React.DOM.tbody(null, 
          showRows
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
        ShowsTable( {shows:this.state.shows} )
      )
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
