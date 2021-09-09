import React, { Component } from "react";
import userApi from '../../api/UserApi';
import MainMenu from '../MainLayout/mainlayout';
import {Prompt,Route, Redirect,Link} from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class AddBrand extends Component{
    render(){
        return(
            <>
            <MainMenu/>
                <div className="col-sm-6">
                    <h1>Add Brands</h1>
                </div>
                
                
                        
                            <form>
                                <div className="form-group mb-3">
                                    <label>
                                        Tên thương hiệu
                                    </label>
                                    <input type="text" placeholder="nhập tên thương hiệu" className="form-control"/>

                                </div>
                                <div className="form-group mb-3">
                                    <label for="exampleFormControlFile1">Chọn hình ảnh</label>
                                    <input type="file" className="form-control" id="exampleFormControlFile1"/>
                                </div>
                                <div>
                                    <label>Nhập nội dung</label>
                                    <CKEditor
                                        editor={ ClassicEditor }
                                        
                                        />
                                </div>
                            </form>
                                
                           
                        
                     
            
            </>
        )
    }
}
export default AddBrand;