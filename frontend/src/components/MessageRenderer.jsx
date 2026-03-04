function MessageRenderer({ message }) {
  const raw = message.raw;

  if (!raw) return null;

  if (raw.type === "text") {
    return <div className="bubble">{raw.text?.body}</div>;
  }

  if (raw.type === "image") {
    return (
      <div className="bubble">
        <img src={raw.image?.link} alt="" style={{ maxWidth: "250px" }} />
        {raw.image?.caption && <div>{raw.image.caption}</div>}
      </div>
    );
  }

  if (raw.type === "interactive") {
    if (raw.interactive.type === "button") {
      return (
        <div className="bubble">
          <div>{raw.interactive.body?.text}</div>
          {raw.interactive.action?.buttons?.map((btn, i) => (
            <div key={i}>🔘 {btn.reply.title}</div>
          ))}
        </div>
      );
    }

    if (raw.interactive.type === "list") {
      return (
        <div className="bubble">
          <div>{raw.interactive.body?.text}</div>
          {raw.interactive.action?.sections?.map((section, i) => (
            <div key={i}>
              <strong>{section.title}</strong>
              {section.rows?.map((row, j) => (
                <div key={j}>{row.title} — {row.description}</div>
              ))}
            </div>
          ))}
        </div>
      );
    }
  }

  return <div className="bubble">Unsupported message</div>;
}

export default MessageRenderer;