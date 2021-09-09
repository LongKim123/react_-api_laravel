import React, { Component } from "react";
import {Prompt, Redirect,Link} from 'react-router-dom';
import MainMenu from '../MainLayout/mainlayout';
import menuApi from '../../api/MenuApi';

class AddMenu extends Component{
    constructor(props){
        super(props);
        this.state={
            cateMenu:null,
            parent_id:0,
            namemenu:null,
            handlePage:false}
    }

    componentDidMount(){
        try {
            menuApi.getCate().then(
              (res) =>{
                console.log(res.data); 
                this.setState({
                    cateMenu:res.data,
                    
                });  
              }
              
             
          );
          } catch (e) {
            console.log("failed ngu ngu gnug g",e);
          
          }   
    }
    callApiAddMenu=()=>{
        try {
            menuApi.AddMenu(this.state.namemenu,this.state.parent_id).then(
                (res) =>{
                  console.log(res.data); 
                  this.setState({
                    handlePage:true,
                      
                  });  
                }
                
               
            );
            
        } catch (e) {
            console.log("failed ngu ngu gnug g",e);
        }
    }
    change=(event)=>{
        let name=event.target.name;
        let value=event.target.value;
       
        let data={};
        data[name]=value;
        this.setState(data);
    }
    submit=(e)=>{
        e.preventDefault();
        console.log(this.state.namemenu,this.state.parent_id);
        this.callApiAddMenu();
    }
    render(){
        if(this.state.handlePage==true){
            return <Redirect to={
                {
                    pathname:'/list-menu',
                   
                }
            }/>

        }else{
       
            return(
                <>
                <MainMenu/>
                <div class="container"></div>
                <div className="row align-items-center">
                    <form>
                        <div className="mb-3">
                            <label  className="form-label">Menu</label>
                            <input onChange={this.change} type="type" name="namemenu" className="form-control" />
                            
                        </div>
                        <div className="mb-3" >
                            <label  className="form-label">Menu Cap Cha</label>
                        <select onChange={this.change} name="parent_id" value={this.state.value} className="form-select" dangerouslySetInnerHTML={ { __html: this.state.cateMenu } }></select>
                        
                        </div>
                    
                    
                        <button type="submit" onClick={this.submit}  className="btn btn-primary">Submit</button>
                    </form>
                </div>
                </>
                
            )
        }
    }
}
export default AddMenu;