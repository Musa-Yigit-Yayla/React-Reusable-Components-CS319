import React from 'react';
import message_icon from './assets/message.png'

const FRIEND_NAME_FONT_SIZE = '25px';
const LAST_MESSAGE_FONT_SIZE = '15px';
const CHATPANE_SPACING = 30; //30 pixels between two chatpanes in the vbox
const UPPER_VBOX_HEIGHT = 40;
const FRIEND_IMG_LENGTH = 30; //both for width and height
const MESSAGES_PANE_HEIGHT = 700;
const MESSAGES_PANE_WIDTH = 200;
const CHATPANE_WIDTH = 300;

/**
 * Component regarding vbox for chats made with friends
 * Expected props and their value types are as follows: 
 * 2d arr contacts: [[userName0, profileImgUrl0], [userName1, profileImg1]...]
 * username: username of the logged in user as a string
 * fetchLastMessage: boolean value indicating whether we want to fetch the latest message in chatboxes
 */
export default class MessagesPane extends React.Component{
    contacts;
    username;
    fetchLastMessage;

    constructor(props){
        super(props);

        this.username = props.username;
        this.fetchLastMessage = props.fetchLastMessage;

        this.initContacts = this.initContacts.bind(this);

        this.initContacts(); //invoke the method
    }
    //Expects the content of the provided props to be valid
    initContacts(){
        let contactsArr = this.props.contacts;
        this.contacts = [];

        if(contactsArr !== null && contactsArr !== undefined){
            for(let i = 0; i < contactsArr.length; i++){
                let currName = contactsArr[i][0];
                let currImgUrl = contactsArr[i][1];

                let newContact = new ContactPerson(currName, currImgUrl);
                this.contacts.push(newContact);
            }
        }
    }
    render(){
        let counter = 0; //counter for inner array.map function loop
        
        const tdStyle = {height: MESSAGES_PANE_HEIGHT,
            overflowY: 'auto',
            position: 'relative',
        };
        return(
            <table>
                <tbody>
                    <tr> 
                        <td style={{ paddingRight: '40px', order: 1 }}> 
                            <img src={message_icon}></img> 
                        </td>
                        <td style={{ paddingRight: '40px', order: 2 }}> 
                            <p style={{fontSize: '30px'}}> Messages </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style={{}}>
                            <div style={{ width: MESSAGES_PANE_WIDTH, height: MESSAGES_PANE_HEIGHT, overflowX: 'hidden', overflowY: 'auto', position: 'relative'}}>
                                {   
                                    
                                    (this.contacts !== null && this.contacts !== undefined) && //conditional rendering applied
                                        this.contacts.map(currContact => {
                                            let currFriendName = currContact.name;
                                            let currImgUrl = currContact.imgUrl;

                                            let currHeight = UPPER_VBOX_HEIGHT + counter * (FRIEND_IMG_LENGTH + CHATPANE_SPACING);

                                            return(
                                                <ChatPane imgUrl={currImgUrl} friendname={currFriendName} username={this.username} key={counter++} style={{width: CHATPANE_WIDTH}}></ChatPane>
                                            )
                                        })
                                    
                                    
                                }
                            </div>
                            </div>    
                        </td>     
                    </tr>
                </tbody>
            </table>
        );
    }
}

/* !!Caller is obliged to provide valid props
*Expected props are as follows:
* imgUrl
* username: name of the current logged in user
* friendname: name of the associate
* latestMessage: latest sent message fetched from backend if exists
*/ 
class ChatPane extends React.Component{
    username;
    friendname;
    imgUrl;
    latestMessage;
    
    constructor(props){
        super(props);

        this.username = props.username;
        this.friendname = props.friendname;
        this.imgUrl = props.imgUrl;
        this.latestMessage = props.latestMessage;

        if(this.latestMessage === null || this.latestMessage === undefined){ //!!! you might want to handle blank message case later on
            this.latestMessage = "...";
        }
    }
    render(){
        const imageStyle = {
            clipPath: 'circle(50% at 50% 50%)',
            width: '70px',
            height: '70px',
        };
        return( 
            <table>
                <tbody>
                    <tr>
                        <td>
                            <img style={imageStyle} src={this.imgUrl}></img>
                        </td>
                    
                        <td>
                            <table>
                                <tbody>
                                    <tr> {/**row containing friend name */}
                                        <td>
                                            <p style={{fontSize: FRIEND_NAME_FONT_SIZE}}>{this.friendname}</p>
                                        </td>
                                    </tr>
                                    <tr> {/**row containing latest sent message (could be from both sides if exists) */}
                                        <td>
                                            <p style={{fontSize: LAST_MESSAGE_FONT_SIZE}}>{this.latestMessage}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        
                    </tr>
                </tbody>
                
            </table>
        );
    }
}
class ContactPerson{
    name;
    imgUrl;
    constructor(name, imgUrl){
        this.name = name;
        this.imgUrl = imgUrl;
    }
}