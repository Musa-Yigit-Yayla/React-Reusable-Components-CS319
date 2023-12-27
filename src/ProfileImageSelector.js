import React from "react";
//import {useRef} from "react";

const initialCircleX = 50.0;
const initialCircleY = 50.0;
const initialCircleRadius = 40.0;
const filterRectWidth = 225;
const filterRectHeight = 225;
const imageContainerWidth = '225px';
const imageContainerHeight = '225px';

export default class ProfileImageSelector extends React.Component{
    //In props we expect the image user has provided in their local
    constructor(props){
        super(props);
        //bind the functions to "this" reference
        this.getNewCoordinates = this.getNewCoordinates.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this); //instead of binding we can use arrow function but I prefer binding
        this.handleMouseDrag = this.handleMouseDrag.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.getCirclePoints = this.getCirclePoints.bind(this);
        this.drawFilter = this.drawFilter.bind(this);
        this.render = this.render.bind(this);
        //this.setSliderHandler = this.setSliderHandler.bind(this);
        this.sliderHandler = this.sliderHandler.bind(this);

        this.isMouseDown = false;
        this.canvasRef = React.createRef(); //useref will enable us to have accessibility for the canvas reference attribute
        this.sliderRef = React.createRef();
        this.state = {
            circleX: initialCircleX,
            circleY: initialCircleY,
            circleRadius: initialCircleRadius
        };
        this.renderCount = 0; //variable for handling the procedure of setting the slider's handler method inside the render function
    }

    /*
    *Parameter e is the event that has occured, must be passed by the caller
    *Returns an array in the format of {x, y}
    **/
    getNewCoordinates(x, y){
        let newX = x;
        let newY = y;
        let radius = parseInt(this.state.circleRadius);

        let isXSet = false;
        if(newX >= this.state.circleRadius && newX + radius <= filterRectWidth){
            isXSet = true; //x is already in acceptable bounds
        }

        let isYSet = false;
        if(newY >= radius && newY + radius <= filterRectHeight){
            isYSet = true;
        }
        console.log("Coordinate Debug: INITIAL NEWX NEWY ARE " + newX + ", and " + newY);
        console.log("Coordinate Debug: CIRCLE RADIUS IN GETNEWCOORDINATES IS " + this.state.circleRadius);
        if(!isXSet && (newX - radius < 0)){
            console.log("Coordinate Debug: executing first if block");
            console.log("newX:", newX);
            console.log("Circle Radius:", this.state.circleRadius);
            newX = radius;
        }
        else if(!isXSet && (newX + radius > filterRectWidth)){
            console.log("Coordinate Debug: executing second if block, and filterRectWidth is " + filterRectWidth);
            console.log("newX:", newX);
            console.log("Circle Radius:", this.state.circleRadius);
            console.log("filterRectWidth:" + filterRectWidth);
            newX = filterRectWidth - radius;
        }

        if(!isYSet && (newY - radius < 0)){
            console.log("Coordinate Debug: executing third if block");
            newY = radius;
        }
        else if(!isYSet && (newY + radius > filterRectHeight)){
            console.log("Coordinate Debug: executing fourth if block, and filterRectHeight is" + filterRectHeight);
            newY = filterRectHeight - radius;
        }
        console.log("Coordinate Debug: Given {x, y} coordinates and the resulting ones are (" + x + ", " + y + ") and" + "(" + newX + ", " + newY + ")");
        //return {newX, newY};
        let coordinateArr = [newX, newY];
        return coordinateArr;
    }
    //Event handlers
    handleClick(x, y){
        if(this.isMouseDown){ //only perform the drag operation if the user is still pressing the mouse
            x = parseInt(x);
            y = parseInt(y);
            let coordinates = this.getNewCoordinates(x, y);
            let newX = coordinates[0];
            let newY = coordinates[1];
            console.log("handleClick Debug: newX and newY are " + newX + ", " + newY);
            this.setState({circleX: newX, circleY: newY, circleRadius: this.state.circleRadius}); //for setting circleX, circleY
            //this.setSliderHandler();
            this.drawFilter();
            this.setState({circleX: newX, circleY: newY, circleRadius: this.state.circleRadius}); //for re-rendering
        }
    }
    //Drag enter
    handleMouseDown(e){
        console.log("Debug: Setting mouseDown true in handleMouseDown");
        this.isMouseDown = true;
        this.handleClick(e.clientX, e.clientY);
    }
    //Drag exit
    handleMouseUp(e){
        console.log("Debug: Setting mouseDown false in handleMouseUp");
        this.isMouseDown = false;
        this.handleClick(e.clientX, e.clientY);
    }
    //Drag
    handleMouseDrag(e){
        if(this.isMouseDown){
            console.log("Debug: executing handleClick from handleMouseDrag, points are (x, y): (" + e.clientX + ", " + e.clientY + ")");
            this.handleClick(e.clientX, e.clientY);
        }
    }
    /*
    *pointPrecision specifies how many points will be on the returned array, must be an integer divisible by 4
    *current circle must not be out of the screen
    *returns the points on the circumference of the current circle as {x0, y0, x1, y1, ... xn - 1, yn - 1}
    */
    getCirclePoints(pointPrecision = 360){
        let result = [];
        
        //Rightmost point of the circle
        const rightX = this.state.circleX + this.state.circleRadius;
        const rightY = this.state.circleY;

        const theta = 2 * Math.PI / pointPrecision;

        //traverse anti-clockwise
        for(let i = 0; i < pointPrecision; i++){
            let currAngle = theta * i;
            let currX;
            let currY;

            if(i === pointPrecision / 4){
                //region 1
                currX = rightX - Math.cos(currAngle) * this.state.circleRadius;
                currY = rightY + Math.sin(currAngle) * this.state.circleRadius;
            }
            else if(i < pointPrecision / 2){
                //region 2
                currX = rightX + 2 * Math.cos(currAngle) * this.state.circleRadius;
                currY = rightY - Math.sin(currAngle - (2 * Math.PI / 4)) * this.state.circleRadius;
            }
            else if(i < pointPrecision * 0.75){
                //region 3
                currX = (rightX - this.state.circleRadius) - Math.cos(currAngle - (2 * Math.PI / 2)) * this.state.circleRadius;
                currY = rightY + Math.sin(currAngle) * this.state.circleRadius;
            }
            else{
                //region 4
                currX = rightX - (1 - Math.cos(currAngle)) * this.state.circleRadius;
                currY = rightY + Math.sin(currAngle) * this.state.circleRadius;
            }
            result.push(currX);
            result.push(currY);
        }
        return result;
    }
    getCirclePoints2(pointPrecision = 360) {
        const result = [];
        const { circleX, circleY, circleRadius } = this.state;
        const angleIncrement = (2 * Math.PI) / pointPrecision;
    
        for (let i = 0; i < pointPrecision; i++) {
            const angle = angleIncrement * i;
            const currX = circleX + Math.cos(angle) * circleRadius;
            const currY = circleY + Math.sin(angle) * circleRadius;
    
            result.push(currX, currY);
        }
    
        return result;
    }
    
    drawFilter(){
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");

        //clear the previously drawn contents
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //The logic is to draw a polygon which is comprised of the edges of the scene, and the circumference of
        //the circle positioned in the {x, y} = {circleX, circleY} with radius circleRadius

        //let circlePoints = this.getCirclePoints(); //obtain the bounding circle's circumference
        
        //draw the filtered poligon with respect to circlePoints

        const filterTransparency = 0.2; //0 is full transparent, 1 is full opaque
        const r = 0, g = 0, b = 0;
        const filterFillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + filterTransparency + ")";

        const defaultLineWidth = 1;
        const circleLineWidth = 8;

        ctx.fillStyle = filterFillStyle;
        ctx.strokeStyle = filterFillStyle;

        

        const rectX = 0, rectY = 0;

        /*ctx.beginPath();
        let circlePoints = this.getCirclePoints2();
        console.log("Debug: Circle points are " + circlePoints);

        const rectTopLeftX = 0, rectTopleftY = 0;
        const rectTopRightX = (rectTopLeftX + filterRectWidth), rectTopRightY = 0;
        const rectBottomRightX = (rectTopRightX), rectBottomRightY = rectTopRightY + filterRectHeight;
        const rectBottomLeftX = rectTopLeftX, rectBottomLeftY = rectBottomRightY;
        ctx.moveTo(rectTopLeftX, rectTopleftY);
        ctx.lineTo(rectTopRightX, rectTopRightY);
        ctx.lineTo(rectBottomRightX, rectBottomRightY);
        ctx.lineTo(rectBottomLeftX, rectBottomLeftY);

        for(let i = 0; i < circlePoints.length - 1; i++){
            let currX = circlePoints[i];
            let currY = circlePoints[i + 1];
            if(i === 0){
                ctx.moveTo(currX, currY);
            }
            else{
                ctx.lineTo(currX, currY);
            }
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();*/
        
        //set the line width before starting the path
        ctx.lineWidth = defaultLineWidth;
        ctx.beginPath();
        //ctx.globalCompositeOperation = 'destination-atop';
        console.log("Debug FilterRect: rectX, rectY, width, height attributes are " + rectX + ", " + rectX + ", " + filterRectWidth + ", " + filterRectHeight);
        ctx.rect(rectX, rectY, filterRectWidth, filterRectHeight);
        ctx.fill();
        ctx.stroke(); //invoke the fill() and stroke() methods right after you have drawn something to set its paint properties
        ctx.closePath();

        const transparentStyle = 'transparent';

        const purpleR = 106;
        const purpleG = 13;
        const purpleB = 173;
        const circleStrokeStyle = "rgba(" + purpleR + ", " + purpleG + ", " + purpleB + ", " + (filterTransparency * 3) + ")";

        ctx.fillStyle = transparentStyle;
        ctx.strokeStyle = circleStrokeStyle;
        
        ctx.lineWidth = circleLineWidth;
        ctx.beginPath();
        ctx.globalCompositeOperation = 'destination-over'; //use destination over to go over to the 
        ctx.arc(this.state.circleX, this.state.circleY, this.state.circleRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.globalCompositeOperation = 'source-over'; //switch back to regular globalCompositeOperation value

        //ctx.globalCompositeOperation = 'source-over';
        console.log("drawFilter Debug: The values of circleX, circleY, radius are sequentially " + this.state.circleX + ", " + this.state.circleY + ", " + this.state.circleRadius);
    }
    /*setSliderHandler(){
        console.log("Debug: sliderRef.current is " + this.sliderRef.current + "\nDebug: setSliderHandler method, render count is" + this.renderCount);
        if(this.renderCount === 1){
            const slider = this.sliderRef.current;
            slider.onInput = this.sliderHandler(slider);
        }
        if(this.renderCount <= 2){
            this.renderCount++;
        }
    }*/
    //sliderHandler function which receives a reference of the slider
    sliderHandler(){
        const sliderValue = this.sliderRef.current.value;
        console.log("Debug Slider: slider value is " + sliderValue);
        this.setState({circleX: this.state.circleX, circleY: this.state.circleY, circleRadius: sliderValue});
        //re-render the canvas after each change
        this.drawFilter();    
    }
    render(){
        return(
            <>
                <div id="imageContainer" className="imageContainerStyle">
                    <div style={{width: imageContainerWidth, height: imageContainerHeight}}>
                        <img src={this.props.imageUrl} alt="given user profile picture" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                         onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseDrag}></img>
                    </div>
                    <canvas ref={this.canvasRef} width={filterRectWidth} height={filterRectHeight} className="canvas" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseDrag}></canvas>
                </div>
                <div id="radiusSliderContainer" className="imageContainerStyle">
                    <input ref={this.sliderRef} onInput={this.sliderHandler} type='range' min='20' max='100'></input>
                </div>
                
            </>
        );
    }
}