
import { Component } from 'react';

import './style.scss';
import Login from "./login"
import Register from './register';


class IndexLogin extends Component{
  constructor (props){
    super(props);
    this.state={
      listUser:null,
      isLoginActive: true
    };
  }
  componentDidMount(){
    this.rightSide.classList.add("right");
  }
 
 
  changeState =()=> {
    const { isLoginActive } = this.state;

    if (isLoginActive) {
      this.rightSide.classList.remove("right");
      this.rightSide.classList.add("left");
    } else {
      this.rightSide.classList.remove("left");
      this.rightSide.classList.add("right");
    }
    this.setState(prevState => ({ isLoginActive: !prevState.isLoginActive }));
    console.log('ngu');
    console.log(this.state.listUser);
  }
  render(){
    
    const {isLoginActive} =this.state;
    const current= isLoginActive ? "Register":"Login";
    const currentActive =isLoginActive ? "login" :"register";
      return (
    
      <div className="login">
        <div className="container"  ref={ref => (this.container = ref)}>
          {isLoginActive && (<Login containerRef={ref=>(this.current=ref)}/>)}
          {!isLoginActive && (<Register changeRegister={this.changeState} containerRef={ref=>(this.current=ref)}/>)}
          </div>
          <RightSide  current={current}
            currentActive={currentActive}
            containerRef={ref => (this.rightSide = ref)}
            onClick={this.changeState}/>
       
      </div>
    
  );

  }
   

}
const RightSide = props =>{
  return(
    <div className="right-side"
    ref={props.containerRef}
    onClick={props.onClick}>
   <div className="inner-container">
   <div className="text" >{props.current}</div>
 
   </div>
     
   </div>
  );
 
};
export default IndexLogin;
