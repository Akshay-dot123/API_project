import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [usersList, setUsersList] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [newEmail, setNewEmail] = useState("");
  useEffect(() => {
    axios.get("http://localhost:3000/user/getUsers").then((res) => {
      setUsersList(res.data);
    });
  }, []);
  const createUser = () => {
    axios
      .post("http://localhost:3000/user/createUser", { name: newUser, email: newEmail })
      .then((res) => {
        // This will add new user to existing list withou
        setUsersList([...usersList,{ name: newUser, email: newEmail }]);
        alert("User created successfully");
      });
  };
  return (
    <>
      <div>
        {usersList.map((user) => {
          return (
          <div>Name: {user.name}, Email: {user.email}</div>
          )
        })}
      </div>
      <div>
        <input
          type="text"
          placeholder="Name"
          id="name"
          onChange={(e) => setNewUser(e.target.value)}
        />
        <input type="email"
          placeholder="Email"
          id="email"
          onChange={(e) => setNewEmail(e.target.value)}
         />
        <button onClick={createUser}>Create User</button>
      </div>
    </>
  );
}

export default App;
