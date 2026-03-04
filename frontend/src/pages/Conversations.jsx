import { useEffect, useState, useRef } from "react";
import { getUsers, getMessages, sendMessageAPI } from "../services/api";
import MessageRenderer from "../components/MessageRenderer";

function Conversations() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadUsers() {
    const res = await getUsers();
    setUsers(res.data);
  }

  async function loadMessages(user) {
    const res = await getMessages(user);
    setMessages(res.data);
  }

  async function handleSend() {
    if (!newMessage.trim()) return;

    await sendMessageAPI({
      to: selectedUser,
      message: newMessage
    });

    setNewMessage("");
    loadMessages(selectedUser);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT USERS */}
      <div style={{ width: "280px", borderRight: "1px solid #ddd", background: "#f0f2f5" }}>
        {users.map((user) => (
          <div
            key={user}
            onClick={() => {
              setSelectedUser(user);
              loadMessages(user);
            }}
            style={{
              padding: "12px",
              cursor: "pointer",
              background: selectedUser === user ? "#d9fdd3" : "transparent"
            }}
          >
            {user}
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedUser && (
          <>
            <div style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
              {selectedUser}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px", background: "#efeae2" }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: msg.from === "user" ? "flex-start" : "flex-end",
                    marginBottom: "10px"
                  }}
                >
                  <MessageRenderer message={msg} />
                </div>
              ))}
              <div ref={bottomRef}></div>
            </div>

            <div style={{ padding: "10px", display: "flex", background: "#f0f2f5" }}>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "20px",
                  border: "1px solid #ccc"
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  marginLeft: "10px",
                  padding: "10px 20px",
                  background: "#25D366",
                  color: "white",
                  border: "none",
                  borderRadius: "20px"
                }}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Conversations;