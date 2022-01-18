


class Post extends React.Component{
  constructor(props){
  super(props);
  this.state={editview:false,currentpost:'',content:''};
  this.fetchlike = this.fetchlike.bind(this);
  this.fetchpost = this.fetchpost.bind(this);
  this.edit = this.edit.bind(this);
  this.change = this.change.bind(this);
  }

  fetchlike = (event) => {
    fetch(`like/${this.props.item}`)
    .then(response => response.json())
    .then(message => {
      console.log(message);
      this.fetchpost();

    });
  }
  fetchpost=()=>{
    fetch(`post/${this.props.item}`)
    .then(response => response.json())
    .then(p =>{
      this.setState({currentpost:p,content:p.content});
    });
  }
componentDidMount(){
    this.fetchpost();
  }
  componentDidUpdate(prevProps){
    if(prevProps.item != this.props.item){
      this.fetchpost();

    }}


  change=()=>{
    this.setState({editview:!this.state.editview});
  }
  edit=(event)=>{
    event.preventDefault();
    fetch(`/like/${this.props.item}`, {
method: 'PUT',
body: JSON.stringify({
    content:event.target[0].value
})
})
this.setState({content:event.target[0].value});
this.change();

  }

  changeHandler=(event)=>{
    document.querySelector("#exampleFormControlTextarea2").value=event.target.value

  }




  render(){
    if(this.state.currentpost!=''){
    const noedit = <div className="list-group">
  <div style={{border:"5px solid red"}} className="list-group-item list-group-item-action active ">
    <div className="d-flex w-100 justify-content-between">
      <h5 className="mb-1"><Link  type={1} uid={this.state.currentpost.u_id} label={this.state.currentpost.name}  /></h5>
      <small>{this.state.currentpost.date}</small>
    </div>
    <p className="new">{this.state.content}</p>
    <br/>
  <div>  {this.state.currentpost.likes.includes(a)?<svg  onClick={this.fetchlike} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-heart-fill" fill="Red" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>:<svg onClick={this.fetchlike} width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-heart-fill" fill="#e6e6e6" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/></svg>}</div>
    <small>{this.state.currentpost.likes.length}&nbsp;</small>
  { this.state.currentpost.u_id==a ?<a style={{color:"#ff9999"}} onClick={this.change}>Edit</a>:null}
  </div></div>
  const edit =  <div style={{border:"5px solid red"}}  className="list-group-item list-group-item-action ">
  <form onSubmit={this.edit}>
  <div  className="form-group">
    <label htmlFor="exampleFormControlTextarea2">Edit Post</label>
    <textarea onChange={this.changeHandler}  className="form-control" id="exampleFormControlTextarea2" rows={3}    required>{this.state.content}</textarea>
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
</form></div>
    return(<React.Fragment> {this.state.editview?edit:noedit}</React.Fragment> );
  }
  else{
      return(<React.Fragment> <h1>Loading....</h1></React.Fragment> );
  }
}
}










class Npost extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      text:''
    };
    this.changeHandler = this.changeHandler.bind(this);
  this.submitHandler = this.submitHandler.bind(this);
  }
  changeHandler = (event) =>{
    this.setState({
      text:event.target.value
    });
  }
  submitHandler = () =>{
    event.preventDefault();
    fetch('/newpost',
    {
method: 'POST',headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
},
body: JSON.stringify({

   body : this.state.text
})

    })
    .then(response => response.json())
    .then(output =>{
      console.log(output);
      document.querySelector('#exampleFormControlTextarea1').value = '' ;
      this.props.refetchdata();
    });
}
render(){
      return(<form  onSubmit={this.submitHandler}>
        <div className="form-group">
  <textarea style={{backgroundColor:"#8c8c8c"}} onChange={this.changeHandler} className="form-control" id="exampleFormControlTextarea1" rows={3}  placeholder="Write something here for a new post" required></textarea>
  <input type="submit" className="btn btn-warning" name="" value="submit"/>
  </div>
  </form>);

}
}








class Pview extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      posts:[],
      pnum:1,
      active:1,
    };

  this.fetchdata = this.fetchdata.bind(this);
  this.sideclick = this.sideclick.bind(this);
  }

  fetchdata=()=>{
    fetch(`postview/${this.props.filter}/${this.state.active}/${this.props.cuser}`)
    .then(response => response.json())
    .then(postlist => {
      console.log(postlist);
      console.log(this.state.active);
    this.setState({
      posts: postlist.objlist,
      pnum:postlist.objnum

    });});
  }



  sideclick=(event)=>{
    if(event.target.id=="previous"){
      this.setState((state)=>({active:state.active - 1}));
    }
    else if(event.target.id=="next"){
      this.setState((state)=>({active:state.active + 1}));
    }
    else{
      this.setState({active:parseInt(event.target.getAttribute('a-key'))});
    }
    console.log(this.state.active);

  }
componentDidUpdate(prevProps,prevState){
  if(prevProps.filter != this.props.filter){
    this.fetchdata();

  }
  if(prevState.active != this.state.active){
 this.fetchdata();}
}
componentDidMount(){
  this.fetchdata();
}



  render(){
    const npost = (a!=false)?<Npost refetchdata={this.fetchdata} />:null;
    const items = (this.state.posts.length==0)?<h1 style={{fontFamily:"Barrio"}}>No posts right now &#129335;</h1>:this.state.posts.map((i,j) => <li key={j}><Post user={a}   item={i.id}/></li>);
    const n = null;
    var i;
    var pagelist = [];
    for(i=1;i<=this.state.pnum;i++) {
      if(this.state.active==i){
  pagelist.push( <li key={i} className="page-item active" aria-current="page">
      <a a-key={i} className="page-link" onClick={this.sideclick}  href="#">{i}<span className="sr-only">(current)</span></a>
    </li>);}
    else{
    pagelist.push( <li key={i} className="page-item"><a a-key={i} className="page-link" onClick={this.sideclick}  href="#">{i}</a></li>);
   }
 };
    return(<React.Fragment>
      {this.props.filter==1?npost:n}
    <ul>{items}</ul>
    <br/><br/>
    {(this.state.pnum>1)?
<nav  aria-label="...">
<ul  className="pagination">
 <li className={(this.state.active!=1?"page-item":"page-item disabled")}>
   <a onClick={this.sideclick} className="page-link" id="previous" href="#" aria-disabled={(this.state.active!=1?'false': 'true')} tabIndex={(this.state.active!=1?'': '-1')}>Previous</a>
 </li>
 {pagelist}
 <li className={(this.state.active!=this.state.pnum?"page-item":"page-item disabled")}>
   <a onClick={this.sideclick} className="page-link" id="next" href="#" aria-disabled={(this.state.active!=this.state.pnum?'false': 'true')} tabIndex={(this.state.active!=this.state.pnum?'': '-1')}>Next</a>
 </li>
</ul>
</nav>:null});
     </React.Fragment>);
  }

}




class Profile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      posts:[],
      followers:0,
      following:1,
      userinfollowing:1,
      same:1
    };
this.fetchFollowers = this.fetchFollowers.bind(this);
this.followToggle = this.followToggle.bind(this);
}
    fetchFollowers = () => {
    fetch(`/followers/${this.props.userid}`)
    .then(response => response.json())
    .then(foll => {

this.setState({followers:foll.followed,following:foll.currentuser,userinfollowing:foll.following,same:foll.samee});

})
  }

  followToggle = ()=>{

fetch(`/toggle/${this.props.userid}`)
.then(response => response.json())
.then(r =>{

  console.log(r);
  this.fetchFollowers();
})

  }

  componentDidUpdate(prevProps){
    if(prevProps.userid != this.props.userid){
      this.fetchFollowers()
    }
  }
  componentDidMount(){

     this.fetchFollowers();
  }


  render(){

    const fbutton = <button style={{color:"White",fontFamily:'Kirang Haerang'}} class="btn btn-success" onClick={this.followToggle}>Follow</button> ;
    const ufbutton = <button style={{color:"White",fontFamily:'Kirang Haerang'}} class="btn btn-danger" onClick={this.followToggle}>Unfollow</button> ;
    const tag =  this.state.following==1?  <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check-circle-fill" fill="Blue" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>:null;
     const fo = this.state.following==1?<sup>following</sup>:null;
    var c = <br/> ;
return(<React.Fragment>
  <div className="jumbotron jumbotron-fluid">
  <div className="container">
    <b className="display-4">{this.props.label}</b><sub>{fo}{tag}</sub>

    <br/><br/>
    <p className="lead" id="ptext">Followers: {this.state.followers} <br/>Following:  {this.state.userinfollowing} </p>
    <br/>{this.state.same==1? c:this.state.following==1?ufbutton:fbutton }
  </div>
</div>


<Pview filter={3} cuser={this.props.userid} />
</React.Fragment>);

  }




  }

  class Link extends React.Component{
    constructor(props){
      super(props);
      this.view = this.view.bind(this);
      }
      static defaultProps = {
        uid: a ,
        type:1
    }

      view=(props) => {

        if (this.props.type == 1) {
          ReactDOM.render(<Profile userid={this.props.uid} label={this.props.label} />,document.getElementById("post-view"));
        }else if(this.props.type == 2){
          ReactDOM.render(<Pview filter={2} cuser={a} />,document.getElementById("post-view"));
        }else{
          ReactDOM.render(<Pview filter={1} cuser={a} />,document.getElementById("post-view"));
        }

      }

render(){
return(<b className="labels" onClick={this.view} >{this.props.label}</b>);

}

    }



  ReactDOM.render(<Pview filter={1} cuser={1} />,document.getElementById("post-view"));



  ReactDOM.render(<Link type={1} uid={a}  label={b}  />,document.getElementById("ppost"));
  ReactDOM.render(<Link type={2} uid={a} label="following" />,document.getElementById("fpost"));
  ReactDOM.render(<Link type={3} uid={a} label="Allpost" />,document.getElementById("apost"));
