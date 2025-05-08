import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import styles from "./messages.module.css";
import useUserStore from "../../hooks/userStore";
import { NavLink } from "react-router";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("received");
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const currentUser = useUserStore((state) => state.currentUser);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser) return;

      try {
        const messagesRef = collection(db, "messages");
        const q = query(
          messagesRef,
          where(
            view === "received" ? "recipientID" : "senderID",
            "==",
            currentUser.userID
          ),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);

        const fetchedMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(fetchedMessages);

        const userIds = [
          ...new Set(
            fetchedMessages.flatMap((msg) => [msg.senderID, msg.recipientID])
          ),
        ];
        const userData = {};
        for (const userId of userIds) {
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            userData[userId] = userDoc.data().username || "Unknown User";
          }
        }
        setUserDetails(userData);

        const productIds = [
          ...new Set(fetchedMessages.map((msg) => msg.productId)),
        ];
        const productData = {};
        for (const productId of productIds) {
          const productDoc = await getDoc(doc(db, "allads", productId));
          if (productDoc.exists()) {
            productData[productId] = productDoc.data();
          }
        }
        setProductDetails(productData);

        if (view === "received") {
          const batchUpdates = querySnapshot.docs.map((doc) =>
            updateDoc(doc.ref, { isRead: true })
          );
          await Promise.all(batchUpdates);
          console.log("All received messages marked as read.");
        }
      } catch (err) {
        console.error("Error fetching messages or user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser, view]);

  const toggleView = () => {
    const newView = view === "received" ? "sent" : "received";
    setView(newView);
    setExpandedMessage(null);
    setReplyingTo(null);
  };

  const toggleMessage = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
    setReplyingTo(null);
  };

  const handleReply = async (e, message) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You need to log in to send messages.");
      return;
    }

    if (!replyContent.trim()) {
      alert("Please write a reply before sending.");
      return;
    }

    try {
      await addDoc(collection(db, "messages"), {
        senderID: currentUser.userID,
        recipientID: message.senderID,
        content: replyContent.trim(),
        title: `Re: ${message.title}`,
        timestamp: serverTimestamp(),
        isRead: false,
        productId: message.productId,
      });

      alert("Reply sent successfully!");
      setReplyingTo(null);
      setReplyContent("");
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Failed to send the reply. Please try again.");
    }
  };

  if (loading) return <div className={styles.status}>Loading messages...</div>;

  const groupedMessages = messages.reduce((acc, message) => {
    const { productId } = message;
    if (!acc[productId]) acc[productId] = [];
    acc[productId].push(message);
    return acc;
  }, {});

  return (
    <div className={styles.wrapper}>
      <div className={styles.messagesContainer}>
        <button onClick={toggleView} className={styles.toggleButton}>
          {view === "received"
            ? "View Sent Messages"
            : "View Received Messages"}
        </button>

        <div className={styles.header}>
          <h2>{view === "received" ? "Received Messages" : "Sent Messages"}</h2>
        </div>

        {Object.keys(groupedMessages).length === 0 ? (
          <p className={styles.noMessages}>No messages to display.</p>
        ) : (
          Object.entries(groupedMessages).map(([productId, messages]) => {
            const product = productDetails[productId];
            return (
              <div key={productId} className={styles.productGroup}>
                <h3 className={styles.productTitle}>
                  <NavLink
                    to={`/product/${productId}`}
                    className={styles.productLink}
                  >
                    {product ? (
                      <>
                        <img
                          src={product.images?.[0]}
                          alt={product.title}
                          className={styles.productImage}
                        />
                        {product.title}
                      </>
                    ) : (
                      `Product ID: ${productId}`
                    )}
                  </NavLink>
                </h3>
                {messages.map((message) => (
                  <div key={message.id} className={styles.messageItem}>
                    <div className={styles.messageMeta}>
                      <small>
                        From: {userDetails[message.senderID]} | To:{" "}
                        {userDetails[message.recipientID]} |{" "}
                        {new Date(
                          message.timestamp?.seconds * 1000
                        ).toLocaleString()}
                      </small>
                    </div>
                    <div
                      className={styles.messageTitle}
                      onClick={() => toggleMessage(message.id)}
                    >
                      {message.title}
                    </div>
                    {expandedMessage === message.id && (
                      <div className={styles.messageBody}>
                        <p>{message.content}</p>
                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === message.id ? null : message.id
                            )
                          }
                          className={styles.replyButton}
                        >
                          {replyingTo === message.id ? "Cancel Reply" : "Reply"}
                        </button>
                        {replyingTo === message.id && (
                          <form
                            className={styles.replyForm}
                            onSubmit={(e) => handleReply(e, message)}
                          >
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Write your reply here..."
                              className={styles.replyInput}
                              required
                            />
                            <button
                              type="submit"
                              className={styles.sendReplyButton}
                            >
                              Send Reply
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Messages;
