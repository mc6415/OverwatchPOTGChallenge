var MainEntry = React.createClass({
  getInitialState: function(){
    return {
      heroes: []
    }
  },
  componentWillMount: function(){
    $.ajax({
      url: '/api/Heroes/getAll',
      success: function(res){
        this.setState({heroes: res})
      }.bind(this)
    })
  },
  render: function(){

    var nodes = this.state.heroes.map(function(n){
      return(
        <tr>
          <td><img src={n.img} style={{height: '50%'}}/> {n.name}</td>
        </tr>
      )
    })

    return(
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <td>Hero</td>
          </tr>
        </thead>
        <tbody>
          {nodes}
        </tbody>
      </table>
    );
  }
})

ReactDOM.render(
  <MainEntry />,
  document.getElementById('content')
)
