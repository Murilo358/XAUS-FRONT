import { useEffect, useContext, useState } from "react";
import { Client } from "@stomp/stompjs";
import AuthContext from "../Contexts/AuthContext";
import Cookies from "universal-cookie";
import { hasPermission } from "../Permissions/Permissions";
import { actions } from "../Permissions/Constants";

const UseWebSocketComponent = () => {
  const { jwtToken, authenticated, roles } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const cookies = new Cookies();
  const viewNotifications = hasPermission(roles, actions.VIEW_NOTIFICATIONS);

  const saveOrderToCookies = async (json) => {
    try {
      const parsedJson = JSON.parse(json);

      const stringfiedProducts = JSON.stringify(parsedJson.products);
      let orderId = parsedJson.id;
      const cookieName = `order_${orderId}`;
      await cookies.set(cookieName, stringfiedProducts, {
        expires: new Date(Date.now() + 86400e3),
      });
      return orderId;
    } catch (err) {
      console.error("Erro while saving order into cookies", err.message);
    }
  };

  const getAllOrdersFromCookies = () => {
    const allCookies = cookies.getAll(false);

    const orders = Object.keys(allCookies);
    setMessages([]);

    orders
      .filter((cookieName) => cookieName.startsWith("order_"))
      .map((cookieName) => {
        let cookieToAdd = allCookies[cookieName];
        cookieToAdd["id"] = cookieName.split("_")[1];
        setMessages((current) => [...current, allCookies[cookieName]]);
      });
  };

  useEffect(() => {
    let stompClient;

    getAllOrdersFromCookies();
    if (authenticated && viewNotifications) {
      console.log(jwtToken);
      stompClient = new Client({
        brokerURL: import.meta.env.VITE_PUBLIC_WEBSOCKET_URL,
      });

      const headers = {
        Authorization: "Bearer " + jwtToken,
      };

      stompClient.configure({
        connectHeaders: headers,
      });

      stompClient.onConnect = (frame) => {
        console.log("connected" + frame);

        stompClient.subscribe("/user/topich/notify", async (message) => {
          let orderId = await saveOrderToCookies(message.body);
          let returnedOrder = JSON.parse(message.body).products;
          returnedOrder["id"] = orderId;
          if (messages.length > 0) {
            setMessages((current) => [...current, returnedOrder]);
          } else {
            setMessages([returnedOrder]);
          }
        });
      };

      stompClient.onDisconnect = () => {
        console.log("disconnected from websockets");
      };

      stompClient.activate();
    }

    // Cleanup function
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [authenticated, jwtToken, roles]);

  return { messages, setMessages };
};

export default UseWebSocketComponent;
