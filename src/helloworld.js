/** @jsx React.DOM */
var data = [
  {author: "Pete Hunt", text: "This is oneasda comment"},
  {author: "Jordan Walke", text: "This is *another* comment"}
];

var shows = [
  {id: 1, title: "朝ごはんタイム", episode: 1},
  {id: 2, title: "昼ごはんタイム", episode: 2}
];

var ShowRow = React.createClass({
  render: function () {
    return React.DOM.tr({
      children: [
        React.DOM.td(null, this.props.id),
        React.DOM.td(null, this.props.title),
        React.DOM.td(null, this.props.episode)
      ]
    });
  }
});

var ShowsTableHeader = React.createClass({
  render: function () {
    return React.DOM.thead({
      children: [
        React.DOM.th(null, "id"),
        React.DOM.th(null, "title"),
        React.DOM.th(null, "episode")
      ]
    });
  }
});

var ShowsTable = React.createClass({
  render: function () {
    var showRows = this.props.shows.map(function (show) {
      return ShowRow({id: show.id, title: show.title, episode: show.episode});
    });
    return React.DOM.table({
      className: 'table',
      children: [ShowsTableHeader({}), showRows]
    });
  }
});

var ShowsPanel = React.createClass({
  render: function () {
    return React.DOM.div({
      className: 'panel panel-primary',
      children: [
        React.DOM.div({className: 'panel-heading'}, "Shows"),
        ShowsTable({shows: this.props.shows})
      ]
    })
  }
})

React.renderComponent(
  ShowsPanel({shows: shows}),
  document.getElementById("content")
);
