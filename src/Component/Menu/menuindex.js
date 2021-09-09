import React, { Component } from "react";
import {Prompt, Redirect,Link} from 'react-router-dom';
import MainMenu from '../MainLayout/mainlayout';
import menuApi from '../../api/MenuApi';
class ListMenu extends Component{
    constructor(props){
        super(props);
        this.state={
            listMenu:null,
            
            
        }
    }
    componentDidMount(){
        
            try {
                menuApi.getAll().then(
                  (res) =>{
                    console.log(res.data); 
                    this.setState({
                        listMenu:res.data,
                        
                    });  
                  }
                  
                 
              );
              } catch (e) {
                console.log("failed ngu ngu gnug g",e);
              
              }   
    }
    onDelete(id,index){
        try {
            menuApi.DeleteMenu(id).then((res)=>{
                    if(res.code == 200){
                        const newList = [...this.state.listMenu];
                        newList.splice(index, 1);
                        this.setState({ listMenu: newList }) 
                        }
            }
            );
        
        } catch (e) {
            console.log("failed ngu ngu gnug g",e);
        }
    }
    
    render() {
        
        if(this.state.listMenu!==null){
            var element=this.state.listMenu.map((item,index)=>{
                return (
                    <tr>
                        <th scope="row">{index}</th>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>
                            <button onClick={()=>this.onDelete(item.id,index)} className="btn btn-danger">Xóa</button>
                            <Link className="btn btn-primary"  to={`/edit-menu/${item.id}`}>Sửa</Link>
                        </td>
                    </tr>
                );
            });
        }
        
       
            return (
     
                <>
                 < MainMenu />
                 <div>
                     <Link to='/add-menu' className="btn btn-success">Add</Link>
                     
                 </div>
                 
                <div className="table-responsive">
                    <table class="table table-striped mt-4">
                    <thead>
                        <tr>
                        <th scope="col">STT</th>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {element}
                    
                        
                    </tbody>
                    </table>
                </div>
                 
                </>
            );

        
        
    }
}
export default ListMenu;