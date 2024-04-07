// Import Section

// Core Components
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Expo Icon
import { Ionicons } from "@expo/vector-icons";

// React Hooks
import { useEffect, useState } from "react";

// Firebase Functions
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import db from "../services/firebase/firebaseConfig";

// Main Function
const MainScreen = () => {
  // State Management
  const [messages, setMessages] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // Firestore Reference
  const messageId = Date.now().toString();
  const newChatRef = doc(db, "chat", `message_${messageId}`);
  const chatRef = collection(db, "chat");

  // Event Handlers
  const handleTextInput = (text) => {
    setMessages(text);
  };

  const handleButtonPress = async () => {
    // Data
    const data = { id: Math.random().toString(), text: messages };

    // Basic storing of data using state management
    // setChatHistory((prevMessages) => {
    //   return [...prevMessages, data];
    // });

    // Storing data in Firestore
    await setDoc(newChatRef, data);

    // Clear the input
    setMessages("");
  };

  const handleRender = ({ item }) => {
    return <Text style={styles.message}>{item.text}</Text>;
  };

  // Get from firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(chatRef, (querySnapshot) => {
      const chatHistoryArray = [];
      querySnapshot.forEach((doc) => {
        chatHistoryArray.push(doc.data());
      });
      setChatHistory(chatHistoryArray);
    });

    // Cleanup function to unsubscribe from snapshot listener when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    // Main Container
    <View style={styles.container}>
      {/* Message list using FlatList */}
      <FlatList
        data={chatHistory}
        renderItem={handleRender}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={styles.messagesList}
      />

      {/* Toolbar Container */}
      <View style={styles.toolbarContainer}>
        {/* Text Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Message"
          onChangeText={handleTextInput}
          value={messages}
        />

        {/* Send Button */}
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Ionicons name="send" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MainScreen;

// Styles
const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 50,
  },
  toolbarContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "row",
  },
  textInput: {
    backgroundColor: "#E5E4E2",
    borderRadius: 20,
    flex: 1,
    textAlign: "left",
    paddingLeft: 20,
    margin: 10,
  },

  // Send Button
  button: { margin: 10 },

  // Message Styles
  message: {
    backgroundColor: "#0084ff",
    color: "white",
    marginRight: 30,
    marginTop: 5,
    padding: 15,
    borderRadius: 40,
    borderBottomRightRadius: 0,
  },

  // Message List
  messagesList: { flexDirection: "column-reverse" },
});
