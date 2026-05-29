import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';

const BACKEND_URL = 'https://chatbot-backend-4xch.onrender.com';

type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', content: data.response };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const errMsg: Message = { id: (Date.now() + 1).toString(), role: 'bot', content: '서버 연결 실패' };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerText}>챗봇</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={styles.bubbleText}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />
      {loading && <Text style={styles.loadingText}>입력 중...</Text>}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="메시지를 입력하세요"
          placeholderTextColor="#888"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>전송</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  header: { paddingTop: 60, paddingBottom: 16, alignItems: 'center', backgroundColor: '#161b22' },
  headerText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  messageList: { padding: 16, gap: 8 },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 12 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#1f6feb' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#21262d' },
  bubbleText: { color: '#fff', fontSize: 15 },
  loadingText: { color: '#888', textAlign: 'center', marginBottom: 8 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: '#161b22' },
  input: { flex: 1, backgroundColor: '#21262d', color: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  sendButton: { backgroundColor: '#1f6feb', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: 'bold' },
});