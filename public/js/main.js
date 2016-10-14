var User = JSON.parse($.cookie('user'));

var MainEntry = React.createClass({
  getInitialState: function(){
    return {
      heroes: [],
      potg: []
    }
  },
  componentWillMount: function(){
    $.ajax({
      url: '/api/Heroes/getAll',
      data: {battletag: User.battletag},
      method: "POST",
      success: function(res){
          this.setState({heroes: res});
      }.bind(this)
    })

    $.ajax({
      url: '/api/potg/getUser',
      data: {username: User.username},
      method: "POST",
      success: function(res){
        console.log(res);
        this.setState({potg: res});
      }.bind(this)
    })
  },
  addPotg: function(hero){
    console.log(hero);
  },
  render: function(){

    var nodes = this.state.heroes.map(function(n, i){
        var index = this.state.potg.findIndex(x => x.character == n.name);

        if(index > -1){
          return(
            <tr key={i}>
              <td><img src={n.image} style={{height: '50%'}}/> {n.name}</td>
              <td> Aww This is my Jam! </td>
            </tr>
          )
        } else {
          return(
            <tr key={i}>
              <td><img src={n.image} style={{height: '50%'}}/> {n.name}</td>
              <td> <button className="btn" onClick={function(){this.addPotg(n)}.bind(this)}>Add POTG</button> </td>
            </tr>
          )
        }
    }.bind(this))

    return(
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <td>Hero</td>
            <td>Play of the Game</td>
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
