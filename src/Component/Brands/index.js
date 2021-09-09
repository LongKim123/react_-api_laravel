import React, { Component } from "react";
import userApi from '../../api/UserApi';
import MainMenu from '../MainLayout/mainlayout';
import {Prompt,Route, Redirect,Link} from 'react-router-dom';
class ListBrand extends Component{

    render() {
        return (
            
            <>
             < MainMenu />
                <div>
                     <Link to='/add-brand' className="btn btn-success">Add</Link>
                     
                 </div>
                <div className="table-responsive">
                <table class="table table-striped mt-4">
                    <thead>
                        <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Tên thương hiệu</th>
                        <th scope="col">Hình ảnh</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                    
                        
                    </tbody>
                    </table>

                </div>
            </>
        );
    }
}
export default ListBrand;