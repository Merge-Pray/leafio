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
        let q;

        if (view === "received") {
          q = query(
            messagesRef,
            where("recipientID", "==", currentUser.userID),
            where("visibleForRecipient", "==", true),
            orderBy("timestamp", "desc")
          );
        } else if (view === "sent") {
          q = query(
            messagesRef,
            where("senderID", "==", currentUser.userID),
            where("visibleForSender", "==", true),
            orderBy("timestamp", "desc")
          );
        } else if (view === "trash") {
          const receivedTrashQuery = query(
            messagesRef,
            where("recipientID", "==", currentUser.userID),
            where("visibleForRecipient", "==", false)
          );

          const sentTrashQuery = query(
            messagesRef,
            where("senderID", "==", currentUser.userID),
            where("visibleForSender", "==", false)
          );

          const [receivedTrashSnapshot, sentTrashSnapshot] = await Promise.all([
            getDocs(receivedTrashQuery),
            getDocs(sentTrashQuery),
          ]);

          const receivedTrashMessages = receivedTrashSnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

          const sentTrashMessages = sentTrashSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const allTrashMessages = [
            ...receivedTrashMessages,
            ...sentTrashMessages,
          ];
          setMessages(allTrashMessages);
          return;
        }

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
            userData[userId] =
              userDoc.data().username || "Unbekannter Benutzer";
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
          console.log("Alle empfangenen Nachrichten als gelesen markiert.");
        }
      } catch (err) {
        console.error(
          "Fehler beim Abrufen der Nachrichten oder Benutzerdetails:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser, view]);

  const toggleMessage = (messageId) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
    setReplyingTo(null);
  };

  const handleReply = async (e, message) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Du musst eingeloggt sein, um Nachrichten zu senden.");
      return;
    }

    if (!replyContent.trim()) {
      alert("Bitte schreibe eine Antwort, bevor du sie sendest.");
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
        visibleForSender: true,
        visibleForRecipient: true,
      });

      alert("Antwort erfolgreich gesendet!");
      setReplyingTo(null);
      setReplyContent("");
    } catch (err) {
      console.error("Fehler beim Senden der Antwort:", err);
      alert(
        "Die Antwort konnte nicht gesendet werden. Bitte versuche es erneut."
      );
    }
  };

  const handleDelete = async (message) => {
    try {
      const messageRef = doc(db, "messages", message.id);

      if (currentUser.userID === message.recipientID) {
        await updateDoc(messageRef, { visibleForRecipient: false });
      } else if (currentUser.userID === message.senderID) {
        await updateDoc(messageRef, { visibleForSender: false });
      }
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== message.id)
      );
    } catch (err) {
      console.error("Fehler beim Löschen der Nachricht:", err);
      alert(
        "Die Nachricht konnte nicht gelöscht werden. Bitte versuche es erneut."
      );
    }
  };

  const handleRestore = async (message) => {
    try {
      const messageRef = doc(db, "messages", message.id);

      if (currentUser.userID === message.recipientID) {
        await updateDoc(messageRef, { visibleForRecipient: true });
      } else if (currentUser.userID === message.senderID) {
        await updateDoc(messageRef, { visibleForSender: true });
      }
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== message.id)
      );
    } catch (err) {
      console.error("Fehler beim Wiederherstellen der Nachricht:", err);
      alert(
        "Die Nachricht konnte nicht wiederhergestellt werden. Bitte versuche es erneut."
      );
    }
  };

  if (loading)
    return <div className={styles.status}>Nachrichten werden geladen...</div>;

  const groupedMessages = messages.reduce((acc, message) => {
    const { productId } = message;
    if (!acc[productId]) acc[productId] = [];
    acc[productId].push(message);
    return acc;
  }, {});

  return (
    <div className={styles.wrapper}>
      <div className={styles.messagesContainer}>
        <div className={styles.viewButtons}>
          <button
            onClick={() => setView("received")}
            className={`${styles.viewButton} ${
              view === "received" ? styles.active : ""
            }`}
          >
            Posteingang
          </button>
          <button
            onClick={() => setView("sent")}
            className={`${styles.viewButton} ${
              view === "sent" ? styles.active : ""
            }`}
          >
            Gesendet
          </button>
          <button
            onClick={() => setView("trash")}
            className={`${styles.viewButton} ${
              view === "trash" ? styles.active : ""
            }`}
          >
            Papierkorb
          </button>
        </div>

        <div className={styles.header}>
          <h2>
            {view === "received"
              ? "Empfangene Nachrichten"
              : view === "sent"
              ? "Gesendete Nachrichten"
              : "Papierkorb"}
          </h2>
        </div>

        {Object.keys(groupedMessages).length === 0 ? (
          <p className={styles.noMessages}>Keine Nachrichten zum Anzeigen.</p>
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
                      `Produkt-ID: ${productId}`
                    )}
                  </NavLink>
                </h3>
                {messages.map((message) => (
                  <div key={message.id} className={styles.messageItem}>
                    <div className={styles.messageMeta}>
                      <small>
                        Von: {userDetails[message.senderID]} | An:{" "}
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
                        {view !== "trash" && (
                          <button
                            onClick={() =>
                              setReplyingTo(
                                replyingTo === message.id ? null : message.id
                              )
                            }
                            className={styles.replyButton}
                          >
                            {replyingTo === message.id
                              ? "Antwort abbrechen"
                              : "Antworten"}
                          </button>
                        )}
                        {view === "trash" ? (
                          <button
                            onClick={() => handleRestore(message)}
                            className={styles.restoreButton}
                          >
                            Wiederherstellen
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(message)}
                            className={styles.deleteButton}
                          >
                            Löschen
                          </button>
                        )}

                        {replyingTo === message.id && view !== "trash" && (
                          <form
                            className={styles.replyForm}
                            onSubmit={(e) => handleReply(e, message)}
                          >
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Schreibe deine Antwort hier..."
                              className={styles.replyInput}
                              required
                            />
                            <button
                              type="submit"
                              className={styles.sendReplyButton}
                            >
                              Antworten
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
