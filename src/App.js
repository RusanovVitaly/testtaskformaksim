import React from 'react';
import axios from 'axios';
import 'antd/dist/antd.css';
import {notification,Input,Button,Card  } from "antd";
import './App.css';

const API_URL = 'https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC';

export default class App extends React.Component{

    state = {
        isSearching: false,
        searchedTag: '',
        pictures:{
            test:[
                {image:'https://www.wikihow.com/images_en/thumb/9/96/Add-a-Background-to-a-Website-Step-5-Version-3.jpg/v4-728px-Add-a-Background-to-a-Website-Step-5-Version-3.jpg'},
                {image:'https://www.wikihow.com/images_en/thumb/9/96/Add-a-Background-to-a-Website-Step-5-Version-3.jpg/v4-728px-Add-a-Background-to-a-Website-Step-5-Version-3.jpg'}
            ],
            test1:[
                {image:'https://www.wikihow.com/images_en/thumb/4/44/Insert-Images-with-HTML-Step-4-Version-3.jpg/v4-728px-Insert-Images-with-HTML-Step-4-Version-3.jpg'},
                {image:'https://www.wikihow.com/images_en/thumb/4/44/Insert-Images-with-HTML-Step-4-Version-3.jpg/v4-728px-Insert-Images-with-HTML-Step-4-Version-3.jpg'},
                {image:'https://www.wikihow.com/images_en/thumb/4/44/Insert-Images-with-HTML-Step-4-Version-3.jpg/v4-728px-Insert-Images-with-HTML-Step-4-Version-3.jpg'},
                {image:'https://www.wikihow.com/images_en/thumb/4/44/Insert-Images-with-HTML-Step-4-Version-3.jpg/v4-728px-Insert-Images-with-HTML-Step-4-Version-3.jpg'}
            ]
        },
        isGrouped: false
    };
    openNotificationBlock = (type, message, description) => {
        notification[type]({
            message,
            description
        })
    };
    onInputChange = (value) => {
        this.setState({searchedTag: value})
    };
    getPics = tag => {
        this.setState({isSearching:true});
        const {pictures} = this.state;
        axios.get(`${API_URL}&tag=${tag}`,{
            headers:{
                'Content-Type':'image/gif'
            }
        })
            .then(response => {
                this.setState({isSearching:false});
                const data = response.data.data;
                //const data = {embed_url:'https://www.wikihow.com/images_en/thumb/4/44/Insert-Images-with-HTML-Step-4-Version-3.jpg/v4-728px-Insert-Images-with-HTML-Step-4-Version-3.jpg'}
                console.log(data);
                if (!data.type)
                {
                    this.openNotificationBlock('error', 'По этому тегу ничего не найдено!', `К сожалению, по тегу ${tag} ничего не найдено.Проверьте правильность написания, и попробуйте снова! `)
                }
                else {
                    if (tag in pictures) {
                        let newState = pictures;
                        for (let item in newState) {
                            if (item === tag) {
                                newState[item].push({image: data.embed_url});
                            }
                        }
                        this.setState({pictures: newState})
                    } else {
                        this.setState({pictures: {...pictures, [tag]: [{image: data.embed_url}]}})
                    }
                }
            })
            .catch(() => {
                this.setState({isSearching:false});
                this.openNotificationBlock('error', 'Произошла ошибка!', `К сожалению, при поиске произошла ошибка, повторите запрос позднее! `)


                const data = {embed_url:'https://www.wikihow.com/images_en/thumb/4/44/Insert-Images-with-HTML-Step-4-Version-3.jpg/v4-728px-Insert-Images-with-HTML-Step-4-Version-3.jpg'}
                console.log(data);
            })
    };
    getTestPics = tag =>{
        const {pictures} = this.state;
        this.setState({isSearching: false});
        const data = {embed_url: 'https://www.wikihow.com/images_en/thumb/4/44/Insert-Images-with-HTML-Step-4-Version-3.jpg/v4-728px-Insert-Images-with-HTML-Step-4-Version-3.jpg'}
        if (tag in pictures) {
            let newState = pictures;
            for (let item in newState) {
                if (item === tag) {
                    newState[item].push({image: data.embed_url});
                }
            }
            this.setState({pictures: newState})
        } else {
            this.setState({pictures: {...pictures, [tag]: [{image: data.embed_url}]}})
        }
    };
    setGroup = () => {
        const {isGrouped} = this.state;
        this.setState({isGrouped: !isGrouped});
    };
    setClear = ()=>{
        this.setState({searchedTag:'',pictures:[]})
    };
    renderBy = (pictures,type)=>{
        switch (type) {
            case 'group':{
                let array = [];
                for (let key in pictures){
                    array.push(
                        <div key={key} className='group-card'>
                            <div className='group-card_header'>
                                <p style={{fontSize:'20px'}}>{key}</p>
                            </div>
                        <div key={key} className='group-card_content'>
                            {pictures[key].map((item,id)=>(
                                <Card style={{ width: 240,margin:5 }}
                                      key = {id}
                                      cover={<img alt="this" src={item.image} />}
                                />
                            ))}
                        </div>
                        </div>)
                }
                return array;
            }
            case 'flat':{
                let array = [];
                for (let key in pictures){
                    array.push(
                        pictures[key].map((item,id)=>(
                                <Card style={{ width: 240,margin:5 }}
                                      key = {id}
                                      cover={<img alt="this" src={item.image} />}
                                />
                            ))
                        )
                }
                return array;
            }
            default: return null;
        }

    };


  render() {
      const {searchedTag,isGrouped,pictures,isSearching} = this.state;
    return (
        <div className='App'>
            <div className='inputs-container'>
                <Input value={searchedTag} onChange={event => this.onInputChange(event.target.value)}/>
                <Button loading={isSearching} className='inputs-button' type='primary' onClick={() => {
                    this.getPics(searchedTag)
                }}>Загрузить</Button>
                <Button className='inputs-button' danger={true} type='primary' onClick={this.setClear}>Очистить</Button>
                <Button className='inputs-button' type='primary' onClick={this.setGroup}>{isGrouped?'Разгруппировать':'Сгруппировать'}</Button>
            </div>
            <div className='images-container'>
                {isGrouped?this.renderBy(pictures,'group'):this.renderBy(pictures,'flat')}
            </div>
        </div>
    );
  }
}

