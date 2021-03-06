var User = JSON.parse($.cookie('user'));

var MainEntry = React.createClass({
    getInitialState: function() {
        return {heroes: [], potg: [], complete: 0, heroCount: 0}
    },
    componentWillMount: function() {
        $.ajax({
            url: '/api/Heroes/getAll',
            data: {
                battletag: User.battletag
            },
            method: "POST",
            success: function(res) {
                this.setState({heroes: res, heroCount: res.length});
            }.bind(this)
        })

        $.ajax({
            url: '/api/potg/getUser',
            data: {
                username: User.username
            },
            method: "POST",
            success: function(res) {
                this.setState({potg: res, complete: res.length});
            }.bind(this)
        })
    },
    updateComplete: function(){
      var newComplete = this.state.complete + 1
      this.setState({complete: newComplete})
    },
    addPotg: function(hero) {},
    render: function() {
        console.log(User);
        var removeVis = "none"
        if(User.isAdmin == 1){
          removeVis =  ""
        }
        var nodes = this.state.heroes.map(function(n, i) {
            var index = this.state.potg.findIndex(x => x.character == n.name);

            if (index > -1) {
                var desired = n.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '')
                var modalName = "#" + desired + "ViewModal"
                return (
                    <tr key={i}>
                        <td><img src={n.image} style={{
                        height: '50%'
                    }}/> {n.name}</td>
                        <td>
                            <button className="btn" data-toggle="modal" data-target={modalName}>View POTG</button>
                            <a className="btn btn-danger" style={{display: removeVis, marginLeft: "10px"}} id="removeBtn" href={"/api/potg/remove/" + this.state.potg[index]._id}> Remove</a>
                            <ViewImage potg={this.state.potg[index]}/>
                        </td>
                    </tr>
                )
            } else {
                var desired = n.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '')
                var modalName = "#" + desired + "Modal"
                return (
                    <tr key={i}>
                        <td><img src={n.image} style={{
                        height: '50%'
                    }}/> {n.name}</td>
                        <td>
                            <button className="btn" onClick={function() {
                                this.addPotg(n)
                            }.bind(this)} data-toggle="modal" data-target={modalName}>Add POTG</button>
                        </td>
                        <UploadForm hero={n}/>
                    </tr>
                )
            }
        }.bind(this))

        return (
          <div>
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
            Heroes Complete: {this.state.complete} / {this.state.heroCount} <br/>
            Percent Complete: {(this.state.complete / this.state.heroCount).toFixed(2)}%
          </div>
        );
    }
})

var UploadForm = React.createClass({
    getInitialState: function() {
        return ({hero: this.props.hero, image: '', input: ''})
    },
    testFunction: function(e) {
        var reader = new FileReader();
        //    var test = reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = function() {
            this.setState({image: reader.result})
        }.bind(this);

        reader.readAsDataURL(e.target.files[0]);
    },
    updateInput: function(e) {
        if (e.target.value == 'Link') {
            this.setState({image: ''})
            // var control = $('#potg');
            // if (typeof(control) != 'undefined'){
            //   control.replaceWith(control = control.clone(true));
            // }
        }

        this.setState({input: e.target.value})
    },
    render: function() {
        var desired = this.props.hero.name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
        var modalId = desired + "Modal"
        var img;
        if (this.state.image != '') {
            img = (<img src={this.state.image} style={{
                width: '600px'
            }}/>)
        } else {
            img = ''
        }
        var input;
        if (this.state.input == 'Image') {
            input = (<input type="file" className="form-control" name="potg" id="potg" onChange={this.testFunction}/>)
        } else if (this.state.input == 'Link') {
            input = (<input type="text" className="form-control" name="youtube" onChange={this.setYoutube}/>)
        }
        return (
            <div className="modal fade" id={modalId} tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3 text-center modalForm">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">×</button>
                            <br/><br/>
                            <h1>{this.state.hero.name}
                                POTG</h1>
                            <form action="/api/potg/create" encType="multipart/form-data" method="post">
                                <label className="radio-inline"><input type="radio" name="optRadio" onChange={this.updateInput} value="Link"/>Link</label>
                                <label className="radio-inline"><input type="radio" name="optRadio" onChange={this.updateInput} value="Image"/>Image</label>
                                {input}
                                <input type="hidden" id="username" name="username" value={User.username}/>
                                <input type="hidden" id="hero" name="hero" value={this.props.hero.name}/> {img}
                                <input type="submit" className="form-control"/>
                            </form>
                            <hr/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

var ViewImage = React.createClass({
    render: function() {
        var desired = this.props.potg.character.replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
        var modalId = desired + "ViewModal"
        return (
            <div className="modal fade" id={modalId} tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3 text-center modalForm" style={{width: "70%"}}>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">×</button>
                            <br/><br/>
                            <img src={"data:image/jpeg;base64,"+this.props.potg.image} style={{width: "100%"}} /> <br/>
                            <hr/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

ReactDOM.render(
    <MainEntry/>, document.getElementById('content'))
