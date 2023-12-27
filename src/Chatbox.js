import React from 'react';


const MAX_FETCHED_MESSAGE_COUNT = 50; //represents the amount of messages that will be fetched each time user slides up to previous messages
const PROFILE_PIC_RADIUS = '20px';
const TEXTFIELD_COLSPAN_CONST = 8;
const CHATBOX_WIDTH = '440px';
const CHATBOX_HEIGHT = '600px'; //the overall component height
const CHATBOX_INSET_X = 15;
const CHATBOX_INSET_Y = 15;
const UPPER_VBOX_HEIGHT = '60px'; // the area which the friend's profile pic and username is contained
const  MESSAGE_PANE_MAX_CHAR_LENGTH = 50; //max possible characters to be stored in a line
const MESSAGE_PANE_HEIGHT = '440px';
const CHAR_PIXEL_LENGTH = 5.2;
const CHAR_PIXEL_HEIGHT = 12; // the length of a line, in the chatbox, containing characters
const CHATBOX_RADIUS = 10;
const USER_MESSAGE_BOX_COLOR = "rgba(43, 47, 119, 1)";
const FRIEND_MESSAGE_BOX_COLOR = "rgba(211, 211, 211, 1)";
const MESSAGE_BOX_INSET_X = 10;
const MESSAGE_BOX_INSET_Y = 10;
const MESSAGE_BOX_RADIUS = 10; //radius of the message rectangle's curvy area
const MESSAGE_FONT = toString(CHAR_PIXEL_LENGTH) + "px Arial";
const FRIEND_IMAGE_RADIUS = 25; //fixed friend image radius on the chatbox
const FRIEND_IMAGE_CANVAS_LENGTH = FRIEND_IMAGE_RADIUS * 2;
const MESSAGE_BOX_LINE_HEIGHT = 16;
const MESSAGE_BOX_VGAP = 16;
const MESSAGE_BOX_HGAP_SHORT = CHATBOX_INSET_X;
const HGAP_FACTOR = 0.4;
const CHATBOX_WIDTH_NUMERICAL = 440;
const MESSAGE_BOX_HGAP_LONG = CHATBOX_WIDTH_NUMERICAL - (CHAR_PIXEL_LENGTH * MESSAGE_PANE_MAX_CHAR_LENGTH) - 100; //50 is the max number of chars available on a line
const SCROLLPANE_HEIGHT_INSET = 30;

//logged user represents the user opening up the chatbox, messagedUser is the user on the other side
//These parameters will be expected to be strings which help fetch the messages from backend
export default class Chatbox extends React.Component{
    currMessages; //messages array regarding the chatbox
    userName;
    friendName;
    friendImage; //url of friend's pp image
    friendX;
    friendY;
    friendRadius;

    //Props expects friendImage (friend's image as a whole), friendX and friendY (representing X Y coordinates of friend's image center), friendRadius 
    //also names of the users
    constructor(props){
        super(props); //super has to be explicitly called from the constructor
        //Bind instance methods to the object itself
        this.fetchPrevMessages = this.fetchPrevMessages.bind(this);
        this.drawCanvas = this.drawCanvas.bind(this);
        this.render = this.render.bind(this);
        this.initializeMessages = this.initializeMessages.bind(this);
        this.sendMessageHandler = this.sendMessageHandler.bind(this);

        this.state = {currMessages: []}; //must be fetched from the backend if any messages exist between the users
        this.initializeMessages();
        this.userName = this.props.userName;
        this.friendName = this.props.friendName;
        this.friendImage = this.props.friendImage;
        this.friendX = this.props.friendX;
        this.friendY = this.props.friendY;
        this.friendRadius = this.props.friendRadius
        this.imgCanvasRef = React.createRef();
        this.textfieldRef = React.createRef();
        this.sendButtonRef = React.createRef();
        this.fetchPrevMessages();

        
    }
    componentDidMount(){
        this.drawCanvas();
    }
    componentDidUpdate(){
        this.drawCanvas();
    }
    //This method initially renders a message then completes the message sending procedure regarding backend data transfer
    sendMessageHandler(){
        //Retrieve the entered message in the textfield if it is not empty
        let currentMessage = null;
        if(this.textfieldRef.current !== null && this.textfieldRef !== undefined){
            currentMessage = new Message(this.userName, this.textfieldRef.current.value);
        } 
        if(currentMessage !== null && currentMessage !== undefined && Message.isNonEmpty(currentMessage.messageText)){
            console.log("Debug: About to invoke setState after appending the new message");
            let newMessages = this.state.currMessages;
            newMessages.push(currentMessage);
            console.log("Debug: newMessages are " + newMessages);
            this.setState({currMessages: newMessages});
            //clear the textfield content
            this.textfieldRef.current.value = " ";
        }
        //ToDo backend information transfer logic
    }
    //Method to fetch the previous messages from backend
    fetchPrevMessages(){
        //ToDo
    }
    /**Initializes currMessages property of this component, based on the corresponding props value
     *The passed props value must contain the latest messages read from the backend entity
     *The passed props value must be a 2d array with N rows and 2 columns (where N represents total message count) and first column represents
     *senderName and second column represents messageText. N-1th message is expected to be the most recent message
     *This method will create JavaScript Message objects from this 2d array and assign currMessages a 1d Message object array
     */
    initializeMessages(){
        const messagesArr = this.props.messages; //2d message array in the specified format, fetched from the backend
        try{
            let newMessages = this.state.currMessages;
            for(let i = 0; i < messagesArr.length; i++){
                const senderName = messagesArr[i][0];
                const messageText = messagesArr[i][1];
    
                let message = new Message(senderName, messageText);
                
                newMessages.push(message);
                //console.log("Debug: initializeMessages instantiated message has name and text respectively " + message.senderName + "\n" + message.messageText);
                
            }
            //this.setState({currMessages: newMessages});
            this.state.currMessages = newMessages;
        }
        catch(exception){
            console.log("Error: an exception in initializeMessages has occured " + exception.message);
        }
    }
    drawCanvas(){
        //console.log("Debug: drawCanvas method has been invoked");
        const ctx = this.imgCanvasRef.current.getContext("2d");
        ctx.beginPath();

        //Initially draw a circle in which we will use to clip the friend's image
        ctx.arc(FRIEND_IMAGE_CANVAS_LENGTH / 2, FRIEND_IMAGE_CANVAS_LENGTH / 2, FRIEND_IMAGE_RADIUS, 0, 2 * Math.PI);
        ctx.closePath();

        ctx.clip(); //Use the clip method to clip a portion of the image out, based on the most recently specified path on our context

        let image = new Image();
        image.src = this.friendImage;
        ctx.drawImage(image, 0, 0, FRIEND_IMAGE_CANVAS_LENGTH, FRIEND_IMAGE_CANVAS_LENGTH);
    }
    render(){
        console.log("Debug: Chatbox Component is rendering" + this.state.currMessages.length);
        const trStyle0 = "border-spacing: " + toString(CHATBOX_RADIUS) + "px"; 
        return (
            <div>
                <table style={{width: {CHATBOX_WIDTH}, height:{CHATBOX_HEIGHT}}}>
                    <tbody>
                        <tr id="friendDataRow" style={{display: 'flex'}}>
                            <td style={{ paddingRight: '20px', order: 1 }}> <canvas ref={this.imgCanvasRef} width={FRIEND_IMAGE_CANVAS_LENGTH} height={FRIEND_IMAGE_CANVAS_LENGTH}></canvas></td>
                            <td style={{ paddingRight: '20px', order: 2 }}> {this.friendName} </td>
                        </tr>
                        <tr>
                            <td> <MessagePane currMessages={this.state.currMessages} userName={this.userName} friendName={this.friendName}></MessagePane> </td>
                        </tr>
                        <tr id="chatField">
                            <td> <input type="text" style={{width: MESSAGE_PANE_MAX_CHAR_LENGTH * TEXTFIELD_COLSPAN_CONST + 'px'}} ref={this.textfieldRef}></input> </td>
                            <td> <input type="button" onClick={this.sendMessageHandler} ref={this.sendButtonRef}></input> </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
        );
    }
}

//Pane holding the messages
class MessagePane extends React.Component{
    

    constructor(props){
        super(props);
        this.state = {emptyState: null}; //empty state for force rendering the component
        this.canvases = []; //canvases each representing a single message (namely canvases' properties)
        //bind the instance functions to the object itself
        this.addFetchedMessages = this.addFetchedMessages.bind(this);
        this.createCanvases = this.createCanvases.bind(this);
        this.updateCanvases = this.updateCanvases.bind(this);
        this.drawMessageBox = this.drawMessageBox.bind(this);
        this.getModifiedMessage = this.getModifiedMessage.bind(this);
        this.createMessageObjects = this.createMessageObjects.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.canvas = this.canvasAction.bind(this);
        this.render = this.render.bind(this);

        this.currMessages = this.props.currMessages; //array containing Message objects
        this.userName = this.props.userName;
        this.friendName = this.props.friendName;
        this.scrollPaneRef = React.createRef();
        this.canvasRefs = [];
        for(let i = 0; i < this.currMessages.length; i++){
            this.canvasRefs.push(React.createRef());
        }
        this.createCanvases();
        
    }
    componentDidMount(){
        /*console.log("Debug: invoking createCanvases from componentDidMount" + this.canvases.length);
        this.createCanvases();
        for(let i = 0; i < this.canvases.length; i++){
            let canvas = this.canvases[i];
            console.log("Debug: canvasRef in componentDidMount is " + JSON.stringify(canvas.ref));
            console.log("Debug: canvasRef.current is " + canvas.ref.current);
            this.drawMessageBox(canvas);
        }*/
        //console.log("COMPONEEEENTEEEE MUUUUUNT" + this.canvases.length);
        for(let i = 0; i < this.canvases.length; i++){
            let currCanvas = this.canvases[i];
            this.canvasAction(currCanvas);
        }
        this.scrollToBottom();
    }
    componentDidUpdate(){
        console.log("Debug: invoked componentDidUpdate, initially canvases has length " + this.canvases.length);
        this.updateCanvases();
        console.log("Debug: componentDidUpdate after createCanvases has been called, canvases has length " + this.canvases.length);
        for(let i = 0; i < this.canvases.length; i++){
            let currCanvas = this.canvases[i];
            console.log("Debug: currCanvas.ref in componentDidUpdate === null is " + currCanvas.ref === null);
            this.canvasAction(currCanvas);
        }
        this.scrollToBottom();
    }
    //fetchedMessages array is expected to have the older messages at earlier indexes, the latest index will contain the newest message
    //Same is valid on the currMessages array
    //!!! THIS FUNCTION REQUIRES AN UPDATE
    addFetchedMessages(fetchedMessages){
        if(fetchedMessages !== null){
            //append userName to fetchedMessages array and assign that array back to the userName using built-in concat method
            this.currMessages = fetchedMessages.concat(this.currMessages);
        }
    }
    //Invoke when we want to scroll the message pane to the very bottom
    scrollToBottom(){
        if(this.scrollPaneRef.current !== null){
            let height = this.scrollPaneRef.current.scrollHeight;
            if(height > SCROLLPANE_HEIGHT_INSET){
                console.log("Debug: reducing height of scrollHeight");
                height -= SCROLLPANE_HEIGHT_INSET;
            }
            this.scrollPaneRef.current.scrollTop = height; 
        }
    }
    //Invoke when a new message is about to be sent from the user and should be rendered in frontend
    //Works regardless of whether the message has been sent successfully or not
    updateCanvases(){
        //Below logic ensures whether we have a new message to be appended before rerendering
        if(this.canvases.length + 1 === this.currMessages.length){
            let newIndex = this.canvases.length;
            let currY = CHATBOX_INSET_Y + CHAR_PIXEL_HEIGHT * newIndex ;
            let currRef = React.createRef();
            let rectColor = USER_MESSAGE_BOX_COLOR;
            let messageColor = "rgba(255, 255, 255, 1)";
            this.canvasRefs.push(currRef);

            let newCanvas = {index: this.canvases.length,
                ref: currRef,
                top: currY,
                currMessage: this.currMessages.at(this.canvases.length),
                messageColor: messageColor,
                boxColor: rectColor};

            this.canvases.push(newCanvas);
        }
    }
    //create canvases (with respect to currMessages) and store them in the array
    createCanvases(){
        let newCanvases = [];
        if(this.currMessages === null || this.currMessages === undefined){
            console.log("Debug: currMessages are undefined or null");
        }
        for(let i = 0; i < this.currMessages.length; i++){
            let currMessage = this.currMessages[i];
            
            let rectColor = FRIEND_MESSAGE_BOX_COLOR;
            let messageColor = "rgba(0, 0, 0, 1)";
            if(currMessage.senderName === this.userName){
                rectColor = USER_MESSAGE_BOX_COLOR;
                messageColor = "rgba(255, 255, 255, 1)";
            }
            let currRef = this.canvasRefs[i];
            //console.log("REACT CREATEREF IS: " + JSON.stringify(currRef));
            let currY = CHATBOX_INSET_Y + CHAR_PIXEL_HEIGHT * i;
            //let currCanvas = <canvas id={"messageCanvas" + (i + 1)} key={i} ref={currRef} position="absolute" left={CHATBOX_INSET_X} height={currY}></canvas>
            //const ctx = currRef.current.getContext("2d");
            let currCanvas = {index: i,
                              ref: currRef,
                              top: currY,
                              currMessage: currMessage,
                              messageColor: messageColor,
                              boxColor: rectColor};

            //this.drawMessageBox(currCanvas);
            newCanvases.push(currCanvas); 
        }
        //YOU MAY HAVE TO ERASE THE CURRENT CONTENT BEFORE EXECUTING THE FOLLOWING ASSIGNMENT
        /*console.log("Debug: returning from createCanvases content of the newCanvases are");
        for(let i = 0; i < newCanvases.length; i++){
            console.log(newCanvases.at(i));
        }*/
        this.canvases = newCanvases;
    }
    //Method responsible from drawing a single message box
    drawMessageBox(canvas){
        const canvasRef = canvas.ref;
        const boxColor = canvas.boxColor;
        const messageStr = this.getModifiedMessage(canvas.currMessage);
        const messageColor = canvas.messageColor;
        //console.log("---------Debug DrawMessageBox-----------");
        const ctx = canvasRef.current.getContext("2d");
        //initially draw the rectangle
        
        ctx.beginPath();
        ctx.fillStyle = boxColor;
        ctx.strokeStyle = boxColor; //change back to messageColor later on

        let lineLength = messageStr.length * CHAR_PIXEL_LENGTH;
        if(messageStr.length > MESSAGE_PANE_MAX_CHAR_LENGTH){
            lineLength = MESSAGE_PANE_MAX_CHAR_LENGTH * CHAR_PIXEL_LENGTH;
        }
        //console.log("Debug: lineLength is " + lineLength);
        const lineCount = (new Message("emptyObject", messageStr)).getNewlineCount();
        //console.log("Debug: lineCount is " + lineCount);
        //bottom point of the left edge's curvy quarter arc begin
        ctx.moveTo(0, MESSAGE_BOX_INSET_Y);
        ctx.arc(MESSAGE_BOX_INSET_X, MESSAGE_BOX_INSET_Y, MESSAGE_BOX_RADIUS, Math.PI, 1.5 * Math.PI);
        let currX = lineLength + MESSAGE_BOX_INSET_X;
        let currY = 0;
        ctx.lineTo(currX, currY);
        ctx.arc(currX + MESSAGE_BOX_INSET_X, MESSAGE_BOX_INSET_Y, MESSAGE_BOX_RADIUS, Math.PI * 1.5, 0);
        currX += 2 * MESSAGE_BOX_INSET_X;
        currY = MESSAGE_BOX_INSET_Y + lineCount * CHAR_PIXEL_HEIGHT;
        ctx.lineTo(currX, currY);
        ctx.arc(currX - MESSAGE_BOX_INSET_X, currY + MESSAGE_BOX_INSET_Y, MESSAGE_BOX_RADIUS, 0, 0.5 * Math.PI);
        currX = MESSAGE_BOX_INSET_X;
        currY += 2 * MESSAGE_BOX_INSET_Y;
        ctx.lineTo(currX, currY);
        currY -= MESSAGE_BOX_INSET_Y;
        ctx.arc(currX, currY, MESSAGE_BOX_RADIUS, 0.5 * Math.PI, Math.PI);
        ctx.fill();
        ctx.closePath();

        let lines = messageStr.split("\n");
        //now write the modified message which has been given as a parameter
        ctx.fillStyle = messageColor;
        ctx.strokeStyle = messageColor;
        ctx.font = MESSAGE_FONT;
        ctx.beginPath();
        for(let i = 0; i < lines.length; i++){
            let currLine = lines[i];
            let leftX = MESSAGE_BOX_INSET_X;
            let topY = MESSAGE_BOX_INSET_Y + (i * CHAR_PIXEL_HEIGHT);
            ctx.fillText(currLine, leftX, topY);
        }
        ctx.closePath();
        return null; //return null for rendering since the function is invoked from the jsx scope of render function
    }
    getModifiedMessage(givenMessage){
        let linesArr = givenMessage.tokenizeLines(); 
        let modifiedMessage = "";
        for(let j = 0; j < linesArr.length - 1; j++){
            let currLine = linesArr[j];
            modifiedMessage += currLine + "\n";
        }
        if(linesArr.length > 0){
            //add the last line
            modifiedMessage += linesArr[linesArr.length - 1];
        }
        /*console.log("getModifiedMessage Debug: returned result is " + modifiedMessage + ", linesArr length is " + linesArr.length + 
        ", givenMessage is " + JSON.stringify(givenMessage));*/
        return modifiedMessage;
    }
    //Receives a 2D array containing messages in String format
    createMessageObjects(messageArr){
        //first column contains senderName, second column contains message content
        let newMessages = [];

        for(let i = 0; i < messageArr.length; i++){
            const senderName = messageArr[i][0];
            const messageText = messageArr[i][1];
            
            let newMessage = new Message(senderName, messageText);
            newMessages.push(newMessage);
        }
        return newMessages;
    }
    canvasAction(currCanvas){
        if(currCanvas.ref.current !== null){
            this.drawMessageBox(currCanvas);
        }
        else{
            //force update the component using setState
            this.setState({emptyState: null});
        }
        
    }
    render(){
        /*for(let i = 0; i < this.canvases.length; i++){
            console.log("Debug render:" + JSON.stringify(this.canvases.at(i)));
        }*/
        console.log("Debug: MessagePane component is rendering " + this.currMessages.length);
        let counter = 0;
        let currHeight = 60;
        let prevLineCount = 0;
        return(
            <div ref={this.scrollPaneRef} style={{height: MESSAGE_PANE_HEIGHT, width: CHATBOX_WIDTH, overflowY: 'auto', position: 'relative'}}>
                {this.canvases.map(currCanvas => {
                    
                    let verticalGapCoeff = counter;
                    if(counter > 5){
                        verticalGapCoeff = 3;
                    }
                    currHeight += parseInt(prevLineCount * CHAR_PIXEL_HEIGHT + (MESSAGE_BOX_VGAP * verticalGapCoeff), 10);
                    let currLineCount = (currCanvas.currMessage.tokenizeLines()).length;
                    prevLineCount = currLineCount; //!!! This line is crucial in terms of overall logic !!!CHANGE OPERATOR TO +=

                    let currHgap;
                    if(currCanvas.currMessage.senderName === this.friendName){
                        currHgap = MESSAGE_BOX_HGAP_SHORT;
                        //console.log("Debug: TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT sender and friend names match in render of message pane");
                    }
                    else{
                        let currLineLength = Message.getMaxLineLength(currCanvas.currMessage.messageText);
                        if(currLineLength > MESSAGE_PANE_MAX_CHAR_LENGTH){
                            currLineLength = MESSAGE_PANE_MAX_CHAR_LENGTH;
                        }
                        currHgap = MESSAGE_BOX_HGAP_LONG;
                        //console.log("Debug: ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ currHgap and currLineLength are respectively is " + currHgap + ", " + currLineLength);
                    }
                    //console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKDebug: " + counter + " " + currHeight + ", " + currHgap);
                    //console.log("Debug: QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ" + currCanvas.currMessage.messageText);
                    //console.log("Debug: currCanvas.senderName and this.friendName " + currCanvas.senderName + ", " + this.friendName);
                    return (
                        <canvas style={{ position: 'absolute', left: `${currHgap}px`, top:  `${currHeight}px` }}
                            key={currCanvas.index}
                            ref={this.canvasRefs[counter++]}
                        > </canvas>
                    );
                })}
            </div>
        );
    }
}
class Message{
    senderName;
    messageText;
    constructor(senderName, messageText){
        this.senderName = senderName;
        this.messageText = messageText;
        //bind instance methods to the class
        this.getNewlineCount = this.getNewlineCount.bind(this);
        this.getBlankCharCount = this.getBlankCharCount.bind(this);
        this.tokenizeLines = this.tokenizeLines.bind(this);
    }
    /*
    *Returns the newline character count in the messageText
    */
    getNewlineCount(givenMessage = this.messageText){
        let result = (givenMessage.split(/\r\n|\r|\n/)).length;
        /*console.log("Debug getNlCount: givenMessage.length is " + givenMessage.length);
        for(let i = 0; i < givenMessage.length - 1; i++){
            let currSubstr = givenMessage.substring(i, i + 2);
            console.log(currSubstr);
            if(currSubstr === "\n"){
                result++;
            }
        }*/
        //console.log("Debug: nlCount result is " + result);
        return result - 1;
    }
    getBlankCharCount(givenMessage = this.messageText){
        let result = 0;
        for(let i = 0; i < givenMessage.length; i++){
            let currChar = givenMessage.charAt(i);
            if(currChar === ' '){
                result++;
            }
        }
        return result;
    }
    //Split the messageText content into lines for display purposes, and return an array containing the content
    tokenizeLines(currMessage = this.messageText){
        let lines = [];
        //console.log("Debug tokenizeLines: currMsg " + currMessage);
        if(this.getNewlineCount(currMessage) === 0 && this.getBlankCharCount(currMessage) === 0){
            //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            //split on each every 50 character
            let beginIndex = 0;
            while((currMessage.length - beginIndex > MESSAGE_PANE_MAX_CHAR_LENGTH)){
                let currLine = currMessage.substring(beginIndex, beginIndex + MESSAGE_PANE_MAX_CHAR_LENGTH);
                lines.push(currLine);
                beginIndex += MESSAGE_PANE_MAX_CHAR_LENGTH;
            }
            if(beginIndex < currMessage.length){
                let currLine = currMessage.substring(beginIndex);
                lines.push(currLine);
            }
        }
        else if(this.getNewlineCount(currMessage) === 0){
            //console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBB currMessage " + currMessage);
            //our string contains blank lines, we should use them to split it into substrings when necessary
            if(currMessage.length < MESSAGE_PANE_MAX_CHAR_LENGTH){
                lines.push(currMessage);
            }
            else{
                //retrieve the blank line closest to the 50th index (smaller than 50th index) and split the string into two, then recurse on the second part
                let blankIndex = MESSAGE_PANE_MAX_CHAR_LENGTH;
                for(let i = 0; i < MESSAGE_PANE_MAX_CHAR_LENGTH; i++){
                    if(currMessage.charAt(i) === ' '){
                        blankIndex = i;
                    }
                }
                let firstLine = currMessage.substring(0, blankIndex); //exclude the blank line index
                let remainingLines = this.tokenizeLines(currMessage.substring(blankIndex)); //notice this is an array !!!
                lines.push(firstLine);
                lines = lines.concat(remainingLines);
            }
        }
        else{
            /*console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCC currMessage, nlCount, blankCount respectively, " + currMessage
             + this.getNewlineCount(currMessage) + ", " + this.getBlankCharCount(currMessage));*/
            //both blank and newline characters exist, hence split from newlines and recursively call the method again
            let currLines = currMessage.split(/\r\n|\r|\n/);
            for(let i = 0; i < currLines.length; i++){
                let currLine = this.tokenizeLines(currLines[i]);
                //console.log("Debug: currLine is " + JSON.stringify(currLine));
                //console.log("Debug: Is array is " + Array.isArray(currLine));
                if(Array.isArray(currLine)){
                    lines = lines.concat(currLine); //reassign the lines array to the concatenated version as it doesn't modify the original array
                }
                else{
                    lines.push(currLine);
                }
                //console.log("Debug: lines is currently " + JSON.stringify(lines));
            }
        }
        //console.log("Debug: returned lines is " + JSON.stringify(lines));
        return lines;
    }
    //Checks and returns whether if a string contains characters which are nonblank as a boolean value
    //User is responsible for providing a valid string
    static isNonEmpty(str){
        let result = false;
        for(let i = 0; i < str.length; i++){
            if(str.at(i) !== ' '){
                result = true;
                break;
            }
        }
        return result;
    }
    //Returns the maximum length of a line, in a given string which may potentially contain newline characters
    //Returns 0 if the given str is not of type string
    static getMaxLineLength(str){
        let maxLength = 0;
        if(typeof(str) === 'string'){
            let currLines = str.split(/\r\n|\r|\n/);
            
            for(let i = 0; i < currLines.length; i++){
                let currLine = currLines[i];
                if(currLine.length > maxLength){
                    maxLength = currLine.length;
                }
            }
        }
        return maxLength;
    }
}