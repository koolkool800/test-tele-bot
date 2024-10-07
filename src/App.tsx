import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initData = (window as any)?.Telegram?.WebApp?.initData;

    axios
      .post("https://dev-api.pipeonliner.com/api/auth/telegram", { initData })
      .then((response) => {
        if (response.data) {
          setUser(response.data);
        } else {
          console.error("Authentication failed:", response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error while authenticating:", err);
      });
  }, []);

  return (
    <>
      hi
      {JSON.stringify(user)}
    </>
  );
}

export default App;
