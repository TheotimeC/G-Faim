import { FunctionComponent } from "react";
import "../assets/styles/restoheader.css";

interface FrameComponent3Props {
  categorie: string;
  restaurantName: string;
}

const FrameComponent3: FunctionComponent<FrameComponent3Props> = ({ categorie, restaurantName }) => {
  return (
    <div className="frame-wrapper25">
      <div className="rectangle-parent23">
        <img className="rectangle-icon" alt="" src="/rectangle-43@2x.png" />
        <div className="frame-child64" />
        <div className="frame-wrapper26">
          <div className="frame-parent51">
            <div className="im-lovin-it-parent">
              <div className="im-lovin-it">{categorie}</div>
              <h1 className="mcdonalds-strasbourg">{restaurantName}</h1>
            </div>
            <div className="frame-parent52">
              <div className="frame-parent53">
                <div className="order-completed-wrapper">
                  
                </div>
                <div className="frame-child65" />
              
              </div>
              <div className="frame-parent54">
                <div className="motocross-wrapper">
                  
                </div>
                <div className="frame-child66" />
                
              </div>
            </div>
          </div>
        </div>
        <div className="visual-karsa-y8fs7csn-vw-unspl-parent">
          <img
            className="visual-karsa-y8fs7csn-vw-unspl-icon1"
            loading="lazy"
            alt=""
            src="/visualkarsay8fs7csnvwunsplash-1@2x.png"
          />
          
        </div>
      </div>
    </div>
  );
};

export default FrameComponent3;
