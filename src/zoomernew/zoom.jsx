import {
  forwardRef,
  useEffect,
  useState,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { Rnd } from "react-rnd";
import "../components/ZoomItem/ZoomItem.css";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import DrophouseLogo from "../assets/logo_footer_t.png";

const ZoomItem = forwardRef(function Zoom(props, ref) {
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      const image = await props.imageSrc; 
      setBackgroundImage(image);
    };

    fetchImage();
  }, [props.imageSrc,props]);
  const pointDirections = ["ne", "nw", "se", "sw"];
  const [imageX, setImageX] = useState(105);
  const [imageY, setImageY] = useState(105);
  const [imageWidth, setImageWidth] = useState("59%");
  const [imageHeight, setImageHeight] = useState("59%");
  const [R_width, setRWidth] = useState(320);
  const [R_width_rend, setRWidth_rend] = useState(320);
  const [container_width, setContainerWidth] = useState(128);
  const [container_width_rend, setContainerWidth_rend] = useState(128);
  const [out_container_width, setOutContainerWidth] = useState(512);
  const [initOffset, setInitOffset] = useState(25);
  const { apparel } = useContext(AppContext);
  const zoomerImageRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(()=>{
    setRWidth(props.dimensions.Dim_width/100*450)
  },[props.dimensions.Dim_width,props])

  function resetAllPositions() {
    console.log('Positions are reseted')
    if (window.innerWidth < 544) {
      //mobile devices
      setContainerWidth(180);
      setImageHeight('59%');
      setImageWidth('59%');
      setContainerWidth_rend(180);
      setRWidth_rend(300);
      setContainerWidth_rend(310);
      setRWidth(85);
      setOutContainerWidth(310);
      setInitOffset(33);
      setImageX(63);
      // setImageWidth(65);
      
      setImageY(63);
    } else {
      setContainerWidth(270);
      setImageHeight('59%');
      setImageWidth('59%');
      setRWidth_rend(450);
      setOutContainerWidth(512);
      setContainerWidth_rend(512);
      setInitOffset(23);
      setImageX(95);
      setImageY(95);
    }
  }
  useEffect(() => {
    resetAllPositions();
  }, []);

  useImperativeHandle(
    ref,
    () => {
      return {
        getEditedImageRef() {
          return zoomerImageRef;
        },
        resetImagePosition() {
          return resetAllPositions();
        },
        resetAllPositions() {
          return resetAllPositions();
        }
      };
    },
    []
  );

  function setZoomBoundaryStyle(apparel) {
    switch (apparel) {
      case "mug":
        return "mugZoomBoundary";
      case "cap":
        return "capZoomBoundary";
      default:
        return "zoomBoundary";
    }
  }

  function setZoomerInnerBoundaryStyle(apparel) {
    switch (apparel) {
      case "mug":
        return "mugInnerZoomBoundary";
      default:
        return "zoomInnerBorder";
    }
  }

  function isPercentage(input) {
    var pattern = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)%$/;
    return pattern.test(input);
  }

  function calculate_R_BackgroundPosition(R_width, container_width, isMobile = false) {
    // console.log(isMobile ? 'calculating mobile' : 'calculating');
    let ratio = R_width / container_width;
    let offset = isMobile ? 13.7 : 20.7;
    
    return `${(imageX * ratio) - (R_width * 0.5) + offset}px ${(imageY * ratio) - (R_width * 0.5) + offset}px`;
  }
  function calculate_R_BackgroundSize(R_width, container_width, isMobile = false) {
    let width = 0;
    let height = 0;
    let offset = isMobile ? 42.5 : 0;

    if (isPercentage(imageWidth)) {
        width = R_width + offset;
        height = R_width + offset;
    } else {
        let ratio = R_width / container_width;
        width = parseInt(imageWidth) * ratio;
        height = parseInt(imageHeight) * ratio;
    }

    return `${width}px ${height}px`;
  }
  const [alignment, setAlignment] = useState("Edit");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  function calculate_R_BackgroundPosition_rend(R_width_rend, container_width_rend, isMobile = false) {
    let ratio = R_width_rend / container_width_rend;
    let newimageX = imageX * 1.8;
    let newimageY = imageY * 1.8;
    
    if (isMobile) {
        return `${newimageX * ratio - R_width_rend + 190}px ${newimageY * ratio - R_width_rend + 190}px`;
    } else {
        return `${newimageX * ratio - R_width_rend * 0.38 + 25}px ${newimageY * ratio - R_width_rend * 0.38 + 25}px`;
    }
  }

  function calculate_R_BackgroundSize_rend(R_width_rend, container_width_rend, isMobile = false) {
    let width = 0;
    let height = 0;
    let ratio = R_width_rend / container_width_rend;

    if (isPercentage(imageWidth)) {
        width = R_width_rend;
        height = R_width_rend;
    } else {
        if (isMobile) {
            width = parseInt(imageWidth) * ratio * 1.666;
            height = parseInt(imageHeight) * ratio * 1.666;
        } else {
            width = parseInt(imageWidth) * ratio * 1.9;
            height = parseInt(imageHeight) * ratio * 1.9;
        }
    }
    
    return `${width}px ${height}px`;
  }

  return (
    <div
      id="zoomer-new"
      className={`relative z-[4] mt-[10%] grid w-full h-full ${props.isZoomEnabled ? '' : 'hidden'}`}
      // style={{height: `460px`,width: `460px`}}
    >
       <div className="nav-zoomer">
        {/* <button onClick={() => navigate(-1)} className={`absolute`}>
        <svg className="back-arrow-zoomer" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292"/></svg>
        </button> */}
        <img
            className="h-[2rem] md:h-[3rem] mx-auto"
            src={DrophouseLogo}
            alt="logo"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
      <div className={`grid grid-cols-2 md:grid-cols-2 justify-items-center items-center fixed w-full ${!(window.innerWidth <= 544) ? `` : `hidden`}`} style={{top: `50px`,width: `100vw`,height: `30px` ,backgroundColor: `white`,zIndex: `99999999`,color: `rgb(128, 0, 0)`,fontSize: `19px`}}>
        <div className="grid" style={{width: `100%`,height: `30px`,textAlign: `center`, border: `1px solid grey`}}>Preview</div>
        <div className="grid" style={{width: `100%`,height: `30px`,textAlign: `center`, border: `1px solid grey`,borderLeft: `none`}}>Edit</div>
      </div>
      <div className={`grid ${!(window.innerWidth <= 1024)? `grid-cols-2 `:`grid-cols-1`}  justify-items-center items-center relative w-full`} style={{width: `100vw`,height: `87vh`}}>
      <div className={`preview-div`}>
      <div className={`grid ${!(window.innerWidth <= 544) ? `hidden` : ``}`} style={{color: `rgb(128, 0, 0)`,width: `100%`,height: `30px`,position: `absolute`,top: `-10%`,textAlign: `center`, border: `1px solid grey`}}>Preview</div>
      <canvas className={`${props.TshirtImageSrc ? props.TshirtImageSrc.split('/').pop().split('_')[0] : ``}-R-Src-Img bg-repeat R_Preview outline-dashed outline-offset outline-green-500`}
        style={{
          width: `${props.dimensions.Dim_width}%`,
          height: `${props.dimensions.Dim_height}%`,
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: `${!(window.innerWidth < 544) ? calculate_R_BackgroundPosition(R_width,container_width) : calculate_R_BackgroundPosition(R_width,container_width,true)}`,
          backgroundSize: `${!(window.innerWidth < 544)? calculate_R_BackgroundSize(R_width,container_width) : calculate_R_BackgroundSize(R_width / 2,container_width / 2,true)}`,
          position: `absolute`,
          top: `${props.dimensions.Dim_top}%`,
        left: `${props.dimensions.Dim_left}%`
        }}
        ref={zoomerImageRef}
         >
        {/* <img
          draggable={false} 
          className={`w-full h-full`}
          src={R_image}
          alt="R image"
        /> */}
      </canvas>
      <div className={`${props.TshirtImageSrc ? props.TshirtImageSrc.split('/').pop().split('_')[0]: `` }-preview preview-new-zoomer relative bg-no-repeat bg-contain bg-center z-40`}
          style={{
            backgroundImage: `url(${props.TshirtImageSrc})`,
            top: `0`,
            left: `0`,
          }}>

        </div>
      </div>
      <div className={`zoomer-interactive-div relative ${!(window.innerWidth < 544) ? `hei-460` : ``}`}
      //  style={{height: `460px`,width: `460px`}}
       >
      <div className={`grid ${!(window.innerWidth <= 544) ? `hidden` : ``}`} style={{color: `rgb(128, 0, 0)`,width: `100%`,height: `30px`,textAlign: `center`, border: `1px solid grey`,position: `absolute`,top: `-17%`}}>Edit</div>
        <span className="zoomer-span">Adjust the image inside the red dotted square !</span>
      <div
        className="rectangle-img-border"
        style={{
          width: `${imageWidth}`,
          height: `${imageHeight}`,
          top: `${imageY}px`,
          left: `${imageX}px`,
          position: `absolute`,
          zIndex: `9999`,
          backgroundColor: `transparent`,
          border: `3px dotted red`,
          pointerEvents: `none`
        }}
        ><div className="control-point point-ne"></div><div className="control-point point-nw"></div><div className="control-point point-se"></div><div class="control-point point-sw"></div>
      </div>
      {/* dotted lines on zoomer */}
      {/* <canvas className={`canvas-R ${(window.innerWidth < 544) ? `hidden` : ``}`} style={{ */}
      <canvas className={`canvas-R`} style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: `${!(window.innerWidth < 544) ? calculate_R_BackgroundPosition_rend(R_width_rend,container_width_rend) : calculate_R_BackgroundPosition_rend(R_width_rend,container_width_rend,true)}`,
        backgroundSize: `${!(window.innerWidth < 544)? calculate_R_BackgroundSize_rend(R_width_rend,container_width_rend) : calculate_R_BackgroundSize_rend(R_width_rend,container_width_rend,true)}`,
        opacity: `1`,
        height: `${(window.innerWidth < 544) ? `300px`: `450px`}`,
        width: `${(window.innerWidth < 544) ? `300px`: `450px`}`,
        top: `0`,
        left: `0`,
      }}
      
      ></canvas>
      {/* <div className="canvas-R z-20" style={{
              height: `${(window.innerWidth < 544) ? `300px`: `450px`}`,
              width: `${(window.innerWidth < 544) ? `300px`: `450px`}`,
              left: `0`,
              top: `-400px`,
              zIndex: `9999`,
              position: `absolute`
      }}></div> */}
      <canvas className={`canvas-R z-20`}
      style={{ backgroundImage: `url(${props.ZoomerMock})`,}}
      ></canvas>
      <canvas className="whitespace-top"></canvas>
      <canvas className="whitespace-left"></canvas>
      <canvas className="whitespace-right"></canvas>
      <canvas className="whitespace-bottom"></canvas>
      <div
        className={`mx-auto relative bg-repeat w-full h-full`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: `${imageX}px ${imageY}px`,
          backgroundSize: `${imageWidth} ${imageHeight}`,
          // position: "fixed",
          height: `${!(window.innerWidth <= 544) ? `460px` : `310px`}`,
          width: `${!(window.innerWidth <= 544) ? `460px` : `310px`}`,
        }}
        
      ></div>
      <Rnd
        data-html2canvas-ignore="true"
        className={`z-10 flex bg-repeat-round`}
        bounds={"parent"}
        size={{ width: `${imageWidth}`, height: `${imageHeight}` }}
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(${backgroundImage})`,
          top: `-${initOffset}%`,
          left: `-${initOffset}%`,
          border: `1px dotted #800000`,
        }}
        position={{ x: imageX, y: imageY }}
        maxHeight={"100%"}
        maxWidth={"100%"}
        enableResizing={{
          bottom: false,
          bottomLeft: true,
          bottomRight: true,
          left: false,
          right: false,
          top: false,
          topLeft: true,
          topRight: true,
        }}
        onDrag={(e, d) => {
          setImageX(imageX + d.deltaX);
          setImageY(imageY + d.deltaY);
        }}
        onResize={(e, direction, ref, delta, position) => {
          setImageWidth(ref.offsetWidth + "px");
          setImageHeight(ref.offsetHeight + "px");
          setImageX(position.x);
          setImageY(position.y);
        }}
      >
        {pointDirections.map((item, index) => (
          <div key={index} className={`control-point point-${item}`}></div>
        ))}
      </Rnd>
      </div>
      </div>
    </div>
  );
});

export default ZoomItem;
