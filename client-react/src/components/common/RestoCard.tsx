import { FunctionComponent, useMemo, type CSSProperties } from "react";
import Icon from '@mdi/react';
import { mdiPlusCircle } from '@mdi/js';
import "../assets/styles/restocard.css"
import api from "./api.ts";
import {message} from "antd";

export type GroupComponent2Type = {
  Titre?: string;
  Description?: string;
  img?: string;
  prix?: number;

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
  prix,
  propPadding,
  propGap,
  propGap1,
  propWidth,
  propLineHeight,
  propHeight,
  propBackgroundImage,
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
  type CartItem = {
    id: number;
    name: string;
    price: string; // Consider converting this to number if your backend sends it as a number
    quantity: number;
    imgSrc: string;
  };
  const getCart = async (): Promise<CartItem[]> => {
    try {
      const response = await api.get<{ items: CartItem[] }>(`http://localhost:3002/orders/cart`, {
        params: {
          userId: "user123",
        },
      });
      console.log(response.data.items);
      return response.data.items; // Assuming the response data structure includes an items array
    } catch (error: any) {
      console.error('Error fetching cart:', error.response ? error.response.data : error.message);
      return []; // Return empty array on error
    }
  };
  const [messageApi, contextHolder] = message.useMessage()
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'Item added to cart !',
      duration: 2
    });
  };
  const updateCart = async () => {
    // Construct the new item object
    const newItem = {
      name: Titre,
      description: Description,
      imgSrc: img,
      price: prix || 0,
      quantity: 1, // Default quantity set to 1, adjust as necessary
    };
    // Assuming you have a way to get the current user's ID and current cart items
    const userId = "user123"; // Example user ID
    let currentCartItems: any[] = await getCart(); // You would fetch current cart items here
    // Check if the item already exists in the cart
    const existingItemIndex = currentCartItems.findIndex((item) => item.name === newItem.name);

    // If it exists, update the quantity, otherwise add as a new item
    if (existingItemIndex !== -1) {
      const existingItem = currentCartItems[existingItemIndex];
      currentCartItems[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity + newItem.quantity };
    } else {
      currentCartItems.push(newItem);
    }

    // Add the new item to the current cart items

    try {
      // Make API call to update the cart
      await api.put(`http://localhost:3002/orders/cart`, {
        userId: userId,
        items: currentCartItems,
      });
      success();
      console.log("Item added to cart successfully");
      // Optionally, trigger a state update or refetch cart items to reflect the change in UI
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  return (
      <>
        {contextHolder}
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
          <b className="b24">{prix}€</b>
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
        <div className="function-end" onClick={updateCart}>
          <div className="data-processor" />
          <Icon className="plus-icon1" path={mdiPlusCircle} size={2} />
        </div>
      </div>
    </div>
        </>
  );
};

export default GroupComponent2;
