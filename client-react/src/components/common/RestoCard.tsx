import { FunctionComponent, useMemo, type CSSProperties } from "react";
import Icon from '@mdi/react';
import { mdiPlusCircle } from '@mdi/js';
import "../assets/styles/restocard.css"

export type GroupComponent2Type = {
  Titre?: string;
  Description?: string;
  img?: string;

  /** Style props */
  propPadding?: CSSProperties["padding"];
  propGap?: CSSProperties["gap"];
  propGap1?: CSSProperties["gap"];
  propWidth?: CSSProperties["width"];
  propLineHeight?: CSSProperties["lineHeight"];
  propHeight?: CSSProperties["height"];
  propBackgroundImage?: CSSProperties["backgroundImage"];
  onClick?: () => void;
};

const GroupComponent2: FunctionComponent<GroupComponent2Type> = ({
  Titre,
  Description,
  img,
  propPadding,
  propGap,
  propGap1,
  propWidth,
  propLineHeight,
  propHeight,
  propBackgroundImage,
  onClick,
}) => {
  const groupDivStyle: CSSProperties = useMemo(() => {
    return {
      padding: propPadding,
    };
  }, [propPadding]);

  const logicOperatorStyle: CSSProperties = useMemo(() => {
    return {
      gap: propGap,
    };
  }, [propGap]);

  const branchSplitterStyle: CSSProperties = useMemo(() => {
    return {
      gap: propGap1,
    };
  }, [propGap1]);

  const royalCheeseBurgerStyle: CSSProperties = useMemo(() => {
    return {
      width: propWidth,
      lineHeight: propLineHeight,
    };
  }, [propWidth, propLineHeight]);

  const mcChicken1BigStyle: CSSProperties = useMemo(() => {
    return {
      height: propHeight,
    };
  }, [propHeight]);

  const functionBeginStyle: CSSProperties = useMemo(() => {
    return {
      backgroundImage: propBackgroundImage,
    };
  }, [propBackgroundImage]);

  return (
    <div className="rectangle-parent29" style={groupDivStyle}>
      <div className="frame-child75" />
      <div className="condition-pair">
        <div className="logic-operator" style={logicOperatorStyle}>
          <div className="branch-splitter" style={branchSplitterStyle}>
            <div className="royal-cheese-burger" style={royalCheeseBurgerStyle}>
              {Titre}
            </div>
            <div className="mcchicken-1-big" style={mcChicken1BigStyle}>
              {Description}
            </div>
          </div>
          <b className="b24">23.10 €</b>
        </div>
      </div>
      <div 
        className="function-begin" 
        style={{
          ...functionBeginStyle, 
          backgroundImage: `url(${img})`
        }}
      >
        <img className="function-begin-child" alt="" src={img} />
        <div className="function-end" onClick={onClick}>
          <div className="data-processor" />
          <Icon className="plus-icon1" path={mdiPlusCircle} size={2} />
        </div>
      </div>
    </div>
  );
};

export default GroupComponent2;
